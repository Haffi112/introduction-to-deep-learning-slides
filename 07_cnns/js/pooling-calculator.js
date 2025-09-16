// pooling-calculator.js - Interactive pooling dimension calculator
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('pooling-calculator')) return;

    const svg = d3.select('#dimension-calculator-svg');
    const width = 800;
    const height = 350;
    
    // UI Colors
    const colors = {
        primary: '#10099F',
        secondary: '#2DD2C0',
        highlight: '#FFA05F',
        error: '#FC8484',
        success: '#00FFBA',
        light: '#F5F5F5',
        dark: '#262626',
        gray: '#EEEEEE'
    };

    // State
    let inputSize = 28;
    let poolSize = 2;
    let stride = 2;
    let padding = 0;

    // Calculate output size
    function calculateOutputSize(input, pool, str, pad) {
        return Math.floor((input + 2 * pad - pool) / str) + 1;
    }

    // Draw the visualization
    function draw() {
        svg.selectAll('*').remove();

        // Validate inputs
        if (isNaN(inputSize) || isNaN(poolSize) || isNaN(stride) || isNaN(padding)) {
            console.error('Invalid input values:', { inputSize, poolSize, stride, padding });
            const outputEl = document.getElementById('calc-output');
            if (outputEl) {
                outputEl.textContent = 'Invalid input values!';
                outputEl.style.color = colors.error;
            }
            return;
        }

        const outputSize = calculateOutputSize(inputSize, poolSize, stride, padding);

        // Update output display
        const outputEl = document.getElementById('calc-output');
        if (outputEl) {
            outputEl.textContent =
                outputSize > 0 ? `Output Size: ${outputSize} × ${outputSize}` : 'Invalid configuration!';
            outputEl.style.color = outputSize > 0 ? colors.primary : colors.error;
        }
        
        if (outputSize <= 0) return;
        
        // Create groups for input and output
        const inputGroup = svg.append('g')
            .attr('transform', 'translate(150, 50)');
        
        const outputGroup = svg.append('g')
            .attr('transform', 'translate(500, 50)');
        
        // Scale factors for visualization
        const maxVisSize = 200;
        const inputScale = Math.min(maxVisSize / inputSize, 10);
        const outputScale = Math.min(maxVisSize / outputSize, 15);
        
        // Draw input with padding
        const totalInputSize = inputSize + 2 * padding;
        
        // Draw padding area if exists
        if (padding > 0) {
            inputGroup.append('rect')
                .attr('x', 0)
                .attr('y', 0)
                .attr('width', totalInputSize * inputScale)
                .attr('height', totalInputSize * inputScale)
                .attr('fill', colors.gray)
                .attr('stroke', colors.dark)
                .attr('stroke-width', 1)
                .attr('stroke-dasharray', '3,3');
            
            // Padding label
            inputGroup.append('text')
                .attr('x', totalInputSize * inputScale / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .attr('fill', colors.dark)
                .style('font-size', '12px')
                .text(`Padding: ${padding}`);
        }
        
        // Draw actual input
        inputGroup.append('rect')
            .attr('x', padding * inputScale)
            .attr('y', padding * inputScale)
            .attr('width', inputSize * inputScale)
            .attr('height', inputSize * inputScale)
            .attr('fill', colors.light)
            .attr('stroke', colors.primary)
            .attr('stroke-width', 2);
        
        // Draw grid lines for input
        const gridStep = Math.max(1, Math.floor(inputSize / 10));
        for (let i = gridStep; i < inputSize; i += gridStep) {
            inputGroup.append('line')
                .attr('x1', padding * inputScale + i * inputScale)
                .attr('y1', padding * inputScale)
                .attr('x2', padding * inputScale + i * inputScale)
                .attr('y2', padding * inputScale + inputSize * inputScale)
                .attr('stroke', colors.gray)
                .attr('stroke-width', 0.5);
            
            inputGroup.append('line')
                .attr('x1', padding * inputScale)
                .attr('y1', padding * inputScale + i * inputScale)
                .attr('x2', padding * inputScale + inputSize * inputScale)
                .attr('y2', padding * inputScale + i * inputScale)
                .attr('stroke', colors.gray)
                .attr('stroke-width', 0.5);
        }
        
        // Draw pooling window
        const windowGroup = inputGroup.append('g')
            .attr('class', 'pooling-window');
        
        windowGroup.append('rect')
            .attr('x', padding * inputScale)
            .attr('y', padding * inputScale)
            .attr('width', poolSize * inputScale)
            .attr('height', poolSize * inputScale)
            .attr('fill', colors.highlight)
            .attr('fill-opacity', 0.3)
            .attr('stroke', colors.highlight)
            .attr('stroke-width', 2);
        
        // Input label
        inputGroup.append('text')
            .attr('x', totalInputSize * inputScale / 2)
            .attr('y', totalInputSize * inputScale + 25)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.dark)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text(`Input: ${inputSize}×${inputSize}`);
        
        // Draw output
        outputGroup.append('rect')
            .attr('width', outputSize * outputScale)
            .attr('height', outputSize * outputScale)
            .attr('fill', colors.secondary)
            .attr('fill-opacity', 0.1)
            .attr('stroke', colors.secondary)
            .attr('stroke-width', 2);
        
        // Draw output grid
        const outputGridStep = Math.max(1, Math.floor(outputSize / 10));
        for (let i = outputGridStep; i < outputSize; i += outputGridStep) {
            outputGroup.append('line')
                .attr('x1', i * outputScale)
                .attr('y1', 0)
                .attr('x2', i * outputScale)
                .attr('y2', outputSize * outputScale)
                .attr('stroke', colors.secondary)
                .attr('stroke-opacity', 0.3)
                .attr('stroke-width', 0.5);
            
            outputGroup.append('line')
                .attr('x1', 0)
                .attr('y1', i * outputScale)
                .attr('x2', outputSize * outputScale)
                .attr('y2', i * outputScale)
                .attr('stroke', colors.secondary)
                .attr('stroke-opacity', 0.3)
                .attr('stroke-width', 0.5);
        }
        
        // Output label
        outputGroup.append('text')
            .attr('x', outputSize * outputScale / 2)
            .attr('y', outputSize * outputScale + 25)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.dark)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text(`Output: ${outputSize}×${outputSize}`);
        
        // Draw arrow
        const arrowY = Math.max(totalInputSize * inputScale, outputSize * outputScale) / 2 + 50;
        
        svg.append('path')
            .attr('d', `M 370 ${arrowY} L 470 ${arrowY}`)
            .attr('stroke', colors.primary)
            .attr('stroke-width', 3)
            .attr('fill', 'none')
            .attr('marker-end', 'url(#calc-arrowhead)');
        
        // Arrow marker
        svg.append('defs').append('marker')
            .attr('id', 'calc-arrowhead')
            .attr('markerWidth', 10)
            .attr('markerHeight', 10)
            .attr('refX', 9)
            .attr('refY', 3)
            .attr('orient', 'auto')
            .append('polygon')
            .attr('points', '0 0, 10 3, 0 6')
            .attr('fill', colors.primary);
        
        // Operation label
        svg.append('text')
            .attr('x', 420)
            .attr('y', arrowY - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.primary)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(`${poolSize}×${poolSize} pool`);
        
        svg.append('text')
            .attr('x', 420)
            .attr('y', arrowY + 20)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.dark)
            .style('font-size', '11px')
            .text(`stride: ${stride}`);
        
        // Show formula
        const formulaGroup = svg.append('g')
            .attr('transform', 'translate(400, 280)');
        
        formulaGroup.append('rect')
            .attr('x', -200)
            .attr('y', -20)
            .attr('width', 400)
            .attr('height', 40)
            .attr('fill', colors.light)
            .attr('stroke', colors.dark)
            .attr('stroke-width', 1)
            .attr('rx', 5);
        
        formulaGroup.append('text')
            .attr('x', 0)
            .attr('y', 5)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.dark)
            .style('font-size', '13px')
            .style('font-family', 'monospace')
            .text(`⌊(${inputSize} + 2×${padding} - ${poolSize}) / ${stride}⌋ + 1 = ${outputSize}`);
        
        // Animate pooling window movement
        animatePoolingWindow();
    }

    function animatePoolingWindow() {
        const outputSize = calculateOutputSize(inputSize, poolSize, stride, padding);
        if (outputSize <= 0) return;
        
        const inputScale = Math.min(200 / inputSize, 10);
        const positions = [];
        
        for (let i = 0; i < outputSize; i++) {
            for (let j = 0; j < outputSize; j++) {
                positions.push({
                    x: padding * inputScale + j * stride * inputScale,
                    y: padding * inputScale + i * stride * inputScale
                });
            }
        }
        
        let currentPos = 0;
        
        function moveWindow() {
            if (currentPos >= positions.length) {
                currentPos = 0;
            }
            
            const pos = positions[currentPos];
            
            svg.select('.pooling-window rect')
                .transition()
                .duration(500)
                .attr('x', pos.x)
                .attr('y', pos.y);
            
            currentPos++;
        }
        
        // Move window every 1.5 seconds
        setInterval(moveWindow, 1500);
    }

    // Event handlers
    const inputSizeEl = document.getElementById('calc-input-size');
    if (inputSizeEl) {
        inputSizeEl.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 4 && value <= 256) {
                inputSize = value;
                draw();
            }
        });
    }

    const poolSizeEl = document.getElementById('calc-pool-size');
    if (poolSizeEl) {
        poolSizeEl.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 1 && value <= 10) {
                poolSize = value;
                draw();
            }
        });
    }

    const strideEl = document.getElementById('calc-stride');
    if (strideEl) {
        strideEl.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 1 && value <= 10) {
                stride = value;
                draw();
            }
        });
    }

    const paddingEl = document.getElementById('calc-padding');
    if (paddingEl) {
        paddingEl.addEventListener('input', function(e) {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= 10) {
                padding = value;
                draw();
            }
        });
    }
    
    // Initial draw
    draw();
});