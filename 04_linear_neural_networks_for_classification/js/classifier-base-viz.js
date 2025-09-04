// Classifier Base Visualizations for Deep Learning Course
// University of Iceland

// Initialize accuracy demonstration
function initAccuracyDemo() {
    const container = document.getElementById('accuracy-viz-container');
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    const width = 800;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    // Sample data for demonstration
    let currentBatch = [];
    let currentStep = 0;
    let stepMode = false;
    
    // Generate random batch of predictions and labels
    function generateBatch() {
        const batchSize = 8;
        const numClasses = 3;
        currentBatch = [];
        
        for (let i = 0; i < batchSize; i++) {
            // Generate random probabilities
            const probs = Array.from({length: numClasses}, () => Math.random());
            const sum = probs.reduce((a, b) => a + b, 0);
            const normalizedProbs = probs.map(p => p / sum);
            
            // Determine predicted class (argmax)
            const predicted = normalizedProbs.indexOf(Math.max(...normalizedProbs));
            
            // Generate true label (sometimes matches, sometimes doesn't)
            const trueLabel = Math.random() < 0.6 ? predicted : Math.floor(Math.random() * numClasses);
            
            currentBatch.push({
                id: i,
                probabilities: normalizedProbs,
                predicted: predicted,
                trueLabel: trueLabel,
                correct: predicted === trueLabel,
                revealed: false
            });
        }
        currentStep = 0;
        stepMode = false;
        updateVisualization();
    }
    
    // Update visualization
    function updateVisualization() {
        svg.selectAll('*').remove();
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        // Title
        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text('Accuracy Computation: Predictions vs Ground Truth');
        
        // Sample width and spacing
        const sampleWidth = innerWidth / currentBatch.length - 10;
        const sampleSpacing = (innerWidth - sampleWidth * currentBatch.length) / (currentBatch.length - 1);
        
        // Draw samples
        currentBatch.forEach((sample, i) => {
            const x = i * (sampleWidth + sampleSpacing);
            const y = 50;
            
            // Sample group
            const sampleGroup = g.append('g')
                .attr('transform', `translate(${x},${y})`);
            
            // Draw probability bars
            const barHeight = 50;
            const barWidth = sampleWidth / 3 - 2;
            
            sample.probabilities.forEach((prob, j) => {
                const barX = j * (barWidth + 2);
                
                // Bar background
                sampleGroup.append('rect')
                    .attr('x', barX)
                    .attr('y', barHeight - barHeight * prob)
                    .attr('width', barWidth)
                    .attr('height', barHeight * prob)
                    .attr('fill', j === sample.predicted ? '#10099F' : '#EEEEEE')
                    .attr('stroke', '#262626')
                    .attr('stroke-width', 0.5);
                
                // Probability value
                sampleGroup.append('text')
                    .attr('x', barX + barWidth / 2)
                    .attr('y', barHeight + 15)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '10px')
                    .text(prob.toFixed(2));
            });
            
            // Predicted class label
            sampleGroup.append('text')
                .attr('x', sampleWidth / 2)
                .attr('y', barHeight + 25)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .style('fill', '#10099F')
                .text(`Pred: ${sample.predicted}`);
            
            // True label
            sampleGroup.append('text')
                .attr('x', sampleWidth / 2)
                .attr('y', barHeight + 40)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .style('fill', '#262626')
                .text(`True: ${sample.trueLabel}`);
            
            // Correct/Incorrect indicator
            if (sample.revealed || !stepMode) {
                const isCorrect = sample.correct;
                sampleGroup.append('text')
                    .attr('x', sampleWidth / 2)
                    .attr('y', barHeight + 60)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '18px')
                    .text(isCorrect ? '✓' : '✗')
                    .style('fill', isCorrect ? '#2DD2C0' : '#FC8484');
            }
        });
        
        // Update statistics
        const revealed = stepMode ? currentBatch.slice(0, currentStep + 1) : currentBatch;
        const correct = revealed.filter(s => s.correct).length;
        const total = revealed.length;
        const accuracy = total > 0 ? (correct / total * 100).toFixed(1) : '0.0';
        
        document.getElementById('correct-count').textContent = correct;
        document.getElementById('total-count').textContent = total;
        document.getElementById('accuracy-value').textContent = `${accuracy}%`;
    }
    
    // Step through samples
    function stepThrough() {
        if (!stepMode) {
            stepMode = true;
            currentStep = 0;
            currentBatch.forEach(s => s.revealed = false);
        } else {
            currentStep = Math.min(currentStep + 1, currentBatch.length - 1);
        }
        
        for (let i = 0; i <= currentStep; i++) {
            currentBatch[i].revealed = true;
        }
        
        updateVisualization();
    }
       
    
    // Event listeners
    document.getElementById('accuracy-generate-btn').addEventListener('click', generateBatch);
    document.getElementById('accuracy-step-btn').addEventListener('click', stepThrough);
    
    // Initialize with a batch
    generateBatch();
}

// Initialize argmax visualization
function initArgmaxDemo() {
    const container = document.getElementById('argmax-viz-container');
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    const width = 600;
    const height = 300;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // Initialize probabilities
    let probabilities = [0.2, 0.5, 0.3];
    
    // Scales
    const xScale = d3.scaleBand()
        .domain(['Class 0', 'Class 1', 'Class 2'])
        .range([0, innerWidth])
        .padding(0.2);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));
    
    g.append('g')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('.1f')));
    
    // Y-axis label
    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (innerHeight / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Probability').style('font-size', '15px');
    
    // Function to update visualization
    function updateArgmax() {
        // Normalize probabilities
        const sum = probabilities.reduce((a, b) => a + b, 0);
        if (sum > 0) {
            probabilities = probabilities.map(p => p / sum);
        }
        
        // Find argmax
        const maxProb = Math.max(...probabilities);
        const argmax = probabilities.indexOf(maxProb);
        
        // Update bars
        const bars = g.selectAll('.prob-bar')
            .data(probabilities);
        
        bars.enter()
            .append('rect')
            .attr('class', 'prob-bar')
            .merge(bars)
            .transition()
            .duration(300)
            .attr('x', (d, i) => xScale(`Class ${i}`))
            .attr('y', d => yScale(d))
            .attr('width', xScale.bandwidth())
            .attr('height', d => innerHeight - yScale(d))
            .attr('fill', (d, i) => i === argmax ? '#10099F' : '#EEEEEE')
            .attr('stroke', '#262626')
            .attr('stroke-width', 2);
        
        // Update probability labels
        const labels = g.selectAll('.prob-label')
            .data(probabilities);
        
        labels.enter()
            .append('text')
            .attr('class', 'prob-label')
            .merge(labels)
            .transition()
            .duration(300)
            .attr('x', (d, i) => xScale(`Class ${i}`) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d) - 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text(d => d.toFixed(3));
        
        // Update argmax indicator
        let indicator = g.selectAll('.argmax-indicator').data([argmax]);
        
        indicator.enter()
            .append('g')
            .attr('class', 'argmax-indicator')
            .append('text')
            .merge(indicator.select('text'))
            .transition()
            .duration(300)
            .attr('x', xScale(`Class ${argmax}`) + xScale.bandwidth() / 2)
            .attr('y', yScale(probabilities[argmax]) - 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '24px')
            .text('👆')
            .style('fill', '#10099F');
        
        // Update display values
        document.getElementById('prob-0-value').textContent = probabilities[0].toFixed(2);
        document.getElementById('prob-1-value').textContent = probabilities[1].toFixed(2);
        document.getElementById('prob-2-value').textContent = probabilities[2].toFixed(2);
        document.getElementById('predicted-class').textContent = argmax;
        
        // Update sliders
        document.getElementById('prob-0').value = probabilities[0] * 100;
        document.getElementById('prob-1').value = probabilities[1] * 100;
        document.getElementById('prob-2').value = probabilities[2] * 100;
    }
    
    // Event listeners for sliders
    ['prob-0', 'prob-1', 'prob-2'].forEach((id, i) => {
        document.getElementById(id).addEventListener('input', (e) => {
            probabilities[i] = parseFloat(e.target.value) / 100;
            updateArgmax();
        });
    });
    
    // Initial update
    updateArgmax();
}

// Initialize all visualizations when ready
function initClassifierBaseViz() {
    initAccuracyDemo();
    initArgmaxDemo();
}

// Export for use in main script
if (typeof window !== 'undefined') {
    window.initClassifierBaseViz = initClassifierBaseViz;
}