// Numerical Stability Demonstration
function initNumericalStabilityDemo() {
    const container = d3.select('#stability-visualization');
    if (container.empty()) return;
    
    // Clear previous content
    container.selectAll('*').remove();
    
    const width = container.node().getBoundingClientRect().width || 800;
    const height = 320;
    const margin = { top: 40, right: 80, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Test cases showing overflow/underflow
    const testCases = [
        { logits: [10, 20, 30, 40, 50], label: 'Large values' },
        { logits: [-50, -40, -30, -20, -10], label: 'Small values' },
        { logits: [100, 200, 300, 400, 500], label: 'Very large (overflow!)' },
        { logits: [-500, -400, -300, -200, -100], label: 'Very small (underflow!)' },
        { logits: [1, 2, 3, 4, 5], label: 'Normal range' }
    ];
    
    let currentCase = 0;
    
    // Split visualization into two parts
    const leftWidth = innerWidth * 0.45;
    const rightWidth = innerWidth * 0.45;
    const centerGap = innerWidth * 0.1;
    
    // Left side: Naive computation
    const naiveGroup = g.append('g')
        .attr('class', 'naive-computation');
    
    naiveGroup.append('text')
        .attr('x', leftWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#FC8484')
        .text('Naive Softmax');
    
    // Right side: Stable computation
    const stableGroup = g.append('g')
        .attr('class', 'stable-computation')
        .attr('transform', `translate(${leftWidth + centerGap}, 0)`);
    
    stableGroup.append('text')
        .attr('x', rightWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#2DD2C0')
        .text('Stable Softmax');
    
    // Create display areas
    const naiveDisplay = naiveGroup.append('g')
        .attr('transform', 'translate(0, 20)');
    
    const stableDisplay = stableGroup.append('g')
        .attr('transform', 'translate(0, 20)');
    
    // Function to compute naive softmax
    function naiveSoftmax(logits) {
        const expValues = logits.map(l => Math.exp(l));
        const sum = expValues.reduce((a, b) => a + b, 0);
        return expValues.map(e => e / sum);
    }
    
    // Function to compute stable softmax
    function stableSoftmax(logits) {
        const maxLogit = Math.max(...logits);
        const expValues = logits.map(l => Math.exp(l - maxLogit));
        const sum = expValues.reduce((a, b) => a + b, 0);
        return expValues.map(e => e / sum);
    }
    
    // Display computation steps
    function displayComputation(group, logits, isStable = false) {
        group.selectAll('*').remove();
        
        const lineHeight = 25;
        let y = 0;
        
        // Show logits
        group.append('text')
            .attr('x', 0)
            .attr('y', y)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Logits:');
        
        group.append('text')
            .attr('x', 60)
            .attr('y', y)
            .style('font-size', '12px')
            .style('font-family', 'monospace')
            .text(`[${logits.join(', ')}]`);
        
        y += lineHeight;
        
        if (isStable) {
            // Show max subtraction
            const maxLogit = Math.max(...logits);
            group.append('text')
                .attr('x', 0)
                .attr('y', y)
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text('Max:');
            
            group.append('text')
                .attr('x', 60)
                .attr('y', y)
                .style('font-size', '12px')
                .style('font-family', 'monospace')
                .style('fill', '#2DD2C0')
                .text(maxLogit);
            
            y += lineHeight;
            
            // Show adjusted logits
            const adjustedLogits = logits.map(l => l - maxLogit);
            group.append('text')
                .attr('x', 0)
                .attr('y', y)
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text('Adjusted:');
            
            group.append('text')
                .attr('x', 60)
                .attr('y', y)
                .style('font-size', '12px')
                .style('font-family', 'monospace')
                .text(`[${adjustedLogits.join(', ')}]`);
            
            y += lineHeight;
        }
        
        // Show exp values
        let expValues;
        let hasOverflow = false;
        let hasUnderflow = false;
        
        if (isStable) {
            const maxLogit = Math.max(...logits);
            expValues = logits.map(l => {
                const val = Math.exp(l - maxLogit);
                return val;
            });
        } else {
            expValues = logits.map(l => {
                const val = Math.exp(l);
                if (!isFinite(val)) hasOverflow = true;
                if (val === 0) hasUnderflow = true;
                return val;
            });
        }
        
        group.append('text')
            .attr('x', 0)
            .attr('y', y)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('exp():');
        
        const expText = expValues.map(v => {
            if (!isFinite(v)) return '∞';
            if (v === 0) return '0';
            if (v > 1e6) return v.toExponential(1);
            if (v < 1e-6 && v > 0) return v.toExponential(1);
            return v.toFixed(2);
        }).join(', ');
        
        group.append('text')
            .attr('x', 60)
            .attr('y', y)
            .style('font-size', '12px')
            .style('font-family', 'monospace')
            .style('fill', hasOverflow || hasUnderflow ? '#FC8484' : '#262626')
            .text(`[${expText}]`);
        
        y += lineHeight;
        
        // Show sum
        const sum = expValues.reduce((a, b) => a + b, 0);
        group.append('text')
            .attr('x', 0)
            .attr('y', y)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Sum:');
        
        group.append('text')
            .attr('x', 60)
            .attr('y', y)
            .style('font-size', '12px')
            .style('font-family', 'monospace')
            .style('fill', !isFinite(sum) ? '#FC8484' : '#262626')
            .text(isFinite(sum) ? sum.toFixed(2) : '∞');
        
        y += lineHeight;
        
        // Show result
        const result = expValues.map(e => e / sum);
        
        group.append('text')
            .attr('x', 0)
            .attr('y', y)
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Result:');
        
        const resultText = result.map(v => {
            if (isNaN(v)) return 'NaN';
            if (!isFinite(v)) return '∞';
            return v.toFixed(3);
        }).join(', ');
        
        const hasNaN = result.some(v => isNaN(v));
        
        group.append('text')
            .attr('x', 60)
            .attr('y', y)
            .style('font-size', '12px')
            .style('font-family', 'monospace')
            .style('fill', hasNaN ? '#FC8484' : '#2DD2C0')
            .text(`[${resultText}]`);
        
        y += lineHeight * 1.5;
        
        // Show status
        if (!isStable && (hasOverflow || hasUnderflow || hasNaN)) {
            group.append('text')
                .attr('x', leftWidth / 2)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .style('fill', '#FC8484')
                .text('❌ FAILED!');
            
            if (hasOverflow) {
                group.append('text')
                    .attr('x', leftWidth / 2)
                    .attr('y', y + 20)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '11px')
                    .style('fill', '#FC8484')
                    .text('Overflow detected');
            } else if (hasUnderflow) {
                group.append('text')
                    .attr('x', leftWidth / 2)
                    .attr('y', y + 20)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '11px')
                    .style('fill', '#FC8484')
                    .text('Underflow detected');
            }
        } else if (isStable) {
            group.append('text')
                .attr('x', rightWidth / 2)
                .attr('y', y)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .style('fill', '#2DD2C0')
                .text('✓ STABLE!');
        }
    }
    
    // Update function
    function update() {
        const testCase = testCases[currentCase];
        const logits = testCase.logits;
        
        // Update title
        g.selectAll('.case-label').remove();
        g.append('text')
            .attr('class', 'case-label')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text(`Test Case: ${testCase.label}`);
        
        // Display computations
        displayComputation(naiveDisplay, logits, false);
        displayComputation(stableDisplay, logits, true);
    }
    
    // Add controls
    const controls = container.append('div')
        .style('margin-top', '10px')
        .style('text-align', 'center');
    
    controls.append('button')
        .text('Previous')
        .style('margin-right', '10px')
        .style('padding', '5px 10px')
        .style('background', '#10099F')
        .style('color', 'white')
        .style('border', 'none')
        .style('border-radius', '4px')
        .style('cursor', 'pointer')
        .on('click', () => {
            currentCase = (currentCase - 1 + testCases.length) % testCases.length;
            update();
        });
    
    controls.append('button')
        .text('Next')
        .style('padding', '5px 10px')
        .style('background', '#10099F')
        .style('color', 'white')
        .style('border', 'none')
        .style('border-radius', '4px')
        .style('cursor', 'pointer')
        .on('click', () => {
            currentCase = (currentCase + 1) % testCases.length;
            update();
        });
    
    // Initialize
    update();
}