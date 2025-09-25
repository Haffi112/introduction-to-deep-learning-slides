// CNN Design Visualizations for RegNet and AnyNet
document.addEventListener('DOMContentLoaded', function() {

    // AnyNet Structure Visualization
    function initAnyNetVisualization() {
        const container = document.getElementById('anynet-viz');
        if (!container) return;

        const width = container.clientWidth;
        const height = 350;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const stagesSlider = document.getElementById('anynet-stages');
        const stagesValue = document.getElementById('anynet-stages-value');
        const animateBtn = document.getElementById('anynet-animate');

        function drawAnyNet(numStages) {
            svg.selectAll('*').remove();

            const g = svg.append('g')
                .attr('transform', `translate(${width/2}, ${height/2})`);

            // Calculate positions
            const totalWidth = width - 100;
            const sectionWidth = totalWidth / (numStages + 2); // stem + stages + head

            // Draw stem
            const stemX = -totalWidth/2;
            g.append('rect')
                .attr('class', 'stem')
                .attr('x', stemX)
                .attr('y', -30)
                .attr('width', sectionWidth * 0.8)
                .attr('height', 60)
                .attr('fill', '#10099F')
                .attr('rx', 5)
                .attr('opacity', 0.8);

            g.append('text')
                .attr('x', stemX + sectionWidth * 0.4)
                .attr('y', 5)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '14px')
                .text('Stem');

            // Draw stages
            for (let i = 0; i < numStages; i++) {
                const stageX = stemX + (i + 1) * sectionWidth;
                const stageHeight = 60 + i * 10; // Progressive height increase

                g.append('rect')
                    .attr('class', `stage-${i}`)
                    .attr('x', stageX)
                    .attr('y', -stageHeight/2)
                    .attr('width', sectionWidth * 0.8)
                    .attr('height', stageHeight)
                    .attr('fill', '#2DD2C0')
                    .attr('rx', 5)
                    .attr('opacity', 0.8);

                g.append('text')
                    .attr('x', stageX + sectionWidth * 0.4)
                    .attr('y', 5)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white')
                    .attr('font-size', '14px')
                    .text(`Stage ${i + 1}`);

                // Add resolution indicator
                g.append('text')
                    .attr('x', stageX + sectionWidth * 0.4)
                    .attr('y', -stageHeight/2 - 10)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#666')
                    .attr('font-size', '12px')
                    .text(`r/${Math.pow(2, i + 2)}`);
            }

            // Draw head
            const headX = stemX + (numStages + 1) * sectionWidth;
            g.append('rect')
                .attr('class', 'head')
                .attr('x', headX)
                .attr('y', -25)
                .attr('width', sectionWidth * 0.8)
                .attr('height', 50)
                .attr('fill', '#FC8484')
                .attr('rx', 5)
                .attr('opacity', 0.8);

            g.append('text')
                .attr('x', headX + sectionWidth * 0.4)
                .attr('y', 5)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '14px')
                .text('Head');

            // Draw connections
            for (let i = 0; i <= numStages; i++) {
                const startX = stemX + i * sectionWidth + sectionWidth * 0.8;
                const endX = stemX + (i + 1) * sectionWidth;

                g.append('line')
                    .attr('class', `connection-${i}`)
                    .attr('x1', startX)
                    .attr('y1', 0)
                    .attr('x2', endX)
                    .attr('y2', 0)
                    .attr('stroke', '#666')
                    .attr('stroke-width', 2)
                    .attr('opacity', 0.5);
            }
        }

        // Update visualization on slider change
        stagesSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            stagesValue.textContent = value;
            drawAnyNet(value);
        });

        // Animate data flow
        animateBtn.addEventListener('click', function() {
            const numStages = parseInt(stagesSlider.value);

            // Create flow particles
            for (let i = 0; i <= numStages + 1; i++) {
                setTimeout(() => {
                    const particle = svg.append('circle')
                        .attr('r', 5)
                        .attr('fill', '#FFA05F')
                        .attr('cx', width/2 - (width - 100)/2 + i * (width - 100)/(numStages + 2))
                        .attr('cy', height/2);

                    particle.transition()
                        .duration(500)
                        .attr('cx', width/2 - (width - 100)/2 + (i + 1) * (width - 100)/(numStages + 2))
                        .ease(d3.easeLinear)
                        .on('end', function() { d3.select(this).remove(); });
                }, i * 300);
            }
        });

        // Initial draw
        drawAnyNet(4);
    }

    // Stem Visualization
    function initStemVisualization() {
        const container = document.getElementById('stem-viz');
        if (!container) return;

        const width = container.clientWidth;
        const height = 300;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const channelsSlider = document.getElementById('stem-channels');
        const channelsValue = document.getElementById('stem-channels-value');
        const animateBtn = document.getElementById('stem-animate');

        function drawStem(channels) {
            svg.selectAll('*').remove();

            const g = svg.append('g')
                .attr('transform', `translate(${width/2}, ${height/2})`);

            // Input image
            const inputSize = 80;
            g.append('rect')
                .attr('x', -width/3 - inputSize/2)
                .attr('y', -inputSize/2)
                .attr('width', inputSize)
                .attr('height', inputSize)
                .attr('fill', '#10099F')
                .attr('opacity', 0.3);

            // Draw 3x3 grid for RGB
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    g.append('rect')
                        .attr('x', -width/3 - inputSize/2 + 10 + i * 20)
                        .attr('y', -inputSize/2 + 10 + j * 20)
                        .attr('width', 18)
                        .attr('height', 18)
                        .attr('fill', i === 0 ? '#FF0000' : (i === 1 ? '#00FF00' : '#0000FF'))
                        .attr('opacity', 0.6);
                }
            }

            g.append('text')
                .attr('x', -width/3)
                .attr('y', -inputSize/2 - 10)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text('Input: 3×r×r');

            // Convolution operation
            g.append('rect')
                .attr('x', -50)
                .attr('y', -30)
                .attr('width', 100)
                .attr('height', 60)
                .attr('fill', '#2DD2C0')
                .attr('rx', 5)
                .attr('opacity', 0.8);

            g.append('text')
                .attr('x', 0)
                .attr('y', -5)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .text('Conv 3×3');

            g.append('text')
                .attr('x', 0)
                .attr('y', 10)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .text('Stride 2');

            g.append('text')
                .attr('x', 0)
                .attr('y', 25)
                .attr('text-anchor', 'middle')
                .attr('fill', 'white')
                .attr('font-size', '12px')
                .text('+ BN + ReLU');

            // Output feature maps
            const outputSize = 60;
            const numMaps = Math.min(channels / 16, 8);

            for (let i = 0; i < numMaps; i++) {
                const offset = i * 5;
                g.append('rect')
                    .attr('x', width/3 - outputSize/2 + offset)
                    .attr('y', -outputSize/2 + offset)
                    .attr('width', outputSize)
                    .attr('height', outputSize)
                    .attr('fill', '#FC8484')
                    .attr('opacity', 0.3 + i * 0.05);
            }

            g.append('text')
                .attr('x', width/3)
                .attr('y', -outputSize/2 - 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text(`Output: ${channels}×r/2×r/2`);

            // Arrows
            g.append('path')
                .attr('d', `M ${-width/3 + inputSize/2 + 10} 0 L ${-50} 0`)
                .attr('stroke', '#666')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrowhead)');

            g.append('path')
                .attr('d', `M ${50} 0 L ${width/3 - outputSize/2 - 10} 0`)
                .attr('stroke', '#666')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrowhead)');

            // Add arrowhead marker
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 8)
                .attr('refY', 0)
                .attr('markerWidth', 4)
                .attr('markerHeight', 4)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5')
                .attr('fill', '#666');
        }

        channelsSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            channelsValue.textContent = value;
            drawStem(value);
        });

        animateBtn.addEventListener('click', function() {
            const channels = parseInt(channelsSlider.value);

            // Animate convolution
            const rect = svg.append('rect')
                .attr('x', width/2 - width/3 + 40)
                .attr('y', height/2 - 15)
                .attr('width', 30)
                .attr('height', 30)
                .attr('fill', '#FFA05F')
                .attr('opacity', 0.8);

            rect.transition()
                .duration(1000)
                .attr('x', width/2 + width/3 - 70)
                .ease(d3.easeQuadInOut)
                .on('end', function() { d3.select(this).remove(); });
        });

        drawStem(32);
    }

    // Layer Summary Visualization
    function initLayerSummary() {
        const container = document.getElementById('layer-summary-viz');
        if (!container) return;

        // Simulate layer summary output
        setTimeout(() => {
            container.innerHTML = `
                <div style="color: #00ff00;">AnyNet Layer Summary:</div>
                <div style="margin-top: 10px;">
                    stem.0 (Conv2d): [3, 32, 3, 3] → Output: [32, 112, 112]<br>
                    stem.1 (BatchNorm2d): [32] → Output: [32, 112, 112]<br>
                    stem.2 (ReLU): [] → Output: [32, 112, 112]<br>
                    stage1 (Sequential): 4 blocks → Output: [32, 56, 56]<br>
                    stage2 (Sequential): 6 blocks → Output: [64, 28, 28]<br>
                    stage3 (Sequential): 8 blocks → Output: [128, 14, 14]<br>
                    stage4 (Sequential): 2 blocks → Output: [256, 7, 7]<br>
                    head.0 (AdaptiveAvgPool2d): [] → Output: [256, 1, 1]<br>
                    head.1 (Flatten): [] → Output: [256]<br>
                    head.2 (Linear): [256, 10] → Output: [10]<br>
                    <br>
                    Total Parameters: 1,234,567<br>
                    Trainable Parameters: 1,234,567
                </div>
            `;
        }, 1000);
    }

    // CDF Visualization
    function initCDFVisualization() {
        const container = document.getElementById('cdf-viz');
        if (!container) return;

        const width = container.clientWidth;
        const height = 400;
        const margin = {top: 20, right: 80, bottom: 50, left: 50};
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain([30, 80])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', innerWidth / 2)
            .attr('y', 40)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .text('Error (%)');

        g.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -innerHeight / 2)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .text('Cumulative Probability');

        const line = d3.line()
            .x(d => xScale(d[0]))
            .y(d => yScale(d[1]))
            .curve(d3.curveMonotoneX);

        const sampleBtn = document.getElementById('cdf-sample');

        function generateCDF(constraints) {
            const points = [];
            const baseError = 50;
            const improvement = constraints * 2;

            for (let error = 30; error <= 80; error += 1) {
                const p = 1 / (1 + Math.exp(-0.3 * (error - baseError + improvement)));
                points.push([error, p]);
            }
            return points;
        }

        function updateCDFs() {
            g.selectAll('.cdf-line').remove();
            g.selectAll('.cdf-label').remove();

            const constraints = [
                document.getElementById('cdf-shared-bottleneck').checked,
                document.getElementById('cdf-shared-groups').checked,
                document.getElementById('cdf-increasing-width').checked,
                document.getElementById('cdf-increasing-depth').checked
            ];

            const numConstraints = constraints.filter(c => c).length;

            const configs = [
                { name: 'AnyNetX_A', constraints: 0, color: '#666666' },
                { name: `AnyNetX_${String.fromCharCode(65 + numConstraints)}`, constraints: numConstraints, color: '#10099F' }
            ];

            configs.forEach((config, i) => {
                const data = generateCDF(config.constraints);

                g.append('path')
                    .datum(data)
                    .attr('class', 'cdf-line')
                    .attr('fill', 'none')
                    .attr('stroke', config.color)
                    .attr('stroke-width', 2)
                    .attr('d', line)
                    .style('opacity', 0)
                    .transition()
                    .duration(1000)
                    .style('opacity', 1);

                g.append('text')
                    .attr('class', 'cdf-label')
                    .attr('x', innerWidth - 50)
                    .attr('y', yScale(data[data.length - 1][1]) + i * 20)
                    .attr('fill', config.color)
                    .style('font-size', '12px')
                    .text(config.name);
            });
        }

        // Event listeners
        document.getElementById('cdf-shared-bottleneck').addEventListener('change', updateCDFs);
        document.getElementById('cdf-shared-groups').addEventListener('change', updateCDFs);
        document.getElementById('cdf-increasing-width').addEventListener('change', updateCDFs);
        document.getElementById('cdf-increasing-depth').addEventListener('change', updateCDFs);
        sampleBtn.addEventListener('click', updateCDFs);

        // Initial draw
        updateCDFs();
    }

    // RegNet Design Explorer
    function initRegNetDesignExplorer() {
        const container = document.getElementById('regnet-structure-viz');
        if (!container) return;

        const width = container.clientWidth;
        const height = 350;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const c0Slider = document.getElementById('regnet-c0');
        const c0Value = document.getElementById('regnet-c0-value');
        const caSlider = document.getElementById('regnet-ca');
        const caValue = document.getElementById('regnet-ca-value');
        const groupsSelect = document.getElementById('regnet-groups');

        function drawRegNet(c0, ca, groups) {
            svg.selectAll('*').remove();

            const g = svg.append('g')
                .attr('transform', `translate(50, ${height/2})`);

            // Calculate widths for 10 blocks
            const numBlocks = 10;
            const blockSpacing = (width - 100) / numBlocks;

            for (let j = 0; j < numBlocks; j++) {
                const width_j = c0 + ca * j;
                const maxWidth = c0 + ca * (numBlocks - 1);
                const normalizedHeight = (width_j / maxWidth) * 120;

                g.append('rect')
                    .attr('x', j * blockSpacing)
                    .attr('y', -normalizedHeight/2)
                    .attr('width', blockSpacing * 0.8)
                    .attr('height', normalizedHeight)
                    .attr('fill', j < 3 ? '#10099F' : (j < 6 ? '#2DD2C0' : '#FC8484'))
                    .attr('opacity', 0.7)
                    .attr('rx', 2);

                // Add width label
                if (j % 2 === 0) {
                    g.append('text')
                        .attr('x', j * blockSpacing + blockSpacing * 0.4)
                        .attr('y', normalizedHeight/2 + 15)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '10px')
                        .attr('fill', '#666')
                        .text(width_j);
                }
            }

            // Add formula
            g.append('text')
                .attr('x', (width - 100) / 2)
                .attr('y', -height/2 + 30)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .text(`c_j = ${c0} + ${ca}×j, groups = ${groups}`);

            // Add stage labels
            g.append('text')
                .attr('x', blockSpacing * 1.5)
                .attr('y', height/2 - 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', '#10099F')
                .text('Stage 1');

            g.append('text')
                .attr('x', blockSpacing * 4.5)
                .attr('y', height/2 - 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', '#2DD2C0')
                .text('Stage 2');

            g.append('text')
                .attr('x', blockSpacing * 8)
                .attr('y', height/2 - 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', '#FC8484')
                .text('Stage 3');
        }

        c0Slider.addEventListener('input', function() {
            const c0 = parseInt(this.value);
            const ca = parseInt(caSlider.value);
            const groups = parseInt(groupsSelect.value);
            c0Value.textContent = c0;
            drawRegNet(c0, ca, groups);
        });

        caSlider.addEventListener('input', function() {
            const c0 = parseInt(c0Slider.value);
            const ca = parseInt(this.value);
            const groups = parseInt(groupsSelect.value);
            caValue.textContent = ca;
            drawRegNet(c0, ca, groups);
        });

        groupsSelect.addEventListener('change', function() {
            const c0 = parseInt(c0Slider.value);
            const ca = parseInt(caSlider.value);
            const groups = parseInt(this.value);
            drawRegNet(c0, ca, groups);
        });

        // Initial draw
        drawRegNet(32, 16, 16);
    }

    // Training Curves Visualization
    function initTrainingCurves() {
        const container = document.getElementById('training-curves');
        if (!container) return;

        const width = container.clientWidth;
        const height = 350;
        const margin = {top: 20, right: 80, bottom: 50, left: 50};
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', innerWidth / 2)
            .attr('y', 40)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .text('Epoch');

        g.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -innerHeight / 2)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .text('Loss / Accuracy');

        const line = d3.line()
            .x(d => xScale(d.epoch))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        let animationInterval;
        const trainLossData = [];
        const valLossData = [];
        const valAccData = [];

        function updateChart(epoch) {
            // Generate data
            const trainLoss = 0.8 * Math.exp(-epoch * 0.3) + 0.1 + Math.random() * 0.05;
            const valLoss = 0.9 * Math.exp(-epoch * 0.25) + 0.15 + Math.random() * 0.1;
            const valAcc = 0.92 * (1 - Math.exp(-epoch * 0.3)) + Math.random() * 0.05;

            trainLossData.push({epoch, value: trainLoss});
            valLossData.push({epoch, value: valLoss});
            valAccData.push({epoch, value: valAcc});

            // Update lines
            g.selectAll('.train-loss-line').remove();
            g.selectAll('.val-loss-line').remove();
            g.selectAll('.val-acc-line').remove();

            g.append('path')
                .datum(trainLossData)
                .attr('class', 'train-loss-line')
                .attr('fill', 'none')
                .attr('stroke', '#10099F')
                .attr('stroke-width', 2)
                .attr('d', line);

            g.append('path')
                .datum(valLossData)
                .attr('class', 'val-loss-line')
                .attr('fill', 'none')
                .attr('stroke', '#FC8484')
                .attr('stroke-width', 2)
                .attr('d', line);

            g.append('path')
                .datum(valAccData)
                .attr('class', 'val-acc-line')
                .attr('fill', 'none')
                .attr('stroke', '#2DD2C0')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .attr('d', line);
        }

        // Legend
        const legend = g.append('g')
            .attr('transform', `translate(${innerWidth - 100}, 20)`);

        legend.append('line')
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', 20).attr('y2', 0)
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2);
        legend.append('text')
            .attr('x', 25).attr('y', 5)
            .style('font-size', '12px')
            .text('Train Loss');

        legend.append('line')
            .attr('x1', 0).attr('y1', 20)
            .attr('x2', 20).attr('y2', 20)
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2);
        legend.append('text')
            .attr('x', 25).attr('y', 25)
            .style('font-size', '12px')
            .text('Val Loss');

        legend.append('line')
            .attr('x1', 0).attr('y1', 40)
            .attr('x2', 20).attr('y2', 40)
            .attr('stroke', '#2DD2C0')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
        legend.append('text')
            .attr('x', 25).attr('y', 45)
            .style('font-size', '12px')
            .text('Val Acc');

        // Controls
        document.getElementById('start-training').addEventListener('click', function() {
            let epoch = 0;
            const speed = parseInt(document.getElementById('training-speed').value);

            if (animationInterval) clearInterval(animationInterval);

            animationInterval = setInterval(() => {
                if (epoch <= 10) {
                    updateChart(epoch);
                    epoch += 0.2;
                } else {
                    clearInterval(animationInterval);
                }
            }, speed);
        });

        document.getElementById('reset-training').addEventListener('click', function() {
            if (animationInterval) clearInterval(animationInterval);
            trainLossData.length = 0;
            valLossData.length = 0;
            valAccData.length = 0;
            g.selectAll('.train-loss-line').remove();
            g.selectAll('.val-loss-line').remove();
            g.selectAll('.val-acc-line').remove();
        });
    }

    // Architecture Comparison
    function initArchitectureComparison() {
        const container = document.getElementById('architecture-comparison');
        if (!container) return;

        const width = container.clientWidth;
        const height = 400;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const data = [
            {name: 'ResNet-50', params: 25.6, accuracy: 0.91, color: '#666666'},
            {name: 'RegNetX-4GF', params: 22.1, accuracy: 0.92, color: '#10099F'},
            {name: 'DenseNet-121', params: 8.0, accuracy: 0.90, color: '#2DD2C0'},
            {name: 'EfficientNet-B0', params: 5.3, accuracy: 0.91, color: '#FC8484'}
        ];

        const g = svg.append('g')
            .attr('transform', 'translate(50, 50)');

        const xScale = d3.scaleLinear()
            .domain([0, 30])
            .range([0, width - 150]);

        const yScale = d3.scaleLinear()
            .domain([0.88, 0.93])
            .range([height - 100, 0]);

        // Add axes
        g.append('g')
            .attr('transform', `translate(0, ${height - 100})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', (width - 150) / 2)
            .attr('y', 40)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .text('Parameters (M)');

        g.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -35)
            .attr('x', -(height - 100) / 2)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .text('Accuracy');

        // Add points
        g.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.params))
            .attr('cy', d => yScale(d.accuracy))
            .attr('r', 8)
            .attr('fill', d => d.color)
            .attr('opacity', 0.8)
            .style('cursor', 'pointer')
            .on('mouseover', function(event, d) {
                // Show tooltip
                const tooltip = g.append('g')
                    .attr('class', 'tooltip');

                const rect = tooltip.append('rect')
                    .attr('x', xScale(d.params) - 40)
                    .attr('y', yScale(d.accuracy) - 40)
                    .attr('width', 80)
                    .attr('height', 30)
                    .attr('fill', 'white')
                    .attr('stroke', '#666')
                    .attr('rx', 3);

                tooltip.append('text')
                    .attr('x', xScale(d.params))
                    .attr('y', yScale(d.accuracy) - 25)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .text(d.name);

                tooltip.append('text')
                    .attr('x', xScale(d.params))
                    .attr('y', yScale(d.accuracy) - 10)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '10px')
                    .text(`${d.params}M params`);
            })
            .on('mouseout', function() {
                g.selectAll('.tooltip').remove();
            });

        // Add labels
        g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('x', d => xScale(d.params))
            .attr('y', d => yScale(d.accuracy) + 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .text(d => d.name);

        // Highlight RegNet
        g.append('circle')
            .attr('cx', xScale(22.1))
            .attr('cy', yScale(0.92))
            .attr('r', 12)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '3,3')
            .style('animation', 'pulse 2s infinite');
    }

    // Timeline Visualization
    function initTimelineVisualization() {
        const container = document.getElementById('timeline-viz');
        if (!container) return;

        const width = container.clientWidth;
        const height = 200;

        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const events = [
            {year: 2012, name: 'AlexNet', type: 'cnn', color: '#666666'},
            {year: 2015, name: 'ResNet', type: 'cnn', color: '#10099F'},
            {year: 2018, name: 'RegNet', type: 'cnn', color: '#2DD2C0'},
            {year: 2020, name: 'Vision Transformer', type: 'transformer', color: '#FC8484'},
            {year: 2022, name: 'ConvNeXt', type: 'hybrid', color: '#FFA05F'}
        ];

        const xScale = d3.scaleLinear()
            .domain([2010, 2024])
            .range([50, width - 50]);

        const g = svg.append('g')
            .attr('transform', 'translate(0, 100)');

        // Timeline
        g.append('line')
            .attr('x1', xScale(2010))
            .attr('y1', 0)
            .attr('x2', xScale(2024))
            .attr('y2', 0)
            .attr('stroke', '#666')
            .attr('stroke-width', 2);

        // Events
        events.forEach((event, i) => {
            const x = xScale(event.year);

            g.append('circle')
                .attr('cx', x)
                .attr('cy', 0)
                .attr('r', 0)
                .attr('fill', event.color)
                .transition()
                .delay(i * 200)
                .duration(500)
                .attr('r', 8);

            g.append('text')
                .attr('x', x)
                .attr('y', -20)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('opacity', 0)
                .text(event.name)
                .transition()
                .delay(i * 200 + 300)
                .duration(500)
                .style('opacity', 1);

            g.append('text')
                .attr('x', x)
                .attr('y', 25)
                .attr('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('opacity', 0)
                .text(event.year)
                .transition()
                .delay(i * 200 + 300)
                .duration(500)
                .style('opacity', 1);
        });
    }

    // Initialize all visualizations when slides are ready
    Reveal.addEventListener('ready', function() {
        initAnyNetVisualization();
        initStemVisualization();
        initLayerSummary();
        initCDFVisualization();
        initRegNetDesignExplorer();
        initTrainingCurves();
        initArchitectureComparison();
        initTimelineVisualization();
    });

    // Reinitialize on slide change if needed
    Reveal.addEventListener('slidechanged', function(event) {
        // Check if current slide has visualizations and reinitialize if needed
        if (event.currentSlide.querySelector('#anynet-viz')) {
            initAnyNetVisualization();
        }
        if (event.currentSlide.querySelector('#stem-viz')) {
            initStemVisualization();
        }
        if (event.currentSlide.querySelector('#cdf-viz')) {
            initCDFVisualization();
        }
        if (event.currentSlide.querySelector('#regnet-structure-viz')) {
            initRegNetDesignExplorer();
        }
        if (event.currentSlide.querySelector('#training-curves')) {
            initTrainingCurves();
        }
        if (event.currentSlide.querySelector('#architecture-comparison')) {
            initArchitectureComparison();
        }
        if (event.currentSlide.querySelector('#timeline-viz')) {
            initTimelineVisualization();
        }
    });
});