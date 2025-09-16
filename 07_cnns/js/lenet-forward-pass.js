// LeNet Forward Pass Visualization
(function() {
    const svg = d3.select('#lenet-forward-svg');
    const width = 800;
    const height = 400;
    
    // Network structure
    const network = {
        layers: [
            { name: 'Input', x: 50, neurons: 3, color: '#F5F5F5', shape: '1×28×28' },
            { name: 'Conv1', x: 150, neurons: 4, color: '#10099F', shape: '6×28×28' },
            { name: 'Pool1', x: 250, neurons: 4, color: '#2DD2C0', shape: '6×14×14' },
            { name: 'Conv2', x: 350, neurons: 5, color: '#10099F', shape: '16×10×10' },
            { name: 'Pool2', x: 450, neurons: 5, color: '#2DD2C0', shape: '16×5×5' },
            { name: 'FC1', x: 550, neurons: 4, color: '#FC8484', shape: '120' },
            { name: 'FC2', x: 650, neurons: 3, color: '#FC8484', shape: '84' },
            { name: 'Output', x: 750, neurons: 2, color: '#FFA05F', shape: '10' }
        ]
    };
    
    let currentStep = -1;
    let animationTimer = null;
    let particles = [];
    
    function init() {
        svg.selectAll('*').remove();
        
        // Create gradient
        const defs = svg.append('defs');
        const gradient = defs.append('linearGradient')
            .attr('id', 'flow-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#10099F')
            .attr('stop-opacity', 0.8);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#FFA05F')
            .attr('stop-opacity', 0.8);
        
        drawNetwork();
        reset();
    }
    
    function drawNetwork() {
        // Draw connections
        const connections = svg.append('g').attr('class', 'connections');
        
        for (let i = 0; i < network.layers.length - 1; i++) {
            const layer1 = network.layers[i];
            const layer2 = network.layers[i + 1];
            
            for (let j = 0; j < layer1.neurons; j++) {
                for (let k = 0; k < layer2.neurons; k++) {
                    const y1 = getY(j, layer1.neurons);
                    const y2 = getY(k, layer2.neurons);
                    
                    connections.append('line')
                        .attr('class', `connection connection-${i}`)
                        .attr('x1', layer1.x)
                        .attr('y1', y1)
                        .attr('x2', layer2.x)
                        .attr('y2', y2)
                        .attr('stroke', '#ddd')
                        .attr('stroke-width', 0.5)
                        .attr('opacity', 0.3);
                }
            }
        }
        
        // Draw layers
        const layerGroups = svg.selectAll('.layer-group')
            .data(network.layers)
            .enter()
            .append('g')
            .attr('class', 'layer-group');
        
        // Draw neurons
        network.layers.forEach((layer, layerIdx) => {
            const g = svg.append('g').attr('class', `layer-${layerIdx}`);
            
            // Draw layer box
            const layerHeight = layer.neurons * 40 + 20;
            g.append('rect')
                .attr('class', `layer-box layer-box-${layerIdx}`)
                .attr('x', layer.x - 25)
                .attr('y', height / 2 - layerHeight / 2)
                .attr('width', 50)
                .attr('height', layerHeight)
                .attr('fill', layer.color)
                .attr('stroke', '#262626')
                .attr('stroke-width', 2)
                .attr('rx', 5)
                .attr('opacity', 0.2);
            
            // Draw neurons
            for (let i = 0; i < layer.neurons; i++) {
                const y = getY(i, layer.neurons);
                
                g.append('circle')
                    .attr('class', `neuron neuron-${layerIdx}-${i}`)
                    .attr('cx', layer.x)
                    .attr('cy', y)
                    .attr('r', 12)
                    .attr('fill', layer.color)
                    .attr('stroke', '#262626')
                    .attr('stroke-width', 2)
                    .attr('opacity', 0.7);
            }
            
            // Layer label
            g.append('text')
                .attr('x', layer.x)
                .attr('y', height - 50)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 'bold')
                .attr('font-size', '12px')
                .attr('fill', '#262626')
                .text(layer.name);
            
            // Shape info
            g.append('text')
                .attr('x', layer.x)
                .attr('y', height - 30)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px')
                .attr('fill', '#666')
                .text(layer.shape);
        });
        
        // Particle container
        svg.append('g').attr('class', 'particles');
    }
    
    function getY(index, total) {
        const spacing = 40;
        const totalHeight = total * spacing;
        const startY = height / 2 - totalHeight / 2 + spacing / 2;
        return startY + index * spacing;
    }
    
    function stepForward() {
        if (currentStep >= network.layers.length - 1) {
            return;
        }
        
        currentStep++;
        updateDisplay();
        
        if (currentStep < network.layers.length) {
            animateActivation(currentStep);
        }
    }
    
    function animateActivation(layerIdx) {
        const layer = network.layers[layerIdx];
        
        // Highlight layer
        svg.selectAll('.layer-box')
            .transition()
            .duration(300)
            .attr('opacity', (d, i) => i === layerIdx ? 0.8 : 0.2);
        
        // Animate neurons
        svg.selectAll(`.neuron-${layerIdx}-${Array.from({length: layer.neurons}, (_, i) => i).join(', .neuron-' + layerIdx + '-')}`)
            .transition()
            .duration(200)
            .attr('r', 18)
            .attr('opacity', 1)
            .transition()
            .duration(200)
            .attr('r', 12)
            .attr('opacity', 0.7);
        
        // Animate connections
        if (layerIdx > 0) {
            svg.selectAll(`.connection-${layerIdx - 1}`)
                .transition()
                .duration(500)
                .attr('stroke', 'url(#flow-gradient)')
                .attr('stroke-width', 2)
                .attr('opacity', 0.8)
                .transition()
                .delay(500)
                .duration(500)
                .attr('stroke', '#ddd')
                .attr('stroke-width', 0.5)
                .attr('opacity', 0.3);
            
            // Create particles
            if (layerIdx < network.layers.length) {
                createParticles(layerIdx - 1);
            }
        }
    }
    
    function createParticles(connectionIdx) {
        const layer1 = network.layers[connectionIdx];
        const layer2 = network.layers[connectionIdx + 1];
        
        const particleGroup = svg.select('.particles');
        
        for (let i = 0; i < layer1.neurons; i++) {
            for (let j = 0; j < Math.min(layer2.neurons, 2); j++) {
                const y1 = getY(i, layer1.neurons);
                const y2 = getY(j, layer2.neurons);
                
                const particle = particleGroup.append('circle')
                    .attr('cx', layer1.x)
                    .attr('cy', y1)
                    .attr('r', 4)
                    .attr('fill', '#FFA05F')
                    .attr('opacity', 0.8);
                
                particle.transition()
                    .duration(1000)
                    .ease(d3.easeQuadInOut)
                    .attr('cx', layer2.x)
                    .attr('cy', y2)
                    .transition()
                    .duration(200)
                    .attr('opacity', 0)
                    .remove();
            }
        }
    }
    
    function reset() {
        currentStep = -1;
        
        // Clear particles
        svg.selectAll('.particles *').remove();
        
        // Reset layers
        svg.selectAll('.layer-box')
            .attr('opacity', 0.2);
        
        svg.selectAll('.neuron')
            .attr('r', 12)
            .attr('opacity', 0.7);
        
        svg.selectAll('.connection')
            .attr('stroke', '#ddd')
            .attr('stroke-width', 0.5)
            .attr('opacity', 0.3);
        
        updateDisplay();
    }
    
    function updateDisplay() {
        const layerName = currentStep >= 0 && currentStep < network.layers.length 
            ? `Processing: ${network.layers[currentStep].name}` 
            : 'Ready';
        document.getElementById('lenet-current-layer').textContent = layerName;
    }
    
    // Event handlers
    document.getElementById('lenet-forward-step').addEventListener('click', stepForward);
    document.getElementById('lenet-forward-reset').addEventListener('click', reset);
    
    // Initialize when slide is shown
    Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#lenet-forward-svg')) {
            init();
        }
    });
    
    // Initial check
    if (document.querySelector('#lenet-forward-svg')) {
        init();
    }
})();