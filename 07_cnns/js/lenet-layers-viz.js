// LeNet Layer-by-Layer Visualization
(function() {
    const svg = d3.select('#lenet-layers-svg');
    const width = 800;
    const height = 450;
    
    // Layer definitions
    const layers = [
        {
            name: 'Input',
            type: 'input',
            shape: [1, 28, 28],
            description: 'Grayscale image',
            color: '#F5F5F5',
            params: 0
        },
        {
            name: 'Conv1',
            type: 'conv',
            shape: [6, 28, 28],
            description: '6 filters, 5×5 kernel, padding=2',
            color: '#10099F',
            params: 156
        },
        {
            name: 'Pool1',
            type: 'pool',
            shape: [6, 14, 14],
            description: 'Average pooling 2×2, stride=2',
            color: '#2DD2C0',
            params: 0
        },
        {
            name: 'Conv2',
            type: 'conv',
            shape: [16, 10, 10],
            description: '16 filters, 5×5 kernel',
            color: '#10099F',
            params: 2416
        },
        {
            name: 'Pool2',
            type: 'pool',
            shape: [16, 5, 5],
            description: 'Average pooling 2×2, stride=2',
            color: '#2DD2C0',
            params: 0
        },
        {
            name: 'Flatten',
            type: 'reshape',
            shape: [400],
            description: 'Reshape to 1D vector',
            color: '#FAC55B',
            params: 0
        },
        {
            name: 'FC1',
            type: 'dense',
            shape: [120],
            description: 'Fully connected, sigmoid',
            color: '#FC8484',
            params: 48120
        },
        {
            name: 'FC2',
            type: 'dense',
            shape: [84],
            description: 'Fully connected, sigmoid',
            color: '#FC8484',
            params: 10164
        },
        {
            name: 'Output',
            type: 'output',
            shape: [10],
            description: 'Class probabilities',
            color: '#FFA05F',
            params: 850
        }
    ];
    
    let currentLayer = 0;
    
    // Initialize visualization
    function init() {
        // Clear SVG
        svg.selectAll('*').remove();
        
        // Create gradient definitions
        const defs = svg.append('defs');
        
        // Create gradient for connections
        const gradient = defs.append('linearGradient')
            .attr('id', 'layer-gradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');
        
        gradient.append('stop')
            .attr('offset', '0%')
            .attr('stop-color', '#10099F')
            .attr('stop-opacity', 0.3);
        
        gradient.append('stop')
            .attr('offset', '100%')
            .attr('stop-color', '#FC8484')
            .attr('stop-opacity', 0.3);
        
        drawLayers();
        updateInfo();
    }
    
    function drawLayers() {
        const layerWidth = 70;
        const spacing = (width - layerWidth * layers.length) / (layers.length + 1);
        
        // Draw connections
        const connections = svg.append('g').attr('class', 'connections');
        
        for (let i = 0; i < layers.length - 1; i++) {
            const x1 = spacing + i * (layerWidth + spacing) + layerWidth;
            const x2 = spacing + (i + 1) * (layerWidth + spacing);
            const y = height / 2;
            
            connections.append('line')
                .attr('x1', x1)
                .attr('y1', y)
                .attr('x2', x2)
                .attr('y2', y)
                .attr('stroke', 'url(#layer-gradient)')
                .attr('stroke-width', 2)
                .attr('opacity', 0.5);
        }
        
        // Draw layers
        const layerGroups = svg.selectAll('.layer-group')
            .data(layers)
            .enter()
            .append('g')
            .attr('class', 'layer-group')
            .attr('transform', (d, i) => {
                const x = spacing + i * (layerWidth + spacing);
                return `translate(${x}, ${height / 2})`;
            });
        
        // Layer rectangles
        layerGroups.append('rect')
            .attr('class', 'layer-rect')
            .attr('x', 0)
            .attr('y', -60)
            .attr('width', layerWidth)
            .attr('height', 120)
            .attr('fill', d => d.color)
            .attr('stroke', '#262626')
            .attr('stroke-width', 2)
            .attr('rx', 5)
            .attr('opacity', (d, i) => i === currentLayer ? 1 : 0.3);
        
        // Layer names
        layerGroups.append('text')
            .attr('x', layerWidth / 2)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-weight', 'bold')
            .attr('font-size', '14px')
            .attr('fill', d => {
                const rgb = d3.rgb(d.color);
                return rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114 > 186 ? '#262626' : 'white';
            })
            .text(d => d.name);
        
        // Shape info
        layerGroups.append('text')
            .attr('class', 'shape-text')
            .attr('x', layerWidth / 2)
            .attr('y', -80)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('fill', '#262626')
            .text(d => {
                if (d.shape.length === 3) {
                    return `${d.shape[0]}×${d.shape[1]}×${d.shape[2]}`;
                } else {
                    return `${d.shape[0]}`;
                }
            });
        
        // Parameter count
        layerGroups.append('text')
            .attr('class', 'param-text')
            .attr('x', layerWidth / 2)
            .attr('y', 80)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#666')
            .text(d => d.params > 0 ? `${d.params.toLocaleString()} params` : '');
        
        // Detailed info box for current layer
        const infoBox = svg.append('g')
            .attr('class', 'info-box')
            .attr('transform', `translate(${width / 2}, 380)`);
        
        infoBox.append('rect')
            .attr('x', -200)
            .attr('y', -25)
            .attr('width', 400)
            .attr('height', 50)
            .attr('fill', '#F9F9F9')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('rx', 5);
        
        const infoText = infoBox.append('text')
            .attr('class', 'info-text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('font-size', '14px')
            .attr('fill', '#262626');
    }
    
    function updateInfo() {
        const layer = layers[currentLayer];
        
        // Update layer info display
        document.getElementById('lenet-layer-info').textContent = 
            `${layer.name}: ${layer.description}`;
        
        // Update layer highlighting
        svg.selectAll('.layer-rect')
            .transition()
            .duration(300)
            .attr('opacity', (d, i) => i === currentLayer ? 1 : 0.3);
        
        // Update info box
        svg.select('.info-text')
            .text(layer.description);
        
        // Animate shape visualization
        animateLayerShape(layer);
    }
    
    function animateLayerShape(layer) {
        // Remove previous shape visualization
        svg.selectAll('.shape-viz').remove();
        
        const shapeViz = svg.append('g')
            .attr('class', 'shape-viz')
            .attr('transform', `translate(${width / 2}, 200)`);
        
        if (layer.type === 'conv' || layer.type === 'pool') {
            // Draw feature maps
            const channels = layer.shape[0];
            const mapSize = 30;
            const spacing = 5;
            const totalWidth = Math.min(channels, 8) * (mapSize + spacing);
            const startX = -totalWidth / 2;
            
            for (let i = 0; i < Math.min(channels, 8); i++) {
                const x = startX + i * (mapSize + spacing);
                
                shapeViz.append('rect')
                    .attr('x', x)
                    .attr('y', -mapSize / 2)
                    .attr('width', mapSize)
                    .attr('height', mapSize)
                    .attr('fill', layer.color)
                    .attr('stroke', '#262626')
                    .attr('opacity', 0)
                    .transition()
                    .delay(i * 50)
                    .duration(300)
                    .attr('opacity', 0.8);
            }
            
            if (channels > 8) {
                shapeViz.append('text')
                    .attr('x', startX + 8 * (mapSize + spacing) + 10)
                    .attr('y', 0)
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', '14px')
                    .attr('fill', '#666')
                    .text(`... +${channels - 8} more`);
            }
        } else if (layer.type === 'dense' || layer.type === 'reshape') {
            // Draw neurons
            const neurons = Math.min(layer.shape[0], 10);
            const radius = 8;
            const spacing = 25;
            const totalWidth = neurons * spacing;
            const startX = -totalWidth / 2;
            
            for (let i = 0; i < neurons; i++) {
                const x = startX + i * spacing + spacing / 2;
                
                shapeViz.append('circle')
                    .attr('cx', x)
                    .attr('cy', 0)
                    .attr('r', 0)
                    .attr('fill', layer.color)
                    .attr('stroke', '#262626')
                    .attr('stroke-width', 2)
                    .transition()
                    .delay(i * 30)
                    .duration(300)
                    .attr('r', radius);
            }
            
            if (layer.shape[0] > 10) {
                shapeViz.append('text')
                    .attr('x', startX + neurons * spacing + 10)
                    .attr('y', 0)
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', '14px')
                    .attr('fill', '#666')
                    .text(`... +${layer.shape[0] - 10} more`);
            }
        }
    }
    
    // Event handlers
    document.getElementById('lenet-layer-prev').addEventListener('click', () => {
        if (currentLayer > 0) {
            currentLayer--;
            updateInfo();
        }
    });
    
    document.getElementById('lenet-layer-next').addEventListener('click', () => {
        if (currentLayer < layers.length - 1) {
            currentLayer++;
            updateInfo();
        }
    });
    
    // Initialize when slide is shown
    Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#lenet-layers-svg')) {
            init();
        }
    });
    
    // Initial check
    if (document.querySelector('#lenet-layers-svg')) {
        init();
    }
})();