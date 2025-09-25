// DenseNet Visualizations
// Interactive demonstrations for DenseNet architecture

// Connection Animation - Shows dense connections vs ResNet connections
function initializeConnectionAnimation(containerId) {
    const container = d3.select(containerId);
    const width = container.node().offsetWidth || 800;
    const height = 300;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Create two side-by-side visualizations
    const resnetGroup = svg.append('g')
        .attr('transform', `translate(${width/4}, ${height/2})`);

    const densenetGroup = svg.append('g')
        .attr('transform', `translate(${width*3/4}, ${height/2})`);

    // Labels
    svg.append('text')
        .attr('x', width/4)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('fill', '#10099F')
        .text('ResNet: Skip Connections');

    svg.append('text')
        .attr('x', width*3/4)
        .attr('y', 30)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .style('fill', '#2DD2C0')
        .text('DenseNet: Dense Connections');

    // ResNet layers
    const resnetLayers = [];
    for (let i = 0; i < 4; i++) {
        const layer = resnetGroup.append('rect')
            .attr('x', -30)
            .attr('y', i * 50 - 100)
            .attr('width', 60)
            .attr('height', 30)
            .attr('fill', '#10099F')
            .attr('opacity', 0.7)
            .attr('rx', 5);
        resnetLayers.push(layer);
    }

    // ResNet connections (skip connections)
    for (let i = 0; i < 3; i++) {
        // Direct connection
        resnetGroup.append('line')
            .attr('x1', 0)
            .attr('y1', i * 50 - 70)
            .attr('x2', 0)
            .attr('y2', (i + 1) * 50 - 100)
            .attr('stroke', '#666')
            .attr('stroke-width', 2);

        // Skip connection
        if (i < 2) {
            resnetGroup.append('path')
                .attr('d', `M 40 ${i * 50 - 85} Q 60 ${(i + 1) * 50 - 85} 40 ${(i + 2) * 50 - 85}`)
                .attr('fill', 'none')
                .attr('stroke', '#FC8484')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5');
        }
    }

    // DenseNet layers
    const densenetLayers = [];
    for (let i = 0; i < 4; i++) {
        const layer = densenetGroup.append('rect')
            .attr('x', -30)
            .attr('y', i * 50 - 100)
            .attr('width', 60)
            .attr('height', 30)
            .attr('fill', '#2DD2C0')
            .attr('opacity', 0.7)
            .attr('rx', 5);
        densenetLayers.push(layer);
    }

    // DenseNet connections (dense connections)
    for (let i = 0; i < 4; i++) {
        for (let j = i + 1; j < 4; j++) {
            const offset = (j - i) * 15;
            densenetGroup.append('path')
                .attr('d', `M ${-40 - offset} ${i * 50 - 85} Q ${-60 - offset} ${(i + j) * 25 - 85} ${-40 - offset} ${j * 50 - 85}`)
                .attr('fill', 'none')
                .attr('stroke', '#FFA05F')
                .attr('stroke-width', 1.5)
                .attr('opacity', 0.6)
                .attr('class', `dense-connection-${i}-${j}`);
        }
    }

    // Animate connections
    function animateConnections() {
        // Animate ResNet
        resnetGroup.selectAll('path')
            .attr('stroke-dashoffset', 100)
            .transition()
            .duration(2000)
            .attr('stroke-dashoffset', 0);

        // Animate DenseNet
        densenetGroup.selectAll('path')
            .each(function(d, i) {
                d3.select(this)
                    .attr('opacity', 0)
                    .transition()
                    .delay(i * 100)
                    .duration(500)
                    .attr('opacity', 0.6);
            });
    }

    // Start animation after a short delay
    setTimeout(animateConnections, 500);
}

// Growth Rate Visualization
function initializeGrowthVisualization(containerId) {
    const container = d3.select(containerId);
    const width = container.node().offsetWidth || 800;
    const height = 250;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const growthRateSlider = document.getElementById('growth-rate-slider');
    const growthRateValue = document.getElementById('growth-rate-value');
    const numLayersSlider = document.getElementById('num-layers-slider');
    const numLayersValue = document.getElementById('num-layers-value');
    const animateButton = document.getElementById('animate-growth');

    let growthRate = 32;
    let numLayers = 4;
    let initialChannels = 64;

    // Update visualization
    function updateVisualization(animate = false) {
        svg.selectAll('*').remove();

        const layerWidth = (width - 100) / (numLayers + 1);
        const maxChannels = initialChannels + growthRate * numLayers;
        const scaleFactor = 150 / maxChannels;

        // Draw layers
        for (let i = 0; i <= numLayers; i++) {
            const channels = initialChannels + growthRate * i;
            const height = channels * scaleFactor;
            const x = 50 + i * layerWidth;
            const y = 125 - height / 2;

            const rect = svg.append('rect')
                .attr('x', x - 25)
                .attr('y', y)
                .attr('width', 50)
                .attr('height', height)
                .attr('fill', i === 0 ? '#10099F' : '#2DD2C0')
                .attr('opacity', 0.7)
                .attr('rx', 5);

            if (animate) {
                rect.attr('height', 0)
                    .attr('y', 125)
                    .transition()
                    .delay(i * 200)
                    .duration(500)
                    .attr('height', height)
                    .attr('y', y);
            }

            // Channel count label
            const text = svg.append('text')
                .attr('x', x)
                .attr('y', y - 10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(`${channels}ch`);

            if (animate) {
                text.attr('opacity', 0)
                    .transition()
                    .delay(i * 200 + 300)
                    .duration(300)
                    .attr('opacity', 1);
            }

            // Layer label
            svg.append('text')
                .attr('x', x)
                .attr('y', 220)
                .attr('text-anchor', 'middle')
                .style('font-size', '11px')
                .text(i === 0 ? 'Input' : `Layer ${i}`);

            // Draw connections
            if (i > 0) {
                // Draw connections from all previous layers
                for (let j = 0; j < i; j++) {
                    const prevX = 50 + j * layerWidth;
                    const prevChannels = initialChannels + growthRate * j;
                    const prevHeight = prevChannels * scaleFactor;
                    const prevY = 125 - prevHeight / 2;

                    const path = svg.append('path')
                        .attr('d', `M ${prevX + 25} ${prevY + prevHeight/2}
                                   Q ${(prevX + x) / 2} ${125 + (i - j) * 10}
                                   ${x - 25} ${y + height/2}`)
                        .attr('fill', 'none')
                        .attr('stroke', '#FFA05F')
                        .attr('stroke-width', 1.5)
                        .attr('opacity', 0.3);

                    if (animate) {
                        const pathLength = path.node().getTotalLength();
                        path.attr('stroke-dasharray', pathLength)
                            .attr('stroke-dashoffset', pathLength)
                            .transition()
                            .delay(i * 200 + 100)
                            .duration(500)
                            .attr('stroke-dashoffset', 0);
                    }
                }
            }
        }

        // Add growth rate indicator
        if (numLayers > 0) {
            const arrowY = 30;
            svg.append('line')
                .attr('x1', 50 + layerWidth - 25)
                .attr('y1', arrowY)
                .attr('x2', 50 + layerWidth + 25)
                .attr('y2', arrowY)
                .attr('stroke', '#FC8484')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrowhead)');

            svg.append('text')
                .attr('x', 50 + layerWidth)
                .attr('y', arrowY - 5)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('fill', '#FC8484')
                .text(`+${growthRate} channels`);
        }

        // Define arrowhead marker
        svg.append('defs').append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M 0,-5 L 10,0 L 0,5')
            .attr('fill', '#FC8484');
    }

    // Event listeners
    growthRateSlider.addEventListener('input', (e) => {
        growthRate = parseInt(e.target.value);
        growthRateValue.textContent = growthRate;
        updateVisualization(false);
    });

    numLayersSlider.addEventListener('input', (e) => {
        numLayers = parseInt(e.target.value);
        numLayersValue.textContent = numLayers;
        updateVisualization(false);
    });

    animateButton.addEventListener('click', () => {
        updateVisualization(true);
    });

    // Initial render
    updateVisualization(false);
}

// Transition Layer Demo
function initializeTransitionDemo(containerId) {
    const container = d3.select(containerId);
    const width = container.node().offsetWidth || 800;
    const height = 200;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Input dimensions
    const inputChannels = 256;
    const inputSize = 14;

    // Output dimensions
    const outputChannels = 128;
    const outputSize = 7;

    // Positions
    const inputX = width * 0.2;
    const transitionX = width * 0.5;
    const outputX = width * 0.8;
    const y = height / 2;

    // Draw input block
    const inputBlock = svg.append('g')
        .attr('transform', `translate(${inputX}, ${y})`);

    inputBlock.append('rect')
        .attr('x', -40)
        .attr('y', -60)
        .attr('width', 80)
        .attr('height', 120)
        .attr('fill', '#2DD2C0')
        .attr('opacity', 0.7)
        .attr('rx', 5);

    inputBlock.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -70)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('Input');

    inputBlock.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 0)
        .style('font-size', '11px')
        .text(`${inputChannels} channels`);

    inputBlock.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 15)
        .style('font-size', '11px')
        .text(`${inputSize}×${inputSize}`);

    // Draw transition layer components
    const transitionGroup = svg.append('g')
        .attr('transform', `translate(${transitionX}, ${y})`);

    // 1x1 conv
    const conv1x1 = transitionGroup.append('g')
        .attr('transform', 'translate(0, -30)');

    conv1x1.append('rect')
        .attr('x', -50)
        .attr('y', -15)
        .attr('width', 100)
        .attr('height', 30)
        .attr('fill', '#FFA05F')
        .attr('opacity', 0.7)
        .attr('rx', 5);

    conv1x1.append('text')
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .text('1×1 Conv');

    // Average pooling
    const avgPool = transitionGroup.append('g')
        .attr('transform', 'translate(0, 30)');

    avgPool.append('rect')
        .attr('x', -50)
        .attr('y', -15)
        .attr('width', 100)
        .attr('height', 30)
        .attr('fill', '#FC8484')
        .attr('opacity', 0.7)
        .attr('rx', 5);

    avgPool.append('text')
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('fill', 'white')
        .style('font-weight', 'bold')
        .text('AvgPool 2×2');

    // Draw output block
    const outputBlock = svg.append('g')
        .attr('transform', `translate(${outputX}, ${y})`);

    outputBlock.append('rect')
        .attr('x', -30)
        .attr('y', -40)
        .attr('width', 60)
        .attr('height', 80)
        .attr('fill', '#2DD2C0')
        .attr('opacity', 0.7)
        .attr('rx', 5);

    outputBlock.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -50)
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .text('Output');

    outputBlock.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 0)
        .style('font-size', '11px')
        .text(`${outputChannels} channels`);

    outputBlock.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 15)
        .style('font-size', '11px')
        .text(`${outputSize}×${outputSize}`);

    // Draw arrows
    svg.append('line')
        .attr('x1', inputX + 40)
        .attr('y1', y)
        .attr('x2', transitionX - 60)
        .attr('y2', y)
        .attr('stroke', '#666')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)');

    svg.append('line')
        .attr('x1', transitionX + 60)
        .attr('y1', y)
        .attr('x2', outputX - 30)
        .attr('y2', y)
        .attr('stroke', '#666')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrow)');

    // Define arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 8)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', '#666');

    // Animate data flow
    function animateFlow() {
        // Create particles
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = svg.append('circle')
                    .attr('cx', inputX + 40)
                    .attr('cy', y)
                    .attr('r', 4)
                    .attr('fill', '#10099F');

                particle.transition()
                    .duration(1000)
                    .attr('cx', transitionX - 60)
                    .transition()
                    .duration(500)
                    .attr('r', 3)
                    .attr('fill', '#FFA05F')
                    .transition()
                    .duration(1000)
                    .attr('cx', outputX - 30)
                    .attr('r', 2)
                    .remove();
            }, i * 500);
        }
    }

    // Start animation on load
    setTimeout(animateFlow, 1000);
    // Repeat animation
    setInterval(animateFlow, 4000);
}

// Initialize all visualizations when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Connection animation
    const connectionContainer = document.getElementById('connection-animation');
    if (connectionContainer) {
        initializeConnectionAnimation('#connection-animation');
    }

    // Growth visualization
    const growthContainer = document.getElementById('growth-visualization');
    if (growthContainer) {
        initializeGrowthVisualization('#growth-visualization');
    }

    // Transition demo
    const transitionContainer = document.getElementById('transition-demo');
    if (transitionContainer) {
        initializeTransitionDemo('#transition-demo');
    }
});

// Also initialize when Reveal.js changes slides
if (typeof Reveal !== 'undefined') {
    Reveal.on('slidechanged', event => {
        // Reinitialize visualizations on slide change
        const currentSlide = event.currentSlide;

        if (currentSlide.querySelector('#connection-animation')) {
            const container = currentSlide.querySelector('#connection-animation');
            container.innerHTML = '';
            initializeConnectionAnimation('#connection-animation');
        }

        if (currentSlide.querySelector('#growth-visualization')) {
            const container = currentSlide.querySelector('#growth-visualization');
            container.innerHTML = '';
            initializeGrowthVisualization('#growth-visualization');
        }

        if (currentSlide.querySelector('#transition-demo')) {
            const container = currentSlide.querySelector('#transition-demo');
            container.innerHTML = '';
            initializeTransitionDemo('#transition-demo');
        }
    });
}