// Multi-Channel Convolution Demo
// Demonstrates how multiple input channels are convolved and summed

(function() {
    'use strict';

    let animationInProgress = false;
    let animationFrame = null;

    function initMultiChannelConvDemo() {
        const container = document.getElementById('multi-channel-conv-demo');
        if (!container) return;

        const svg = d3.select('#multi-channel-svg');
        const width = 800;
        const height = 400;
        
        // Configuration
        let numChannels = 2;
        const inputSize = 3;
        const kernelSize = 2;
        const cellSize = 30;
        
        // Sample data for demonstration
        const inputData = [
            [[0, 1, 2], [3, 4, 5], [6, 7, 8]],  // Channel 1
            [[1, 2, 3], [4, 5, 6], [7, 8, 9]]   // Channel 2
        ];
        
        const kernelData = [
            [[0, 1], [2, 3]],  // Kernel for channel 1
            [[1, 2], [3, 4]]   // Kernel for channel 2
        ];

        // Clear previous content
        svg.selectAll('*').remove();

        // Create groups for different components
        const inputGroup = svg.append('g')
            .attr('transform', 'translate(50, 50)');
        
        const kernelGroup = svg.append('g')
            .attr('transform', 'translate(250, 100)');
        
        const outputGroup = svg.append('g')
            .attr('transform', 'translate(500, 100)');
        
        const operationGroup = svg.append('g')
            .attr('transform', 'translate(350, 150)');

        // Draw function for matrices
        function drawMatrix(group, data, title, color = '#10099F') {
            const rows = data.length;
            const cols = data[0].length;
            
            // Title
            group.append('text')
                .attr('x', cols * cellSize / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text(title);
            
            // Cells
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const cell = group.append('g')
                        .attr('transform', `translate(${j * cellSize}, ${i * cellSize})`);
                    
                    cell.append('rect')
                        .attr('width', cellSize - 2)
                        .attr('height', cellSize - 2)
                        .attr('fill', 'white')
                        .attr('stroke', color)
                        .attr('stroke-width', 1);
                    
                    cell.append('text')
                        .attr('x', cellSize / 2 - 1)
                        .attr('y', cellSize / 2 + 1)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .style('font-size', '12px')
                        .text(data[i][j]);
                }
            }
        }

        // Draw multiple channels
        function drawChannels() {
            svg.selectAll('*').remove();
            
            for (let c = 0; c < numChannels; c++) {
                const yOffset = c * 120;
                
                // Input channel
                const inputChannelGroup = svg.append('g')
                    .attr('transform', `translate(50, ${50 + yOffset})`);
                drawMatrix(inputChannelGroup, inputData[c], `Input Ch ${c + 1}`, '#10099F');
                
                // Kernel for this channel
                const kernelChannelGroup = svg.append('g')
                    .attr('transform', `translate(250, ${75 + yOffset})`);
                drawMatrix(kernelChannelGroup, kernelData[c], `Kernel Ch ${c + 1}`, '#2DD2C0');
                
                // Plus sign between channels
                if (c < numChannels - 1) {
                    svg.append('text')
                        .attr('x', 400)
                        .attr('y', 110 + yOffset)
                        .attr('text-anchor', 'middle')
                        .style('font-size', '24px')
                        .style('font-weight', 'bold')
                        .text('+');
                }
            }
            
            // Output
            const outputData = computeOutput();
            const outputY = 100;
            const outputChannelGroup = svg.append('g')
                .attr('transform', `translate(500, ${outputY})`);
            drawMatrix(outputChannelGroup, outputData, 'Output', '#FC8484');
            
            // Equals sign
            svg.append('text')
                .attr('x', 450)
                .attr('y', outputY + 30)
                .attr('text-anchor', 'middle')
                .style('font-size', '24px')
                .style('font-weight', 'bold')
                .text('=');
        }

        // Compute convolution output
        function computeOutput() {
            const outputSize = inputSize - kernelSize + 1;
            const output = Array(outputSize).fill(0).map(() => Array(outputSize).fill(0));
            
            for (let c = 0; c < numChannels; c++) {
                for (let i = 0; i < outputSize; i++) {
                    for (let j = 0; j < outputSize; j++) {
                        let sum = 0;
                        for (let ki = 0; ki < kernelSize; ki++) {
                            for (let kj = 0; kj < kernelSize; kj++) {
                                sum += inputData[c][i + ki][j + kj] * kernelData[c][ki][kj];
                            }
                        }
                        output[i][j] += sum;
                    }
                }
            }
            
            return output;
        }

        // Animate convolution process
        function animateConvolution() {
            if (animationInProgress) return;
            animationInProgress = true;
            
            const outputSize = inputSize - kernelSize + 1;
            let currentPos = 0;
            const totalPositions = outputSize * outputSize;
            
            function step() {
                if (currentPos >= totalPositions) {
                    animationInProgress = false;
                    return;
                }
                
                const row = Math.floor(currentPos / outputSize);
                const col = currentPos % outputSize;
                
                // Highlight current position in all channels
                svg.selectAll('.highlight-rect').remove();
                
                for (let c = 0; c < numChannels; c++) {
                    const yOffset = c * 120;
                    
                    // Highlight input region
                    svg.append('rect')
                        .attr('class', 'highlight-rect')
                        .attr('x', 50 + col * cellSize)
                        .attr('y', 50 + yOffset + row * cellSize)
                        .attr('width', kernelSize * cellSize - 2)
                        .attr('height', kernelSize * cellSize - 2)
                        .attr('fill', 'none')
                        .attr('stroke', '#FFA05F')
                        .attr('stroke-width', 3);
                }
                
                // Highlight output cell
                svg.append('rect')
                    .attr('class', 'highlight-rect')
                    .attr('x', 500 + col * cellSize)
                    .attr('y', 100 + row * cellSize)
                    .attr('width', cellSize - 2)
                    .attr('height', cellSize - 2)
                    .attr('fill', '#FFA05F')
                    .attr('fill-opacity', 0.3);
                
                currentPos++;
                animationFrame = setTimeout(step, 500);
            }
            
            step();
        }

        // Reset animation
        function resetAnimation() {
            animationInProgress = false;
            if (animationFrame) {
                clearTimeout(animationFrame);
                animationFrame = null;
            }
            svg.selectAll('.highlight-rect').remove();
        }

        // Initial draw
        drawChannels();

        // Event listeners
        const slider = document.getElementById('num-channels-slider');
        const valueDisplay = document.getElementById('num-channels-value');
        const animateBtn = document.getElementById('animate-conv');
        const resetBtn = document.getElementById('reset-conv');

        if (slider) {
            slider.addEventListener('input', function() {
                numChannels = parseInt(this.value);
                valueDisplay.textContent = numChannels;
                resetAnimation();
                drawChannels();
            });
        }

        if (animateBtn) {
            animateBtn.addEventListener('click', animateConvolution);
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function() {
                resetAnimation();
                drawChannels();
            });
        }
    }

    // Initialize when Reveal is ready
    if (typeof Reveal !== 'undefined') {
        Reveal.on('ready', initMultiChannelConvDemo);
        Reveal.on('slidechanged', function(event) {
            if (event.currentSlide.querySelector('#multi-channel-conv-demo')) {
                initMultiChannelConvDemo();
            }
        });
    } else {
        document.addEventListener('DOMContentLoaded', initMultiChannelConvDemo);
    }
})();