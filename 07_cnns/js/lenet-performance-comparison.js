// LeNet Performance Comparison Visualization
(function() {
    const svg = d3.select('#performance-comparison-svg');
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 80, bottom: 60, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Model performance data
    const models = [
        {
            name: 'Original LeNet',
            color: '#10099F',
            data: [
                { epoch: 0, acc: 10 },
                { epoch: 1, acc: 65 },
                { epoch: 2, acc: 75 },
                { epoch: 3, acc: 80 },
                { epoch: 4, acc: 83 },
                { epoch: 5, acc: 85 },
                { epoch: 6, acc: 86.5 },
                { epoch: 7, acc: 87.5 },
                { epoch: 8, acc: 88.2 },
                { epoch: 9, acc: 88.8 },
                { epoch: 10, acc: 89.2 }
            ]
        },
        {
            name: 'Modern LeNet',
            color: '#2DD2C0',
            data: [
                { epoch: 0, acc: 10 },
                { epoch: 1, acc: 72 },
                { epoch: 2, acc: 80 },
                { epoch: 3, acc: 84 },
                { epoch: 4, acc: 87 },
                { epoch: 5, acc: 89 },
                { epoch: 6, acc: 90.5 },
                { epoch: 7, acc: 91.3 },
                { epoch: 8, acc: 91.8 },
                { epoch: 9, acc: 92.2 },
                { epoch: 10, acc: 92.5 }
            ]
        },
        {
            name: 'Deeper LeNet',
            color: '#FC8484',
            data: [
                { epoch: 0, acc: 10 },
                { epoch: 1, acc: 70 },
                { epoch: 2, acc: 78 },
                { epoch: 3, acc: 82 },
                { epoch: 4, acc: 85 },
                { epoch: 5, acc: 87 },
                { epoch: 6, acc: 88.5 },
                { epoch: 7, acc: 89.5 },
                { epoch: 8, acc: 90.3 },
                { epoch: 9, acc: 90.8 },
                { epoch: 10, acc: 91.2 }
            ]
        }
    ];
    
    let visibleModels = new Set(['Original LeNet', 'Modern LeNet', 'Deeper LeNet']);
    
    function init() {
        svg.selectAll('*').remove();
        
        // Create plot area
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, plotWidth]);
        
        const yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([plotHeight, 0]);
        
        // Add grid lines
        g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${plotHeight})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-plotHeight)
                .tickFormat(''))
            .style('stroke-dasharray', '3,3')
            .style('opacity', 0.3);
        
        g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale)
                .tickSize(-plotWidth)
                .tickFormat(''))
            .style('stroke-dasharray', '3,3')
            .style('opacity', 0.3);
        
        // Add axes
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${plotHeight})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));
        
        // Add axis labels
        g.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', plotHeight + 45)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .text('Epoch');
        
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -plotHeight / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .text('Validation Accuracy (%)');
        
        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.epoch))
            .y(d => yScale(d.acc))
            .curve(d3.curveMonotoneX);
        
        // Add lines for each model
        models.forEach(model => {
            const modelG = g.append('g')
                .attr('class', `model-${model.name.replace(/\s+/g, '-')}`);
            
            // Add line
            modelG.append('path')
                .datum(model.data)
                .attr('class', 'line')
                .attr('fill', 'none')
                .attr('stroke', model.color)
                .attr('stroke-width', 2.5)
                .attr('d', line)
                .attr('opacity', visibleModels.has(model.name) ? 1 : 0.1);
            
            // Add dots
            modelG.selectAll('.dot')
                .data(model.data)
                .enter().append('circle')
                .attr('class', 'dot')
                .attr('cx', d => xScale(d.epoch))
                .attr('cy', d => yScale(d.acc))
                .attr('r', 3)
                .attr('fill', model.color)
                .attr('opacity', visibleModels.has(model.name) ? 1 : 0.1);
            
            // Add hover tooltip
            const tooltip = g.append('g')
                .attr('class', 'tooltip')
                .style('display', 'none');
            
            tooltip.append('rect')
                .attr('width', 120)
                .attr('height', 40)
                .attr('fill', 'white')
                .attr('stroke', '#262626')
                .attr('rx', 5);
            
            tooltip.append('text')
                .attr('x', 60)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px');
            
            modelG.selectAll('.dot')
                .on('mouseover', function(event, d) {
                    tooltip.style('display', null);
                    tooltip.select('text')
                        .text(`Epoch ${d.epoch}: ${d.acc.toFixed(1)}%`);
                    const [x, y] = d3.pointer(event, g.node());
                    tooltip.attr('transform', `translate(${x - 60}, ${y - 50})`);
                })
                .on('mouseout', function() {
                    tooltip.style('display', 'none');
                });
        });
        
        // Add legend
        const legend = g.append('g')
            .attr('transform', `translate(${plotWidth - 150}, 20)`);
        
        models.forEach((model, i) => {
            const legendItem = legend.append('g')
                .attr('transform', `translate(0, ${i * 25})`);
            
            legendItem.append('rect')
                .attr('width', 18)
                .attr('height', 18)
                .attr('fill', model.color)
                .attr('opacity', visibleModels.has(model.name) ? 1 : 0.3);
            
            legendItem.append('text')
                .attr('x', 24)
                .attr('y', 9)
                .attr('dominant-baseline', 'middle')
                .attr('font-size', '12px')
                .text(model.name);
        });
        
        // Add final accuracy annotations
        models.forEach(model => {
            if (visibleModels.has(model.name)) {
                const finalData = model.data[model.data.length - 1];
                g.append('text')
                    .attr('class', `annotation-${model.name.replace(/\s+/g, '-')}`)
                    .attr('x', xScale(finalData.epoch) + 10)
                    .attr('y', yScale(finalData.acc))
                    .attr('font-size', '11px')
                    .attr('font-weight', 'bold')
                    .attr('fill', model.color)
                    .text(`${finalData.acc.toFixed(1)}%`);
            }
        });
        
        updateVisualization();
    }
    
    function updateVisualization() {
        const g = svg.select('g');
        
        models.forEach(model => {
            const modelClass = `.model-${model.name.replace(/\s+/g, '-')}`;
            const isVisible = visibleModels.has(model.name);
            
            g.select(`${modelClass} .line`)
                .transition()
                .duration(300)
                .attr('opacity', isVisible ? 1 : 0.1);
            
            g.selectAll(`${modelClass} .dot`)
                .transition()
                .duration(300)
                .attr('opacity', isVisible ? 1 : 0.1);
            
            g.select(`.annotation-${model.name.replace(/\s+/g, '-')}`)
                .transition()
                .duration(300)
                .attr('opacity', isVisible ? 1 : 0);
        });
    }
    
    // Event handlers for checkboxes
    function setupCheckboxes() {
        document.getElementById('show-original')?.addEventListener('change', function() {
            if (this.checked) {
                visibleModels.add('Original LeNet');
            } else {
                visibleModels.delete('Original LeNet');
            }
            updateVisualization();
        });
        
        document.getElementById('show-modern')?.addEventListener('change', function() {
            if (this.checked) {
                visibleModels.add('Modern LeNet');
            } else {
                visibleModels.delete('Modern LeNet');
            }
            updateVisualization();
        });
        
        document.getElementById('show-deeper')?.addEventListener('change', function() {
            if (this.checked) {
                visibleModels.add('Deeper LeNet');
            } else {
                visibleModels.delete('Deeper LeNet');
            }
            updateVisualization();
        });
    }
    
    // Initialize when slide is shown
    Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#performance-comparison-svg')) {
            init();
            setupCheckboxes();
        }
    });
    
    // Initial check
    if (document.querySelector('#performance-comparison-svg')) {
        init();
        setupCheckboxes();
    }
})();