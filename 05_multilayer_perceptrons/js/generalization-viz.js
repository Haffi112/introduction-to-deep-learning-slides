// Overfitting and Generalization Visualization
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('overfitting-viz');
    if (!container) return;
    
    const margin = {top: 20, right: 120, bottom: 50, left: 60};
    const width = container.offsetWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select('#overfitting-viz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    // Line generators
    const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(10))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Model Capacity / Training Epochs');
    
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Error');
    
    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width + margin.left + 20}, ${margin.top + 20})`);
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .style('stroke', '#10099F')
        .style('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 5)
        .text('Training Error')
        .style('font-size', '12px');
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 20)
        .attr('y2', 20)
        .style('stroke', '#FC8484')
        .style('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 25)
        .text('Test Error')
        .style('font-size', '12px');
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 40)
        .attr('y2', 40)
        .style('stroke', '#2DD2C0')
        .style('stroke-width', 2)
        .style('stroke-dasharray', '5,5');
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 45)
        .text('Gen. Gap')
        .style('font-size', '12px');
    
    // Data paths
    const trainPath = g.append('path')
        .style('stroke', '#10099F')
        .style('stroke-width', 2)
        .style('fill', 'none');
    
    const testPath = g.append('path')
        .style('stroke', '#FC8484')
        .style('stroke-width', 2)
        .style('fill', 'none');
    
    // Generalization gap area
    const gapArea = g.append('path')
        .style('fill', '#2DD2C0')
        .style('fill-opacity', 0.2);
    
    // Double descent indicator
    const descentMarker = g.append('g')
        .style('display', 'none');
    
    descentMarker.append('circle')
        .attr('r', 5)
        .style('fill', '#FFA05F')
        .style('stroke', '#FFA05F')
        .style('stroke-width', 2);
    
    descentMarker.append('text')
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('fill', '#FFA05F')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('Double Descent');
    
    // Controls
    const capacitySlider = document.getElementById('capacity-slider');
    const capacityValue = document.getElementById('capacity-value');
    const animateButton = document.getElementById('animate-training');
    
    let animationId = null;
    let currentCapacity = 10;
    
    // Generate error curves based on capacity
    function generateErrorCurves(maxCapacity) {
        const trainData = [];
        const testData = [];
        
        for (let capacity = 1; capacity <= maxCapacity; capacity++) {
            // Classical U-shaped curve for test error with double descent
            let trainError, testError;
            
            if (capacity < 20) {
                // Underfitting regime
                trainError = 0.4 * Math.exp(-capacity / 10) + 0.05;
                testError = 0.45 * Math.exp(-capacity / 10) + 0.08;
            } else if (capacity < 60) {
                // Classical overfitting regime
                trainError = 0.05 * Math.exp(-capacity / 20) + 0.01;
                const overfitFactor = (capacity - 20) / 40;
                testError = 0.08 + overfitFactor * 0.15;
            } else {
                // Modern regime - double descent
                trainError = 0.01;
                const descentFactor = Math.exp(-(capacity - 60) / 30);
                testError = 0.23 - 0.1 * (1 - descentFactor);
            }
            
            // Add some noise
            trainError += (Math.random() - 0.5) * 0.01;
            testError += (Math.random() - 0.5) * 0.02;
            
            trainData.push({x: capacity, y: Math.max(0, trainError)});
            testData.push({x: capacity, y: Math.max(0, testError)});
        }
        
        return {train: trainData, test: testData};
    }
    
    // Area generator for generalization gap
    const areaGenerator = d3.area()
        .x(d => xScale(d.x))
        .y0(d => yScale(d.train))
        .y1(d => yScale(d.test))
        .curve(d3.curveMonotoneX);
    
    // Update visualization
    function updateVisualization(capacity, animate = false) {
        const data = generateErrorCurves(capacity);
        
        if (animate) {
            // Animate the paths growing
            const duration = 50;
            const n = data.train.length;
            
            let i = 0;
            function drawNext() {
                if (i > n) {
                    // Show double descent marker if applicable
                    if (capacity > 70) {
                        const minTestIdx = data.test.reduce((minIdx, d, idx) => 
                            d.y < data.test[minIdx].y ? idx : minIdx, 0);
                        
                        if (minTestIdx > 60) {
                            descentMarker
                                .style('display', 'block')
                                .attr('transform', `translate(${xScale(data.test[minTestIdx].x)}, ${yScale(data.test[minTestIdx].y)})`);
                        }
                    }
                    return;
                }
                
                const partialTrain = data.train.slice(0, i);
                const partialTest = data.test.slice(0, i);
                
                trainPath.datum(partialTrain).attr('d', line);
                testPath.datum(partialTest).attr('d', line);
                
                // Update gap area
                if (partialTrain.length > 1) {
                    const gapData = partialTrain.map((d, idx) => ({
                        x: d.x,
                        train: d.y,
                        test: partialTest[idx].y
                    }));
                    gapArea.datum(gapData).attr('d', areaGenerator);
                }
                
                i++;
                animationId = setTimeout(drawNext, duration);
            }
            
            drawNext();
        } else {
            // Immediate update
            trainPath.datum(data.train).attr('d', line);
            testPath.datum(data.test).attr('d', line);
            
            const gapData = data.train.map((d, idx) => ({
                x: d.x,
                train: d.y,
                test: data.test[idx].y
            }));
            gapArea.datum(gapData).attr('d', areaGenerator);
            
            // Show double descent marker if applicable
            if (capacity > 70) {
                const minTestIdx = data.test.reduce((minIdx, d, idx) => 
                    d.y < data.test[minIdx].y ? idx : minIdx, 0);
                
                if (minTestIdx > 60) {
                    descentMarker
                        .style('display', 'block')
                        .attr('transform', `translate(${xScale(data.test[minTestIdx].x)}, ${yScale(data.test[minTestIdx].y)})`);
                } else {
                    descentMarker.style('display', 'none');
                }
            } else {
                descentMarker.style('display', 'none');
            }
        }
    }
    
    // Event handlers
    capacitySlider.addEventListener('input', function() {
        capacityValue.textContent = this.value;
        currentCapacity = parseInt(this.value);
        
        if (animationId) {
            clearTimeout(animationId);
            animationId = null;
        }
        
        updateVisualization(currentCapacity, false);
    });
    
    animateButton.addEventListener('click', function() {
        if (animationId) {
            clearTimeout(animationId);
            animationId = null;
        }
        
        descentMarker.style('display', 'none');
        updateVisualization(currentCapacity, true);
    });
    
    // Initial visualization
    updateVisualization(currentCapacity, false);
});