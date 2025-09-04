// Distribution Shift Visualization
// Interactive demonstration of different types of distribution shifts

function initDistributionShiftViz() {
    // Real-World Examples Visualization
    const examplesContainer = d3.select('#distribution-shift-examples');
    if (!examplesContainer.empty()) {
        createExamplesViz(examplesContainer);
    }

    // Interactive Distribution Shift Demo
    const demoContainer = d3.select('#distribution-shift-demo');
    if (!demoContainer.empty()) {
        createDistributionShiftDemo(demoContainer);
    }

    // Learning Taxonomy Visualization  
    const taxonomyContainer = d3.select('#learning-taxonomy-viz');
    if (!taxonomyContainer.empty()) {
        createTaxonomyViz(taxonomyContainer);
    }
}

function createExamplesViz(container) {
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 400;
    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const examples = [
        {name: 'Medical\nDiagnostics', risk: 0.95, deployment: 0.15, color: '#FC8484'},
        {name: 'Self-Driving\nCars', risk: 0.92, deployment: 0.25, color: '#FFA05F'},
        {name: 'Spam\nFilters', risk: 0.85, deployment: 0.70, color: '#2DD2C0'},
        {name: 'Face\nDetection', risk: 0.88, deployment: 0.45, color: '#10099F'}
    ];

    const xScale = d3.scaleBand()
        .domain(examples.map(d => d.name))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height - margin.bottom, margin.top]);

    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .style('font-size', '12px');

    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')));

    // Add bars for test accuracy
    const testBars = svg.selectAll('.test-bar')
        .data(examples)
        .enter().append('rect')
        .attr('class', 'test-bar')
        .attr('x', d => xScale(d.name))
        .attr('width', xScale.bandwidth() / 2)
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .attr('fill', d => d.color)
        .attr('opacity', 0.7);

    // Add bars for deployment accuracy
    const deployBars = svg.selectAll('.deploy-bar')
        .data(examples)
        .enter().append('rect')
        .attr('class', 'deploy-bar')
        .attr('x', d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr('width', xScale.bandwidth() / 2)
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .attr('fill', d => d.color)
        .attr('opacity', 0.4);

    // Animate bars
    testBars.transition()
        .duration(1000)
        .attr('y', d => yScale(d.risk))
        .attr('height', d => height - margin.bottom - yScale(d.risk));

    deployBars.transition()
        .delay(500)
        .duration(1000)
        .attr('y', d => yScale(d.deployment))
        .attr('height', d => height - margin.bottom - yScale(d.deployment));

    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 150}, ${margin.top})`);

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', '#10099F')
        .attr('opacity', 0.7);

    legend.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text('Test Accuracy')
        .style('font-size', '12px');

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 25)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', '#10099F')
        .attr('opacity', 0.4);

    legend.append('text')
        .attr('x', 20)
        .attr('y', 37)
        .text('Deployment Accuracy')
        .style('font-size', '12px');

    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', margin.top / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .text('Test vs Deployment Performance Gap');
}

function createDistributionShiftDemo(container) {
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 450;
    const margin = {top: 40, right: 20, bottom: 60, left: 60};
    
    // Create control panel
    const controls = container.append('div')
        .style('display', 'flex')
        .style('justify-content', 'center')
        .style('gap', '20px')
        .style('margin-bottom', '20px')
        .style('padding', '10px')
        .style('background', '#f9f9f9')
        .style('border-radius', '5px');

    // Add sliders
    const meanShift = controls.append('div');
    meanShift.append('label')
        .text('Mean Shift: ')
        .style('margin-right', '10px');
    const meanSlider = meanShift.append('input')
        .attr('type', 'range')
        .attr('min', '-2')
        .attr('max', '2')
        .attr('step', '0.1')
        .attr('value', '0')
        .style('width', '150px');
    const meanValue = meanShift.append('span')
        .text('0.0')
        .style('margin-left', '10px')
        .style('font-family', 'monospace');

    const varShift = controls.append('div');
    varShift.append('label')
        .text('Variance Shift: ')
        .style('margin-right', '10px');
    const varSlider = varShift.append('input')
        .attr('type', 'range')
        .attr('min', '0.5')
        .attr('max', '2')
        .attr('step', '0.1')
        .attr('value', '1')
        .style('width', '150px');
    const varValue = varShift.append('span')
        .text('1.0')
        .style('margin-left', '10px')
        .style('font-family', 'monospace');

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const xScale = d3.scaleLinear()
        .domain([-5, 5])
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, 0.5])
        .range([height - margin.bottom, margin.top]);

    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Feature Value');

    svg.append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Probability Density');

    // Create paths for distributions
    const sourcePath = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2)
        .attr('opacity', 0.7);

    const targetPath = svg.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2)
        .attr('opacity', 0.7);

    // Decision boundary
    const boundary = svg.append('line')
        .attr('x1', xScale(0))
        .attr('x2', xScale(0))
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom)
        .attr('stroke', '#666')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5,5');

    // Performance metrics
    const metrics = svg.append('g')
        .attr('transform', `translate(${width - 200}, ${margin.top + 20})`);

    metrics.append('rect')
        .attr('x', -10)
        .attr('y', -10)
        .attr('width', 180)
        .attr('height', 80)
        .attr('fill', 'white')
        .attr('stroke', '#ddd')
        .attr('rx', 5);

    const sourceAccuracy = metrics.append('text')
        .attr('x', 5)
        .attr('y', 15)
        .style('font-size', '12px')
        .text('Source Accuracy: 95%');

    const targetAccuracy = metrics.append('text')
        .attr('x', 5)
        .attr('y', 35)
        .style('font-size', '12px')
        .text('Target Accuracy: 95%');

    const overlapText = metrics.append('text')
        .attr('x', 5)
        .attr('y', 55)
        .style('font-size', '12px')
        .text('Distribution Overlap: 100%');

    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${margin.left + 20}, ${margin.top + 20})`);

    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);

    legend.append('text')
        .attr('x', 25)
        .attr('y', 4)
        .text('Source Distribution')
        .style('font-size', '12px');

    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2);

    legend.append('text')
        .attr('x', 25)
        .attr('y', 24)
        .text('Target Distribution')
        .style('font-size', '12px');

    function updateDistributions() {
        const meanShiftVal = parseFloat(meanSlider.property('value'));
        const varShiftVal = parseFloat(varSlider.property('value'));
        
        meanValue.text(meanShiftVal.toFixed(1));
        varValue.text(varShiftVal.toFixed(1));

        // Generate data points
        const x = d3.range(-5, 5, 0.1);
        
        // Normal distribution function
        function normal(x, mean, variance) {
            return (1 / Math.sqrt(2 * Math.PI * variance)) * 
                   Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
        }

        // Source distribution (standard normal)
        const sourceData = x.map(xi => ({
            x: xi,
            y: normal(xi, 0, 1)
        }));

        // Target distribution (shifted)
        const targetData = x.map(xi => ({
            x: xi,
            y: normal(xi, meanShiftVal, varShiftVal)
        }));

        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y))
            .curve(d3.curveMonotoneX);

        // Update paths
        sourcePath.attr('d', line(sourceData));
        targetPath.attr('d', line(targetData));

        // Calculate performance metrics
        const sourceAcc = 0.95; // Fixed source accuracy
        const overlap = Math.exp(-Math.pow(meanShiftVal, 2) / (2 * (1 + varShiftVal)));
        const targetAcc = sourceAcc * overlap;

        sourceAccuracy.text(`Source Accuracy: ${(sourceAcc * 100).toFixed(0)}%`);
        targetAccuracy.text(`Target Accuracy: ${(targetAcc * 100).toFixed(0)}%`)
            .style('fill', targetAcc < 0.7 ? '#FC8484' : 'black');
        overlapText.text(`Distribution Overlap: ${(overlap * 100).toFixed(0)}%`);
    }

    // Add event listeners
    meanSlider.on('input', updateDistributions);
    varSlider.on('input', updateDistributions);

    // Initial update
    updateDistributions();
}

function createTaxonomyViz(container) {
    container.selectAll('*').remove();
    
    const width = 800;
    const height = 400;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const taxonomyData = {
        name: 'Learning Problems',
        children: [
            {
                name: 'Batch Learning',
                color: '#10099F',
                description: 'All data upfront'
            },
            {
                name: 'Online Learning',
                color: '#2DD2C0',
                description: 'Sequential data'
            },
            {
                name: 'Bandits',
                color: '#FFA05F',
                description: 'Finite actions'
            },
            {
                name: 'Control',
                color: '#FAC55B',
                description: 'Stateful environment'
            },
            {
                name: 'Reinforcement',
                color: '#FC8484',
                description: 'Strategic agents'
            }
        ]
    };

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 150;

    

    // Child nodes
    const angleStep = (2 * Math.PI) / taxonomyData.children.length;
    
    taxonomyData.children.forEach((child, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Connection line
        svg.append('line')
            .attr('x1', centerX)
            .attr('y1', centerY)
            .attr('x2', x)
            .attr('y2', y)
            .attr('stroke', '#ddd')
            .attr('stroke-width', 1);

        const nodeGroup = svg.append('g')
            .attr('transform', `translate(${x}, ${y})`);

        // Node circle
        const circle = nodeGroup.append('rect')
            .attr('width', 120)
            .attr('height', 70)
            .attr('x', -60)
            .attr('y', -35)
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('fill', child.color)
            .attr('opacity', 0.8)
            .style('cursor', 'pointer');

        // Node label
        nodeGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', -5)
            .style('fill', 'white')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(child.name);

        // Node description
        nodeGroup.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', 10)
            .style('fill', 'white')
            .style('font-size', '10px')
            .text(child.description);

        // Hover effect
        circle.on('mouseover', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 40)
                .attr('opacity', 1);
        }).on('mouseout', function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr('r', 35)
                .attr('opacity', 0.8);
        });
    });

    // Central node
    const centralNode = svg.append('g')
        .attr('transform', `translate(${centerX}, ${centerY})`);

    centralNode.append('circle')
        .attr('r', 70)
        .attr('fill', '#f5f5f5')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);

    centralNode.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', 5)
        .style('font-weight', 'bold')
        .style('font-size', '14px')
        .text(taxonomyData.name);
}

// Initialize when slide is shown
if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
        const currentSlide = event.currentSlide;
        if (currentSlide.querySelector('#distribution-shift-examples') ||
            currentSlide.querySelector('#distribution-shift-demo') ||
            currentSlide.querySelector('#learning-taxonomy-viz')) {
            initDistributionShiftViz();
        }
    });
}