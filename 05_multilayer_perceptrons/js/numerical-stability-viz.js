// Numerical Stability Visualizations
// For the Numerical Stability and Initialization section

(function() {
    'use strict';

    // Initialize all visualizations when Reveal is ready
    if (typeof Reveal !== 'undefined') {
        Reveal.on('ready', () => initVisualizations());
        Reveal.on('slidechanged', () => initVisualizations());
    } else {
        document.addEventListener('DOMContentLoaded', initVisualizations);
    }

    function initVisualizations() {
        initGradientFlowVisualization();
        initSigmoidGradientVisualization();
        initMatrixExplosionVisualization();
        initSymmetryBreakingVisualization();
    }

    // Gradient Flow Visualization
    function initGradientFlowVisualization() {
        const container = document.getElementById('gradient-flow-viz');
        if (!container || container.hasAttribute('data-initialized')) return;
        container.setAttribute('data-initialized', 'true');

        const width = container.clientWidth || 800;
        const height = 350;
        const numLayers = 6;
        const neuronsPerLayer = 5;
        
        const svg = d3.select(container)
            .html('')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create gradient definitions
        const defs = svg.append('defs');
        
        // Gradient for vanishing
        const vanishGradient = defs.append('linearGradient')
            .attr('id', 'vanish-gradient')
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '100%').attr('y2', '0%');
        vanishGradient.append('stop')
            .attr('offset', '0%')
            .style('stop-color', '#FC8484')
            .style('stop-opacity', 1);
        vanishGradient.append('stop')
            .attr('offset', '100%')
            .style('stop-color', '#FC8484')
            .style('stop-opacity', 0.1);

        // Gradient for exploding
        const explodeGradient = defs.append('linearGradient')
            .attr('id', 'explode-gradient')
            .attr('x1', '0%').attr('y1', '0%')
            .attr('x2', '100%').attr('y2', '0%');
        explodeGradient.append('stop')
            .attr('offset', '0%')
            .style('stop-color', '#FC8484')
            .style('stop-opacity', 0.3);
        explodeGradient.append('stop')
            .attr('offset', '100%')
            .style('stop-color', '#FC8484')
            .style('stop-opacity', 1);

        // Create network structure
        const layerSpacing = width / (numLayers + 1);
        const neuronSpacing = height / (neuronsPerLayer + 1);
        
        const layers = [];
        const connections = [];
        
        for (let l = 0; l < numLayers; l++) {
            const layer = [];
            const x = layerSpacing * (l + 1);
            
            for (let n = 0; n < neuronsPerLayer; n++) {
                const y = neuronSpacing * (n + 1);
                layer.push({ x, y, layer: l, neuron: n });
            }
            layers.push(layer);
            
            // Create connections to previous layer
            if (l > 0) {
                const prevLayer = layers[l - 1];
                for (let i = 0; i < prevLayer.length; i++) {
                    for (let j = 0; j < layer.length; j++) {
                        connections.push({
                            source: prevLayer[i],
                            target: layer[j],
                            weight: (Math.random() - 0.5) * 2
                        });
                    }
                }
            }
        }

        // Draw connections
        const connectionElements = svg.selectAll('.connection')
            .data(connections)
            .enter().append('line')
            .attr('class', 'connection')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .style('stroke', '#ddd')
            .style('stroke-width', 1)
            .style('opacity', 0.5);

        // Draw neurons
        const neuronGroups = svg.selectAll('.neuron-group')
            .data(layers.flat())
            .enter().append('g')
            .attr('class', 'neuron-group')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        neuronGroups.append('circle')
            .attr('class', 'neuron')
            .attr('r', 12)
            .style('fill', d => {
                if (d.layer === 0) return '#10099F';
                if (d.layer === numLayers - 1) return '#FC8484';
                return '#2DD2C0';
            })
            .style('stroke', 'white')
            .style('stroke-width', 2);

        // Add layer labels
        svg.selectAll('.layer-label')
            .data(Array(numLayers).fill(0))
            .enter().append('text')
            .attr('class', 'layer-label')
            .attr('x', (d, i) => layerSpacing * (i + 1))
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text((d, i) => i === 0 ? 'Input' : i === numLayers - 1 ? 'Output' : `Layer ${i}`);

        // Gradient norm display
        const gradNormsDiv = document.getElementById('grad-norms');
        const statusDiv = document.getElementById('grad-status');

        // Animation function
        function animateGradientFlow() {
            const scaleValue = parseFloat(document.getElementById('grad-init-scale').value);
            const activation = document.getElementById('grad-activation').value;
            
            if (gradNormsDiv) gradNormsDiv.innerHTML = '';
            if (statusDiv) statusDiv.textContent = 'Animating backpropagation...';
            
            let gradientNorms = [1.0]; // Start with gradient norm of 1 at output
            
            // Calculate gradient norms for each layer
            for (let l = numLayers - 2; l >= 0; l--) {
                let multiplier = scaleValue;
                
                // Apply activation function effect
                if (activation === 'sigmoid') {
                    multiplier *= 0.25; // Max sigmoid gradient
                } else if (activation === 'tanh') {
                    multiplier *= 0.8; // Approximate tanh gradient effect
                } else if (activation === 'relu') {
                    multiplier *= 0.9; // Some neurons might be zero
                }
                
                const newNorm = gradientNorms[0] * multiplier;
                gradientNorms.unshift(newNorm);
            }
            
            // Animate the flow
            layers.forEach((layer, layerIdx) => {
                const delay = (numLayers - layerIdx - 1) * 500;
                
                setTimeout(() => {
                    const norm = gradientNorms[layerIdx];
                    const isVanishing = norm < 0.01;
                    const isExploding = norm > 100;
                    
                    // Update connections
                    connectionElements
                        .filter(d => d.target.layer === layerIdx)
                        .transition()
                        .duration(400)
                        .style('stroke', () => {
                            if (isVanishing) return 'url(#vanish-gradient)';
                            if (isExploding) return 'url(#explode-gradient)';
                            return '#FFA05F';
                        })
                        .style('stroke-width', () => {
                            if (isVanishing) return 0.5;
                            if (isExploding) return Math.min(5, norm / 20);
                            return 2;
                        })
                        .style('opacity', 1);
                    
                    // Update neurons
                    neuronGroups
                        .filter(d => d.layer === layerIdx)
                        .select('circle')
                        .transition()
                        .duration(400)
                        .attr('r', () => {
                            if (isExploding) return Math.min(20, Math.max(1, 12 + norm / 50));
                            return 12;
                        })
                        .style('opacity', () => {
                            if (isVanishing) return Math.max(0.3, norm * 10);
                            return 1;
                        });
                    
                    // Update gradient norms display
                    if (gradNormsDiv) {
                        const normText = `Layer ${layerIdx}: ${norm.toExponential(2)}`;
                        const normElement = document.createElement('div');
                        normElement.textContent = normText;
                        if (isVanishing) normElement.style.color = '#FC8484';
                        if (isExploding) normElement.style.color = '#FFA05F';
                        gradNormsDiv.appendChild(normElement);
                    }
                    
                }, delay);
            });
            
            // Reset after animation
            setTimeout(() => {
                if (statusDiv) statusDiv.textContent = 'Animation complete';
            }, numLayers * 500);
        }

        // Event handlers
        const animateBtn = document.getElementById('grad-flow-animate');
        const resetBtn = document.getElementById('grad-flow-reset');
        const scaleSlider = document.getElementById('grad-init-scale');
        const scaleValue = document.getElementById('grad-scale-value');

        if (animateBtn) {
            animateBtn.addEventListener('click', animateGradientFlow);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                connectionElements
                    .transition()
                    .duration(300)
                    .style('stroke', '#ddd')
                    .style('stroke-width', 1)
                    .style('opacity', 0.5);
                
                neuronGroups.select('circle')
                    .transition()
                    .duration(300)
                    .attr('r', 12)
                    .style('opacity', 1);
                
                if (gradNormsDiv) gradNormsDiv.innerHTML = '';
                if (statusDiv) statusDiv.textContent = 'Ready to animate';
            });
        }

        if (scaleSlider && scaleValue) {
            scaleSlider.addEventListener('input', () => {
                scaleValue.textContent = scaleSlider.value;
            });
        }
    }

    // Sigmoid Gradient Visualization
    function initSigmoidGradientVisualization() {
        const container = document.getElementById('sigmoid-gradient-viz');
        if (!container || container.hasAttribute('data-initialized')) return;
        container.setAttribute('data-initialized', 'true');

        const width = container.clientWidth || 800;
        const height = 300;
        const margin = { top: 20, right: 40, bottom: 40, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(container)
            .html('')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([-8, 8])
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);

        // Axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        g.append('g')
            .call(d3.axisLeft(yScale));

        // Axis labels
        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 35)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Input (x)');

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40)
            .attr('x', -innerHeight / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Value');

        // Generate data
        const xValues = d3.range(-8, 8.1, 0.1);
        const sigmoid = x => 1 / (1 + Math.exp(-x));
        const sigmoidGradient = x => {
            const s = sigmoid(x);
            return s * (1 - s);
        };

        const sigmoidData = xValues.map(x => ({ x, y: sigmoid(x) }));
        const gradientData = xValues.map(x => ({ x, y: sigmoidGradient(x) }));

        // Line generators
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        // Draw sigmoid function
        g.append('path')
            .datum(sigmoidData)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Draw gradient
        g.append('path')
            .datum(gradientData)
            .attr('fill', 'none')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add legend
        const legend = g.append('g')
            .attr('transform', `translate(${innerWidth - 100}, 10)`);

        legend.append('line')
            .attr('x1', 0).attr('y1', 0)
            .attr('x2', 20).attr('y2', 0)
            .style('stroke', '#10099F')
            .style('stroke-width', 2);
        legend.append('text')
            .attr('x', 25).attr('y', 4)
            .style('font-size', '12px')
            .text('σ(x)');

        legend.append('line')
            .attr('x1', 0).attr('y1', 15)
            .attr('x2', 20).attr('y2', 15)
            .style('stroke', '#FC8484')
            .style('stroke-width', 2);
        legend.append('text')
            .attr('x', 25).attr('y', 19)
            .style('font-size', '12px')
            .text("σ'(x)");

        // Interactive marker
        const marker = g.append('g')
            .style('display', 'none');

        marker.append('line')
            .attr('class', 'marker-line')
            .style('stroke', '#666')
            .style('stroke-dasharray', '3,3')
            .attr('y1', 0)
            .attr('y2', innerHeight);

        const sigmoidDot = marker.append('circle')
            .attr('r', 5)
            .style('fill', '#10099F');

        const gradientDot = marker.append('circle')
            .attr('r', 5)
            .style('fill', '#FC8484');

        // Update function
        function updateMarker(xValue) {
            const s = sigmoid(xValue);
            const g = sigmoidGradient(xValue);
            
            marker.style('display', null)
                .attr('transform', `translate(${xScale(xValue)}, 0)`);
            
            sigmoidDot.attr('cy', yScale(s));
            gradientDot.attr('cy', yScale(g));
            
            document.getElementById('sigmoid-output').textContent = s.toFixed(3);
            document.getElementById('sigmoid-gradient').textContent = g.toFixed(3);
        }

        // Event handler
        const slider = document.getElementById('sigmoid-x-input');
        const valueDisplay = document.getElementById('sigmoid-x-value');
        
        if (slider && valueDisplay) {
            slider.addEventListener('input', () => {
                const value = parseFloat(slider.value);
                valueDisplay.textContent = value.toFixed(1);
                updateMarker(value);
            });
            
            // Initialize
            updateMarker(0);
        }
    }

    // Matrix Explosion Visualization
    function initMatrixExplosionVisualization() {
        const container = document.getElementById('matrix-explosion-viz');
        if (!container || container.hasAttribute('data-initialized')) return;
        container.setAttribute('data-initialized', 'true');

        const width = container.clientWidth || 800;
        const height = 250;
        const margin = { top: 20, right: 40, bottom: 30, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3.select(container)
            .html('')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales (will be updated dynamically)
        const xScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, innerWidth]);

        const yScale = d3.scaleLog()
            .domain([1, 1e30])
            .range([innerHeight, 0])
            .clamp(true);

        // Axes
        const xAxis = g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale));

        const yAxis = g.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d3.format('.0e')));

        // Axis labels
        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Iteration');

        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -60)
            .attr('x', -innerHeight / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text('Max Absolute Value');

        // Line for data
        const line = d3.line()
            .x(d => xScale(d.iteration))
            .y(d => yScale(Math.max(1, d.value)));

        const path = g.append('path')
            .attr('fill', 'none')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2);

        // Matrix multiplication simulation
        let animationId = null;
        const data = [];

        function multiplyMatrices() {
            const variance = parseFloat(document.getElementById('matrix-variance').value);
            const std = Math.sqrt(variance);
            
            // Reset
            data.length = 0;
            let matrix = generateRandomMatrix(4, 4, std);
            data.push({ iteration: 0, value: getMaxAbsValue(matrix) });
            
            let iteration = 0;
            const maxIterations = 100;
            
            function step() {
                if (iteration >= maxIterations) {
                    document.getElementById('matrix-status').textContent = 'Complete';
                    return;
                }
                
                iteration++;
                const newMatrix = generateRandomMatrix(4, 4, std);
                matrix = matrixMultiply(matrix, newMatrix);
                const maxVal = getMaxAbsValue(matrix);
                
                data.push({ iteration, value: maxVal });
                
                // Update visualization
                path.datum(data)
                    .attr('d', line);
                
                // Update status
                document.getElementById('matrix-iter').textContent = iteration;
                document.getElementById('matrix-max').textContent = maxVal.toExponential(2);
                
                if (maxVal > 1e25) {
                    document.getElementById('matrix-status').textContent = 'Exploded!';
                } else if (maxVal < 1e-25) {
                    document.getElementById('matrix-status').textContent = 'Vanished!';
                } else {
                    document.getElementById('matrix-status').textContent = 'Running...';
                }
                
                animationId = requestAnimationFrame(step);
            }
            
            step();
        }

        function generateRandomMatrix(rows, cols, std) {
            const matrix = [];
            for (let i = 0; i < rows; i++) {
                const row = [];
                for (let j = 0; j < cols; j++) {
                    // Box-Muller transform for normal distribution
                    const u1 = Math.random();
                    const u2 = Math.random();
                    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                    row.push(z * std);
                }
                matrix.push(row);
            }
            return matrix;
        }

        function matrixMultiply(a, b) {
            const result = [];
            for (let i = 0; i < a.length; i++) {
                const row = [];
                for (let j = 0; j < b[0].length; j++) {
                    let sum = 0;
                    for (let k = 0; k < b.length; k++) {
                        sum += a[i][k] * b[k][j];
                    }
                    row.push(sum);
                }
                result.push(row);
            }
            return result;
        }

        function getMaxAbsValue(matrix) {
            let max = 0;
            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    max = Math.max(max, Math.abs(matrix[i][j]));
                }
            }
            return max;
        }

        // Event handlers
        const multiplyBtn = document.getElementById('matrix-multiply');
        const resetBtn = document.getElementById('matrix-reset');
        const varianceSlider = document.getElementById('matrix-variance');
        const varianceValue = document.getElementById('matrix-var-value');

        if (multiplyBtn) {
            multiplyBtn.addEventListener('click', () => {
                if (animationId) cancelAnimationFrame(animationId);
                multiplyMatrices();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (animationId) cancelAnimationFrame(animationId);
                data.length = 0;
                path.datum(data).attr('d', line);
                document.getElementById('matrix-iter').textContent = '0';
                document.getElementById('matrix-max').textContent = '1.00';
                document.getElementById('matrix-status').textContent = 'Ready';
            });
        }

        if (varianceSlider && varianceValue) {
            varianceSlider.addEventListener('input', () => {
                varianceValue.textContent = varianceSlider.value;
            });
        }
    }

    // Symmetry Breaking Visualization
    function initSymmetryBreakingVisualization() {
        const container = document.getElementById('symmetry-breaking-viz');
        if (!container || container.hasAttribute('data-initialized')) return;
        container.setAttribute('data-initialized', 'true');

        const width = container.clientWidth || 800;
        const height = 250;
        
        const svg = d3.select(container)
            .html('')
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Network structure
        const layers = [
            { neurons: 2, x: width * 0.2, label: 'Input' },
            { neurons: 4, x: width * 0.5, label: 'Hidden' },
            { neurons: 1, x: width * 0.8, label: 'Output' }
        ];

        // Calculate neuron positions
        layers.forEach(layer => {
            layer.positions = [];
            const spacing = height / (layer.neurons + 1);
            for (let i = 0; i < layer.neurons; i++) {
                layer.positions.push({
                    x: layer.x,
                    y: spacing * (i + 1),
                    value: 0,
                    gradient: 0
                });
            }
        });

        // Draw connections
        const connections = [];
        for (let l = 1; l < layers.length; l++) {
            const prevLayer = layers[l - 1];
            const currLayer = layers[l];
            
            prevLayer.positions.forEach(source => {
                currLayer.positions.forEach(target => {
                    const conn = {
                        source,
                        target,
                        weight: 0
                    };
                    connections.push(conn);
                });
            });
        }

        const connectionElements = svg.selectAll('.sym-connection')
            .data(connections)
            .enter().append('line')
            .attr('class', 'sym-connection')
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .style('stroke', '#ddd')
            .style('stroke-width', 1);

        // Draw neurons
        const neuronGroups = svg.selectAll('.sym-neuron-group')
            .data(layers.flatMap((l, idx) => l.positions.map(p => ({ ...p, layer: idx }))))
            .enter().append('g')
            .attr('class', 'sym-neuron-group')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        const neurons = neuronGroups.append('circle')
            .attr('r', 15)
            .style('fill', d => {
                if (d.layer === 0) return '#10099F';
                if (d.layer === 2) return '#FC8484';
                return '#2DD2C0';
            })
            .style('stroke', 'white')
            .style('stroke-width', 2);

        const neuronTexts = neuronGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.3em')
            .style('font-size', '10px')
            .style('fill', 'white')
            .text('0.0');

        // Layer labels
        svg.selectAll('.sym-layer-label')
            .data(layers)
            .enter().append('text')
            .attr('class', 'sym-layer-label')
            .attr('x', d => d.x)
            .attr('y', height - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text(d => d.label);

        // Initialize functions
        function setIdenticalWeights() {
            connections.forEach(conn => {
                conn.weight = 0.5;
            });
            
            connectionElements
                .transition()
                .duration(300)
                .style('stroke', '#FFA05F')
                .style('stroke-width', d => Math.abs(d.weight) * 4);
            
            layers.forEach(layer => {
                layer.positions.forEach(neuron => {
                    neuron.value = 0.5;
                    neuron.gradient = 0.5;
                });
            });
            
            updateNeuronDisplay();
        }

        function setRandomWeights() {
            connections.forEach(conn => {
                conn.weight = (Math.random() - 0.5) * 2;
            });
            
            connectionElements
                .transition()
                .duration(300)
                .style('stroke', d => d.weight > 0 ? '#10099F' : '#FC8484')
                .style('stroke-width', d => Math.abs(d.weight) * 4)
                .style('opacity', d => Math.abs(d.weight));
            
            layers.forEach(layer => {
                layer.positions.forEach(neuron => {
                    neuron.value = Math.random();
                    neuron.gradient = Math.random();
                });
            });
            
            updateNeuronDisplay();
        }

        function trainStep() {
            // Simulate one training step
            const learningRate = 0.1;
            
            connections.forEach(conn => {
                // Update based on whether weights are identical or random
                if (Math.abs(conn.weight - 0.5) < 0.01) {
                    // Identical weights - all get same update
                    conn.weight -= learningRate * 0.1;
                } else {
                    // Random weights - different updates
                    conn.weight -= learningRate * (Math.random() - 0.5) * 0.2;
                }
            });
            
            connectionElements
                .transition()
                .duration(300)
                .style('stroke', d => d.weight > 0 ? '#10099F' : '#FC8484')
                .style('stroke-width', d => Math.abs(d.weight) * 4)
                .style('opacity', d => Math.min(1, Math.abs(d.weight)));
            
            // Update neuron values
            layers.forEach((layer, idx) => {
                if (idx > 0) {
                    layer.positions.forEach(neuron => {
                        // Check if this is symmetric initialization
                        const isSymmetric = connections.every(c => 
                            Math.abs(c.weight - connections[0].weight) < 0.01
                        );
                        
                        if (isSymmetric) {
                            neuron.value = 0.5;
                            neuron.gradient = 0.5;
                        } else {
                            neuron.value = Math.random();
                            neuron.gradient = Math.random();
                        }
                    });
                }
            });
            
            updateNeuronDisplay();
        }

        function updateNeuronDisplay() {
            neuronTexts
                .text(d => d.value.toFixed(2));
            
            neurons
                .transition()
                .duration(300)
                .style('opacity', d => 0.3 + d.value * 0.7);
        }

        // Event handlers
        const identicalBtn = document.getElementById('sym-identical');
        const randomBtn = document.getElementById('sym-random');
        const trainBtn = document.getElementById('sym-train-step');

        if (identicalBtn) {
            identicalBtn.addEventListener('click', setIdenticalWeights);
        }

        if (randomBtn) {
            randomBtn.addEventListener('click', setRandomWeights);
        }

        if (trainBtn) {
            trainBtn.addEventListener('click', trainStep);
        }
    }

})();