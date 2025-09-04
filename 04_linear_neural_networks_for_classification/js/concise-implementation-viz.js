// Concise Implementation Visualization Functions

// Initialize all concise implementation visualizations
function initConciseImplementationViz() {
    if (document.getElementById('stability-comparison-demo')) {
        initStabilityComparison();
    }
}

// Numerical Stability Comparison
function initStabilityComparison() {
    const container = d3.select('#stability-comparison-demo');
    container.selectAll('*').remove();
    
    // Create control panel
    const controls = container.append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'center')
        .style('gap', '20px')
        .style('margin-bottom', '20px')
        .style('padding', '15px')
        .style('background', '#f9f9f9')
        .style('border-radius', '8px')
        .style('z-index', '100')
        .style('position', 'relative');
    
    controls.append('label')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('gap', '10px')
        .html('Scale Factor: <input type="range" id="scale-slider" min="0" max="100" value="30" style="width: 150px;"><span id="scale-value" style="font-family: monospace; width: 40px;">30</span>');
    
    controls.append('button')
        .style('background', '#10099F')
        .style('color', 'white')
        .style('border', 'none')
        .style('padding', '8px 16px')
        .style('border-radius', '5px')
        .style('cursor', 'pointer')
        .text('Reset')
        .on('click', () => {
            document.getElementById('scale-slider').value = 30;
            updateComparison();
        });
    
    // Create comparison panels
    const panels = container.append('div')
        .style('display', 'grid')
        .style('grid-template-columns', '1fr 1fr')
        .style('gap', '30px')
        .style('margin-top', '20px');
    
    // Naive implementation panel
    const naivePanel = panels.append('div')
        .style('padding', '20px')
        .style('background', '#fff')
        .style('border', '2px solid #FC8484')
        .style('border-radius', '10px');
    
    naivePanel.append('h3')
        .style('color', '#FC8484')
        .style('margin-top', '0')
        .text('Naive Implementation');
    
    const naiveContent = naivePanel.append('div')
        .attr('id', 'naive-content');
    
    // Stable implementation panel
    const stablePanel = panels.append('div')
        .style('padding', '20px')
        .style('background', '#fff')
        .style('border', '2px solid #2DD2C0')
        .style('border-radius', '10px');
    
    stablePanel.append('h3')
        .style('color', '#2DD2C0')
        .style('margin-top', '0')
        .text('Stable Implementation');
    
    const stableContent = stablePanel.append('div')
        .attr('id', 'stable-content');
    
    function updateComparison() {
        const scale = parseFloat(document.getElementById('scale-slider').value);
        document.getElementById('scale-value').textContent = scale;
        
        // Sample logits
        const logits = [1.2, 0.8, 2.1].map(x => x * scale);
        const maxLogit = Math.max(...logits);
        
        // Clear previous content
        naiveContent.selectAll('*').remove();
        stableContent.selectAll('*').remove();
        
        // Naive calculation
        naiveContent.append('div')
            .style('font-family', 'monospace')
            .style('font-size', '13px')
            .style('margin-bottom', '10px')
            .html(`Logits: [${logits.map(x => x.toFixed(1)).join(', ')}]`);
        
        const expValues = logits.map(x => Math.exp(x));
        const hasOverflow = expValues.some(x => !isFinite(x));
        
        naiveContent.append('div')
            .style('font-family', 'monospace')
            .style('font-size', '13px')
            .style('margin-bottom', '10px')
            .style('color', hasOverflow ? '#FF0000' : '#000')
            .html(`exp(o): [${expValues.map(x => isFinite(x) ? x.toExponential(2) : 'Infinity').join(', ')}]`);
        
        if (hasOverflow) {
            naiveContent.append('div')
                .style('color', '#FF0000')
                .style('font-weight', 'bold')
                .style('margin-top', '10px')
                .text('⚠️ OVERFLOW DETECTED!');
        } else {
            const sum = expValues.reduce((a, b) => a + b, 0);
            const probs = expValues.map(x => x / sum);
            
            naiveContent.append('div')
                .style('font-family', 'monospace')
                .style('font-size', '13px')
                .style('margin-top', '10px')
                .html(`Probabilities: [${probs.map(x => x.toFixed(4)).join(', ')}]`);
        }
        
        // Stable calculation
        stableContent.append('div')
            .style('font-family', 'monospace')
            .style('font-size', '13px')
            .style('margin-bottom', '10px')
            .html(`Logits: [${logits.map(x => x.toFixed(1)).join(', ')}]`);
        
        stableContent.append('div')
            .style('font-family', 'monospace')
            .style('font-size', '13px')
            .style('margin-bottom', '10px')
            .style('color', '#666')
            .html(`Max: ${maxLogit.toFixed(1)}`);
        
        const shiftedLogits = logits.map(x => x - maxLogit);
        stableContent.append('div')
            .style('font-family', 'monospace')
            .style('font-size', '13px')
            .style('margin-bottom', '10px')
            .html(`o - max: [${shiftedLogits.map(x => x.toFixed(1)).join(', ')}]`);
        
        const stableExpValues = shiftedLogits.map(x => Math.exp(x));
        stableContent.append('div')
            .style('font-family', 'monospace')
            .style('font-size', '13px')
            .style('margin-bottom', '10px')
            .html(`exp(o - max): [${stableExpValues.map(x => x.toFixed(4)).join(', ')}]`);
        
        const stableSum = stableExpValues.reduce((a, b) => a + b, 0);
        const stableProbs = stableExpValues.map(x => x / stableSum);
        
        stableContent.append('div')
            .style('font-family', 'monospace')
            .style('font-size', '13px')
            .style('margin-top', '10px')
            .style('color', '#2DD2C0')
            .style('font-weight', 'bold')
            .html(`Probabilities: [${stableProbs.map(x => x.toFixed(4)).join(', ')}]`);
        
        stableContent.append('div')
            .style('color', '#2DD2C0')
            .style('font-weight', 'bold')
            .style('margin-top', '10px')
            .text('✓ Numerically stable!');
    }
    
    // Set up event listener
    document.getElementById('scale-slider').addEventListener('input', updateComparison);
    
    // Initial update
    updateComparison();
}