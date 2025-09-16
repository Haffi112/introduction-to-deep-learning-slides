// pooling-types-comparison.js - Compare different pooling methods
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('pooling-types-comparison')) return;

    const svg = d3.select('#comparison-svg');
    const width = 800;
    const height = 500;
    
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
    let patternType = 'edge';
    let currentComparison = null;

    // Generate input patterns
    function generatePattern(type) {
        const size = 8;
        const pattern = Array(size).fill(null).map(() => Array(size).fill(0));
        
        switch(type) {
            case 'edge':
                // Vertical edge
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size / 2; j++) {
                        pattern[i][j] = 1;
                    }
                    for (let j = size / 2; j < size; j++) {
                        pattern[i][j] = 9;
                    }
                }
                break;
                
            case 'corner':
                // Corner pattern
                for (let i = 0; i < size / 2; i++) {
                    for (let j = 0; j < size / 2; j++) {
                        pattern[i][j] = 9;
                    }
                }
                break;
                
            case 'noise':
                // Noisy pattern
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        pattern[i][j] = Math.random() * 10;
                    }
                }
                break;
                
            case 'gradient':
                // Gradient pattern
                for (let i = 0; i < size; i++) {
                    for (let j = 0; j < size; j++) {
                        pattern[i][j] = (i + j) / (size * 2) * 10;
                    }
                }
                break;
        }
        
        return pattern;
    }

    // Pooling operations
    function maxPool(input, poolSize = 2) {
        const inputSize = input.length;
        const outputSize = Math.floor(inputSize / poolSize);
        const output = [];
        
        for (let i = 0; i < outputSize; i++) {
            output[i] = [];
            for (let j = 0; j < outputSize; j++) {
                let maxVal = -Infinity;
                for (let di = 0; di < poolSize; di++) {
                    for (let dj = 0; dj < poolSize; dj++) {
                        maxVal = Math.max(maxVal, input[i * poolSize + di][j * poolSize + dj]);
                    }
                }
                output[i][j] = maxVal;
            }
        }
        return output;
    }

    function avgPool(input, poolSize = 2) {
        const inputSize = input.length;
        const outputSize = Math.floor(inputSize / poolSize);
        const output = [];
        
        for (let i = 0; i < outputSize; i++) {
            output[i] = [];
            for (let j = 0; j < outputSize; j++) {
                let sum = 0;
                for (let di = 0; di < poolSize; di++) {
                    for (let dj = 0; dj < poolSize; dj++) {
                        sum += input[i * poolSize + di][j * poolSize + dj];
                    }
                }
                output[i][j] = sum / (poolSize * poolSize);
            }
        }
        return output;
    }

    function stochasticPool(input, poolSize = 2) {
        // Simplified stochastic pooling for visualization
        const inputSize = input.length;
        const outputSize = Math.floor(inputSize / poolSize);
        const output = [];
        
        for (let i = 0; i < outputSize; i++) {
            output[i] = [];
            for (let j = 0; j < outputSize; j++) {
                const window = [];
                for (let di = 0; di < poolSize; di++) {
                    for (let dj = 0; dj < poolSize; dj++) {
                        window.push(input[i * poolSize + di][j * poolSize + dj]);
                    }
                }
                
                // Compute probabilities (simplified)
                const sum = window.reduce((a, b) => a + Math.abs(b), 0);
                if (sum === 0) {
                    output[i][j] = 0;
                } else {
                    const probs = window.map(v => Math.abs(v) / sum);
                    const cumProbs = [];
                    let cumSum = 0;
                    for (let k = 0; k < probs.length; k++) {
                        cumSum += probs[k];
                        cumProbs.push(cumSum);
                    }
                    
                    // Sample based on probabilities
                    const rand = Math.random();
                    let selectedIdx = 0;
                    for (let k = 0; k < cumProbs.length; k++) {
                        if (rand <= cumProbs[k]) {
                            selectedIdx = k;
                            break;
                        }
                    }
                    output[i][j] = window[selectedIdx];
                }
            }
        }
        return output;
    }

    // Draw comparison
    function drawComparison() {
        svg.selectAll('*').remove();
        
        const input = generatePattern(patternType);
        const results = {
            'Max Pooling': maxPool(input),
            'Average Pooling': avgPool(input),
            'Stochastic Pooling': stochasticPool(input)
        };
        
        currentComparison = { input, results };
        
        const cellSize = 25;
        const groupSpacing = 180;
        
        // Main group
        const mainGroup = svg.append('g')
            .attr('transform', 'translate(40, 30)');
        
        // Draw input
        const inputGroup = mainGroup.append('g')
            .attr('transform', 'translate(0, 50)');
        
        inputGroup.append('text')
            .attr('x', 100)
            .attr('y', -20)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.dark)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text(`Input Pattern: ${patternType}`);
        
        // Draw input matrix
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const value = input[i][j];
                const normalizedValue = value / 10;
                
                inputGroup.append('rect')
                    .attr('x', j * cellSize)
                    .attr('y', i * cellSize)
                    .attr('width', cellSize - 1)
                    .attr('height', cellSize - 1)
                    .attr('fill', d3.interpolateBlues(normalizedValue))
                    .attr('stroke', colors.dark)
                    .attr('stroke-width', 0.5);
            }
        }
        
        // Draw results
        let xOffset = 0;
        Object.entries(results).forEach(([method, output], idx) => {
            const resultGroup = mainGroup.append('g')
                .attr('transform', `translate(${xOffset}, 280)`);
            
            // Method label
            resultGroup.append('text')
                .attr('x', 50)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .attr('fill', colors.primary)
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(method);
            
            // Draw output matrix
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    const value = output[i][j];
                    const normalizedValue = value / 10;
                    
                    const cell = resultGroup.append('g')
                        .attr('transform', `translate(${j * cellSize}, ${i * cellSize})`);
                    
                    cell.append('rect')
                        .attr('width', cellSize - 1)
                        .attr('height', cellSize - 1)
                        .attr('fill', d3.interpolateBlues(normalizedValue))
                        .attr('stroke', colors.secondary)
                        .attr('stroke-width', 1);
                    
                    cell.append('text')
                        .attr('x', cellSize / 2)
                        .attr('y', cellSize / 2)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('fill', normalizedValue > 0.5 ? 'white' : colors.dark)
                        .style('font-size', '10px')
                        .style('font-weight', 'bold')
                        .text(value.toFixed(1));
                }
            }
            
            // Draw arrow from input to output
            const arrow = mainGroup.append('g');
            arrow.append('path')
                .attr('d', `M 100 250 L ${xOffset + 50} 270`)
                .attr('stroke', colors.primary)
                .attr('stroke-width', 1.5)
                .attr('fill', 'none')
                .attr('marker-end', `url(#comp-arrow-${idx})`);
            
            // Arrow marker
            svg.append('defs').append('marker')
                .attr('id', `comp-arrow-${idx}`)
                .attr('markerWidth', 8)
                .attr('markerHeight', 8)
                .attr('refX', 7)
                .attr('refY', 4)
                .attr('orient', 'auto')
                .append('polygon')
                .attr('points', '0 0, 8 4, 0 8')
                .attr('fill', colors.primary);
            
            xOffset += groupSpacing;
        });
        
        // Add analysis text
        drawAnalysis();
    }

    function drawAnalysis() {
        const analysisGroup = svg.append('g')
            .attr('transform', 'translate(40, 430)');
        
        analysisGroup.append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 720)
            .attr('height', 50)
            .attr('fill', colors.light)
            .attr('stroke', colors.dark)
            .attr('stroke-width', 1)
            .attr('rx', 5);
        
        let analysisText = '';
        switch(patternType) {
            case 'edge':
                analysisText = 'Edge pattern: Max pooling preserves the sharp edge (9s), average pooling blurs it (~5), stochastic varies.';
                break;
            case 'corner':
                analysisText = 'Corner pattern: Max pooling strongly detects the corner, average dilutes it, stochastic is probabilistic.';
                break;
            case 'noise':
                analysisText = 'Noisy pattern: Max pooling amplifies peaks, average smooths noise, stochastic samples randomly.';
                break;
            case 'gradient':
                analysisText = 'Gradient pattern: Max pooling selects higher values, average preserves gradient, stochastic varies.';
                break;
        }
        
        analysisGroup.append('text')
            .attr('x', 360)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.dark)
            .style('font-size', '12px')
            .text(analysisText);
    }

    // Event handlers
    document.getElementById('pattern-type').addEventListener('change', function(e) {
        patternType = e.value;
        drawComparison();
    });
    
    document.getElementById('compare-all').addEventListener('click', function() {
        drawComparison();
    });
    
    document.getElementById('reset-comparison').addEventListener('click', function() {
        patternType = 'edge';
        document.getElementById('pattern-type').value = 'edge';
        drawComparison();
    });
    
    // Initial draw
    drawComparison();
});