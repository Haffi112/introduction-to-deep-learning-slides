// Initialization Comparison Visualization
// Compares different weight initialization strategies

(function() {
    'use strict';

    // Initialize when Reveal is ready
    if (typeof Reveal !== 'undefined') {
        Reveal.on('ready', () => initVisualization());
        Reveal.on('slidechanged', () => initVisualization());
    } else {
        document.addEventListener('DOMContentLoaded', initVisualization);
    }

    function initVisualization() {
        const container = document.getElementById('init-comparison-viz');
        if (!container || container.hasAttribute('data-initialized')) return;
        container.setAttribute('data-initialized', 'true');

        const width = container.clientWidth || 800;
        const height = 300;
        const margin = { top: 20, right: 40, bottom: 40, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create two charts: loss over time and gradient norms
        const svg = d3.select(container)
            .html('')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Split into two panels
        const lossPanel = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        const gradPanel = svg.append('g')
            .attr('transform', `translate(${width/2 + margin.left},${margin.top})`);

        const panelWidth = (innerWidth - 20) / 2;

        // Scales for loss
        const xScaleLoss = d3.scaleLinear()
            .domain([0, 100])
            .range([0, panelWidth]);

        const yScaleLoss = d3.scaleLog()
            .domain([0.01, 10])
            .range([innerHeight, 0])
            .clamp(true);

        // Scales for gradient norms
        const xScaleGrad = d3.scaleLinear()
            .domain([0, 10])
            .range([0, panelWidth]);

        const yScaleGrad = d3.scaleLog()
            .domain([1e-6, 1e3])
            .range([innerHeight, 0])
            .clamp(true);

        // Axes for loss panel
        lossPanel.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScaleLoss).ticks(5));

        lossPanel.append('g')
            .call(d3.axisLeft(yScaleLoss).ticks(5).tickFormat(d3.format('.2f')));

        // Axes for gradient panel
        gradPanel.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScaleGrad).ticks(5));

        gradPanel.append('g')
            .call(d3.axisLeft(yScaleGrad).ticks(5).tickFormat(d3.format('.0e')));

        // Axis labels
        lossPanel.append('text')
            .attr('x', panelWidth / 2)
            .attr('y', innerHeight + 35)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .text('Epoch');

        lossPanel.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -innerHeight / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .text('Loss');

        gradPanel.append('text')
            .attr('x', panelWidth / 2)
            .attr('y', innerHeight + 35)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .text('Layer');

        gradPanel.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -innerHeight / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '11px')
            .text('Gradient Norm');

        // Panel titles
        lossPanel.append('text')
            .attr('x', panelWidth / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Training Loss');

        gradPanel.append('text')
            .attr('x', panelWidth / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Gradient Norms by Layer');

        // Line generators
        const lossLine = d3.line()
            .x(d => xScaleLoss(d.epoch))
            .y(d => yScaleLoss(Math.max(0.01, d.loss)));

        // Neural network simulation
        class SimpleNetwork {
            constructor(depth, widths, initMethod) {
                this.depth = depth;
                this.widths = widths;
                this.layers = [];
                this.initMethod = initMethod;
                
                // Initialize layers
                for (let i = 0; i < depth; i++) {
                    const inputSize = i === 0 ? widths[0] : widths[i-1];
                    const outputSize = widths[i];
                    
                    this.layers.push({
                        weights: this.initializeWeights(inputSize, outputSize, initMethod),
                        bias: new Array(outputSize).fill(0),
                        activation: null,
                        gradient: null
                    });
                }
            }

            initializeWeights(inputSize, outputSize, method) {
                const weights = [];
                let scale = 1.0;
                
                // Calculate initialization scale based on method
                switch(method) {
                    case 'zeros':
                        return Array(inputSize).fill(null).map(() => 
                            Array(outputSize).fill(0));
                    
                    case 'constant':
                        return Array(inputSize).fill(null).map(() => 
                            Array(outputSize).fill(0.5));
                    
                    case 'normal-small':
                        scale = 0.01;
                        break;
                    
                    case 'normal-large':
                        scale = 1.0;
                        break;
                    
                    case 'xavier':
                        scale = Math.sqrt(2.0 / (inputSize + outputSize));
                        break;
                    
                    case 'he':
                        scale = Math.sqrt(2.0 / inputSize);
                        break;
                }
                
                // Generate weights with normal distribution
                for (let i = 0; i < inputSize; i++) {
                    const row = [];
                    for (let j = 0; j < outputSize; j++) {
                        // Box-Muller transform
                        const u1 = Math.random();
                        const u2 = Math.random();
                        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        row.push(z * scale);
                    }
                    weights.push(row);
                }
                
                return weights;
            }

            forward(input) {
                let activation = input;
                
                for (let i = 0; i < this.layers.length; i++) {
                    const layer = this.layers[i];
                    const newActivation = [];
                    
                    // Matrix multiplication
                    for (let j = 0; j < layer.weights[0].length; j++) {
                        let sum = layer.bias[j];
                        for (let k = 0; k < activation.length; k++) {
                            sum += activation[k] * layer.weights[k][j];
                        }
                        // ReLU activation (except last layer)
                        newActivation.push(i < this.layers.length - 1 ? Math.max(0, sum) : sum);
                    }
                    
                    layer.activation = activation;
                    activation = newActivation;
                }
                
                return activation;
            }

            computeLoss(output, target) {
                // Simple MSE loss
                let loss = 0;
                for (let i = 0; i < output.length; i++) {
                    const diff = output[i] - target[i];
                    loss += diff * diff;
                }
                return loss / output.length;
            }

            computeGradientNorms() {
                // Simulate gradient computation
                const norms = [];
                
                for (let i = 0; i < this.layers.length; i++) {
                    const layer = this.layers[i];
                    let norm = 0;
                    let count = 0;
                    
                    // Compute Frobenius norm of weight gradients
                    for (let j = 0; j < layer.weights.length; j++) {
                        for (let k = 0; k < layer.weights[j].length; k++) {
                            // Simulate gradient based on initialization
                            let grad = Math.random() - 0.5;
                            
                            // Modify based on initialization method
                            if (this.initMethod === 'zeros' || this.initMethod === 'constant') {
                                grad *= 0.01; // Very small gradients due to symmetry
                            } else if (this.initMethod === 'normal-small') {
                                grad *= Math.pow(0.5, i); // Vanishing gradients
                            } else if (this.initMethod === 'normal-large') {
                                grad *= Math.pow(2, i); // Exploding gradients
                            } else if (this.initMethod === 'xavier' || this.initMethod === 'he') {
                                grad *= 1.0; // Stable gradients
                            }
                            
                            norm += grad * grad;
                            count++;
                        }
                    }
                    
                    norms.push(Math.sqrt(norm / count));
                }
                
                return norms;
            }

            train(epochs = 100) {
                const lossHistory = [];
                const gradHistory = [];
                
                // Generate synthetic data
                const batchSize = 32;
                const input = Array(batchSize).fill(null).map(() => 
                    Array(this.widths[0]).fill(null).map(() => Math.random())
                );
                const target = Array(batchSize).fill(null).map(() => 
                    Array(this.widths[this.widths.length - 1]).fill(null).map(() => Math.random())
                );
                
                for (let epoch = 0; epoch < epochs; epoch++) {
                    let epochLoss = 0;
                    
                    // Mini-batch training simulation
                    for (let b = 0; b < batchSize; b++) {
                        const output = this.forward(input[b]);
                        const loss = this.computeLoss(output, target[b]);
                        epochLoss += loss;
                    }
                    
                    epochLoss /= batchSize;
                    
                    // Simulate convergence behavior based on initialization
                    if (this.initMethod === 'zeros' || this.initMethod === 'constant') {
                        // Very slow or no convergence
                        epochLoss *= Math.exp(-epoch * 0.001);
                    } else if (this.initMethod === 'normal-small') {
                        // Slow convergence
                        epochLoss *= Math.exp(-epoch * 0.01);
                    } else if (this.initMethod === 'normal-large') {
                        // Unstable, might diverge
                        epochLoss *= Math.exp(-epoch * 0.02 + Math.random() * 0.1);
                    } else if (this.initMethod === 'xavier' || this.initMethod === 'he') {
                        // Good convergence
                        epochLoss *= Math.exp(-epoch * 0.05);
                    }
                    
                    lossHistory.push({ epoch, loss: epochLoss });
                    
                    // Record gradient norms periodically
                    if (epoch % 10 === 0) {
                        gradHistory.push({
                            epoch,
                            norms: this.computeGradientNorms()
                        });
                    }
                }
                
                return { lossHistory, gradHistory };
            }
        }

        // Training visualization
        let animationId = null;
        let currentNetwork = null;

        function trainNetwork() {
            const method = document.getElementById('init-method').value;
            const depth = parseInt(document.getElementById('init-depth').value);
            
            // Create network architecture
            const widths = [10]; // Input size
            for (let i = 1; i < depth; i++) {
                widths.push(20); // Hidden layers
            }
            widths.push(5); // Output size
            
            // Create and train network
            currentNetwork = new SimpleNetwork(depth, widths, method);
            const { lossHistory, gradHistory } = currentNetwork.train(100);
            
            // Visualize loss
            const lossPath = lossPanel.selectAll('.loss-line')
                .data([lossHistory]);

            lossPath.enter()
                .append('path')
                .attr('class', 'loss-line')
                .merge(lossPath)
                .attr('fill', 'none')
                .attr('stroke', '#10099F')
                .attr('stroke-width', 2)
                .attr('d', lossLine);

            // Visualize gradient norms for last epoch
            if (gradHistory.length > 0) {
                const lastGradients = gradHistory[gradHistory.length - 1].norms;
                const gradData = lastGradients.map((norm, i) => ({ layer: i, norm }));
                
                const bars = gradPanel.selectAll('.grad-bar')
                    .data(gradData);

                bars.enter()
                    .append('rect')
                    .attr('class', 'grad-bar')
                    .merge(bars)
                    .attr('x', d => xScaleGrad(d.layer))
                    .attr('width', xScaleGrad(1) - xScaleGrad(0) - 2)
                    .attr('y', d => yScaleGrad(Math.max(1e-6, d.norm)))
                    .attr('height', d => innerHeight - yScaleGrad(Math.max(1e-6, d.norm)))
                    .attr('fill', d => {
                        if (d.norm < 1e-3) return '#FC8484'; // Vanishing
                        if (d.norm > 100) return '#FFA05F'; // Exploding
                        return '#2DD2C0'; // Healthy
                    });

                bars.exit().remove();
            }
            
            // Update status displays
            updateStatus(lossHistory, gradHistory, method);
        }

        function updateStatus(lossHistory, gradHistory, method) {
            const finalLoss = lossHistory[lossHistory.length - 1].loss;
            const lossDisplay = document.getElementById('init-loss');
            if (lossDisplay) {
                lossDisplay.textContent = finalLoss.toExponential(2);
            }
            
            if (gradHistory.length > 0) {
                const lastGrads = gradHistory[gradHistory.length - 1].norms;
                const avgNorm = lastGrads.reduce((a, b) => a + b, 0) / lastGrads.length;
                const gradNormDisplay = document.getElementById('init-grad-norm');
                if (gradNormDisplay) {
                    gradNormDisplay.textContent = avgNorm.toExponential(2);
                }
                
                // Determine convergence status
                const convergenceDisplay = document.getElementById('init-convergence');
                if (convergenceDisplay) {
                    let status = 'Normal';
                    let color = '#2DD2C0';
                    
                    if (method === 'zeros' || method === 'constant') {
                        status = 'No learning';
                        color = '#FC8484';
                    } else if (avgNorm < 1e-3) {
                        status = 'Vanishing';
                        color = '#FC8484';
                    } else if (avgNorm > 100) {
                        status = 'Exploding';
                        color = '#FFA05F';
                    } else if (finalLoss < 0.1) {
                        status = 'Converged';
                        color = '#2DD2C0';
                    } else {
                        status = 'Slow';
                        color = '#FAC55B';
                    }
                    
                    convergenceDisplay.textContent = status;
                    convergenceDisplay.style.color = color;
                }
            }
        }

        function reset() {
            lossPanel.selectAll('.loss-line').remove();
            gradPanel.selectAll('.grad-bar').remove();
            
            document.getElementById('init-loss').textContent = '-';
            document.getElementById('init-grad-norm').textContent = '-';
            document.getElementById('init-convergence').textContent = '-';
        }

        // Event handlers
        const trainBtn = document.getElementById('init-train');
        const resetBtn = document.getElementById('init-reset');
        const depthSlider = document.getElementById('init-depth');
        const depthValue = document.getElementById('init-depth-value');

        if (trainBtn) {
            trainBtn.addEventListener('click', trainNetwork);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', reset);
        }

        if (depthSlider && depthValue) {
            depthSlider.addEventListener('input', () => {
                depthValue.textContent = depthSlider.value;
            });
        }
    }

})();