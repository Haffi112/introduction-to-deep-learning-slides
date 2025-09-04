// Generalization in Classification Visualizations

// Test Error Convergence Demo
function initTestErrorConvergenceDemo() {
    const container = d3.select('#test-error-convergence-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 60, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // True error
    const trueError = 0.15;
    
    // Generate data
    const sampleSizes = d3.range(10, 2000, 10);
    const data = sampleSizes.map(n => {
        const stdDev = Math.sqrt(trueError * (1 - trueError) / n);
        return {
            n: n,
            mean: trueError,
            upper: trueError + 2 * stdDev,
            lower: trueError - 2 * stdDev,
            empirical: trueError + (Math.random() - 0.5) * 2 * stdDev
        };
    });
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, 2000])
        .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 0.3])
        .range([innerHeight, 0]);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 45)
        .attr('fill', '#262626')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Test Set Size (n)');
    
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', '#262626')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Error Rate');
    
    // Confidence band
    const area = d3.area()
        .x(d => xScale(d.n))
        .y0(d => yScale(d.lower))
        .y1(d => yScale(d.upper))
        .curve(d3.curveMonotoneX);
    
    g.append('path')
        .datum(data)
        .attr('fill', '#10099F')
        .attr('opacity', 0.2)
        .attr('d', area);
    
    // True error line
    g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScale(trueError))
        .attr('y2', yScale(trueError))
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    
    // Empirical errors
    const empiricalLine = d3.line()
        .x(d => xScale(d.n))
        .y(d => yScale(d.empirical))
        .curve(d3.curveMonotoneX);
    
    const path = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2)
        .attr('d', empiricalLine)
        .attr('opacity', 0);
    
    // Animate
    path.transition()
        .duration(2000)
        .attr('opacity', 1);
    
    // Legend
    const legend = g.append('g')
        .attr('transform', `translate(${innerWidth - 150}, 20)`);
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 30)
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    
    legend.append('text')
        .attr('x', 35)
        .attr('y', 5)
        .style('font-size', '12px')
        .text('True Error');
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 30)
        .attr('y1', 20)
        .attr('y2', 20)
        .attr('stroke', '#10099F')
        .attr('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 35)
        .attr('y', 25)
        .style('font-size', '12px')
        .text('Empirical Error');
    
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 35)
        .attr('width', 30)
        .attr('height', 15)
        .attr('fill', '#10099F')
        .attr('opacity', 0.2);
    
    legend.append('text')
        .attr('x', 35)
        .attr('y', 47)
        .style('font-size', '12px')
        .text('95% CI');
}

// Sample Size Scaling Demo
function initSampleSizeScalingDemo() {
    const container = d3.select('#sample-size-scaling-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 700;
    const height = 300;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Data
    const data = [
        { precision: 1, samples: 1, label: 'Baseline' },
        { precision: 2, samples: 4, label: '2× precision' },
        { precision: 10, samples: 100, label: '10× precision' },
        { precision: 100, samples: 10000, label: '100× precision' }
    ];
    
    const barWidth = 120;
    const barSpacing = 150;
    const startX = (width - (data.length * barSpacing - (barSpacing - barWidth))) / 2;
    
    // Scale for bar heights
    const heightScale = d3.scaleLog()
        .domain([1, 10000])
        .range([30, 200]);
    
    // Create bars
    const bars = svg.selectAll('.bar-group')
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', (d, i) => `translate(${startX + i * barSpacing}, ${height - 30})`);
    
    // Add bars with animation
    bars.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', barWidth)
        .attr('height', 0)
        .attr('fill', '#10099F')
        .attr('opacity', 0.8)
        .transition()
        .duration(1000)
        .delay((d, i) => i * 200)
        .attr('y', d => -heightScale(d.samples))
        .attr('height', d => heightScale(d.samples));
    
    // Add sample count labels
    bars.append('text')
        .attr('x', barWidth / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#262626')
        .text(d => d.samples.toLocaleString() + '×')
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .delay((d, i) => i * 200 + 800)
        .attr('opacity', 1)
        .attr('y', d => -heightScale(d.samples) - 10);
    
    // Add precision labels
    bars.append('text')
        .attr('x', barWidth / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text(d => d.label);
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', '#10099F')
        .text('Samples Required for Different Precision Levels');
}

// Bernoulli Variance Demo
function initBernoulliVarianceDemo() {
    const container = d3.select('#bernoulli-variance-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 500;
    const height = 350;
    const margin = { top: 40, right: 60, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Generate variance curve data
    const data = d3.range(0, 1.01, 0.01).map(p => ({
        p: p,
        variance: p * (1 - p)
    }));
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 0.26])
        .range([innerHeight, 0]);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).ticks(10))
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 45)
        .attr('fill', '#262626')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('True Error Rate ε(f)');
    
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', '#262626')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Variance σ²');
    
    // Variance curve
    const line = d3.line()
        .x(d => xScale(d.p))
        .y(d => yScale(d.variance))
        .curve(d3.curveMonotoneX);
    
    const path = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#10099F')
        .attr('stroke-width', 3)
        .attr('d', line);
    
    // Animate the drawing
    const totalLength = path.node().getTotalLength();
    path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);
    
    // Add maximum point
    setTimeout(() => {
        const maxPoint = g.append('circle')
            .attr('cx', xScale(0.5))
            .attr('cy', yScale(0.25))
            .attr('r', 0)
            .attr('fill', '#FC8484');
        
        maxPoint.transition()
            .duration(500)
            .attr('r', 6);
        
        g.append('text')
            .attr('x', xScale(0.5))
            .attr('y', yScale(0.25) - 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#FC8484')
            .style('font-weight', 'bold')
            .text('Max: σ² = 0.25 at ε = 0.5')
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .attr('opacity', 1);
    }, 2000);
}

// Confidence Interval Demo
function initConfidenceIntervalDemo() {
    const container = d3.select('#confidence-interval-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 700;
    const height = 150;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const centerY = height / 2;
    const lineY = centerY + 30;
    
    // True error point
    const trueError = 0.15;
    const centerX = width / 2;
    
    // Draw number line
    svg.append('line')
        .attr('x1', 100)
        .attr('x2', width - 100)
        .attr('y1', lineY)
        .attr('y2', lineY)
        .attr('stroke', '#666')
        .attr('stroke-width', 2);
    
    // Scale
    const scale = d3.scaleLinear()
        .domain([0.10, 0.20])
        .range([150, width - 150]);
    
    // Add tick marks
    const ticks = [0.10, 0.12, 0.14, 0.15, 0.16, 0.18, 0.20];
    svg.selectAll('.tick')
        .data(ticks)
        .enter()
        .append('g')
        .attr('class', 'tick')
        .each(function(d) {
            const g = d3.select(this);
            g.append('line')
                .attr('x1', scale(d))
                .attr('x2', scale(d))
                .attr('y1', lineY - 5)
                .attr('y2', lineY + 5)
                .attr('stroke', '#666');
            
            g.append('text')
                .attr('x', scale(d))
                .attr('y', lineY + 20)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .text(d.toFixed(2));
        });
    
    // True error marker
    svg.append('circle')
        .attr('cx', scale(trueError))
        .attr('cy', lineY)
        .attr('r', 6)
        .attr('fill', '#FC8484');
    
    svg.append('text')
        .attr('x', scale(trueError))
        .attr('y', lineY - 15)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', '#FC8484')
        .text('True Error');
    
    // Confidence intervals
    const intervals = [
        { level: '68%', std: 1, color: '#2DD2C0', opacity: 0.3 },
        { level: '95%', std: 2, color: '#10099F', opacity: 0.2 },
        { level: '99.7%', std: 3, color: '#FFA05F', opacity: 0.15 }
    ];
    
    intervals.forEach((interval, i) => {
        const width = 0.01 * interval.std;
        
        setTimeout(() => {
            const rect = svg.append('rect')
                .attr('x', scale(trueError - width))
                .attr('y', lineY - 40 - i * 15)
                .attr('width', 0)
                .attr('height', 80 + i * 15)
                .attr('fill', interval.color)
                .attr('opacity', interval.opacity);
            
            rect.transition()
                .duration(800)
                .attr('width', scale(trueError + width) - scale(trueError - width));
            
            svg.append('text')
                .attr('x', scale(trueError))
                .attr('y', lineY - 50 - i * 15)
                .attr('text-anchor', 'middle')
                .style('font-size', '11px')
                .style('fill', interval.color)
                .style('font-weight', 'bold')
                .text(interval.level)
                .attr('opacity', 0)
                .transition()
                .delay(400)
                .duration(400)
                .attr('opacity', 1);
        }, i * 500);
    });
}

// Hoeffding Bound Demo
function initHoeffdingBoundDemo() {
    const container = d3.select('#hoeffding-bound-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 80, bottom: 20, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Controls
    const controls = container.append('div')
        .style('margin-top', '20px')
        .style('text-align', 'center');
    
    controls.append('label')
        .style('margin-right', '20px')
        .style('font-size', '0.5em')
        .html('Sample Size n: <input type="range" id="hoeffding-n" min="1000" max="50000" value="10000" step="1000">');
    
    controls.append('span')
        .attr('id', 'hoeffding-n-value')
        .style('font-weight', 'bold')
        .style('color', '#10099F')
        .text('10,000').style('font-size', '0.5em');;
    
    function updateVisualization(n) {
        g.selectAll('*').remove();
        
        // Generate data
        const tValues = d3.range(0, 0.1, 0.001);
        const data = tValues.map(t => ({
            t: t,
            probability: Math.exp(-2 * n * t * t)
        }));
        
        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, 0.1])
            .range([0, innerWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);
        
        // Axes
        g.append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(xScale))
            .append('text')
            .attr('x', innerWidth / 2)
            .attr('y', 45)
            .attr('fill', '#262626')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('Error Gap (t)');
        
        g.append('g')
            .call(d3.axisLeft(yScale))
            .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -60)
            .attr('x', -innerHeight / 2)
            .attr('fill', '#262626')
            .style('text-anchor', 'middle')
            .style('font-size', '14px')
            .text('P(|ε_D - ε| ≥ t)');
        
        // Curve
        const line = d3.line()
            .x(d => xScale(d.t))
            .y(d => yScale(d.probability))
            .curve(d3.curveMonotoneX);
        
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 3)
            .attr('d', line);
        
        // 95% confidence line
        const conf95 = 0.05;
        g.append('line')
            .attr('x1', 0)
            .attr('x2', innerWidth)
            .attr('y1', yScale(conf95))
            .attr('y2', yScale(conf95))
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,5');
        
        g.append('text')
            .attr('x', innerWidth - 10)
            .attr('y', yScale(conf95) - 5)
            .attr('text-anchor', 'end')
            .style('font-size', '12px')
            .style('fill', '#FC8484')
            .text('95% confidence');
        
        // Find t for 95% confidence
        const t95 = Math.sqrt(-Math.log(conf95) / (2 * n));
        
        g.append('line')
            .attr('x1', xScale(t95))
            .attr('x2', xScale(t95))
            .attr('y1', 0)
            .attr('y2', innerHeight)
            .attr('stroke', '#2DD2C0')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '5,5');
        
        g.append('text')
            .attr('x', xScale(t95))
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#2DD2C0')
            .style('font-weight', 'bold')
            .text(`t = ${t95.toFixed(3)}`);
    }
    
    updateVisualization(10000);
    
    d3.select('#hoeffding-n').on('input', function() {
        const n = +this.value;
        d3.select('#hoeffding-n-value').text(n.toLocaleString());
        updateVisualization(n);
    });
}

// Multiple Testing Demo
function initMultipleTestingDemo() {
    const container = d3.select('#multiple-testing-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 500;
    const height = 300;
    const margin = { top: 40, right: 60, bottom: 60, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Generate data
    const maxModels = 30;
    const data = d3.range(1, maxModels + 1).map(k => ({
        models: k,
        falseDiscoveryProb: 1 - Math.pow(0.95, k)
    }));
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, maxModels])
        .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale))
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 45)
        .attr('fill', '#262626')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Number of Models Tested');
    
    g.append('g')
        .call(d3.axisLeft(yScale).tickFormat(d3.format('.0%')))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', '#262626')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('P(At Least One False Discovery)');
    
    // Line
    const line = d3.line()
        .x(d => xScale(d.models))
        .y(d => yScale(d.falseDiscoveryProb))
        .curve(d3.curveMonotoneX);
    
    const path = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 3)
        .attr('d', line);
    
    // Animate
    const totalLength = path.node().getTotalLength();
    path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);
    
    // Key points
    const keyPoints = [
        { models: 1, prob: 0.05, label: '1 model: 5%' },
        { models: 10, prob: 1 - Math.pow(0.95, 10), label: '10 models: 40%' },
        { models: 20, prob: 1 - Math.pow(0.95, 20), label: '20 models: 64%' }
    ];
    
    setTimeout(() => {
        keyPoints.forEach((point, i) => {
            setTimeout(() => {
                g.append('circle')
                    .attr('cx', xScale(point.models))
                    .attr('cy', yScale(point.prob))
                    .attr('r', 0)
                    .attr('fill', '#10099F')
                    .transition()
                    .duration(300)
                    .attr('r', 5);
                
                g.append('text')
                    .attr('x', xScale(point.models) + 10)
                    .attr('y', yScale(point.prob) - 10)
                    .style('font-size', '12px')
                    .style('fill', '#10099F')
                    .style('font-weight', 'bold')
                    .text(point.label)
                    .attr('opacity', 0)
                    .transition()
                    .duration(300)
                    .attr('opacity', 1);
            }, i * 300);
        });
    }, 2000);
}

// Adaptive Overfitting Demo
function initAdaptiveOverfittingDemo() {
    const container = d3.select('#adaptive-overfitting-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 700;
    const height = 250;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Timeline
    const timelineY = 100;
    const startX = 100;
    const endX = 600;
    
    svg.append('line')
        .attr('x1', startX)
        .attr('x2', endX)
        .attr('y1', timelineY)
        .attr('y2', timelineY)
        .attr('stroke', '#666')
        .attr('stroke-width', 2);
    
    // Events
    const events = [
        { x: 150, label: 'Train f₁', color: '#10099F' },
        { x: 250, label: 'Test f₁', color: '#2DD2C0' },
        { x: 350, label: 'Train f₂', color: '#FFA05F' },
        { x: 450, label: 'Test f₂', color: '#FC8484' },
        { x: 550, label: 'Train f₃...', color: '#FC8484' }
    ];
    
    events.forEach((event, i) => {
        setTimeout(() => {
            // Event marker
            const g = svg.append('g');
            
            g.append('circle')
                .attr('cx', event.x)
                .attr('cy', timelineY)
                .attr('r', 0)
                .attr('fill', event.color)
                .transition()
                .duration(300)
                .attr('r', 8);
            
            g.append('text')
                .attr('x', event.x)
                .attr('y', timelineY - 20)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(event.label)
                .attr('opacity', 0)
                .transition()
                .delay(150)
                .duration(300)
                .attr('opacity', 1);
            
            // Contamination arrow
            if (i === 1) {
                setTimeout(() => {
                    const arrow = svg.append('g');
                    
                    arrow.append('path')
                        .attr('d', `M ${event.x + 20} ${timelineY + 30} 
                                   Q ${event.x + 60} ${timelineY + 50} 
                                   ${events[2].x - 20} ${timelineY + 30}`)
                        .attr('fill', 'none')
                        .attr('stroke', '#FC8484')
                        .attr('stroke-width', 2)
                        .attr('marker-end', 'url(#arrowhead)')
                        .attr('stroke-dasharray', '5,5')
                        .attr('opacity', 0)
                        .transition()
                        .duration(500)
                        .attr('opacity', 1);
                    
                    arrow.append('text')
                        .attr('x', (event.x + events[2].x) / 2)
                        .attr('y', timelineY + 60)
                        .attr('text-anchor', 'middle')
                        .style('font-size', '11px')
                        .style('fill', '#FC8484')
                        .style('font-style', 'italic')
                        .text('Information leakage!')
                        .attr('opacity', 0)
                        .transition()
                        .delay(250)
                        .duration(500)
                        .attr('opacity', 1);
                }, 500);
            }
        }, i * 600);
    });
    
    // Arrow marker definition
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#FC8484');
    
    // Warning box
    setTimeout(() => {
        const warningBox = svg.append('g')
            .attr('transform', 'translate(350, 200)');
        
        warningBox.append('rect')
            .attr('x', -150)
            .attr('y', -30)
            .attr('width', 300)
            .attr('height', 60)
            .attr('fill', '#fff5f5')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2)
            .attr('rx', 5)
            .attr('opacity', 0)
            .transition()
            .duration(500)
            .attr('opacity', 1);
        
        warningBox.append('text')
            .attr('x', 0)
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', '#FC8484')
            .text('⚠️ Test Set Contaminated!')
            .attr('opacity', 0)
            .transition()
            .delay(250)
            .duration(500)
            .attr('opacity', 1);
        
        warningBox.append('text')
            .attr('x', 0)
            .attr('y', 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .text('Independence assumption violated')
            .attr('opacity', 0)
            .transition()
            .delay(250)
            .duration(500)
            .attr('opacity', 1);
    }, 3000);
}

// Bias-Variance Demo
function initBiasVarianceDemo() {
    const container = d3.select('#bias-variance-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 700;
    const height = 200;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Three model visualizations
    const models = [
        { name: 'Underfitting', bias: 'high', variance: 'low', x: 150, color: '#2DD2C0' },
        { name: 'Good Fit', bias: 'medium', variance: 'medium', x: 350, color: '#10099F' },
        { name: 'Overfitting', bias: 'low', variance: 'high', x: 550, color: '#FC8484' }
    ];
    
    models.forEach((model, i) => {
        const g = svg.append('g')
            .attr('transform', `translate(${model.x}, 80)`);
        
        // Generate random data points
        const dataPoints = d3.range(25).map(() => {
            const x = (Math.random() - 0.5) * 100;
            const y = 20 * Math.sin(x / 20) + (Math.random() - 0.5) * 20;
            return { x, y };
        });
        
        // Draw data points
        g.selectAll('.data-point')
            .data(dataPoints)
            .enter()
            .append('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 3)
            .attr('fill', '#666')
            .attr('opacity', 0)
            .transition()
            .delay(i * 300)
            .duration(500)
            .attr('opacity', 0.6);
        
        // Draw model fit
        let path;
        if (model.name === 'Underfitting') {
            // Simple line
            path = g.append('line')
                .attr('x1', -60)
                .attr('x2', 60)
                .attr('y1', -20)
                .attr('y2', 20)
                .attr('stroke', model.color)
                .attr('stroke-width', 3);
        } else if (model.name === 'Good Fit') {
            // Smooth curve
            const curveData = d3.range(-60, 61, 10).map(x => ({
                x: x,
                y: 20 * Math.sin(x / 20)
            }));
            const line = d3.line()
                .x(d => d.x)
                .y(d => d.y)
                .curve(d3.curveMonotoneX);
            
            path = g.append('path')
                .datum(curveData)
                .attr('fill', 'none')
                .attr('stroke', model.color)
                .attr('stroke-width', 3)
                .attr('d', line);
        } else {
            // Complex wiggly line
            const complexData = dataPoints.sort((a, b) => a.x - b.x);
            const line = d3.line()
                .x(d => d.x)
                .y(d => d.y)
                .curve(d3.curveCardinal.tension(0));
            
            path = g.append('path')
                .datum(complexData)
                .attr('fill', 'none')
                .attr('stroke', model.color)
                .attr('stroke-width', 3)
                .attr('d', line);
        }
        
        path.attr('opacity', 0)
            .transition()
            .delay(i * 300 + 500)
            .duration(500)
            .attr('opacity', 1);
        
        // Labels
        g.append('text')
            .attr('y', -65)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', model.color)
            .text(model.name)
            .attr('opacity', 0)
            .transition()
            .delay(i * 300 + 800)
            .duration(500)
            .attr('opacity', 1);
        
        g.append('text')
            .attr('y', 80)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .html(`Bias: ${model.bias}`)
            .attr('opacity', 0)
            .transition()
            .delay(i * 300 + 800)
            .duration(500)
            .attr('opacity', 1);
        
        g.append('text')
            .attr('y', 100)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#666')
            .html(`Variance: ${model.variance}`)
            .attr('opacity', 0)
            .transition()
            .delay(i * 300 + 800)
            .duration(500)
            .attr('opacity', 1);
    });
}

// VC Dimension Demo
function initVCDimensionDemo() {
    const container = d3.select('#vc-dimension-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 700;
    const height = 200;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Show shattering of points in 2D
    const examples = [
        { points: 2, canShatter: true, x: 150 },
        { points: 3, canShatter: true, x: 350 },
        { points: 4, canShatter: false, x: 550 }
    ];
    
    examples.forEach((example, i) => {
        const g = svg.append('g')
            .attr('transform', `translate(${example.x}, 100)`);
        
        // Generate points
        let points;
        if (example.points === 2) {
            points = [{ x: -30, y: 0 }, { x: 30, y: 0 }];
        } else if (example.points === 3) {
            points = [
                { x: 0, y: -30 },
                { x: -26, y: 15 },
                { x: 26, y: 15 }
            ];
        } else {
            points = [
                { x: -30, y: -30 },
                { x: 30, y: -30 },
                { x: 30, y: 30 },
                { x: -30, y: 30 }
            ];
        }
        
        // Draw points
        points.forEach((point, j) => {
            setTimeout(() => {
                g.append('circle')
                    .attr('cx', point.x)
                    .attr('cy', point.y)
                    .attr('r', 0)
                    .attr('fill', j % 2 === 0 ? '#10099F' : '#FC8484')
                    .transition()
                    .duration(300)
                    .attr('r', 8);
            }, i * 500 + j * 100);
        });
        
        // Draw separating line
        setTimeout(() => {
            if (example.canShatter) {
                const line = g.append('line')
                    .attr('x1', -40)
                    .attr('x2', 20)
                    .attr('y1', example.points === 2 ? -40 : -60)
                    .attr('y2', example.points === 2 ? 40 : 60)
                    .attr('stroke', '#2DD2C0')
                    .attr('stroke-width', 2)
                    .attr('stroke-dasharray', '5,5')
                    .attr('opacity', 0);
                
                line.transition()
                    .duration(500)
                    .attr('opacity', 1)
                    .attr('y1', example.points === 3 ? -40 : (example.points === 2 ? -40 : -60))
                    .attr('y2', example.points === 3 ? 40 : (example.points === 2 ? 40 : 60));
            } else {
                // Show XOR pattern - cannot be linearly separated
                const text = g.append('text')
                    .attr('y', 80)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .style('fill', '#FC8484')
                    .style('font-weight', 'bold')
                    .text('Cannot linearly separate!')
                    .attr('opacity', 0);
                
                text.transition()
                    .duration(500)
                    .attr('opacity', 1);
            }
        }, i * 500 + example.points * 100 + 200);
        
        // Labels
        g.append('text')
            .attr('y', -80)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text(`${example.points} Points`)
            .attr('opacity', 0)
            .transition()
            .delay(i * 500)
            .duration(500)
            .attr('opacity', 1);
        
        g.append('text')
            .attr('y', -60)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', example.canShatter ? '#2DD2C0' : '#FC8484')
            .text(example.canShatter ? '✓ Can shatter' : '✗ Cannot shatter')
            .attr('opacity', 0)
            .transition()
            .delay(i * 500 + 500)
            .duration(500)
            .attr('opacity', 1);
    });
    
    // VC dimension explanation
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 350)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#10099F')
        .text('VC Dimension of 2D Linear Classifiers = 3')
        .attr('opacity', 0)
        .transition()
        .delay(2000)
        .duration(1000)
        .attr('opacity', 1);
}

// VC Bound Demo
function initVCBoundDemo() {
    const container = d3.select('#vc-bound-demo');
    if (container.empty() || !container.node()) return;
    
    container.selectAll('*').remove();
    
    const width = 500;
    const height = 300;
    const margin = { top: 40, right: 20, bottom: 20, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Parameters
    const delta = 0.05; // 95% confidence
    const c = 1; // Constant
    
    // Generate data for different VC dimensions
    const vcDimensions = [10, 50, 100, 500];
    const nValues = d3.range(100, 10000, 100);
    
    const data = vcDimensions.map(vc => ({
        vc: vc,
        values: nValues.map(n => ({
            n: n,
            bound: c * Math.sqrt((vc - Math.log(delta)) / n)
        }))
    }));
    
    // Color scale
    const colorScale = d3.scaleOrdinal()
        .domain(vcDimensions)
        .range(['#2DD2C0', '#10099F', '#FFA05F', '#FC8484']);
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, 10000])
        .range([0, innerWidth]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0]);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale).tickFormat(d => d / 1000 + 'k'))
        .append('text')
        .attr('x', innerWidth / 2)
        .attr('y', 45)
        .attr('fill', '#262626')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Number of Samples (n)');
    
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', '#262626')
        .style('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Generalization Bound (α)');
    
    // Lines
    const line = d3.line()
        .x(d => xScale(d.n))
        .y(d => yScale(d.bound))
        .curve(d3.curveMonotoneX);
    
    data.forEach((vcData, i) => {
        const path = g.append('path')
            .datum(vcData.values)
            .attr('fill', 'none')
            .attr('stroke', colorScale(vcData.vc))
            .attr('stroke-width', 2.5)
            .attr('d', line);
        
        // Animate
        const totalLength = path.node().getTotalLength();
        path
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .delay(i * 200)
            .attr('stroke-dashoffset', 0);
    });
    
    // Legend
    const legend = g.append('g')
        .attr('transform', `translate(${innerWidth - 80}, 20)`);
    
    vcDimensions.forEach((vc, i) => {
        const legendItem = legend.append('g')
            .attr('transform', `translate(0, ${i * 25})`);
        
        legendItem.append('line')
            .attr('x1', 0)
            .attr('x2', 25)
            .attr('y1', 0)
            .attr('y2', 0)
            .attr('stroke', colorScale(vc))
            .attr('stroke-width', 2.5);
        
        legendItem.append('text')
            .attr('x', 30)
            .attr('y', 4)
            .style('font-size', '12px')
            .text(`VC = ${vc}`);
    });
    
    // Title
    g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', -20)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('font-weight', 'bold')
        .style('fill', '#10099F')
        .text('Generalization Bounds for Different VC Dimensions');
}

// Initialize all visualizations when ready
if (typeof Reveal !== 'undefined') {
    Reveal.on('ready', () => {
        initTestErrorConvergenceDemo();
        initSampleSizeScalingDemo();
        initBernoulliVarianceDemo();
        initConfidenceIntervalDemo();
        initHoeffdingBoundDemo();
        initMultipleTestingDemo();
        initAdaptiveOverfittingDemo();
        initBiasVarianceDemo();
        initVCDimensionDemo();
        initVCBoundDemo();
    });
    
    // Reinitialize on slide change
    Reveal.on('slidechanged', event => {
        const currentSlide = event.currentSlide;
        
        if (currentSlide.querySelector('#test-error-convergence-demo')) {
            initTestErrorConvergenceDemo();
        }
        if (currentSlide.querySelector('#sample-size-scaling-demo')) {
            initSampleSizeScalingDemo();
        }
        if (currentSlide.querySelector('#bernoulli-variance-demo')) {
            initBernoulliVarianceDemo();
        }
        if (currentSlide.querySelector('#confidence-interval-demo')) {
            initConfidenceIntervalDemo();
        }
        if (currentSlide.querySelector('#hoeffding-bound-demo')) {
            initHoeffdingBoundDemo();
        }
        if (currentSlide.querySelector('#multiple-testing-demo')) {
            initMultipleTestingDemo();
        }
        if (currentSlide.querySelector('#adaptive-overfitting-demo')) {
            initAdaptiveOverfittingDemo();
        }
        if (currentSlide.querySelector('#bias-variance-demo')) {
            initBiasVarianceDemo();
        }
        if (currentSlide.querySelector('#vc-dimension-demo')) {
            initVCDimensionDemo();
        }
        if (currentSlide.querySelector('#vc-bound-demo')) {
            initVCBoundDemo();
        }
    });
}