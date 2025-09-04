// k-Nearest Neighbors Demonstration
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('knn-viz');
    if (!container) return;
    
    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    // Ensure minimum width to prevent negative dimensions
    const containerWidth = container.offsetWidth || 600;
    const width = Math.max(400, containerWidth - margin.left - margin.right);
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select('#knn-viz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    // Background for decision regions
    const backgroundGroup = g.append('g');
    
    // Add grid for decision boundary visualization
    const gridResolution = 30;
    const gridData = [];
    for (let i = 0; i <= gridResolution; i++) {
        for (let j = 0; j <= gridResolution; j++) {
            gridData.push({
                x: i / gridResolution,
                y: j / gridResolution
            });
        }
    }
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(5));
    
    g.append('g')
        .call(d3.axisLeft(yScale).ticks(5));
    
    // Data points group
    const pointsGroup = g.append('g');
    const connectionsGroup = g.append('g');
    
    // Legend
    const legend = g.append('g')
        .attr('transform', `translate(${width - 100}, 20)`);
    
    legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 6)
        .style('fill', '#10099F');
    
    legend.append('text')
        .attr('x', 15)
        .attr('y', 5)
        .text('Class A')
        .style('font-size', '12px');
    
    legend.append('circle')
        .attr('cx', 0)
        .attr('cy', 20)
        .attr('r', 6)
        .style('fill', '#FC8484');
    
    legend.append('text')
        .attr('x', 15)
        .attr('y', 25)
        .text('Class B')
        .style('font-size', '12px');
    
    // Training data
    let trainingData = [
        // Class A (blue)
        {x: 0.2, y: 0.3, class: 0},
        {x: 0.3, y: 0.4, class: 0},
        {x: 0.25, y: 0.5, class: 0},
        {x: 0.4, y: 0.35, class: 0},
        {x: 0.15, y: 0.6, class: 0},
        {x: 0.35, y: 0.55, class: 0},
        {x: 0.1, y: 0.4, class: 0},
        {x: 0.3, y: 0.25, class: 0},
        // Class B (red)
        {x: 0.7, y: 0.6, class: 1},
        {x: 0.8, y: 0.7, class: 1},
        {x: 0.75, y: 0.8, class: 1},
        {x: 0.6, y: 0.75, class: 1},
        {x: 0.85, y: 0.5, class: 1},
        {x: 0.65, y: 0.55, class: 1},
        {x: 0.9, y: 0.65, class: 1},
        {x: 0.7, y: 0.45, class: 1}
    ];
    
    let testPoint = null;
    let k = 1;
    
    // Controls
    const kSlider = document.getElementById('k-slider');
    const kValue = document.getElementById('k-value');
    const addPointButton = document.getElementById('add-point');
    const resetButton = document.getElementById('reset-knn');
    
    // Distance function
    function euclideanDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
    
    // k-NN classification
    function classify(point, k) {
        const distances = trainingData.map(d => ({
            ...d,
            distance: euclideanDistance(point, d)
        }));
        
        distances.sort((a, b) => a.distance - b.distance);
        const kNearest = distances.slice(0, k);
        
        const votes = kNearest.reduce((acc, d) => {
            acc[d.class] = (acc[d.class] || 0) + 1;
            return acc;
        }, {});
        
        return {
            class: votes[0] > (votes[1] || 0) ? 0 : 1,
            neighbors: kNearest
        };
    }
    
    // Draw decision boundaries
    function drawDecisionBoundaries() {
        backgroundGroup.selectAll('rect').remove();
        
        // Ensure positive dimensions
        const cellWidth = Math.max(1, width / gridResolution);
        const cellHeight = Math.max(1, height / gridResolution);
        
        gridData.forEach(point => {
            const result = classify(point, k);
            
            // Calculate position ensuring we don't go negative
            const xPos = Math.max(0, xScale(point.x) - cellWidth / 2);
            const yPos = Math.max(0, yScale(point.y) - cellHeight / 2);
            
            // Ensure width and height don't exceed boundaries
            const rectWidth = Math.min(cellWidth, width - xPos);
            const rectHeight = Math.min(cellHeight, height - yPos);
            
            // Only draw if dimensions are positive
            if (rectWidth > 0 && rectHeight > 0) {
                backgroundGroup.append('rect')
                    .attr('x', xPos)
                    .attr('y', yPos)
                    .attr('width', rectWidth)
                    .attr('height', rectHeight)
                    .style('fill', result.class === 0 ? '#10099F' : '#FC8484')
                    .style('opacity', 0.1);
            }
        });
    }
    
    // Draw points
    function drawPoints() {
        // Clear existing
        pointsGroup.selectAll('circle').remove();
        connectionsGroup.selectAll('line').remove();
        
        // Draw training points
        pointsGroup.selectAll('.training-point')
            .data(trainingData)
            .enter()
            .append('circle')
            .attr('class', 'training-point')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 6)
            .style('fill', d => d.class === 0 ? '#10099F' : '#FC8484')
            .style('stroke', 'white')
            .style('stroke-width', 2);
        
        // Draw test point and connections if exists
        if (testPoint) {
            const result = classify(testPoint, k);
            
            // Draw connections to k nearest neighbors
            connectionsGroup.selectAll('line')
                .data(result.neighbors)
                .enter()
                .append('line')
                .attr('x1', xScale(testPoint.x))
                .attr('y1', yScale(testPoint.y))
                .attr('x2', d => xScale(d.x))
                .attr('y2', d => yScale(d.y))
                .style('stroke', '#FFA05F')
                .style('stroke-width', 1)
                .style('stroke-dasharray', '3,3')
                .style('opacity', 0.6);
            
            // Highlight nearest neighbors
            pointsGroup.selectAll('.neighbor-highlight')
                .data(result.neighbors)
                .enter()
                .append('circle')
                .attr('class', 'neighbor-highlight')
                .attr('cx', d => xScale(d.x))
                .attr('cy', d => yScale(d.y))
                .attr('r', 9)
                .style('fill', 'none')
                .style('stroke', '#FFA05F')
                .style('stroke-width', 2);
            
            // Draw test point
            pointsGroup.append('circle')
                .attr('cx', xScale(testPoint.x))
                .attr('cy', yScale(testPoint.y))
                .attr('r', 8)
                .style('fill', result.class === 0 ? '#10099F' : '#FC8484')
                .style('stroke', '#FFA05F')
                .style('stroke-width', 3);
            
            // Add question mark
            pointsGroup.append('text')
                .attr('x', xScale(testPoint.x))
                .attr('y', yScale(testPoint.y))
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .style('fill', 'white')
                .style('font-weight', 'bold')
                .style('font-size', '12px')
                .text('?');
        }
    }
    
    // Event handlers
    kSlider.addEventListener('input', function() {
        k = parseInt(this.value);
        kValue.textContent = k;
        drawDecisionBoundaries();
        drawPoints();
    });
    
    addPointButton.addEventListener('click', function() {
        testPoint = {
            x: 0.4 + Math.random() * 0.3,
            y: 0.4 + Math.random() * 0.3
        };
        drawPoints();
    });
    
    resetButton.addEventListener('click', function() {
        testPoint = null;
        drawPoints();
    });
    
    // Click to add test point
    svg.on('click', function(event) {
        const [mouseX, mouseY] = d3.pointer(event, g.node());
        
        if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
            testPoint = {
                x: xScale.invert(mouseX),
                y: yScale.invert(mouseY)
            };
            drawPoints();
        }
    });
    
    // Initial draw
    drawDecisionBoundaries();
    drawPoints();
});