// Channel Mixer Demo for 1×1 Convolutions
// Visualizes how 1×1 convolutions mix channels at each pixel location

(function() {
    'use strict';

    function initChannelMixerDemo() {
        const container = document.getElementById('channel-mixer-demo');
        if (!container) return;

        const svg = d3.select('#channel-mixer-svg');
        const width = 800;
        const height = 400;
        
        // Configuration
        let inputChannels = 3;
        let outputChannels = 2;
        let showWeights = false;
        let animationInProgress = false;
        
        // Clear previous content
        svg.selectAll('*').remove();

        // Generate random weight matrix
        function generateWeights(outputs, inputs) {
            const weights = [];
            for (let o = 0; o < outputs; o++) {
                const row = [];
                for (let i = 0; i < inputs; i++) {
                    // Generate weights between -1 and 1
                    row.push((Math.random() - 0.5) * 2);
                }
                weights.push(row);
            }
            return weights;
        }

        // Generate sample pixel values
        function generatePixelValues(numChannels) {
            const values = [];
            for (let c = 0; c < numChannels; c++) {
                values.push(Math.floor(Math.random() * 256));
            }
            return values;
        }

        // Main visualization
        function visualize() {
            svg.selectAll('*').remove();
            
            const weights = generateWeights(outputChannels, inputChannels);
            const pixelValues = generatePixelValues(inputChannels);
            
            // Calculate output values
            const outputValues = [];
            for (let o = 0; o < outputChannels; o++) {
                let sum = 0;
                for (let i = 0; i < inputChannels; i++) {
                    sum += pixelValues[i] * weights[o][i];
                }
                // Apply ReLU activation and clip
                sum = Math.max(0, Math.min(255, Math.floor(sum)));
                outputValues.push(sum);
            }
            
            // Layout constants
            const channelWidth = 60;
            const channelHeight = 40;
            const channelSpacing = 20;
            const groupSpacing = 150;
            
            // Draw input channels
            const inputGroup = svg.append('g')
                .attr('transform', 'translate(100, 150)');
            
            inputGroup.append('text')
                .attr('x', 0)
                .attr('y', -80)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('Input Pixel');
            
            inputGroup.append('text')
                .attr('x', 0)
                .attr('y', -60)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .text(`${inputChannels} channels`);
            
            // Draw grid to represent spatial location
            const gridSize = 3;
            const pixelSize = 20;
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const isCenter = i === 1 && j === 1;
                    inputGroup.append('rect')
                        .attr('x', -30 + j * pixelSize)
                        .attr('y', -40 + i * pixelSize)
                        .attr('width', pixelSize - 1)
                        .attr('height', pixelSize - 1)
                        .attr('fill', isCenter ? '#FFE0B2' : '#f5f5f5')
                        .attr('stroke', '#999')
                        .attr('stroke-width', isCenter ? 2 : 0.5);
                }
            }
            
            // Draw input channel values
            for (let c = 0; c < inputChannels; c++) {
                const y = 50 + c * (channelHeight + channelSpacing);
                const channelColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
                
                const channelG = inputGroup.append('g')
                    .attr('transform', `translate(0, ${y})`);
                
                channelG.append('rect')
                    .attr('x', -channelWidth/2)
                    .attr('y', -channelHeight/2)
                    .attr('width', channelWidth)
                    .attr('height', channelHeight)
                    .attr('fill', channelColors[c % channelColors.length])
                    .attr('fill-opacity', 0.3)
                    .attr('stroke', channelColors[c % channelColors.length])
                    .attr('stroke-width', 2)
                    .attr('rx', 5);
                
                channelG.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .text(pixelValues[c]);
                
                channelG.append('text')
                    .attr('x', 0)
                    .attr('y', -channelHeight/2 - 5)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '10px')
                    .text(`Ch ${c + 1}`);
            }
            
            // Draw weight matrix
            const weightGroup = svg.append('g')
                .attr('transform', 'translate(300, 150)');
            
            if (showWeights) {
                weightGroup.append('text')
                    .attr('x', 0)
                    .attr('y', -80)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '14px')
                    .style('font-weight', 'bold')
                    .text('Weight Matrix');
                
                weightGroup.append('text')
                    .attr('x', 0)
                    .attr('y', -60)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .text(`1×1 Conv`);
                
                // Draw weight matrix
                const cellSize = 40;
                for (let o = 0; o < outputChannels; o++) {
                    for (let i = 0; i < inputChannels; i++) {
                        const weight = weights[o][i];
                        const color = weight > 0 ? '#10099F' : '#FC8484';
                        const opacity = Math.abs(weight);
                        
                        const cell = weightGroup.append('g')
                            .attr('transform', `translate(${i * cellSize - inputChannels * cellSize / 2}, ${o * cellSize})`);
                        
                        cell.append('rect')
                            .attr('width', cellSize - 2)
                            .attr('height', cellSize - 2)
                            .attr('fill', color)
                            .attr('fill-opacity', opacity * 0.5)
                            .attr('stroke', '#666')
                            .attr('stroke-width', 0.5);
                        
                        cell.append('text')
                            .attr('x', cellSize / 2 - 1)
                            .attr('y', cellSize / 2)
                            .attr('text-anchor', 'middle')
                            .attr('dominant-baseline', 'middle')
                            .style('font-size', '10px')
                            .text(weight.toFixed(2));
                    }
                }
                
                // Labels
                for (let i = 0; i < inputChannels; i++) {
                    weightGroup.append('text')
                        .attr('x', i * cellSize - inputChannels * cellSize / 2 + cellSize / 2 - 1)
                        .attr('y', -10)
                        .attr('text-anchor', 'middle')
                        .style('font-size', '10px')
                        .text(`i${i + 1}`);
                }
                
                for (let o = 0; o < outputChannels; o++) {
                    weightGroup.append('text')
                        .attr('x', -inputChannels * cellSize / 2 - 15)
                        .attr('y', o * cellSize + cellSize / 2)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .style('font-size', '10px')
                        .text(`o${o + 1}`);
                }
            } else {
                // Simple transformation indicator
                weightGroup.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '24px')
                    .text('→');
                
                weightGroup.append('text')
                    .attr('x', 0)
                    .attr('y', 30)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .text('1×1 Conv');
            }
            
            // Draw output channels
            const outputGroup = svg.append('g')
                .attr('transform', 'translate(500, 150)');
            
            outputGroup.append('text')
                .attr('x', 0)
                .attr('y', -80)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('Output Pixel');
            
            outputGroup.append('text')
                .attr('x', 0)
                .attr('y', -60)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .text(`${outputChannels} channels`);
            
            // Draw grid for output
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    const isCenter = i === 1 && j === 1;
                    outputGroup.append('rect')
                        .attr('x', -30 + j * pixelSize)
                        .attr('y', -40 + i * pixelSize)
                        .attr('width', pixelSize - 1)
                        .attr('height', pixelSize - 1)
                        .attr('fill', isCenter ? '#FCE4EC' : '#f5f5f5')
                        .attr('stroke', '#999')
                        .attr('stroke-width', isCenter ? 2 : 0.5);
                }
            }
            
            // Draw output channel values
            for (let o = 0; o < outputChannels; o++) {
                const y = 50 + o * (channelHeight + channelSpacing + 10);
                
                const channelG = outputGroup.append('g')
                    .attr('transform', `translate(0, ${y})`);
                
                channelG.append('rect')
                    .attr('x', -channelWidth/2)
                    .attr('y', -channelHeight/2)
                    .attr('width', channelWidth)
                    .attr('height', channelHeight)
                    .attr('fill', '#FC8484')
                    .attr('fill-opacity', 0.3)
                    .attr('stroke', '#FC8484')
                    .attr('stroke-width', 2)
                    .attr('rx', 5);
                
                channelG.append('text')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .text(outputValues[o]);
                
                channelG.append('text')
                    .attr('x', 0)
                    .attr('y', -channelHeight/2 - 5)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '10px')
                    .text(`Out ${o + 1}`);
            }
            
            // Add description text
            const descGroup = svg.append('g')
                .attr('transform', 'translate(400, 350)');
            
            descGroup.append('text')
                .attr('x', 0)
                .attr('y', 0)
                .attr('text-anchor', 'middle')
                .style('font-size', '11px')
                .style('font-style', 'italic')
                .text('Same transformation applied at every spatial location');
        }

        // Animate the mixing process
        function animateMixing() {
            if (animationInProgress) return;
            animationInProgress = true;
            
            // Create flowing particles animation
            const numParticles = 5;
            const particleDelay = 200;
            
            for (let p = 0; p < numParticles; p++) {
                setTimeout(() => {
                    const particle = svg.append('circle')
                        .attr('cx', 100)
                        .attr('cy', 200)
                        .attr('r', 4)
                        .attr('fill', '#FFA05F')
                        .attr('opacity', 0.8);
                    
                    particle.transition()
                        .duration(1000)
                        .attr('cx', 500)
                        .attr('cy', 200)
                        .transition()
                        .duration(200)
                        .attr('opacity', 0)
                        .remove();
                }, p * particleDelay);
            }
            
            setTimeout(() => {
                animationInProgress = false;
            }, numParticles * particleDelay + 1200);
        }

        // Initial visualization
        visualize();

        // Event listeners
        const inputSlider = document.getElementById('mixer-input-channels');
        const inputValue = document.getElementById('mixer-input-value');
        const outputSlider = document.getElementById('mixer-output-channels');
        const outputValue = document.getElementById('mixer-output-value');
        const animateBtn = document.getElementById('animate-mixing');
        const weightsBtn = document.getElementById('show-weights');

        if (inputSlider) {
            inputSlider.addEventListener('input', function() {
                inputChannels = parseInt(this.value);
                inputValue.textContent = inputChannels;
                visualize();
            });
        }

        if (outputSlider) {
            outputSlider.addEventListener('input', function() {
                outputChannels = parseInt(this.value);
                outputValue.textContent = outputChannels;
                visualize();
            });
        }

        if (animateBtn) {
            animateBtn.addEventListener('click', animateMixing);
        }

        if (weightsBtn) {
            weightsBtn.addEventListener('click', function() {
                showWeights = !showWeights;
                this.textContent = showWeights ? 'Hide Weights' : 'Show Weights';
                visualize();
            });
        }
    }

    // Initialize when Reveal is ready
    if (typeof Reveal !== 'undefined') {
        Reveal.on('ready', initChannelMixerDemo);
        Reveal.on('slidechanged', function(event) {
            if (event.currentSlide.querySelector('#channel-mixer-demo')) {
                initChannelMixerDemo();
            }
        });
    } else {
        document.addEventListener('DOMContentLoaded', initChannelMixerDemo);
    }
})();