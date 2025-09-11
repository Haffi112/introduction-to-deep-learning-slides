// Kernel Learning Demo - Animated gradient descent visualization
(function() {
    'use strict';

    // Initialize when Reveal is ready
    if (typeof Reveal !== 'undefined') {
        Reveal.on('ready', init);
        Reveal.on('slidechanged', event => {
            if (event.currentSlide.querySelector('#kernel-learning-demo')) {
                init();
            }
        });
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    function init() {
        const demo = document.getElementById('kernel-learning-demo');
        if (!demo || !window.d3) return;

        // Target kernel (what we're trying to learn)
        const targetKernel = [[1.0, -1.0]];
        
        // Current kernel (starts random)
        let currentKernel = [[Math.random() * 2 - 1, Math.random() * 2 - 1]];
        
        // Training parameters
        let learningRate = 0.03;
        let epoch = 0;
        let lossHistory = [];
        let isTraining = false;
        let trainingTimer = null;

        // Simple input/output for demonstration
        const inputData = [
            [1, 1, 0, 0],
            [1, 1, 0, 0],
            [1, 1, 0, 0]
        ];

        // Display kernel as a grid
        function displayKernel(container, kernel, title) {
            const div = document.getElementById(container);
            if (!div) return;
            
            div.innerHTML = `<table style="margin: 0 auto; border-collapse: collapse;">
                <tr>
                    ${kernel[0].map(val => 
                        `<td style="border: 1px solid #ccc; padding: 10px; width: 60px; text-align: center;">
                            ${val.toFixed(3)}
                        </td>`
                    ).join('')}
                </tr>
            </table>`;
        }

        // Compute convolution output
        function convolve(input, kernel) {
            const output = [];
            const kh = kernel.length;
            const kw = kernel[0].length;
            
            for (let i = 0; i <= input.length - kh; i++) {
                output[i] = [];
                for (let j = 0; j <= input[0].length - kw; j++) {
                    let sum = 0;
                    for (let ki = 0; ki < kh; ki++) {
                        for (let kj = 0; kj < kw; kj++) {
                            sum += input[i + ki][j + kj] * kernel[ki][kj];
                        }
                    }
                    output[i][j] = sum;
                }
            }
            return output;
        }

        // Compute loss (mean squared error)
        function computeLoss(predicted, target) {
            let loss = 0;
            let count = 0;
            
            for (let i = 0; i < predicted.length; i++) {
                for (let j = 0; j < predicted[0].length; j++) {
                    loss += Math.pow(predicted[i][j] - target[i][j], 2);
                    count++;
                }
            }
            
            return loss / count;
        }

        // Compute gradient
        function computeGradient(input, kernel, target) {
            const predicted = convolve(input, kernel);
            const gradient = [[0, 0]];
            
            // Simplified gradient computation for demonstration
            for (let ki = 0; ki < kernel[0].length; ki++) {
                let grad = 0;
                for (let i = 0; i <= input.length - 1; i++) {
                    for (let j = 0; j <= input[0].length - kernel[0].length; j++) {
                        const predVal = predicted[i][j];
                        const targetVal = target[i][j];
                        const error = predVal - targetVal;
                        grad += 2 * error * input[i][j + ki];
                    }
                }
                gradient[0][ki] = grad / (predicted.length * predicted[0].length);
            }
            
            return gradient;
        }

        // Training step
        function trainStep() {
            const targetOutput = convolve(inputData, targetKernel);
            const gradient = computeGradient(inputData, currentKernel, targetOutput);
            
            // Update kernel
            for (let i = 0; i < currentKernel.length; i++) {
                for (let j = 0; j < currentKernel[0].length; j++) {
                    currentKernel[i][j] -= learningRate * gradient[i][j];
                }
            }
            
            // Compute and store loss
            const predicted = convolve(inputData, currentKernel);
            const loss = computeLoss(predicted, targetOutput);
            lossHistory.push({ epoch: epoch, loss: loss });
            
            epoch++;
            
            // Update displays
            updateDisplays();
            
            // Stop if converged
            if (loss < 0.001) {
                stopTraining();
            }
        }

        // Update all displays
        function updateDisplays() {
            // Display kernels
            displayKernel('target-kernel', targetKernel);
            displayKernel('current-kernel', currentKernel);
            
            // Update epoch display
            const epochDisplay = document.getElementById('epoch-display');
            if (epochDisplay) {
                const currentLoss = lossHistory.length > 0 ? 
                    lossHistory[lossHistory.length - 1].loss.toFixed(4) : 'N/A';
                epochDisplay.innerHTML = `<strong>Epoch:</strong> ${epoch} | <strong>Loss:</strong> ${currentLoss}`;
            }
            
            // Update loss curve
            updateLossCurve();
        }

        // Draw loss curve using D3
        function updateLossCurve() {
            const svg = d3.select('#loss-curve');
            if (!svg.node()) return;
            
            svg.selectAll('*').remove();
            
            if (lossHistory.length < 2) return;
            
            const margin = { top: 20, right: 30, bottom: 40, left: 50 };
            const width = 250 - margin.left - margin.right;
            const height = 150 - margin.top - margin.bottom;
            
            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
            
            // Scales
            const xScale = d3.scaleLinear()
                .domain([0, Math.max(10, lossHistory.length)])
                .range([0, width]);
            
            const yScale = d3.scaleLinear()
                .domain([0, Math.max(...lossHistory.map(d => d.loss)) * 1.1])
                .range([height, 0]);
            
            // Line generator
            const line = d3.line()
                .x(d => xScale(d.epoch))
                .y(d => yScale(d.loss));
            
            // Add axes
            g.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(xScale).ticks(5));
            
            g.append('g')
                .call(d3.axisLeft(yScale).ticks(5));
            
            // Add line
            g.append('path')
                .datum(lossHistory)
                .attr('fill', 'none')
                .attr('stroke', '#10099F')
                .attr('stroke-width', 2)
                .attr('d', line);
            
            // Add labels
            g.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 0 - margin.left)
                .attr('x', 0 - height / 2)
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .text('Loss');
            
            g.append('text')
                .attr('transform', `translate(${width / 2}, ${height + margin.bottom})`)
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .text('Epoch');
        }

        // Start training
        function startTraining() {
            isTraining = true;
            const btn = document.getElementById('start-learning');
            if (btn) btn.textContent = 'Stop Training';
            
            function train() {
                if (isTraining && epoch < 100) {
                    trainStep();
                    trainingTimer = setTimeout(train, 100);
                } else {
                    stopTraining();
                }
            }
            
            train();
        }

        // Stop training
        function stopTraining() {
            isTraining = false;
            const btn = document.getElementById('start-learning');
            if (btn) btn.textContent = 'Start Training';
            
            if (trainingTimer) {
                clearTimeout(trainingTimer);
                trainingTimer = null;
            }
        }

        // Reset everything
        function reset() {
            stopTraining();
            currentKernel = [[Math.random() * 2 - 1, Math.random() * 2 - 1]];
            epoch = 0;
            lossHistory = [];
            updateDisplays();
        }

        // Set up event listeners
        const startBtn = document.getElementById('start-learning');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                if (isTraining) {
                    stopTraining();
                } else {
                    startTraining();
                }
            });
        }

        const resetBtn = document.getElementById('reset-learning');
        if (resetBtn) {
            resetBtn.addEventListener('click', reset);
        }

        const lrSlider = document.getElementById('learning-rate');
        const lrValue = document.getElementById('lr-value');
        if (lrSlider && lrValue) {
            lrSlider.addEventListener('input', (e) => {
                learningRate = parseFloat(e.target.value);
                lrValue.textContent = learningRate.toFixed(2);
            });
        }

        // Initial display
        updateDisplays();
    }
})();