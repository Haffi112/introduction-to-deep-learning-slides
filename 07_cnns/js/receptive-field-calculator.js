// Receptive Field Calculator and Visualization
(function() {
    'use strict';

    // Initialize when Reveal is ready
    if (typeof Reveal !== 'undefined') {
        Reveal.on('ready', init);
        Reveal.on('slidechanged', event => {
            if (event.currentSlide.querySelector('#receptive-field-demo')) {
                init();
            }
        });
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    function init() {
        const demo = document.getElementById('receptive-field-demo');
        if (!demo || !window.d3) return;

        let numLayers = 3;
        let kernelSize = 3;

        // Calculate receptive field size
        function calculateReceptiveField(layers, kSize) {
            // For stacked convolutions with same kernel size
            // RF = 1 + (k-1) * layers
            // Or more generally: (k-1) * layers + 1
            return (kSize - 1) * layers + 1;
        }

        // Draw receptive field visualization
        function drawVisualization() {
            const svg = d3.select('#receptive-field-svg');
            if (!svg.node()) return;
            
            svg.selectAll('*').remove();
            
            const width = 600;
            const height = 400;
            const margin = { top: 40, right: 60, bottom: 60, left: 60 };
            
            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);
            
            // Grid parameters
            const gridSize = 15; // 15x15 grid
            const cellSize = Math.min(
                (width - margin.left - margin.right) / gridSize,
                (height - margin.top - margin.bottom) / gridSize
            );
            
            const offsetX = (width - margin.left - margin.right - gridSize * cellSize) / 2;
            const offsetY = (height - margin.top - margin.bottom - gridSize * cellSize) / 2;
            
            // Draw input grid
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    g.append('rect')
                        .attr('x', offsetX + j * cellSize)
                        .attr('y', offsetY + i * cellSize)
                        .attr('width', cellSize)
                        .attr('height', cellSize)
                        .attr('fill', 'white')
                        .attr('stroke', '#ddd')
                        .attr('stroke-width', 1);
                }
            }
            
            // Calculate and highlight receptive field
            const rfSize = calculateReceptiveField(numLayers, kernelSize);
            const centerI = Math.floor(gridSize / 2);
            const centerJ = Math.floor(gridSize / 2);
            const rfRadius = Math.floor(rfSize / 2);
            
            // Highlight receptive field for each layer
            for (let layer = 1; layer <= numLayers; layer++) {
                const layerRF = calculateReceptiveField(layer, kernelSize);
                const layerRadius = Math.floor(layerRF / 2);
                
                // Draw receptive field rectangle for this layer
                const opacity = 0.2 + (layer / numLayers) * 0.3;
                const color = layer === numLayers ? '#10099F' : '#2DD2C0';
                
                g.append('rect')
                    .attr('x', offsetX + (centerJ - layerRadius) * cellSize)
                    .attr('y', offsetY + (centerI - layerRadius) * cellSize)
                    .attr('width', layerRF * cellSize)
                    .attr('height', layerRF * cellSize)
                    .attr('fill', color)
                    .attr('fill-opacity', opacity)
                    .attr('stroke', color)
                    .attr('stroke-width', 2)
                    .attr('stroke-opacity', 0.8);
            }
            
            // Draw center neuron
            g.append('circle')
                .attr('cx', offsetX + centerJ * cellSize + cellSize / 2)
                .attr('cy', offsetY + centerI * cellSize + cellSize / 2)
                .attr('r', cellSize / 3)
                .attr('fill', '#FC8484')
                .attr('stroke', '#fff')
                .attr('stroke-width', 2);
            
            // Add layer labels
            const layerWidth = (width - margin.left - margin.right) / (numLayers + 1);
            for (let layer = 0; layer <= numLayers; layer++) {
                const x = layerWidth * (layer + 0.5);
                const y = -20;
                
                g.append('text')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '14px')
                    .attr('font-weight', 'bold')
                    .text(layer === 0 ? 'Input' : `Layer ${layer}`);
                
                if (layer > 0) {
                    const rf = calculateReceptiveField(layer, kernelSize);
                    g.append('text')
                        .attr('x', x)
                        .attr('y', y + 15)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '12px')
                        .attr('fill', '#666')
                        .text(`RF: ${rf}×${rf}`);
                }
            }
            
            // Add legend
            const legendData = [
                { color: '#FC8484', label: 'Output neuron' },
                { color: '#10099F', label: 'Final receptive field' },
                { color: '#2DD2C0', label: 'Intermediate fields' }
            ];
            
            const legend = g.append('g')
                .attr('transform', `translate(${width - margin.left - margin.right - 150}, 0)`);
            
            legendData.forEach((item, i) => {
                legend.append('rect')
                    .attr('x', 0)
                    .attr('y', i * 25)
                    .attr('width', 15)
                    .attr('height', 15)
                    .attr('fill', item.color)
                    .attr('fill-opacity', 0.6);
                
                legend.append('text')
                    .attr('x', 20)
                    .attr('y', i * 25 + 12)
                    .attr('font-size', '12px')
                    .text(item.label);
            });
            
            // Update calculation display
            const calcDisplay = document.getElementById('rf-calculation');
            if (calcDisplay) {
                const rf = calculateReceptiveField(numLayers, kernelSize);
                calcDisplay.innerHTML = `
                    <strong>Calculation:</strong> RF = (${kernelSize} - 1) × ${numLayers} + 1 = ${rf}<br>
                    <strong>Final Receptive Field:</strong> ${rf}×${rf} pixels
                `;
            }
        }

        // Set up event listeners
        const layersSlider = document.getElementById('num-layers');
        const layersValue = document.getElementById('layers-value');
        if (layersSlider && layersValue) {
            layersSlider.addEventListener('input', (e) => {
                numLayers = parseInt(e.target.value);
                layersValue.textContent = numLayers;
                drawVisualization();
            });
        }

        const kernelSelect = document.getElementById('kernel-size-rf');
        if (kernelSelect) {
            kernelSelect.addEventListener('change', (e) => {
                kernelSize = parseInt(e.target.value);
                drawVisualization();
            });
        }

        // Initial draw
        drawVisualization();
    }
})();