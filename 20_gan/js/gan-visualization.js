// GAN Interactive Visualization with D3.js

(function() {
    'use strict';

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        initGANVisualization();
    });

    // Also initialize when Reveal.js is ready
    if (typeof Reveal !== 'undefined') {
        Reveal.on('ready', function() {
            initGANVisualization();
        });
    }

    function initGANVisualization() {
        const container = d3.select('#gan-demo-container');
        if (container.empty()) return;

        // Clear any existing content
        container.html('');

        const width = 800;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };

        // Create SVG
        const svg = container.append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        // Define positions for network components
        const positions = {
            noise: { x: 100, y: height / 2 },
            generator: { x: 250, y: height / 2 },
            fakeData: { x: 400, y: height / 2 + 60 },
            realData: { x: 400, y: height / 2 - 60 },
            discriminator: { x: 550, y: height / 2 },
            outputReal: { x: 700, y: height / 2 - 60 },
            outputFake: { x: 700, y: height / 2 + 60 }
        };

        // State for animation
        let animationState = {
            step: 0,
            isPlaying: false,
            intervalId: null
        };

        // Draw connections
        const connections = [
            { from: 'noise', to: 'generator', class: 'noise-to-gen' },
            { from: 'generator', to: 'fakeData', class: 'gen-to-fake' },
            { from: 'fakeData', to: 'discriminator', class: 'fake-to-disc' },
            { from: 'realData', to: 'discriminator', class: 'real-to-disc' },
            { from: 'discriminator', to: 'outputFake', class: 'disc-to-out-fake' },
            { from: 'discriminator', to: 'outputReal', class: 'disc-to-out-real' }
        ];

        const linkGroup = svg.append('g').attr('class', 'links');

        connections.forEach(conn => {
            linkGroup.append('line')
                .attr('class', `gan-network-link ${conn.class}`)
                .attr('x1', positions[conn.from].x)
                .attr('y1', positions[conn.from].y)
                .attr('x2', positions[conn.to].x)
                .attr('y2', positions[conn.to].y);
        });

        // Draw nodes
        const nodeGroup = svg.append('g').attr('class', 'nodes');

        // Noise node
        nodeGroup.append('circle')
            .attr('class', 'gan-network-node noise-node')
            .attr('cx', positions.noise.x)
            .attr('cy', positions.noise.y)
            .attr('r', 15);

        nodeGroup.append('text')
            .attr('class', 'gan-label')
            .attr('x', positions.noise.x)
            .attr('y', positions.noise.y - 30)
            .text('Noise z');

        nodeGroup.append('text')
            .attr('class', 'gan-sublabel')
            .attr('x', positions.noise.x)
            .attr('y', positions.noise.y - 18)
            .text('~ N(0,1)');

        // Generator node
        nodeGroup.append('circle')
            .attr('class', 'gan-network-node generator-node')
            .attr('cx', positions.generator.x)
            .attr('cy', positions.generator.y)
            .attr('r', 15);

        nodeGroup.append('text')
            .attr('class', 'gan-label')
            .attr('x', positions.generator.x)
            .attr('y', positions.generator.y - 30)
            .text('Generator');

        nodeGroup.append('text')
            .attr('class', 'gan-sublabel')
            .attr('x', positions.generator.x)
            .attr('y', positions.generator.y - 18)
            .text('G(z)');

        // Fake data node
        nodeGroup.append('circle')
            .attr('class', 'gan-network-node data-node-fake')
            .attr('cx', positions.fakeData.x)
            .attr('cy', positions.fakeData.y)
            .attr('r', 15);

        nodeGroup.append('text')
            .attr('class', 'gan-label')
            .attr('x', positions.fakeData.x)
            .attr('y', positions.fakeData.y + 35)
            .text("Fake x'");

        // Real data node
        nodeGroup.append('circle')
            .attr('class', 'gan-network-node data-node-real')
            .attr('cx', positions.realData.x)
            .attr('cy', positions.realData.y)
            .attr('r', 15);

        nodeGroup.append('text')
            .attr('class', 'gan-label')
            .attr('x', positions.realData.x)
            .attr('y', positions.realData.y - 25)
            .text('Real x');

        // Discriminator node
        nodeGroup.append('circle')
            .attr('class', 'gan-network-node discriminator-node')
            .attr('cx', positions.discriminator.x)
            .attr('cy', positions.discriminator.y)
            .attr('r', 15);

        nodeGroup.append('text')
            .attr('class', 'gan-label')
            .attr('x', positions.discriminator.x)
            .attr('y', positions.discriminator.y - 30)
            .text('Discriminator');

        nodeGroup.append('text')
            .attr('class', 'gan-sublabel')
            .attr('x', positions.discriminator.x)
            .attr('y', positions.discriminator.y - 18)
            .text('D(x)');

        // Output nodes
        nodeGroup.append('circle')
            .attr('class', 'gan-network-node output-node')
            .attr('cx', positions.outputReal.x)
            .attr('cy', positions.outputReal.y)
            .attr('r', 12)
            .style('fill', '#2DD2C0');

        nodeGroup.append('text')
            .attr('class', 'gan-sublabel')
            .attr('x', positions.outputReal.x)
            .attr('y', positions.outputReal.y - 20)
            .text('Real? 1');

        nodeGroup.append('circle')
            .attr('class', 'gan-network-node output-node')
            .attr('cx', positions.outputFake.x)
            .attr('cy', positions.outputFake.y)
            .attr('r', 12)
            .style('fill', '#FC8484');

        nodeGroup.append('text')
            .attr('class', 'gan-sublabel')
            .attr('x', positions.outputFake.x)
            .attr('y', positions.outputFake.y + 30)
            .text('Fake? 0');

        // Particle group for animation
        const particleGroup = svg.append('g').attr('class', 'particles');

        // Animation functions
        function animateStep() {
            animationState.step = (animationState.step + 1) % 4;

            // Clear existing particles
            particleGroup.selectAll('.gan-particle').remove();

            // Reset all links
            linkGroup.selectAll('.gan-network-link')
                .classed('active', false);

            switch(animationState.step) {
                case 0:
                    // Noise generation
                    activateLink('noise-to-gen');
                    animateParticle(positions.noise, positions.generator, 1000);
                    break;
                case 1:
                    // Generator creates fake data
                    activateLink('gen-to-fake');
                    animateParticle(positions.generator, positions.fakeData, 1000);
                    break;
                case 2:
                    // Both real and fake go to discriminator
                    activateLink('fake-to-disc');
                    activateLink('real-to-disc');
                    animateParticle(positions.fakeData, positions.discriminator, 1000);
                    animateParticle(positions.realData, positions.discriminator, 1000);
                    break;
                case 3:
                    // Discriminator outputs judgments
                    activateLink('disc-to-out-fake');
                    activateLink('disc-to-out-real');
                    animateParticle(positions.discriminator, positions.outputFake, 1000);
                    animateParticle(positions.discriminator, positions.outputReal, 1000);
                    break;
            }
        }

        function activateLink(className) {
            linkGroup.select(`.${className}`)
                .classed('active', true);
        }

        function animateParticle(from, to, duration) {
            const particle = particleGroup.append('circle')
                .attr('class', 'gan-particle')
                .attr('cx', from.x)
                .attr('cy', from.y)
                .attr('r', 5);

            particle.transition()
                .duration(duration)
                .ease(d3.easeLinear)
                .attr('cx', to.x)
                .attr('cy', to.y)
                .on('end', function() {
                    d3.select(this).remove();
                });
        }

        // Control button handlers
        const resetButton = d3.select('#reset-gan');
        const stepButton = d3.select('#step-gan');
        const playButton = d3.select('#play-gan');

        if (!resetButton.empty()) {
            resetButton.on('click', function() {
                animationState.step = -1;
                animationState.isPlaying = false;
                if (animationState.intervalId) {
                    clearInterval(animationState.intervalId);
                    animationState.intervalId = null;
                }
                particleGroup.selectAll('.gan-particle').remove();
                linkGroup.selectAll('.gan-network-link').classed('active', false);
                playButton.text('Auto Play');
            });
        }

        if (!stepButton.empty()) {
            stepButton.on('click', function() {
                if (!animationState.isPlaying) {
                    animateStep();
                }
            });
        }

        if (!playButton.empty()) {
            playButton.on('click', function() {
                if (animationState.isPlaying) {
                    // Stop playing
                    animationState.isPlaying = false;
                    clearInterval(animationState.intervalId);
                    animationState.intervalId = null;
                    playButton.text('Auto Play');
                } else {
                    // Start playing
                    animationState.isPlaying = true;
                    playButton.text('Stop');
                    animationState.intervalId = setInterval(animateStep, 1500);
                }
            });
        }

        // Add descriptive text showing current phase
        const phaseText = svg.append('text')
            .attr('class', 'gan-label')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', '#10099F')
            .text('Click "Step" to see the adversarial process');

        // Update phase text based on animation step
        function updatePhaseText() {
            const phases = [
                'Step 1: Sample random noise z',
                'Step 2: Generator creates fake data G(z)',
                'Step 3: Discriminator receives real and fake data',
                'Step 4: Discriminator outputs predictions D(x)'
            ];
            phaseText.text(phases[animationState.step] || 'Ready');
        }

        // Override animateStep to include phase text update
        const originalAnimateStep = animateStep;
        animateStep = function() {
            originalAnimateStep();
            updatePhaseText();
        };
    }
})();
