// ResNet Visualizations
// Interactive demonstrations for ResNet and ResNeXt architectures

// Function Classes Visualization
function initializeFunctionClassesVisualization(containerId) {
    const container = d3.select(containerId);
    const width = container.node().offsetWidth || 800;
    const height = 400;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const classes = [
        { name: 'F₁', radius: 60, color: '#EEEEEE', description: 'Linear functions' },
        { name: 'F₂', radius: 100, color: '#D0D0D0', description: 'Shallow networks' },
        { name: 'F₃', radius: 140, color: '#B0B0B0', description: 'Deep networks' },
        { name: 'F₄', radius: 180, color: '#909090', description: 'Deeper networks' },
        { name: 'F*', radius: 200, color: '#10099F', description: 'Target function', isTarget: true }
    ];

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw nested circles
    const circles = svg.selectAll('circle')
        .data(classes.slice().reverse())
        .enter()
        .append('circle')
        .attr('cx', centerX)
        .attr('cy', centerY)
        .attr('r', d => d.radius)
        .attr('fill', d => d.isTarget ? 'none' : d.color)
        .attr('stroke', d => d.isTarget ? d.color : 'none')
        .attr('stroke-width', d => d.isTarget ? 3 : 0)
        .attr('stroke-dasharray', d => d.isTarget ? '5,5' : '0')
        .attr('opacity', 0.7);

    // Add labels
    const labels = svg.selectAll('.class-label')
        .data(classes)
        .enter()
        .append('g')
        .attr('class', 'class-label');

    labels.append('text')
        .attr('x', centerX)
        .attr('y', d => centerY - d.radius + 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#262626')
        .text(d => d.name);

    labels.append('text')
        .attr('x', centerX)
        .attr('y', d => centerY + d.radius - 5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#666')
        .text(d => d.description);

    // Add star for optimal solution
    const star = d3.symbol().type(d3.symbolStar).size(200);
    svg.append('path')
        .attr('d', star)
        .attr('transform', `translate(${centerX + 120}, ${centerY - 50})`)
        .attr('fill', '#FFA05F')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 2);

    svg.append('text')
        .attr('x', centerX + 120)
        .attr('y', centerY - 75)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#262626')
        .text('f*');

    // Add containment arrow
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 9)
        .attr('refY', 3.5)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3.5, 0 7')
        .attr('fill', '#10099F');

    svg.append('text')
        .attr('x', centerX)
        .attr('y', height - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('fill', '#262626')
        .text('F₁ ⊆ F₂ ⊆ F₃ ⊆ F₄ (Nested Function Classes)');
}

// Residual Block Visualization
function initializeResidualBlockVisualization(containerId) {
    const container = d3.select(containerId);
    const width = container.node().offsetWidth || 800;
    const height = 500;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    let isAnimating = false;
    let animationId = null;

    // Block components
    const blockWidth = 100;
    const blockHeight = 40;
    const startX = 100;
    const centerY = height / 2;

    // Main path
    const mainPath = [
        { x: startX, y: centerY, label: 'Input\nx' },
        { x: startX + 150, y: centerY, label: 'Conv\n3×3' },
        { x: startX + 250, y: centerY, label: 'BatchNorm' },
        { x: startX + 350, y: centerY, label: 'ReLU' },
        { x: startX + 450, y: centerY, label: 'Conv\n3×3' },
        { x: startX + 550, y: centerY, label: 'BatchNorm' },
        { x: startX + 650, y: centerY, label: 'Add' },
        { x: startX + 750, y: centerY, label: 'ReLU' },
        { x: startX + 850, y: centerY, label: 'Output' }
    ];

    // Draw main path blocks
    const blocks = svg.selectAll('.block')
        .data(mainPath.slice(1, -1))
        .enter()
        .append('g')
        .attr('class', 'block');

    blocks.append('rect')
        .attr('x', d => d.x - blockWidth/2)
        .attr('y', d => d.y - blockHeight/2)
        .attr('width', blockWidth)
        .attr('height', blockHeight)
        .attr('fill', (d, i) => {
            if (i < 2) return '#10099F';
            if (i === 2) return '#2DD2C0';
            if (i < 5) return '#10099F';
            if (i === 5) return '#FFA05F';
            return '#2DD2C0';
        })
        .attr('stroke', '#262626')
        .attr('stroke-width', 1)
        .attr('rx', 5);

    blocks.append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '11px')
        .attr('fill', 'white')
        .selectAll('tspan')
        .data(d => d.label.split('\n'))
        .enter()
        .append('tspan')
        .attr('x', d => mainPath[mainPath.findIndex(p => p.label === d3.select(this.parentNode).datum())].x)
        .attr('dy', (d, i) => i === 0 ? '-0.3em' : '0.7em')
        .text(d => d);

    // Draw connections
    const connections = svg.append('g').attr('class', 'connections');

    for (let i = 0; i < mainPath.length - 1; i++) {
        connections.append('line')
            .attr('x1', mainPath[i].x + (i > 0 ? blockWidth/2 : 0))
            .attr('y1', mainPath[i].y)
            .attr('x2', mainPath[i+1].x - (i < mainPath.length - 2 ? blockWidth/2 : 0))
            .attr('y2', mainPath[i+1].y)
            .attr('stroke', '#666')
            .attr('stroke-width', 2)
            .attr('marker-end', 'url(#arrowhead-res)');
    }

    // Draw skip connection
    const skipConnection = svg.append('path')
        .attr('d', `M ${startX} ${centerY - 80}
                     Q ${startX + 350} ${centerY - 120}
                     ${startX + 650} ${centerY - 40}`)
        .attr('fill', 'none')
        .attr('stroke', '#FC8484')
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', '5,5');

    // Add arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead-res')
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 9)
        .attr('refY', 3.5)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3.5, 0 7')
        .attr('fill', '#666');

    // Skip connection label
    svg.append('text')
        .attr('x', startX + 350)
        .attr('y', centerY - 130)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#FC8484')
        .text('Skip Connection (Identity)');

    // Input/Output labels
    svg.append('text')
        .attr('x', startX)
        .attr('y', centerY + 50)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#262626')
        .text('x');

    svg.append('text')
        .attr('x', startX + 850)
        .attr('y', centerY + 50)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#262626')
        .text('F(x) + x');

    // Animation particles
    function animateFlow() {
        if (!isAnimating) return;

        // Main path particle
        const mainParticle = svg.append('circle')
            .attr('r', 5)
            .attr('fill', '#10099F')
            .attr('cx', startX)
            .attr('cy', centerY);

        mainParticle.transition()
            .duration(3000)
            .ease(d3.easeLinear)
            .attrTween('cx', function() {
                return function(t) {
                    const idx = Math.floor(t * (mainPath.length - 1));
                    return mainPath[idx].x;
                };
            })
            .on('end', function() { d3.select(this).remove(); });

        // Skip connection particle
        const skipParticle = svg.append('circle')
            .attr('r', 5)
            .attr('fill', '#FC8484')
            .attr('cx', startX)
            .attr('cy', centerY);

        skipParticle.transition()
            .duration(3000)
            .ease(d3.easeLinear)
            .attrTween('transform', function() {
                return function(t) {
                    const x = startX + t * 550;
                    const y = centerY - 80 + 40 * Math.sin(t * Math.PI);
                    return `translate(${x - startX}, ${y - centerY})`;
                };
            })
            .on('end', function() {
                d3.select(this).remove();
                if (isAnimating) {
                    animationId = setTimeout(animateFlow, 500);
                }
            });
    }

    // Control button
    const controlButton = container.append('button')
        .style('margin-top', '20px')
        .style('padding', '10px 20px')
        .style('background', '#10099F')
        .style('color', 'white')
        .style('border', 'none')
        .style('border-radius', '5px')
        .style('cursor', 'pointer')
        .text('Start Animation')
        .on('click', function() {
            isAnimating = !isAnimating;
            d3.select(this).text(isAnimating ? 'Stop Animation' : 'Start Animation');
            if (isAnimating) {
                animateFlow();
            } else {
                if (animationId) {
                    clearTimeout(animationId);
                }
            }
        });
}

// ResNet Architecture Builder
function initializeResNetArchitectureVisualization(containerId) {
    const container = d3.select(containerId);
    const width = container.node().offsetWidth || 900;
    const height = 600;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // ResNet-18 architecture
    const layers = [
        { name: 'Input', channels: 3, size: '224×224', color: '#10099F', x: 50 },
        { name: 'Conv 7×7', channels: 64, size: '112×112', color: '#2DD2C0', x: 150 },
        { name: 'MaxPool', channels: 64, size: '56×56', color: '#FAC55B', x: 250 },
        { name: 'Block 1', channels: 64, size: '56×56', color: '#10099F', x: 350, residual: true },
        { name: 'Block 2', channels: 128, size: '28×28', color: '#10099F', x: 450, residual: true },
        { name: 'Block 3', channels: 256, size: '14×14', color: '#10099F', x: 550, residual: true },
        { name: 'Block 4', channels: 512, size: '7×7', color: '#10099F', x: 650, residual: true },
        { name: 'AvgPool', channels: 512, size: '1×1', color: '#FAC55B', x: 750 },
        { name: 'FC', channels: 1000, size: 'output', color: '#FC8484', x: 850 }
    ];

    const blockHeight = 60;
    const maxChannels = 512;

    // Draw layers
    layers.forEach((layer, i) => {
        const blockWidth = 30 + (layer.channels / maxChannels) * 70;
        const y = height / 2 - (layer.channels / maxChannels) * 150;

        // Draw block
        svg.append('rect')
            .attr('x', layer.x - blockWidth/2)
            .attr('y', y)
            .attr('width', blockWidth)
            .attr('height', (layer.channels / maxChannels) * 300)
            .attr('fill', layer.color)
            .attr('opacity', 0.7)
            .attr('stroke', '#262626')
            .attr('stroke-width', 1)
            .attr('rx', 5);

        // Draw residual connections
        if (layer.residual) {
            svg.append('path')
                .attr('d', `M ${layer.x - blockWidth/2 - 30} ${height/2}
                           Q ${layer.x} ${y - 30}
                           ${layer.x + blockWidth/2 + 30} ${height/2}`)
                .attr('fill', 'none')
                .attr('stroke', '#FC8484')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '3,3')
                .attr('opacity', 0.7);
        }

        // Add labels
        svg.append('text')
            .attr('x', layer.x)
            .attr('y', y - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .attr('fill', '#262626')
            .text(layer.name);

        svg.append('text')
            .attr('x', layer.x)
            .attr('y', y + (layer.channels / maxChannels) * 300 + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#666')
            .text(`${layer.channels}ch`);

        svg.append('text')
            .attr('x', layer.x)
            .attr('y', y + (layer.channels / maxChannels) * 300 + 35)
            .attr('text-anchor', 'middle')
            .attr('font-size', '9px')
            .attr('fill', '#999')
            .text(layer.size);

        // Draw connections
        if (i < layers.length - 1) {
            svg.append('line')
                .attr('x1', layer.x + blockWidth/2)
                .attr('y1', height/2)
                .attr('x2', layers[i+1].x - 30)
                .attr('y2', height/2)
                .attr('stroke', '#666')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrowhead-arch)');
        }
    });

    // Arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead-arch')
        .attr('markerWidth', 10)
        .attr('markerHeight', 7)
        .attr('refX', 9)
        .attr('refY', 3.5)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 10 3.5, 0 7')
        .attr('fill', '#666');

    // Title
    svg.append('text')
        .attr('x', width/2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', '#262626')
        .text('ResNet-18 Architecture');
}

// ResNeXt Grouped Convolution Visualization
function initializeResNeXtVisualization(containerId) {
    const container = d3.select(containerId);
    const width = container.node().offsetWidth || 800;
    const height = 500;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Control panel
    const controls = container.append('div')
        .style('margin-top', '20px')
        .style('text-align', 'center');

    controls.append('label')
        .style('margin-right', '10px')
        .text('Groups: ');

    const groupSlider = controls.append('input')
        .attr('type', 'range')
        .attr('min', 1)
        .attr('max', 32)
        .attr('value', 32)
        .style('width', '200px')
        .style('margin-right', '10px');

    const groupValue = controls.append('span')
        .text('32')
        .style('font-weight', 'bold')
        .style('margin-right', '20px');

    controls.append('label')
        .style('margin-right', '10px')
        .text('Cardinality: ');

    const cardinalityValue = controls.append('span')
        .text('32')
        .style('font-weight', 'bold');

    function drawGroupedConvolution(groups) {
        svg.selectAll('*').remove();

        const inputChannels = 256;
        const outputChannels = 256;
        const channelsPerGroup = inputChannels / groups;

        const startX = 100;
        const endX = width - 100;
        const centerY = height / 2;
        const maxHeight = 300;

        // Draw input
        svg.append('rect')
            .attr('x', startX - 40)
            .attr('y', centerY - maxHeight/2)
            .attr('width', 40)
            .attr('height', maxHeight)
            .attr('fill', '#10099F')
            .attr('opacity', 0.7);

        svg.append('text')
            .attr('x', startX - 20)
            .attr('y', centerY - maxHeight/2 - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#262626')
            .text(`Input: ${inputChannels}ch`);

        // Draw groups
        const groupWidth = (endX - startX - 200) / groups;
        const groupPadding = 2;

        for (let g = 0; g < groups; g++) {
            const groupX = startX + 50 + g * groupWidth;
            const groupHeight = maxHeight / groups;
            const groupY = centerY - maxHeight/2 + g * groupHeight;

            // Group block
            svg.append('rect')
                .attr('x', groupX)
                .attr('y', groupY)
                .attr('width', Math.max(groupWidth - groupPadding, 3))
                .attr('height', groupHeight - groupPadding)
                .attr('fill', d3.interpolateViridis(g / groups))
                .attr('opacity', 0.7)
                .attr('stroke', '#262626')
                .attr('stroke-width', 0.5);

            // Connection lines
            svg.append('line')
                .attr('x1', startX)
                .attr('y1', centerY - maxHeight/2 + (g + 0.5) * groupHeight)
                .attr('x2', groupX)
                .attr('y2', groupY + groupHeight/2)
                .attr('stroke', '#666')
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.5);

            svg.append('line')
                .attr('x1', groupX + Math.max(groupWidth - groupPadding, 3))
                .attr('y1', groupY + groupHeight/2)
                .attr('x2', endX - 40)
                .attr('y2', centerY - maxHeight/2 + (g + 0.5) * groupHeight)
                .attr('stroke', '#666')
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.5);
        }

        // Draw output
        svg.append('rect')
            .attr('x', endX - 40)
            .attr('y', centerY - maxHeight/2)
            .attr('width', 40)
            .attr('height', maxHeight)
            .attr('fill', '#FC8484')
            .attr('opacity', 0.7);

        svg.append('text')
            .attr('x', endX - 20)
            .attr('y', centerY - maxHeight/2 - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#262626')
            .text(`Output: ${outputChannels}ch`);

        // Complexity text
        const complexity = `O(${inputChannels} × ${outputChannels} / ${groups}) = O(${(inputChannels * outputChannels / groups).toLocaleString()})`;

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', '#262626')
            .text(complexity);

        // Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .attr('fill', '#262626')
            .text(`Grouped Convolution (${groups} groups)`);
    }

    // Initial draw
    drawGroupedConvolution(32);

    // Update on slider change
    groupSlider.on('input', function() {
        const groups = +this.value;
        groupValue.text(groups);
        cardinalityValue.text(groups);
        drawGroupedConvolution(groups);
    });
}

// Gradient Flow Comparison
function initializeGradientFlowComparison(containerId) {
    const container = d3.select(containerId);
    const width = container.node().offsetWidth || 800;
    const height = 400;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Split view
    const plainWidth = width / 2 - 20;
    const residualWidth = width / 2 - 20;

    // Plain network gradient flow
    const plainGroup = svg.append('g')
        .attr('transform', 'translate(0, 0)');

    plainGroup.append('text')
        .attr('x', plainWidth / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('fill', '#262626')
        .text('Plain Network');

    // Draw plain network layers
    const plainLayers = 10;
    for (let i = 0; i < plainLayers; i++) {
        const opacity = Math.exp(-i * 0.3);
        const y = 60 + i * 30;

        plainGroup.append('rect')
            .attr('x', 50)
            .attr('y', y)
            .attr('width', plainWidth - 100)
            .attr('height', 20)
            .attr('fill', '#10099F')
            .attr('opacity', opacity);

        plainGroup.append('text')
            .attr('x', 30)
            .attr('y', y + 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#666')
            .text(`L${i+1}`);

        if (i > 0) {
            plainGroup.append('line')
                .attr('x1', plainWidth / 2)
                .attr('y1', y - 10)
                .attr('x2', plainWidth / 2)
                .attr('y2', y)
                .attr('stroke', '#FC8484')
                .attr('stroke-width', 2 * opacity)
                .attr('marker-end', 'url(#gradient-arrow)');
        }
    }

    plainGroup.append('text')
        .attr('x', plainWidth / 2)
        .attr('y', height - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#FC8484')
        .text('Gradient Vanishing →');

    // Residual network gradient flow
    const residualGroup = svg.append('g')
        .attr('transform', `translate(${width/2 + 20}, 0)`);

    residualGroup.append('text')
        .attr('x', residualWidth / 2)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('fill', '#262626')
        .text('ResNet');

    // Draw residual network layers
    for (let i = 0; i < plainLayers; i++) {
        const y = 60 + i * 30;

        residualGroup.append('rect')
            .attr('x', 50)
            .attr('y', y)
            .attr('width', residualWidth - 100)
            .attr('height', 20)
            .attr('fill', '#10099F')
            .attr('opacity', 0.8);

        residualGroup.append('text')
            .attr('x', 30)
            .attr('y', y + 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#666')
            .text(`L${i+1}`);

        // Main gradient path
        if (i > 0) {
            residualGroup.append('line')
                .attr('x1', residualWidth / 2 - 20)
                .attr('y1', y - 10)
                .attr('x2', residualWidth / 2 - 20)
                .attr('y2', y)
                .attr('stroke', '#FC8484')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#gradient-arrow)');
        }

        // Skip connection gradient
        if (i > 0 && i % 2 === 0) {
            residualGroup.append('path')
                .attr('d', `M ${residualWidth / 2 + 20} ${y - 70}
                           Q ${residualWidth - 50} ${y - 35}
                           ${residualWidth / 2 + 20} ${y}`)
                .attr('fill', 'none')
                .attr('stroke', '#2DD2C0')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '3,3')
                .attr('marker-end', 'url(#gradient-arrow-green)');
        }
    }

    residualGroup.append('text')
        .attr('x', residualWidth / 2)
        .attr('y', height - 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('fill', '#2DD2C0')
        .text('Gradient Preserved ✓');

    // Arrow markers
    svg.append('defs').append('marker')
        .attr('id', 'gradient-arrow')
        .attr('markerWidth', 8)
        .attr('markerHeight', 6)
        .attr('refX', 7)
        .attr('refY', 3)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 8 3, 0 6')
        .attr('fill', '#FC8484');

    svg.append('defs').append('marker')
        .attr('id', 'gradient-arrow-green')
        .attr('markerWidth', 8)
        .attr('markerHeight', 6)
        .attr('refX', 7)
        .attr('refY', 3)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 8 3, 0 6')
        .attr('fill', '#2DD2C0');
}

// Initialize visualizations when reveal.js is ready
if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
        // Initialize visualizations based on slide content
        if (event.currentSlide.querySelector('#function-classes-viz')) {
            initializeFunctionClassesVisualization('#function-classes-viz');
        }
        if (event.currentSlide.querySelector('#residual-block-viz')) {
            initializeResidualBlockVisualization('#residual-block-viz');
        }
        if (event.currentSlide.querySelector('#resnet-architecture-viz')) {
            initializeResNetArchitectureVisualization('#resnet-architecture-viz');
        }
        if (event.currentSlide.querySelector('#resnext-viz')) {
            initializeResNeXtVisualization('#resnext-viz');
        }
        if (event.currentSlide.querySelector('#gradient-flow-viz')) {
            initializeGradientFlowComparison('#gradient-flow-viz');
        }
    });
}