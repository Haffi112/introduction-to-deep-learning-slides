// MLP Implementation Visualization Script
// Handles all interactive visualizations for MLP implementation slides

document.addEventListener('DOMContentLoaded', function() {
    
    // MLP Architecture Visualization
    function initArchitectureVisualization() {
        const container = document.getElementById('mlp-architecture-viz');
        if (!container) return;
        
        // Ensure minimum width to prevent negative calculations
        const width = Math.max(600, container.offsetWidth || 600);
        const height = 400;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        // Define layers
        const layers = [
            { name: 'Input', neurons: 8, fullNeurons: 784, color: '#10099F' },
            { name: 'Hidden', neurons: 6, fullNeurons: 256, color: '#2DD2C0' },
            { name: 'Output', neurons: 4, fullNeurons: 10, color: '#FC8484' }
        ];
        
        const layerWidth = width / (layers.length + 1);
        const maxNeurons = Math.max(...layers.map(l => l.neurons));
        
        // Draw connections first (behind neurons)
        layers.forEach((layer, i) => {
            if (i < layers.length - 1) {
                const nextLayer = layers[i + 1];
                const x1 = (i + 1) * layerWidth;
                const x2 = (i + 2) * layerWidth;
                
                // Draw sample connections with varying opacity
                for (let j = 0; j < layer.neurons; j++) {
                    const y1 = height / 2 - (layer.neurons - 1) * 40 / 2 + j * 40;
                    for (let k = 0; k < nextLayer.neurons; k++) {
                        const y2 = height / 2 - (nextLayer.neurons - 1) * 40 / 2 + k * 40;
                        
                        svg.append('line')
                            .attr('x1', x1)
                            .attr('y1', y1)
                            .attr('x2', x2)
                            .attr('y2', y2)
                            .attr('stroke', '#EEEEEE')
                            .attr('stroke-width', 0.5 + Math.random() * 1.5)
                            .attr('opacity', 0.3 + Math.random() * 0.3);
                    }
                }
            }
        });
        
        // Draw neurons
        layers.forEach((layer, i) => {
            const x = (i + 1) * layerWidth;
            
            // Draw visible neurons
            for (let j = 0; j < layer.neurons; j++) {
                const y = height / 2 - (layer.neurons - 1) * 40 / 2 + j * 40;
                
                svg.append('circle')
                    .attr('cx', x)
                    .attr('cy', y)
                    .attr('r', Math.max(1, 15)) // Ensure positive radius
                    .attr('fill', layer.color)
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2);
            }
            
            // Add dots to indicate more neurons
            if (layer.neurons < layer.fullNeurons) {
                svg.append('text')
                    .attr('x', x)
                    .attr('y', height / 2 + layer.neurons * 20 + 10)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '20px')
                    .attr('fill', '#666')
                    .text('⋮');
            }
            
            // Add layer labels
            svg.append('text')
                .attr('x', x)
                .attr('y', height - 30)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', '#262626')
                .text(layer.name);
            
            // Add dimension labels
            svg.append('text')
                .attr('x', x)
                .attr('y', height - 10)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('fill', '#666')
                .text(`(${layer.fullNeurons})`);
        });
        
        // Add weight matrix labels
        svg.append('text')
            .attr('x', layerWidth * 1.5)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#10099F')
            .text('W¹: 784×256');
        
        svg.append('text')
            .attr('x', layerWidth * 2.5)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#10099F')
            .text('W²: 256×10');
    }
    
    // Forward Propagation Animation
    function initForwardPropagation() {
        const container = document.getElementById('forward-prop-viz');
        if (!container) return;
        
        // Clear any existing visualization first
        d3.select(container).selectAll('svg').remove();
        
        // More robust width calculation with minimum value
        const width = Math.max(800, container.clientWidth || container.offsetWidth || 800);
        const height = 350;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        // Simplified network for animation
        const layers = [
            { name: 'Input', neurons: 4, x: width * 0.2 },
            { name: 'Hidden', neurons: 3, x: width * 0.5 },
            { name: 'Output', neurons: 2, x: width * 0.8 }
        ];
        
        // Draw connections
        const connections = [];
        layers.forEach((layer, i) => {
            if (i < layers.length - 1) {
                const nextLayer = layers[i + 1];
                for (let j = 0; j < layer.neurons; j++) {
                    for (let k = 0; k < nextLayer.neurons; k++) {
                        const connection = svg.append('line')
                            .attr('x1', layer.x)
                            .attr('y1', 80 + j * 60)
                            .attr('x2', nextLayer.x)
                            .attr('y2', 80 + k * 60)
                            .attr('stroke', '#EEEEEE')
                            .attr('stroke-width', 2);
                        connections.push({ line: connection, layer: i });
                    }
                }
            }
        });
        
        // Draw neurons
        const neurons = [];
        layers.forEach((layer, layerIdx) => {
            layer.neuronElements = [];
            for (let j = 0; j < layer.neurons; j++) {
                const y = 80 + j * 60;
                
                const neuron = svg.append('g');
                
                neuron.append('circle')
                    .attr('cx', layer.x)
                    .attr('cy', y)
                    .attr('r', Math.max(1, 20)) // Ensure positive radius
                    .attr('fill', layerIdx === 0 ? '#10099F' : layerIdx === 1 ? '#2DD2C0' : '#FC8484')
                    .attr('stroke', '#fff')
                    .attr('stroke-width', 2);
                
                // Add activation value text
                const text = neuron.append('text')
                    .attr('x', layer.x)
                    .attr('y', y + 5)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '12px')
                    .attr('fill', '#fff')
                    .text('0.0');
                
                layer.neuronElements.push({ g: neuron, text: text, circle: neuron.select('circle') });
                neurons.push({ element: neuron, layer: layerIdx, index: j });
            }
            
            // Add layer label
            svg.append('text')
                .attr('x', layer.x)
                .attr('y', height - 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', '#262626')
                .text(layer.name);
        });
        
        // Animation controls
        let animationRunning = false;
        let animationSpeed = 1;
        
        // Remove any existing event listeners first by cloning and replacing
        const startBtn = document.getElementById('fp-start');
        const resetBtn = document.getElementById('fp-reset');
        const speedSlider = document.getElementById('fp-speed');
        
        if (startBtn) {
            const newStartBtn = startBtn.cloneNode(true);
            startBtn.parentNode.replaceChild(newStartBtn, startBtn);
            newStartBtn.addEventListener('click', () => {
                if (!animationRunning) {
                    animationRunning = true;
                    runForwardPropAnimation();
                }
            });
        }
        
        if (resetBtn) {
            const newResetBtn = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
            newResetBtn.addEventListener('click', () => {
                animationRunning = false;
                resetAnimation();
            });
        }
        
        if (speedSlider) {
            const newSpeedSlider = speedSlider.cloneNode(true);
            speedSlider.parentNode.replaceChild(newSpeedSlider, speedSlider);
            newSpeedSlider.addEventListener('input', (e) => {
                animationSpeed = parseFloat(e.target.value);
                document.getElementById('fp-speed-value').textContent = animationSpeed + 'x';
            });
        }
        
        function runForwardPropAnimation() {
            const duration = 1000 / animationSpeed;
            
            // Reset first
            resetAnimation();
            
            // Animate input layer activation
            layers[0].neuronElements.forEach((neuron, i) => {
                const value = Math.random();
                neuron.text.transition()
                    .duration(duration)
                    .text(value.toFixed(2));
                
                neuron.circle.transition()
                    .duration(duration)
                    .attr('fill', d3.interpolateBlues(value));
            });
            
            // Animate connections from input to hidden
            setTimeout(() => {
                connections.filter(c => c.layer === 0).forEach(c => {
                    c.line.transition()
                        .duration(duration)
                        .attr('stroke', '#FFA05F')
                        .attr('stroke-width', 3)
                        .transition()
                        .duration(duration)
                        .attr('stroke', '#EEEEEE')
                        .attr('stroke-width', 2);
                });
                
                // Animate hidden layer activation
                layers[1].neuronElements.forEach((neuron, i) => {
                    const value = Math.random();
                    neuron.text.transition()
                        .delay(duration / 2)
                        .duration(duration)
                        .text(value.toFixed(2));
                    
                    neuron.circle.transition()
                        .delay(duration / 2)
                        .duration(duration)
                        .attr('fill', d3.interpolateGreens(value));
                });
            }, duration);
            
            // Animate connections from hidden to output
            setTimeout(() => {
                connections.filter(c => c.layer === 1).forEach(c => {
                    c.line.transition()
                        .duration(duration)
                        .attr('stroke', '#FFA05F')
                        .attr('stroke-width', 3)
                        .transition()
                        .duration(duration)
                        .attr('stroke', '#EEEEEE')
                        .attr('stroke-width', 2);
                });
                
                // Animate output layer activation
                layers[2].neuronElements.forEach((neuron, i) => {
                    const value = Math.random();
                    neuron.text.transition()
                        .delay(duration / 2)
                        .duration(duration)
                        .text(value.toFixed(2));
                    
                    neuron.circle.transition()
                        .delay(duration / 2)
                        .duration(duration)
                        .attr('fill', d3.interpolateReds(value));
                });
            }, duration * 2);
            
            // Mark animation as complete
            setTimeout(() => {
                animationRunning = false;
            }, duration * 3);
        }
        
        function resetAnimation() {
            // Reset all neurons
            layers.forEach((layer, layerIdx) => {
                layer.neuronElements.forEach(neuron => {
                    neuron.text.text('0.0');
                    neuron.circle.attr('fill', 
                        layerIdx === 0 ? '#10099F' : 
                        layerIdx === 1 ? '#2DD2C0' : '#FC8484');
                });
            });
            
            // Reset connections
            connections.forEach(c => {
                c.line.attr('stroke', '#EEEEEE').attr('stroke-width', 2);
            });
        }
    }
    
    // Training Visualization
    function initTrainingVisualization() {
        const lossContainer = document.getElementById('training-loss-plot');
        const accContainer = document.getElementById('training-accuracy-plot');
        if (!lossContainer || !accContainer) return;
        
        const width = lossContainer.offsetWidth || 350;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // Create loss plot
        const lossSvg = d3.select(lossContainer)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const lossG = lossSvg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Create accuracy plot
        const accSvg = d3.select(accContainer)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const accG = accSvg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, innerWidth]);
        
        const lossScale = d3.scaleLinear()
            .domain([0, 2.5])
            .range([innerHeight, 0]);
        
        const accScale = d3.scaleLinear()
            .domain([0, 100])
            .range([innerHeight, 0]);
        
        // Add axes
        lossG.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        lossG.append('g')
            .call(d3.axisLeft(lossScale));
        
        accG.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        accG.append('g')
            .call(d3.axisLeft(accScale));
        
        // Add labels
        lossG.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (innerHeight / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Loss');
        
        lossG.append('text')
            .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Epoch');
        
        accG.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (innerHeight / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Accuracy (%)');
        
        accG.append('text')
            .attr('transform', `translate(${innerWidth / 2}, ${innerHeight + margin.bottom})`)
            .style('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Epoch');
        
        // Data arrays
        let lossData = [];
        let accData = [];
        let currentEpoch = 0;
        let trainingInterval = null;
        let isPaused = false;
        
        // Line generators
        const lossLine = d3.line()
            .x(d => xScale(d.epoch))
            .y(d => lossScale(d.value))
            .curve(d3.curveMonotoneX);
        
        const accLine = d3.line()
            .x(d => xScale(d.epoch))
            .y(d => accScale(d.value))
            .curve(d3.curveMonotoneX);
        
        // Add line paths
        const lossPath = lossG.append('path')
            .attr('fill', 'none')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2);
        
        const accPath = accG.append('path')
            .attr('fill', 'none')
            .attr('stroke', '#2DD2C0')
            .attr('stroke-width', 2);
        
        // Training simulation
        function simulateTraining() {
            if (currentEpoch >= 10 || isPaused) {
                clearInterval(trainingInterval);
                return;
            }
            
            currentEpoch++;
            
            // Simulate loss decrease
            const loss = 2.3 * Math.exp(-currentEpoch * 0.3) + 0.3 + Math.random() * 0.1;
            lossData.push({ epoch: currentEpoch, value: loss });
            
            // Simulate accuracy increase
            const acc = 85 * (1 - Math.exp(-currentEpoch * 0.3)) + 10 + Math.random() * 5;
            accData.push({ epoch: currentEpoch, value: acc });
            
            // Update paths
            lossPath.datum(lossData)
                .attr('d', lossLine);
            
            accPath.datum(accData)
                .attr('d', accLine);
            
            // Update epoch display
            document.getElementById('train-epoch').textContent = `Epoch: ${currentEpoch}/10`;
        }
        
        // Control buttons
        document.getElementById('train-start')?.addEventListener('click', () => {
            if (!trainingInterval) {
                isPaused = false;
                trainingInterval = setInterval(simulateTraining, 1000);
            }
        });
        
        document.getElementById('train-pause')?.addEventListener('click', () => {
            isPaused = true;
            clearInterval(trainingInterval);
            trainingInterval = null;
        });
        
        document.getElementById('train-reset')?.addEventListener('click', () => {
            clearInterval(trainingInterval);
            trainingInterval = null;
            currentEpoch = 0;
            lossData = [];
            accData = [];
            isPaused = false;
            lossPath.datum(lossData).attr('d', lossLine);
            accPath.datum(accData).attr('d', accLine);
            document.getElementById('train-epoch').textContent = 'Epoch: 0/10';
        });
    }
    
    // Implementation Comparison
    function initImplementationComparison() {
        const scratchCanvas = document.getElementById('scratch-loss-canvas');
        const apiCanvas = document.getElementById('api-loss-canvas');
        if (!scratchCanvas || !apiCanvas) return;
        
        const width = scratchCanvas.parentElement.offsetWidth - 20;
        const height = 230;
        
        // Setup canvases
        scratchCanvas.width = width;
        scratchCanvas.height = height;
        apiCanvas.width = width;
        apiCanvas.height = height;
        
        const scratchCtx = scratchCanvas.getContext('2d');
        const apiCtx = apiCanvas.getContext('2d');
        
        // Data storage
        let scratchData = [];
        let apiData = [];
        let animationFrame = null;
        let currentStep = 0;
        
        function drawChart(ctx, data, color) {
            ctx.clearRect(0, 0, width, height);
            
            // Draw axes
            ctx.strokeStyle = '#ddd';
            ctx.beginPath();
            ctx.moveTo(30, 10);
            ctx.lineTo(30, height - 30);
            ctx.lineTo(width - 10, height - 30);
            ctx.stroke();
            
            // Draw data
            if (data.length > 1) {
                ctx.strokeStyle = color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                
                data.forEach((point, i) => {
                    const x = 30 + (i / 100) * (width - 40);
                    const y = height - 30 - (1 - point) * (height - 40);
                    
                    if (i === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                });
                
                ctx.stroke();
            }
            
            // Labels
            ctx.fillStyle = '#666';
            ctx.font = '10px sans-serif';
            ctx.fillText('0', 10, height - 25);
            ctx.fillText('Loss', 5, 20);
            ctx.fillText('Steps', width - 35, height - 10);
        }
        
        function simulateComparison() {
            if (currentStep >= 100) {
                cancelAnimationFrame(animationFrame);
                return;
            }
            
            currentStep++;
            
            // Simulate training curves (similar performance)
            const scratchLoss = Math.exp(-currentStep * 0.05) + Math.random() * 0.05;
            const apiLoss = Math.exp(-currentStep * 0.05) + Math.random() * 0.03;
            
            scratchData.push(scratchLoss);
            apiData.push(apiLoss);
            
            drawChart(scratchCtx, scratchData, '#10099F');
            drawChart(apiCtx, apiData, '#2DD2C0');
            
            // Update metrics
            document.getElementById('scratch-loss').textContent = scratchLoss.toFixed(3);
            document.getElementById('scratch-acc').textContent = ((1 - scratchLoss) * 85 + 10).toFixed(1) + '%';
            document.getElementById('scratch-time').textContent = '1.2s';
            
            document.getElementById('api-loss').textContent = apiLoss.toFixed(3);
            document.getElementById('api-acc').textContent = ((1 - apiLoss) * 85 + 10).toFixed(1) + '%';
            document.getElementById('api-time').textContent = '1.1s';
            
            animationFrame = requestAnimationFrame(simulateComparison);
        }
        
        document.getElementById('compare-start')?.addEventListener('click', () => {
            if (!animationFrame) {
                simulateComparison();
            }
        });
        
        document.getElementById('compare-reset')?.addEventListener('click', () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
            currentStep = 0;
            scratchData = [];
            apiData = [];
            drawChart(scratchCtx, scratchData, '#10099F');
            drawChart(apiCtx, apiData, '#2DD2C0');
            document.getElementById('scratch-loss').textContent = '-';
            document.getElementById('scratch-acc').textContent = '-';
            document.getElementById('scratch-time').textContent = '-';
            document.getElementById('api-loss').textContent = '-';
            document.getElementById('api-acc').textContent = '-';
            document.getElementById('api-time').textContent = '-';
        });
    }
    
    // Initialize all visualizations when slides are ready
    Reveal.on('ready', () => {
        initArchitectureVisualization();
        initForwardPropagation();
        initTrainingVisualization();
        initImplementationComparison();
    });
    
    // Reinitialize on slide change if needed
    Reveal.on('slidechanged', (event) => {
        // Check if we're on a slide with visualizations
        if (event.currentSlide.querySelector('#mlp-architecture-viz')) {
            initArchitectureVisualization();
        }
        if (event.currentSlide.querySelector('#forward-prop-viz')) {
            initForwardPropagation();
        }
        if (event.currentSlide.querySelector('#training-loss-plot')) {
            initTrainingVisualization();
        }
        if (event.currentSlide.querySelector('#scratch-loss-canvas')) {
            initImplementationComparison();
        }
    });
});