/**
 * Interactive Visualizations for Builder's Guide Presentation
 * Includes module hierarchy, forward flow, and interactive builders
 */

(function() {
    'use strict';

    // Wait for DOM and Reveal to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisualizations);
    } else {
        initVisualizations();
    }

    function initVisualizations() {
        // Initialize on slide change
        if (typeof Reveal !== 'undefined') {
            Reveal.on('slidechanged', function(event) {
                initSlideVisualizations(event.currentSlide);
            });
            // Initialize current slide
            initSlideVisualizations(Reveal.getCurrentSlide());
        }
    }

    function initSlideVisualizations(slide) {
        if (!slide) return;

        // Module Hierarchy Visualization
        if (slide.querySelector('#module-hierarchy')) {
            createModuleHierarchy();
        }

        // Forward Flow Visualization
        if (slide.querySelector('#forward-flow-viz')) {
            createForwardFlowViz();
        }

        // MLP Builder
        if (slide.querySelector('#mlp-builder')) {
            createMLPBuilder();
        }

        // Sequential Flow
        if (slide.querySelector('#sequential-flow')) {
            createSequentialFlow();
        }

        // Control Flow Simulator
        if (slide.querySelector('#control-flow-sim')) {
            createControlFlowSim();
        }

        // Module Tree
        if (slide.querySelector('#module-tree')) {
            createModuleTree();
        }

        // Module Composer
        if (slide.querySelector('#module-composer')) {
            createModuleComposer();
        }

        // === PARAMETER MANAGEMENT VISUALIZATIONS ===
        
        // Parameter Lifecycle
        if (slide.querySelector('#param-lifecycle')) {
            createParameterLifecycle();
        }

        // Parameter Inspector
        if (slide.querySelector('#param-inspector')) {
            createParameterInspector();
        }

        // Parameter Tree Explorer
        if (slide.querySelector('#param-tree-explorer')) {
            createParameterTreeExplorer();
        }

        // Initialization Comparison
        if (slide.querySelector('#init-comparison')) {
            createInitComparison();
        }

        // Shared Parameter Visualization
        if (slide.querySelector('#shared-param-viz')) {
            createSharedParamViz();
        }

        // Save/Load Simulator
        if (slide.querySelector('#save-load-sim')) {
            createSaveLoadSimulator();
        }

        // Parameter Surgery Playground
        if (slide.querySelector('#param-surgery')) {
            createParameterSurgery();
        }
    }

    // Module Hierarchy Visualization
    function createModuleHierarchy() {
        const container = d3.select('#module-hierarchy');
        container.selectAll('*').remove();

        const svgWidth = 550; // Fixed SVG width to prevent overflow
        const height = 400;

        const svg = container.append('svg')
            .attr('width', svgWidth)
            .attr('height', height)
            .style('margin', '0 auto')
            .style('display', 'block'); // Center the SVG

        // Hierarchy data
        const data = {
            name: 'Model',
            children: [
                {
                    name: 'Block 1',
                    children: [
                        { name: 'Layer 1', children: [{ name: 'Neuron' }, { name: 'Neuron' }] },
                        { name: 'Layer 2', children: [{ name: 'Neuron' }, { name: 'Neuron' }] }
                    ]
                },
                {
                    name: 'Block 2',
                    children: [
                        { name: 'Layer 3', children: [{ name: 'Neuron' }] },
                        { name: 'Layer 4', children: [{ name: 'Neuron' }] }
                    ]
                }
            ]
        };

        const root = d3.hierarchy(data);
        const treeWidth = 450; // Fixed width for more compact tree
        const treeLayout = d3.tree().size([treeWidth, height - 100]);
        treeLayout(root);

        const g = svg.append('g')
            .attr('transform', `translate(${(svgWidth - treeWidth) / 2}, 50)`);

        // Draw links
        g.selectAll('.link')
            .data(root.links())
            .enter().append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('d', d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y));

        // Draw nodes
        const nodes = g.selectAll('.node')
            .data(root.descendants())
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        nodes.append('circle')
            .attr('r', d => d.depth === 0 ? 12 : d.depth === 1 ? 10 : d.depth === 2 ? 8 : 5)
            .attr('fill', d => d.depth === 0 ? '#10099F' : d.depth === 1 ? '#2DD2C0' : d.depth === 2 ? '#FFA05F' : '#FC8484')
            .attr('stroke', 'white')
            .attr('stroke-width', 2);

        nodes.append('text')
            .attr('dy', d => d.children ? -20 : 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text(d => d.data.name);
    }

    // Forward Flow Visualization
    function createForwardFlowViz() {
        const container = d3.select('#forward-flow-viz');
        container.selectAll('*').remove();

        const width = container.node().getBoundingClientRect().width;
        const height = 400;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create layers
        const layers = [
            { name: 'Input\n(20)', x: width * 0.2, neurons: 3 },
            { name: 'Hidden\n(256)', x: width * 0.5, neurons: 4 },
            { name: 'Output\n(10)', x: width * 0.8, neurons: 2 }
        ];

        const g = svg.append('g');

        // Draw connections
        for (let i = 0; i < layers.length - 1; i++) {
            const layer1 = layers[i];
            const layer2 = layers[i + 1];
            
            for (let j = 0; j < layer1.neurons; j++) {
                for (let k = 0; k < layer2.neurons; k++) {
                    g.append('line')
                        .attr('class', 'connection')
                        .attr('x1', layer1.x)
                        .attr('y1', 100 + j * 60)
                        .attr('x2', layer2.x)
                        .attr('y2', 100 + k * 60)
                        .attr('stroke', '#ddd')
                        .attr('stroke-width', 1);
                }
            }
        }

        // Draw neurons
        layers.forEach((layer, idx) => {
            for (let i = 0; i < layer.neurons; i++) {
                g.append('circle')
                    .attr('class', `neuron layer-${idx}`)
                    .attr('cx', layer.x)
                    .attr('cy', 100 + i * 60)
                    .attr('r', 20)
                    .attr('fill', idx === 0 ? '#10099F' : idx === 1 ? '#2DD2C0' : '#FC8484')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
            }
            
            g.append('text')
                .attr('x', layer.x)
                .attr('y', 320)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text(layer.name);
        });

        // Animate button
        const animateBtn = document.getElementById('animate-forward');
        const resetBtn = document.getElementById('reset-forward');
        
        if (animateBtn) {
            animateBtn.addEventListener('click', () => {
                animateForwardPass();
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                g.selectAll('.data-particle').remove();
                g.selectAll('.neuron').style('fill', null);
            });
        }

        function animateForwardPass() {
            // Create data particles
            for (let i = 0; i < 3; i++) {
                const particle = g.append('circle')
                    .attr('class', 'data-particle')
                    .attr('r', 5)
                    .attr('fill', '#FFD700')
                    .attr('cx', layers[0].x)
                    .attr('cy', 100 + i * 60);

                // Animate through layers
                particle.transition()
                    .duration(1000)
                    .attr('cx', layers[1].x)
                    .on('end', function() {
                        d3.select(this).transition()
                            .duration(1000)
                            .attr('cx', layers[2].x)
                            .attr('cy', 130)
                            .on('end', function() {
                                d3.select(this).remove();
                            });
                    });
            }

            // Highlight neurons
            g.selectAll('.layer-0')
                .transition()
                .duration(300)
                .style('fill', '#FFD700')
                .transition()
                .delay(1000)
                .duration(300)
                .style('fill', '#10099F');

            g.selectAll('.layer-1')
                .transition()
                .delay(1000)
                .duration(300)
                .style('fill', '#FFD700')
                .transition()
                .delay(1000)
                .duration(300)
                .style('fill', '#2DD2C0');

            g.selectAll('.layer-2')
                .transition()
                .delay(2000)
                .duration(300)
                .style('fill', '#FFD700')
                .transition()
                .delay(1000)
                .duration(300)
                .style('fill', '#FC8484');
        }
    }

    // MLP Builder
    function createMLPBuilder() {
        const hiddenInput = document.getElementById('hidden-size');
        const outputInput = document.getElementById('output-size');
        const buildBtn = document.getElementById('build-mlp');
        const codeDisplay = document.getElementById('mlp-code');

        if (!buildBtn || !codeDisplay) return;

        function updateCode() {
            const hiddenSize = hiddenInput.value;
            const outputSize = outputInput.value;
            
            const code = `class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden = nn.LazyLinear(${hiddenSize})
        self.out = nn.LazyLinear(${outputSize})
    
    def forward(self, X):
        return self.out(F.relu(self.hidden(X)))

# Create and test
net = MLP()
X = torch.rand(2, 20)
output = net(X)
print(f"Output shape: {output.shape}")  # [2, ${outputSize}]`;

            codeDisplay.textContent = code;
        }

        buildBtn.addEventListener('click', updateCode);
        hiddenInput.addEventListener('input', updateCode);
        outputInput.addEventListener('input', updateCode);

        // Initial display
        updateCode();
    }

    // Sequential Flow Visualization
    function createSequentialFlow() {
        const container = d3.select('#sequential-flow');
        container.selectAll('*').remove();

        const width = container.node().getBoundingClientRect().width;
        const height = 400;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g');

        let modules = [
            { type: 'Input', color: '#10099F' }
        ];

        function drawModules() {
            g.selectAll('*').remove();

            const moduleWidth = 100;
            const moduleHeight = 60;
            const spacing = 30;

            modules.forEach((module, idx) => {
                const x = 50 + idx * (moduleWidth + spacing);
                const y = height / 2 - moduleHeight / 2;

                // Draw arrow
                if (idx > 0) {
                    g.append('line')
                        .attr('x1', x - spacing + 5)
                        .attr('y1', height / 2)
                        .attr('x2', x - 5)
                        .attr('y2', height / 2)
                        .attr('stroke', '#666')
                        .attr('stroke-width', 2)
                        .attr('marker-end', 'url(#arrowhead)');
                }

                // Draw module
                g.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', moduleWidth)
                    .attr('height', moduleHeight)
                    .attr('fill', module.color)
                    .attr('rx', 5);

                g.append('text')
                    .attr('x', x + moduleWidth / 2)
                    .attr('y', y + moduleHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', 'white')
                    .style('font-size', '14px')
                    .text(module.type);
            });

            // Add arrowhead marker
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('markerWidth', 10)
                .attr('markerHeight', 10)
                .attr('refX', 9)
                .attr('refY', 3)
                .attr('orient', 'auto')
                .append('polygon')
                .attr('points', '0 0, 10 3, 0 6')
                .attr('fill', '#666');
        }

        drawModules();

        // Button handlers
        const addBtn = document.getElementById('add-layer');
        const animateBtn = document.getElementById('animate-sequential');
        const clearBtn = document.getElementById('clear-sequential');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                const types = ['Linear', 'ReLU', 'Dropout', 'BatchNorm'];
                const colors = ['#2DD2C0', '#FFA05F', '#FC8484', '#FAC55B'];
                const idx = (modules.length - 1) % types.length;
                
                if (modules.length < 6) {
                    modules.push({ type: types[idx], color: colors[idx] });
                    drawModules();
                }
            });
        }

        if (animateBtn) {
            animateBtn.addEventListener('click', () => {
                animateSequentialFlow();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                modules = [{ type: 'Input', color: '#10099F' }];
                drawModules();
            });
        }

        function animateSequentialFlow() {
            const moduleWidth = 100;
            const spacing = 30;

            const particle = g.append('circle')
                .attr('r', 8)
                .attr('fill', '#FFD700')
                .attr('cx', 100)
                .attr('cy', height / 2);

            modules.forEach((module, idx) => {
                if (idx === 0) return;
                
                particle.transition()
                    .delay(idx * 500)
                    .duration(500)
                    .attr('cx', 50 + idx * (moduleWidth + spacing) + moduleWidth / 2);
            });

            setTimeout(() => {
                particle.remove();
            }, modules.length * 500 + 500);
        }
    }

    // Control Flow Simulator
    function createControlFlowSim() {
        const meanSlider = document.getElementById('input-mean');
        const batchSlider = document.getElementById('batch-size');
        const meanValue = document.getElementById('mean-value');
        const batchValue = document.getElementById('batch-value');
        const flowDiagram = document.getElementById('flow-diagram');
        const flowOutput = document.getElementById('flow-output');

        if (!meanSlider || !flowDiagram) return;

        function updateSimulation() {
            const mean = parseFloat(meanSlider.value);
            const batchSize = parseInt(batchSlider.value);
            
            meanValue.textContent = mean.toFixed(1);
            batchValue.textContent = batchSize;

            // Calculate dynamic depth
            const depth = Math.min(3 + Math.floor(mean * 0.4), 5);
            const useDropout = batchSize > 10;

            // Clear and redraw
            flowDiagram.innerHTML = '';
            
            const svg = d3.select(flowDiagram).append('svg')
                .attr('width', '100%')
                .attr('height', '100%');

            const g = svg.append('g');

            // Draw flow diagram
            const boxes = [];
            for (let i = 0; i < depth; i++) {
                boxes.push({ 
                    text: `Layer ${i + 1}`, 
                    x: 50 + i * 120, 
                    y: 50,
                    active: true 
                });
            }

            if (useDropout) {
                boxes.push({ 
                    text: 'Dropout', 
                    x: 50 + depth * 120, 
                    y: 50,
                    active: true,
                    special: true
                });
            }

            // Draw boxes and connections
            boxes.forEach((box, i) => {
                if (i > 0) {
                    g.append('line')
                        .attr('x1', boxes[i-1].x + 80)
                        .attr('y1', 75)
                        .attr('x2', box.x)
                        .attr('y2', 75)
                        .attr('stroke', '#666')
                        .attr('stroke-width', 2);
                }

                g.append('rect')
                    .attr('x', box.x)
                    .attr('y', box.y)
                    .attr('width', 80)
                    .attr('height', 50)
                    .attr('fill', box.special ? '#FC8484' : '#2DD2C0')
                    .attr('rx', 5);

                g.append('text')
                    .attr('x', box.x + 40)
                    .attr('y', box.y + 30)
                    .attr('text-anchor', 'middle')
                    .attr('fill', 'white')
                    .style('font-size', '12px')
                    .text(box.text);
            });

            // Update output
            flowOutput.innerHTML = `
Depth: ${depth} layers
Batch Size: ${batchSize}
Dropout: ${useDropout ? 'Applied (p=0.5)' : 'Not applied'}
            `;
        }

        meanSlider.addEventListener('input', updateSimulation);
        batchSlider.addEventListener('input', updateSimulation);

        updateSimulation();
    }

    // Module Tree Visualization
    function createModuleTree() {
        const container = d3.select('#module-tree');
        container.selectAll('*').remove();

        const width = container.node().getBoundingClientRect().width;
        const height = 400;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Complex module structure
        const data = {
            name: 'Sequential',
            children: [
                {
                    name: 'NestMLP',
                    children: [
                        {
                            name: 'Sequential',
                            children: [
                                { name: 'Linear(64)' },
                                { name: 'ReLU' },
                                { name: 'Linear(32)' },
                                { name: 'ReLU' }
                            ]
                        },
                        { name: 'Linear(16)' }
                    ]
                },
                { name: 'Linear(20)' },
                {
                    name: 'FixedHiddenMLP',
                    children: [
                        { name: 'Linear(20)' },
                        { name: 'Fixed Weight' }
                    ]
                }
            ]
        };

        const root = d3.hierarchy(data);
        const treeLayout = d3.tree().size([height - 100, width - 200]);
        treeLayout(root);

        const g = svg.append('g')
            .attr('transform', 'translate(100, 50)');

        // Draw links
        g.selectAll('.link')
            .data(root.links())
            .enter().append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('d', d3.linkHorizontal()
                .x(d => d.y)
                .y(d => d.x));

        // Draw nodes
        const nodes = g.selectAll('.node')
            .data(root.descendants())
            .enter().append('g')
            .attr('class', 'node')
            .attr('transform', d => `translate(${d.y}, ${d.x})`);

        nodes.append('rect')
            .attr('x', -40)
            .attr('y', -15)
            .attr('width', 80)
            .attr('height', 30)
            .attr('fill', d => d.depth === 0 ? '#10099F' : d.depth === 1 ? '#2DD2C0' : '#FFA05F')
            .attr('rx', 5);

        nodes.append('text')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .style('font-size', '10px')
            .text(d => d.data.name);

        // Expand/Collapse buttons
        const expandBtn = document.getElementById('expand-tree');
        const collapseBtn = document.getElementById('collapse-tree');

        if (expandBtn) {
            expandBtn.addEventListener('click', () => {
                nodes.style('opacity', 1);
                g.selectAll('.link').style('opacity', 1);
            });
        }

        if (collapseBtn) {
            collapseBtn.addEventListener('click', () => {
                nodes.style('opacity', d => d.depth <= 1 ? 1 : 0.2);
                g.selectAll('.link').style('opacity', d => d.target.depth <= 1 ? 1 : 0.2);
            });
        }
    }

    // Module Composer
    function createModuleComposer() {
        const composerView = document.getElementById('composition-view');
        const moduleType = document.getElementById('module-type');
        const addBtn = document.getElementById('add-module');
        const nestBtn = document.getElementById('nest-module');
        const clearBtn = document.getElementById('clear-composer');

        if (!composerView) return;

        let structure = [];
        let currentLevel = structure;

        function renderStructure() {
            composerView.innerHTML = '';
            
            const pre = document.createElement('pre');
            pre.style.background = '#f5f5f5';
            pre.style.padding = '15px';
            pre.style.borderRadius = '5px';
            pre.style.fontSize = '12px';
            pre.style.overflow = 'auto';
            
            pre.textContent = generateCode(structure);
            composerView.appendChild(pre);
        }

        function generateCode(modules, indent = 0) {
            let code = '';
            const spaces = '    '.repeat(indent);
            
            if (modules.length === 0 && indent === 0) {
                return '# Empty module - add components using the controls above';
            }

            if (indent === 0) {
                code += 'model = nn.Sequential(\n';
            }

            modules.forEach((module, idx) => {
                const comma = idx < modules.length - 1 ? ',' : '';
                if (module.children) {
                    code += spaces + '    nn.Sequential(\n';
                    code += generateCode(module.children, indent + 2);
                    code += spaces + '    )' + comma + '\n';
                } else {
                    code += spaces + '    ' + module.code + comma + '\n';
                }
            });

            if (indent === 0) {
                code += ')';
            }

            return code;
        }

        addBtn.addEventListener('click', () => {
            const type = moduleType.value;
            const moduleMap = {
                'linear': { code: 'nn.LazyLinear(128)' },
                'relu': { code: 'nn.ReLU()' },
                'sequential': { code: 'nn.Sequential()', children: [] },
                'custom': { code: 'CustomModule()' }
            };

            currentLevel.push(moduleMap[type]);
            renderStructure();
        });

        nestBtn.addEventListener('click', () => {
            const lastModule = currentLevel[currentLevel.length - 1];
            if (lastModule && lastModule.children) {
                currentLevel = lastModule.children;
                alert('Now adding to nested Sequential block');
            } else {
                alert('Select a Sequential block first to nest modules inside');
            }
        });

        clearBtn.addEventListener('click', () => {
            structure = [];
            currentLevel = structure;
            renderStructure();
        });

        renderStructure();
    }

    // ============================================
    // PARAMETER MANAGEMENT VISUALIZATIONS
    // ============================================

    // Parameter Lifecycle Visualization
    function createParameterLifecycle() {
        const container = d3.select('#param-lifecycle');
        container.selectAll('*').remove();

        const width = container.node().getBoundingClientRect().width;
        const height = 400;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        const stages = [
            { name: 'Creation', y: 50, color: '#10099F' },
            { name: 'Initialization', y: 100, color: '#2DD2C0' },
            { name: 'Training', y: 150, color: '#FFA05F' },
            { name: 'Gradient Update', y: 200, color: '#FC8484' },
            { name: 'Saving', y: 250, color: '#FAC55B' },
            { name: 'Loading', y: 300, color: '#2DD2C0' },
            { name: 'Inference', y: 350, color: '#10099F' }
        ];

        const centerX = width / 2;
        
        // Draw connecting line
        svg.append('line')
            .attr('x1', centerX)
            .attr('y1', 30)
            .attr('x2', centerX)
            .attr('y2', 370)
            .attr('stroke', '#e0e0e0')
            .attr('stroke-width', 2);

        // Draw stages
        stages.forEach((stage, i) => {
            const group = svg.append('g')
                .attr('transform', `translate(${centerX}, ${stage.y})`)
                .style('opacity', 0)
                .transition()
                .delay(i * 200)
                .duration(500)
                .style('opacity', 1);

            group.append('circle')
                .attr('r', 25)
                .attr('fill', stage.color)
                .attr('stroke', 'white')
                .attr('stroke-width', 3);

            group.append('text')
                .attr('x', 40)
                .attr('y', 5)
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .text(stage.name);
        });

        // Animated particle
        const particle = svg.append('circle')
            .attr('r', 8)
            .attr('fill', '#10099F')
            .attr('cx', centerX)
            .attr('cy', 50);

        function animateParticle() {
            particle
                .transition()
                .duration(5000)
                .ease(d3.easeLinear)
                .attrTween('cy', function() {
                    return d3.interpolate(50, 350);
                })
                .on('end', () => {
                    particle.attr('cy', 50);
                    animateParticle();
                });
        }
        animateParticle();
    }

    // Parameter Inspector
    function createParameterInspector() {
        const container = document.getElementById('param-inspector');
        const layerSelect = container.querySelector('#layer-select');
        const paramSelect = container.querySelector('#param-select');
        const inspectBtn = container.querySelector('#inspect-param');
        const vizContainer = container.querySelector('#param-visualization');
        const infoContainer = container.querySelector('#param-info');

        // Mock parameter data
        const paramData = {
            '0': {
                'weight': { shape: [8, 4], values: generateRandomMatrix(8, 4) },
                'bias': { shape: [8], values: generateRandomArray(8) }
            },
            '2': {
                'weight': { shape: [1, 8], values: generateRandomMatrix(1, 8) },
                'bias': { shape: [1], values: generateRandomArray(1) }
            }
        };

        function generateRandomMatrix(rows, cols) {
            const matrix = [];
            for (let i = 0; i < rows; i++) {
                matrix.push(generateRandomArray(cols));
            }
            return matrix;
        }

        function generateRandomArray(length) {
            return Array.from({ length }, () => (Math.random() - 0.5) * 2);
        }

        inspectBtn.addEventListener('click', () => {
            const layer = layerSelect.value;
            const param = paramSelect.value;
            const data = paramData[layer][param];

            // Clear previous visualization
            d3.select(vizContainer).selectAll('*').remove();
            
            const width = vizContainer.offsetWidth;
            const height = 250;
            
            const svg = d3.select(vizContainer)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            if (param === 'weight' && data.values.length > 1) {
                // Visualize as heatmap for 2D weights
                const cellSize = Math.min(30, width / data.values[0].length, height / data.values.length);
                
                const colorScale = d3.scaleLinear()
                    .domain([-1, 0, 1])
                    .range(['#FC8484', 'white', '#10099F']);

                data.values.forEach((row, i) => {
                    row.forEach((value, j) => {
                        svg.append('rect')
                            .attr('x', j * cellSize + 10)
                            .attr('y', i * cellSize + 10)
                            .attr('width', cellSize - 2)
                            .attr('height', cellSize - 2)
                            .attr('fill', colorScale(value))
                            .attr('stroke', '#e0e0e0');
                    });
                });
            } else {
                // Visualize as bar chart for 1D parameters
                const values = data.values.flat();
                const barWidth = Math.min(40, width / values.length - 5);
                const maxVal = Math.max(...values.map(Math.abs));
                const yScale = d3.scaleLinear()
                    .domain([-maxVal, maxVal])
                    .range([height - 30, 30]);

                // Zero line
                svg.append('line')
                    .attr('x1', 10)
                    .attr('x2', width - 10)
                    .attr('y1', yScale(0))
                    .attr('y2', yScale(0))
                    .attr('stroke', '#ccc')
                    .attr('stroke-width', 1);

                values.forEach((value, i) => {
                    svg.append('rect')
                        .attr('x', i * (barWidth + 5) + 10)
                        .attr('y', value > 0 ? yScale(value) : yScale(0))
                        .attr('width', barWidth)
                        .attr('height', Math.abs(yScale(value) - yScale(0)))
                        .attr('fill', value > 0 ? '#10099F' : '#FC8484');
                });
            }

            // Update info
            infoContainer.innerHTML = `
                <strong>Layer ${layer} - ${param}</strong><br>
                Shape: ${JSON.stringify(data.shape)}<br>
                Total elements: ${data.values.flat().length}<br>
                Mean: ${(data.values.flat().reduce((a, b) => a + b, 0) / data.values.flat().length).toFixed(4)}<br>
                Std: ${Math.sqrt(data.values.flat().reduce((a, b) => a + b * b, 0) / data.values.flat().length).toFixed(4)}
            `;
        });
    }

    // Parameter Tree Explorer
    function createParameterTreeExplorer() {
        const container = document.getElementById('param-tree-explorer');
        const expandBtn = container.querySelector('#expand-all-params');
        const collapseBtn = container.querySelector('#collapse-all-params');
        const showShapes = container.querySelector('#show-shapes');
        const showGradients = container.querySelector('#show-gradients');
        const treeContainer = container.querySelector('#param-tree');
        const summaryContainer = container.querySelector('#param-summary');

        // Mock model structure
        const modelStructure = {
            'model': {
                'encoder': {
                    '0.weight': { shape: [256, 784], grad: false },
                    '0.bias': { shape: [256], grad: false },
                    '2.weight': { shape: [128, 256], grad: false },
                    '2.bias': { shape: [128], grad: false }
                },
                'decoder': {
                    'weight': { shape: [10, 128], grad: false },
                    'bias': { shape: [10], grad: false }
                }
            }
        };

        function renderTree(obj, prefix = '', isExpanded = true) {
            let html = '';
            Object.keys(obj).forEach(key => {
                const value = obj[key];
                const hasChildren = typeof value === 'object' && !value.shape;
                
                if (hasChildren) {
                    html += `<div class="tree-node">
                        <span class="tree-toggle" data-path="${prefix}${key}">${isExpanded ? '▼' : '▶'}</span>
                        <strong>${key}/</strong>
                        <div class="tree-children" style="display: ${isExpanded ? 'block' : 'none'}; margin-left: 20px;">
                            ${renderTree(value, prefix + key + '.', isExpanded)}
                        </div>
                    </div>`;
                } else {
                    let info = key;
                    if (showShapes.checked && value.shape) {
                        info += ` <span style="color: #666;">${JSON.stringify(value.shape)}</span>`;
                    }
                    if (showGradients.checked) {
                        info += value.grad ? ' <span style="color: #2DD2C0;">✓ grad</span>' : ' <span style="color: #ccc;">no grad</span>';
                    }
                    html += `<div class="tree-leaf" style="margin-left: 20px;">${info}</div>`;
                }
            });
            return html;
        }

        function updateTree() {
            treeContainer.innerHTML = renderTree(modelStructure);
            
            // Add toggle functionality
            treeContainer.querySelectorAll('.tree-toggle').forEach(toggle => {
                toggle.addEventListener('click', () => {
                    const children = toggle.parentElement.querySelector('.tree-children');
                    if (children) {
                        children.style.display = children.style.display === 'none' ? 'block' : 'none';
                        toggle.textContent = children.style.display === 'none' ? '▶' : '▼';
                    }
                });
            });

            // Update summary
            let totalParams = 0;
            function countParams(obj) {
                Object.values(obj).forEach(value => {
                    if (value.shape) {
                        totalParams += value.shape.reduce((a, b) => a * b, 1);
                    } else if (typeof value === 'object') {
                        countParams(value);
                    }
                });
            }
            countParams(modelStructure);
            summaryContainer.innerHTML = `Total parameters: ${totalParams.toLocaleString()}`;
        }

        expandBtn.addEventListener('click', () => {
            treeContainer.innerHTML = renderTree(modelStructure, '', true);
            updateTree();
        });

        collapseBtn.addEventListener('click', () => {
            treeContainer.innerHTML = renderTree(modelStructure, '', false);
            updateTree();
        });

        showShapes.addEventListener('change', updateTree);
        showGradients.addEventListener('change', updateTree);

        updateTree();
    }

    // Initialization Comparison
    function createInitComparison() {
        const container = document.getElementById('init-comparison');
        const layerSize = container.querySelector('#layer-size');
        const activationType = container.querySelector('#activation-type');
        const compareBtn = container.querySelector('#compare-init');
        const histContainer = container.querySelector('#init-histograms');
        const statsContainer = container.querySelector('#init-stats');

        compareBtn.addEventListener('click', () => {
            const size = parseInt(layerSize.value);
            const activation = activationType.value;
            
            // Clear previous visualization
            d3.select(histContainer).selectAll('*').remove();
            
            const width = histContainer.offsetWidth;
            const height = 300;
            
            const svg = d3.select(histContainer)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            const methods = [
                { name: 'Xavier', color: '#10099F', variance: 2 / (size + size) },
                { name: 'He', color: '#2DD2C0', variance: 2 / size },
                { name: 'Normal(0.01)', color: '#FFA05F', variance: 0.01 * 0.01 },
                { name: 'Uniform[-1,1]', color: '#FC8484', variance: 1/3 }
            ];

            const chartWidth = (width - 50) / methods.length;
            
            methods.forEach((method, idx) => {
                const g = svg.append('g')
                    .attr('transform', `translate(${idx * chartWidth + 25}, 20)`);

                // Generate sample data
                const samples = [];
                for (let i = 0; i < 1000; i++) {
                    if (method.name === 'Uniform[-1,1]') {
                        samples.push(Math.random() * 2 - 1);
                    } else {
                        // Box-Muller transform for normal distribution
                        const u1 = Math.random();
                        const u2 = Math.random();
                        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                        samples.push(z * Math.sqrt(method.variance));
                    }
                }

                // Create histogram
                const histogram = d3.histogram()
                    .domain([-2, 2])
                    .thresholds(20);

                const bins = histogram(samples);
                
                const xScale = d3.scaleLinear()
                    .domain([-2, 2])
                    .range([0, chartWidth - 10]);

                const yScale = d3.scaleLinear()
                    .domain([0, d3.max(bins, d => d.length)])
                    .range([200, 0]);

                // Draw bars
                g.selectAll('rect')
                    .data(bins)
                    .enter()
                    .append('rect')
                    .attr('x', d => xScale(d.x0))
                    .attr('y', d => yScale(d.length))
                    .attr('width', d => xScale(d.x1) - xScale(d.x0) - 1)
                    .attr('height', d => 200 - yScale(d.length))
                    .attr('fill', method.color)
                    .attr('opacity', 0.7);

                // Add label
                g.append('text')
                    .attr('x', chartWidth / 2 - 5)
                    .attr('y', 220)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '12px')
                    .attr('font-weight', 'bold')
                    .text(method.name);

                // Add variance info
                g.append('text')
                    .attr('x', chartWidth / 2 - 5)
                    .attr('y', 240)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10px')
                    .text(`σ² = ${method.variance.toFixed(4)}`);
            });

            // Update stats
            statsContainer.innerHTML = `
                <strong>Recommendations:</strong><br>
                ${activation === 'relu' ? '✓ He initialization recommended for ReLU' : ''}
                ${activation === 'tanh' ? '✓ Xavier initialization recommended for Tanh' : ''}
                ${activation === 'sigmoid' ? '✓ Xavier initialization recommended for Sigmoid' : ''}
                <br><br>
                Fan-in: ${size}, Fan-out: ${size}
            `;
        });
    }

    // Shared Parameter Visualization
    function createSharedParamViz() {
        const container = document.getElementById('shared-param-viz');
        const forwardBtn = container.querySelector('#forward-shared');
        const backwardBtn = container.querySelector('#backward-shared');
        const updateBtn = container.querySelector('#update-shared');
        const resetBtn = container.querySelector('#reset-shared');
        const networkContainer = container.querySelector('#shared-network');
        const infoContainer = container.querySelector('#shared-info');

        let sharedWeight = 1.0;
        let gradient = 0;

        function drawNetwork() {
            d3.select(networkContainer).selectAll('*').remove();
            
            const width = networkContainer.offsetWidth;
            const height = 300;
            
            const svg = d3.select(networkContainer)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            // Draw network structure
            const layers = [
                { x: 100, y: 150, label: 'Input' },
                { x: 250, y: 100, label: 'Layer 1', shared: true },
                { x: 250, y: 200, label: 'Layer 2', shared: true },
                { x: 400, y: 150, label: 'Output' }
            ];

            // Draw connections
            svg.append('line')
                .attr('x1', layers[0].x)
                .attr('y1', layers[0].y)
                .attr('x2', layers[1].x)
                .attr('y2', layers[1].y)
                .attr('stroke', '#ccc')
                .attr('stroke-width', 2);

            svg.append('line')
                .attr('x1', layers[0].x)
                .attr('y1', layers[0].y)
                .attr('x2', layers[2].x)
                .attr('y2', layers[2].y)
                .attr('stroke', '#ccc')
                .attr('stroke-width', 2);

            svg.append('line')
                .attr('x1', layers[1].x)
                .attr('y1', layers[1].y)
                .attr('x2', layers[3].x)
                .attr('y2', layers[3].y)
                .attr('stroke', '#ccc')
                .attr('stroke-width', 2);

            svg.append('line')
                .attr('x1', layers[2].x)
                .attr('y1', layers[2].y)
                .attr('x2', layers[3].x)
                .attr('y2', layers[3].y)
                .attr('stroke', '#ccc')
                .attr('stroke-width', 2);

            // Draw shared weight indicator
            svg.append('rect')
                .attr('x', 220)
                .attr('y', 140)
                .attr('width', 60)
                .attr('height', 20)
                .attr('fill', '#10099F')
                .attr('opacity', 0.2)
                .attr('stroke', '#10099F')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5');

            svg.append('text')
                .attr('x', 250)
                .attr('y', 155)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .text('Shared');

            // Draw nodes
            layers.forEach(layer => {
                svg.append('circle')
                    .attr('cx', layer.x)
                    .attr('cy', layer.y)
                    .attr('r', 20)
                    .attr('fill', layer.shared ? '#2DD2C0' : '#10099F')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);

                svg.append('text')
                    .attr('x', layer.x)
                    .attr('y', layer.y - 30)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '12px')
                    .text(layer.label);
            });

            // Update info
            infoContainer.innerHTML = `
                <strong>Shared Weight Value:</strong> ${sharedWeight.toFixed(4)}<br>
                <strong>Accumulated Gradient:</strong> ${gradient.toFixed(4)}<br>
                <strong>Status:</strong> Both Layer 1 and Layer 2 share the same weight parameter
            `;
        }

        forwardBtn.addEventListener('click', () => {
            // Simulate forward pass animation
            infoContainer.innerHTML += '<br><em>Forward pass: Data flows through both shared layers...</em>';
        });

        backwardBtn.addEventListener('click', () => {
            gradient = (Math.random() - 0.5) * 0.2 + (Math.random() - 0.5) * 0.2;
            drawNetwork();
            infoContainer.innerHTML += '<br><em>Backward pass: Gradients accumulated from both layers!</em>';
        });

        updateBtn.addEventListener('click', () => {
            sharedWeight -= 0.01 * gradient;
            gradient = 0;
            drawNetwork();
            infoContainer.innerHTML += '<br><em>Weights updated using accumulated gradients</em>';
        });

        resetBtn.addEventListener('click', () => {
            sharedWeight = 1.0;
            gradient = 0;
            drawNetwork();
        });

        drawNetwork();
    }

    // Save/Load Simulator
    function createSaveLoadSimulator() {
        const container = document.getElementById('save-load-sim');
        const trainBtn = container.querySelector('#train-model');
        const saveBtn = container.querySelector('#save-model');
        const corruptBtn = container.querySelector('#corrupt-model');
        const loadBtn = container.querySelector('#load-model');
        const vizContainer = container.querySelector('#model-state-viz');
        const infoContainer = container.querySelector('#checkpoint-list');

        let modelState = {
            weights: Array(5).fill(0).map(() => Math.random()),
            epoch: 0,
            loss: 1.0
        };
        let savedCheckpoint = null;

        function drawModelState() {
            d3.select(vizContainer).selectAll('*').remove();
            
            const width = vizContainer.offsetWidth;
            const height = 250;
            
            const svg = d3.select(vizContainer)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            // Draw weight bars
            const barWidth = (width - 100) / modelState.weights.length;
            
            modelState.weights.forEach((weight, i) => {
                svg.append('rect')
                    .attr('x', i * barWidth + 50)
                    .attr('y', 100 - weight * 80)
                    .attr('width', barWidth - 10)
                    .attr('height', weight * 80)
                    .attr('fill', savedCheckpoint && Math.abs(savedCheckpoint.weights[i] - weight) < 0.01 ? '#2DD2C0' : '#10099F');

                svg.append('text')
                    .attr('x', i * barWidth + 50 + barWidth/2 - 5)
                    .attr('y', 120)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10px')
                    .text(`W${i}`);
            });

            // Model info
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', 200)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .text(`Epoch: ${modelState.epoch} | Loss: ${modelState.loss.toFixed(3)}`);
        }

        trainBtn.addEventListener('click', () => {
            modelState.epoch += 1;
            modelState.loss *= 0.9;
            modelState.weights = modelState.weights.map(w => w + (Math.random() - 0.5) * 0.1);
            drawModelState();
            infoContainer.innerHTML = `<em>Training... Epoch ${modelState.epoch}</em>`;
        });

        saveBtn.addEventListener('click', () => {
            savedCheckpoint = JSON.parse(JSON.stringify(modelState));
            infoContainer.innerHTML = `<strong>Checkpoint saved:</strong> Epoch ${savedCheckpoint.epoch}, Loss ${savedCheckpoint.loss.toFixed(3)}`;
            drawModelState();
        });

        corruptBtn.addEventListener('click', () => {
            modelState = {
                weights: Array(5).fill(0).map(() => Math.random() * 0.1),
                epoch: 0,
                loss: 1.0
            };
            drawModelState();
            infoContainer.innerHTML = '<em>Model reset to random initialization!</em>';
        });

        loadBtn.addEventListener('click', () => {
            if (savedCheckpoint) {
                modelState = JSON.parse(JSON.stringify(savedCheckpoint));
                drawModelState();
                infoContainer.innerHTML = `<strong>Checkpoint loaded:</strong> Restored to Epoch ${modelState.epoch}`;
            } else {
                infoContainer.innerHTML = '<em>No checkpoint available!</em>';
            }
        });

        drawModelState();
    }

    // Parameter Surgery Playground
    function createParameterSurgery() {
        const container = document.getElementById('param-surgery');
        const operationType = container.querySelector('#operation-type');
        const operationAmount = container.querySelector('#operation-amount');
        const amountDisplay = container.querySelector('#amount-display');
        const applyBtn = container.querySelector('#apply-operation');
        const resetBtn = container.querySelector('#reset-surgery');
        const vizContainer = container.querySelector('#surgery-viz');
        const statsContainer = container.querySelector('#surgery-stats');

        let networkState = {
            layers: [
                { name: 'Conv1', params: 1000, frozen: false, pruned: 0 },
                { name: 'Conv2', params: 5000, frozen: false, pruned: 0 },
                { name: 'FC1', params: 10000, frozen: false, pruned: 0 },
                { name: 'FC2', params: 500, frozen: false, pruned: 0 }
            ]
        };

        operationAmount.addEventListener('input', () => {
            amountDisplay.textContent = operationAmount.value + '%';
        });

        function drawNetwork() {
            d3.select(vizContainer).selectAll('*').remove();
            
            const width = vizContainer.offsetWidth;
            const height = 250;
            
            const svg = d3.select(vizContainer)
                .append('svg')
                .attr('width', width)
                .attr('height', height);

            const layerWidth = (width - 100) / networkState.layers.length;

            networkState.layers.forEach((layer, i) => {
                const x = i * layerWidth + 50;
                const y = 100;
                const activeParams = layer.params * (1 - layer.pruned / 100);
                
                // Draw layer box
                svg.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', layerWidth - 20)
                    .attr('height', 80)
                    .attr('fill', layer.frozen ? '#e0e0e0' : '#10099F')
                    .attr('opacity', 0.3)
                    .attr('stroke', layer.frozen ? '#999' : '#10099F')
                    .attr('stroke-width', 2);

                // Draw active parameters
                svg.append('rect')
                    .attr('x', x)
                    .attr('y', y + 80 - (activeParams / layer.params * 80))
                    .attr('width', layerWidth - 20)
                    .attr('height', activeParams / layer.params * 80)
                    .attr('fill', layer.frozen ? '#999' : '#2DD2C0')
                    .attr('opacity', 0.7);

                // Layer name
                svg.append('text')
                    .attr('x', x + layerWidth/2 - 10)
                    .attr('y', y - 10)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '12px')
                    .attr('font-weight', 'bold')
                    .text(layer.name);

                // Stats
                svg.append('text')
                    .attr('x', x + layerWidth/2 - 10)
                    .attr('y', y + 100)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10px')
                    .text(`${activeParams.toFixed(0)} params`);

                if (layer.frozen) {
                    svg.append('text')
                        .attr('x', x + layerWidth/2 - 10)
                        .attr('y', y + 115)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '10px')
                        .attr('fill', '#FC8484')
                        .text('FROZEN');
                }
            });

            // Update stats
            const totalParams = networkState.layers.reduce((sum, l) => sum + l.params, 0);
            const activeParams = networkState.layers.reduce((sum, l) => 
                sum + (l.frozen ? 0 : l.params * (1 - l.pruned / 100)), 0);
            
            statsContainer.innerHTML = `
                <strong>Total Parameters:</strong> ${totalParams.toLocaleString()}<br>
                <strong>Active Parameters:</strong> ${activeParams.toLocaleString()}<br>
                <strong>Reduction:</strong> ${((1 - activeParams/totalParams) * 100).toFixed(1)}%<br>
                <strong>Memory Saved:</strong> ${((totalParams - activeParams) * 4 / 1024).toFixed(1)} KB
            `;
        }

        applyBtn.addEventListener('click', () => {
            const operation = operationType.value;
            const amount = parseInt(operationAmount.value);

            switch(operation) {
                case 'freeze':
                    networkState.layers.forEach((layer, i) => {
                        if (i < networkState.layers.length * amount / 100) {
                            layer.frozen = true;
                        }
                    });
                    break;
                case 'prune':
                    networkState.layers.forEach(layer => {
                        if (!layer.frozen) {
                            layer.pruned = amount;
                        }
                    });
                    break;
                case 'quantize':
                    // Simulate quantization effect
                    networkState.layers.forEach(layer => {
                        layer.params = Math.floor(layer.params * (100 - amount) / 100);
                    });
                    break;
                case 'groups':
                    // Simulate parameter grouping
                    networkState.layers.forEach((layer, i) => {
                        layer.frozen = i % 2 === 0;
                    });
                    break;
            }
            drawNetwork();
        });

        resetBtn.addEventListener('click', () => {
            networkState = {
                layers: [
                    { name: 'Conv1', params: 1000, frozen: false, pruned: 0 },
                    { name: 'Conv2', params: 5000, frozen: false, pruned: 0 },
                    { name: 'FC1', params: 10000, frozen: false, pruned: 0 },
                    { name: 'FC2', params: 500, frozen: false, pruned: 0 }
                ]
            };
            drawNetwork();
        });

        drawNetwork();
    }

    // Custom Distribution Visualizer for Parameter Initialization
    function createCustomDistViz() {
        const container = document.getElementById('custom-dist-viz');
        if (!container) return;

        const generateBtn = container.querySelector('#generate-custom');
        const applyBtn = container.querySelector('#apply-to-network');
        const sampleSizeInput = container.querySelector('#sample-size');
        const histogramDiv = container.querySelector('#dist-histogram');
        const networkDiv = container.querySelector('#network-weights');
        const statsDiv = container.querySelector('#dist-stats');

        let currentDistribution = [];
        let networkWeights = [];

        // Generate custom distribution
        function generateCustomDistribution(size) {
            const dist = [];
            for (let i = 0; i < size; i++) {
                const rand = Math.random();
                let value;
                if (rand < 0.25) {
                    // 25% chance: U(5, 10)
                    value = Math.random() * 5 + 5;
                } else if (rand < 0.75) {
                    // 50% chance: 0
                    value = 0;
                } else {
                    // 25% chance: U(-10, -5)
                    value = Math.random() * 5 - 10;
                }
                dist.push(value);
            }
            return dist;
        }

        // Draw histogram
        function drawHistogram(data) {
            // Clear previous
            d3.select(histogramDiv).selectAll('*').remove();

            const margin = { top: 20, right: 30, bottom: 40, left: 50 };
            const width = histogramDiv.clientWidth - margin.left - margin.right;
            const height = histogramDiv.clientHeight - margin.top - margin.bottom;

            const svg = d3.select(histogramDiv)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Create bins
            const bins = d3.histogram()
                .domain([-10, 10])
                .thresholds(40)(data);

            // Scales
            const x = d3.scaleLinear()
                .domain([-10, 10])
                .range([0, width]);

            const y = d3.scaleLinear()
                .domain([0, d3.max(bins, d => d.length)])
                .range([height, 0]);

            // Draw bars
            g.selectAll('.bar')
                .data(bins)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', d => x(d.x0))
                .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
                .attr('y', d => y(d.length))
                .attr('height', d => height - y(d.length))
                .attr('fill', d => {
                    const midpoint = (d.x0 + d.x1) / 2;
                    if (Math.abs(midpoint) < 5) return '#999';  // Zero region
                    else if (midpoint > 0) return '#2DD2C0';     // Positive region
                    else return '#FC8484';                       // Negative region
                })
                .attr('opacity', 0.8);

            // Add axes
            g.append('g')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x));

            g.append('g')
                .call(d3.axisLeft(y));

            // Labels
            g.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 0 - margin.left)
                .attr('x', 0 - (height / 2))
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .text('Count');

            g.append('text')
                .attr('x', width / 2)
                .attr('y', height + margin.bottom)
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .text('Value');

            // Add regions labels
            g.append('text')
                .attr('x', x(-7.5))
                .attr('y', -5)
                .style('font-size', '10px')
                .style('fill', '#FC8484')
                .text('U(-10, -5)');

            g.append('text')
                .attr('x', x(0))
                .attr('y', -5)
                .style('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('fill', '#999')
                .text('Zero');

            g.append('text')
                .attr('x', x(7.5))
                .attr('y', -5)
                .style('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('fill', '#2DD2C0')
                .text('U(5, 10)');
        }

        // Draw network weights visualization
        function drawNetworkWeights(weights) {
            // Clear previous
            d3.select(networkDiv).selectAll('*').remove();

            const margin = { top: 20, right: 30, bottom: 40, left: 30 };
            const width = networkDiv.clientWidth - margin.left - margin.right;
            const height = networkDiv.clientHeight - margin.top - margin.bottom;

            const svg = d3.select(networkDiv)
                .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom);

            const g = svg.append('g')
                .attr('transform', `translate(${margin.left},${margin.top})`);

            // Create a grid of weights
            const gridSize = Math.ceil(Math.sqrt(weights.length));
            const cellSize = Math.min(width / gridSize, height / gridSize);

            // Color scale
            const colorScale = d3.scaleLinear()
                .domain([-10, 0, 10])
                .range(['#FC8484', '#999', '#2DD2C0']);

            // Draw weight grid
            weights.forEach((weight, i) => {
                const row = Math.floor(i / gridSize);
                const col = i % gridSize;

                g.append('rect')
                    .attr('x', col * cellSize)
                    .attr('y', row * cellSize)
                    .attr('width', cellSize - 1)
                    .attr('height', cellSize - 1)
                    .attr('fill', weight === 0 ? '#f0f0f0' : colorScale(weight))
                    .attr('opacity', weight === 0 ? 0.3 : 0.8)
                    .append('title')
                    .text(`Weight[${i}] = ${weight.toFixed(2)}`);
            });

            // Add title
            svg.append('text')
                .attr('x', width / 2 + margin.left)
                .attr('y', 15)
                .style('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .text('Network Weight Matrix');
        }

        // Calculate statistics
        function calculateStats(data) {
            const nonZero = data.filter(d => d !== 0);
            const zeros = data.filter(d => d === 0).length;
            const positive = data.filter(d => d > 0);
            const negative = data.filter(d => d < 0);

            return {
                total: data.length,
                zeros: zeros,
                zeroPercent: (zeros / data.length * 100).toFixed(1),
                positive: positive.length,
                positivePercent: (positive.length / data.length * 100).toFixed(1),
                negative: negative.length,
                negativePercent: (negative.length / data.length * 100).toFixed(1),
                mean: d3.mean(nonZero) || 0,
                std: d3.deviation(nonZero) || 0,
                min: d3.min(data),
                max: d3.max(data)
            };
        }

        // Event handlers
        generateBtn.addEventListener('click', () => {
            const size = parseInt(sampleSizeInput.value);
            currentDistribution = generateCustomDistribution(size);
            drawHistogram(currentDistribution);
            
            const stats = calculateStats(currentDistribution);
            statsDiv.innerHTML = `
                <strong>Distribution Statistics:</strong><br>
                Total Samples: ${stats.total}<br>
                Zeros: ${stats.zeros} (${stats.zeroPercent}%)<br>
                Positive [5,10]: ${stats.positive} (${stats.positivePercent}%)<br>
                Negative [-10,-5]: ${stats.negative} (${stats.negativePercent}%)<br>
                Non-zero Mean: ${stats.mean.toFixed(3)}<br>
                Non-zero Std: ${stats.std.toFixed(3)}<br>
                Range: [${stats.min.toFixed(2)}, ${stats.max.toFixed(2)}]
            `;
        });

        applyBtn.addEventListener('click', () => {
            // Simulate applying to a small network layer
            networkWeights = generateCustomDistribution(64); // 8x8 weight matrix
            drawNetworkWeights(networkWeights);
            
            // Update stats
            const stats = calculateStats(networkWeights);
            statsDiv.innerHTML += `<br><br>
                <strong>Applied to Network Layer (8×8):</strong><br>
                Active Weights: ${64 - stats.zeros} / 64<br>
                Sparsity: ${stats.zeroPercent}%<br>
                Memory: ${(64 - stats.zeros) * 4} bytes (vs ${64 * 4} bytes)
            `;
        });

        // Initialize with sample
        generateBtn.click();
    }

    // Update the initialization comparison visualization
    function createInitComparison() {
        const container = document.getElementById('init-comparison');
        if (!container) return;

        const compareBtn = container.querySelector('#compare-init');
        const layerSizeInput = container.querySelector('#layer-size');
        const activationType = container.querySelector('#activation-type');
        const histogramsDiv = container.querySelector('#init-histograms');
        const statsDiv = container.querySelector('#init-stats');

        if (!compareBtn) return;

        function generateInitializations(size, activation) {
            const methods = {};
            
            // Xavier/Glorot
            const xavierStd = Math.sqrt(2 / (size + size));
            methods.xavier = d3.range(1000).map(() => d3.randomNormal(0, xavierStd)());
            
            // He/Kaiming
            const heStd = Math.sqrt(2 / size);
            methods.he = d3.range(1000).map(() => d3.randomNormal(0, heStd)());
            
            // Normal(0, 0.01)
            methods.normal = d3.range(1000).map(() => d3.randomNormal(0, 0.01)());
            
            // Uniform(-0.1, 0.1)
            methods.uniform = d3.range(1000).map(() => Math.random() * 0.2 - 0.1);
            
            return methods;
        }

        function drawComparison(methods) {
            // Clear previous
            d3.select(histogramsDiv).selectAll('*').remove();

            const margin = { top: 20, right: 30, bottom: 40, left: 50 };
            const width = (histogramsDiv.clientWidth - margin.left - margin.right) / 2 - 10;
            const height = (histogramsDiv.clientHeight - margin.top - margin.bottom) / 2 - 10;

            const methodNames = Object.keys(methods);
            const colors = ['#10099F', '#2DD2C0', '#FFA05F', '#FC8484'];

            methodNames.forEach((method, idx) => {
                const row = Math.floor(idx / 2);
                const col = idx % 2;
                
                const svg = d3.select(histogramsDiv)
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .style('display', 'inline-block');

                const g = svg.append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`);

                const data = methods[method];
                
                // Create bins
                const extent = d3.extent(data);
                const bins = d3.histogram()
                    .domain(extent)
                    .thresholds(30)(data);

                // Scales
                const x = d3.scaleLinear()
                    .domain(extent)
                    .range([0, width]);

                const y = d3.scaleLinear()
                    .domain([0, d3.max(bins, d => d.length)])
                    .range([height, 0]);

                // Draw bars
                g.selectAll('.bar')
                    .data(bins)
                    .enter().append('rect')
                    .attr('x', d => x(d.x0))
                    .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
                    .attr('y', d => y(d.length))
                    .attr('height', d => height - y(d.length))
                    .attr('fill', colors[idx])
                    .attr('opacity', 0.7);

                // Add axes
                g.append('g')
                    .attr('transform', `translate(0,${height})`)
                    .call(d3.axisBottom(x).ticks(5));

                g.append('g')
                    .call(d3.axisLeft(y).ticks(5));

                // Title
                g.append('text')
                    .attr('x', width / 2)
                    .attr('y', -5)
                    .style('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .text(method.charAt(0).toUpperCase() + method.slice(1));
            });
        }

        compareBtn.addEventListener('click', () => {
            const size = parseInt(layerSizeInput.value);
            const activation = activationType.value;
            
            const methods = generateInitializations(size, activation);
            drawComparison(methods);
            
            // Calculate statistics
            let statsHtml = '<strong>Initialization Statistics:</strong><br>';
            Object.entries(methods).forEach(([name, values]) => {
                const mean = d3.mean(values);
                const std = d3.deviation(values);
                const recommended = (activation === 'relu' && name === 'he') ||
                                  (activation !== 'relu' && name === 'xavier');
                
                statsHtml += `${name}: μ=${mean.toFixed(4)}, σ=${std.toFixed(4)}`;
                if (recommended) statsHtml += ' <span style="color: #2DD2C0;">✓ Recommended</span>';
                statsHtml += '<br>';
            });
            
            statsDiv.innerHTML = statsHtml;
        });

        // Initialize with default
        compareBtn.click();
    }

    // Lazy Initialization Flow Visualization
    function createLazyInitFlow() {
        const container = d3.select('#lazy-init-flow');
        const width = container.node().clientWidth;
        const height = 400;
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const g = svg.append('g')
            .attr('transform', 'translate(40, 40)');
        
        // Define the network layers
        const layers = [
            { name: 'Input', neurons: 3, x: 100, initialized: false },
            { name: 'LazyLinear(256)', neurons: 4, x: 300, initialized: false },
            { name: 'ReLU', neurons: 4, x: 500, initialized: true },
            { name: 'LazyLinear(10)', neurons: 2, x: 700, initialized: false }
        ];
        
        let currentStep = 0;
        const steps = [
            { description: 'Network defined with unknown dimensions', layers: [false, false, true, false] },
            { description: 'First data batch shape detected: (2, 20)', layers: [true, false, true, false] },
            { description: 'Layer 1 initializes: Weight shape (256, 20)', layers: [true, true, true, false] },
            { description: 'Layer 2 initializes: Weight shape (10, 256)', layers: [true, true, true, true] }
        ];
        
        // Draw neurons
        function drawNetwork() {
            // Clear previous
            g.selectAll('.layer-group').remove();
            
            layers.forEach((layer, layerIdx) => {
                const layerGroup = g.append('g')
                    .attr('class', 'layer-group');
                
                const yStart = (height - 300 - layer.neurons * 60) / 2;
                
                // Draw neurons
                for (let i = 0; i < layer.neurons; i++) {
                    layerGroup.append('circle')
                        .attr('cx', layer.x)
                        .attr('cy', yStart + i * 60 + 30)
                        .attr('r', 20)
                        .attr('fill', steps[currentStep].layers[layerIdx] ? '#10099F' : '#EEEEEE')
                        .attr('stroke', '#666')
                        .attr('stroke-width', 2);
                    
                    // Add "?" for uninitialized dimensions
                    if (!steps[currentStep].layers[layerIdx] && layerIdx !== 2) {
                        layerGroup.append('text')
                            .attr('x', layer.x)
                            .attr('y', yStart + i * 60 + 35)
                            .attr('text-anchor', 'middle')
                            .style('font-size', '18px')
                            .style('font-weight', 'bold')
                            .style('fill', '#666')
                            .text('?');
                    }
                }
                
                // Layer labels
                layerGroup.append('text')
                    .attr('x', layer.x)
                    .attr('y', height - 60)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .style('fill', steps[currentStep].layers[layerIdx] ? '#10099F' : '#666')
                    .text(layer.name);
                
                // Add dimension labels for initialized layers
                if (steps[currentStep].layers[layerIdx] && layerIdx !== 2) {
                    const dims = layerIdx === 0 ? '(2, 20)' : 
                                 layerIdx === 1 ? '(256, 20)' : 
                                 '(10, 256)';
                    layerGroup.append('text')
                        .attr('x', layer.x)
                        .attr('y', height - 40)
                        .attr('text-anchor', 'middle')
                        .style('font-size', '11px')
                        .style('fill', '#2DD2C0')
                        .text(dims);
                }
            });
            
            // Draw connections
            for (let i = 0; i < layers.length - 1; i++) {
                if (i === 2) continue; // Skip ReLU connections
                
                const layer1 = layers[i];
                const layer2 = layers[i + 1];
                const initialized = steps[currentStep].layers[i] && steps[currentStep].layers[i + 1];
                
                g.append('line')
                    .attr('x1', layer1.x + 20)
                    .attr('y1', height / 2)
                    .attr('x2', layer2.x - 20)
                    .attr('y2', height / 2)
                    .attr('stroke', initialized ? '#2DD2C0' : '#CCCCCC')
                    .attr('stroke-width', initialized ? 3 : 2)
                    .attr('opacity', 0.5);
            }
            
            // Status text
            g.selectAll('.status-text').remove();
            g.append('text')
                .attr('class', 'status-text')
                .attr('x', width / 2 - 40)
                .attr('y', 30)
                .attr('text-anchor', 'middle')
                .style('font-size', '14px')
                .style('font-weight', 'bold')
                .style('fill', '#10099F')
                .text(steps[currentStep].description);
        }
        
        // Initial draw
        drawNetwork();
        
        // Button handlers
        const initBtn = document.getElementById('lazy-init-btn');
        const resetBtn = document.getElementById('lazy-reset-btn');
        
        initBtn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                drawNetwork();
                
                if (currentStep === steps.length - 1) {
                    initBtn.textContent = 'Initialization Complete';
                    initBtn.disabled = true;
                }
            }
        });
        
        resetBtn.addEventListener('click', () => {
            currentStep = 0;
            drawNetwork();
            initBtn.textContent = 'Start Initialization';
            initBtn.disabled = false;
        });
    }
    
    // Lazy Initialization Interactive Demo
    function createLazyInitDemo() {
        const container = d3.select('#lazy-init-demo');
        const width = container.node().clientWidth;
        const height = 400;
        
        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const g = svg.append('g')
            .attr('transform', 'translate(50, 50)');
        
        // UI elements
        const slider = document.getElementById('input-dim-slider');
        const dimValue = document.getElementById('input-dim-value');
        const initBtn = document.getElementById('init-network-btn');
        const codeDisplay = document.getElementById('demo-code');
        
        let initialized = false;
        let inputDim = 20;
        
        // Update slider display
        slider.addEventListener('input', (e) => {
            inputDim = parseInt(e.target.value);
            dimValue.textContent = inputDim;
            
            if (initialized) {
                resetNetwork();
            }
        });
        
        function resetNetwork() {
            initialized = false;
            initBtn.textContent = 'Initialize Network';
            drawNetwork();
            updateCode();
        }
        
        function drawNetwork() {
            g.selectAll('*').remove();
            
            const layers = [
                { name: 'Input', size: inputDim, y: 50 },
                { name: 'LazyLinear(256)', size: 256, y: 150 },
                { name: 'LazyLinear(10)', size: 10, y: 250 }
            ];
            
            // Draw layers
            layers.forEach((layer, idx) => {
                const layerG = g.append('g');
                
                // Layer box
                layerG.append('rect')
                    .attr('x', 100)
                    .attr('y', layer.y)
                    .attr('width', 600)
                    .attr('height', 60)
                    .attr('fill', initialized ? '#E8F4FD' : '#F5F5F5')
                    .attr('stroke', initialized ? '#10099F' : '#999')
                    .attr('stroke-width', 2)
                    .attr('rx', 5);
                
                // Layer name
                layerG.append('text')
                    .attr('x', 120)
                    .attr('y', layer.y + 25)
                    .style('font-weight', 'bold')
                    .style('font-size', '14px')
                    .text(layer.name);
                
                // Dimensions
                let dimText = '';
                if (initialized) {
                    if (idx === 0) dimText = `Shape: (batch, ${inputDim})`;
                    else if (idx === 1) dimText = `Weight: (256, ${inputDim}), Bias: (256,)`;
                    else dimText = `Weight: (10, 256), Bias: (10,)`;
                } else {
                    if (idx === 0) dimText = 'Shape: Unknown';
                    else dimText = 'Weight: Uninitialized, Bias: Uninitialized';
                }
                
                layerG.append('text')
                    .attr('x', 120)
                    .attr('y', layer.y + 45)
                    .style('font-size', '12px')
                    .style('fill', initialized ? '#2DD2C0' : '#666')
                    .text(dimText);
                
                // Parameter count
                if (initialized && idx > 0) {
                    const params = idx === 1 ? 
                        (256 * inputDim + 256) : 
                        (10 * 256 + 10);
                    
                    layerG.append('text')
                        .attr('x', 600)
                        .attr('y', layer.y + 35)
                        .style('font-size', '11px')
                        .style('fill', '#666')
                        .text(`${params.toLocaleString()} params`);
                }
            });
            
            // Draw connections
            if (initialized) {
                // Connection 1
                g.append('path')
                    .attr('d', 'M 400 110 L 400 150')
                    .attr('stroke', '#2DD2C0')
                    .attr('stroke-width', 3)
                    .attr('fill', 'none')
                    .attr('marker-end', 'url(#arrowhead)');
                
                // Connection 2
                g.append('path')
                    .attr('d', 'M 400 210 L 400 250')
                    .attr('stroke', '#2DD2C0')
                    .attr('stroke-width', 3)
                    .attr('fill', 'none')
                    .attr('marker-end', 'url(#arrowhead)');
            }
            
            // Arrow marker
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 5)
                .attr('refY', 0)
                .attr('markerWidth', 5)
                .attr('markerHeight', 5)
                .attr('orient', 'auto')
                .append('path')
                .attr('d', 'M 0,-5 L 10,0 L 0,5')
                .attr('fill', '#2DD2C0');
        }
        
        function updateCode() {
            const code = initialized ? 
`# Network initialized with input dimension ${inputDim}
import torch
from torch import nn

# Define network with lazy layers
net = nn.Sequential(
    nn.LazyLinear(256),
    nn.ReLU(),
    nn.LazyLinear(10)
)

# Pass first batch - triggers initialization
X = torch.rand(32, ${inputDim})
output = net(X)

# Check initialized shapes
print(net[0].weight.shape)  # torch.Size([256, ${inputDim}])
print(net[2].weight.shape)  # torch.Size([10, 256])

# Total parameters: ${((256 * inputDim + 256) + (10 * 256 + 10)).toLocaleString()}` :
`# Network not yet initialized
import torch
from torch import nn

# Define network with lazy layers
net = nn.Sequential(
    nn.LazyLinear(256),  # Input dimension unknown
    nn.ReLU(),
    nn.LazyLinear(10)    # Previous layer dimension unknown
)

# Parameters exist but are uninitialized
# Attempting to access weights would raise an error

# Need to pass data through network to initialize`;
            
            codeDisplay.textContent = code;
            
            // Re-highlight code if Reveal highlight is available
            if (typeof Reveal !== 'undefined' && Reveal.getPlugin('highlight')) {
                Reveal.getPlugin('highlight').highlightBlock(codeDisplay);
            }
        }
        
        initBtn.addEventListener('click', () => {
            initialized = true;
            initBtn.textContent = 'Network Initialized!';
            drawNetwork();
            updateCode();
            
            setTimeout(() => {
                initBtn.textContent = 'Reset Network';
            }, 1500);
        });
        
        // Initialize
        drawNetwork();
        updateCode();
    }

    // === CUSTOM LAYER VISUALIZATIONS ===
    
    // CenteredLayer Visual Demonstration
    function createCenteredLayerVisual() {
        const container = document.getElementById('centered-layer-visual');
        if (!container || container.dataset.initialized) return;
        container.dataset.initialized = 'true';
        
        const width = container.clientWidth;
        const height = 300;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const data = [1, 2, 3, 4, 5];
        const mean = d3.mean(data);
        const centered = data.map(d => d - mean);
        
        const xScale = d3.scaleLinear()
            .domain([0, data.length - 1])
            .range([50, width - 50]);
        
        const yScale = d3.scaleLinear()
            .domain([-3, 6])
            .range([height - 40, 20]);
        
        // Add axes
        svg.append('g')
            .attr('transform', `translate(0, ${yScale(0)})`)
            .call(d3.axisBottom(xScale).ticks(data.length));
        
        svg.append('g')
            .attr('transform', 'translate(40, 0)')
            .call(d3.axisLeft(yScale));
        
        // Add mean line
        svg.append('line')
            .attr('x1', 50)
            .attr('x2', width - 50)
            .attr('y1', yScale(mean))
            .attr('y2', yScale(mean))
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
        
        svg.append('text')
            .attr('x', width - 45)
            .attr('y', yScale(mean) - 5)
            .text(`mean = ${mean}`)
            .attr('fill', '#FC8484')
            .attr('font-size', '12px');
        
        // Original data points
        svg.selectAll('.orig-point')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'orig-point')
            .attr('cx', (d, i) => xScale(i))
            .attr('cy', d => yScale(d))
            .attr('r', 6)
            .attr('fill', '#10099F')
            .attr('opacity', 0.7);
        
        // Centered data points
        svg.selectAll('.centered-point')
            .data(centered)
            .enter()
            .append('circle')
            .attr('class', 'centered-point')
            .attr('cx', (d, i) => xScale(i))
            .attr('cy', d => yScale(d))
            .attr('r', 6)
            .attr('fill', '#2DD2C0')
            .attr('opacity', 0)
            .transition()
            .delay((d, i) => i * 100)
            .duration(500)
            .attr('opacity', 0.7);
        
        // Add arrows showing the transformation
        svg.selectAll('.transform-arrow')
            .data(data)
            .enter()
            .append('line')
            .attr('class', 'transform-arrow')
            .attr('x1', (d, i) => xScale(i))
            .attr('y1', d => yScale(d))
            .attr('x2', (d, i) => xScale(i))
            .attr('y2', (d, i) => yScale(centered[i]))
            .attr('stroke', '#FFA05F')
            .attr('stroke-width', 1)
            .attr('marker-end', 'url(#arrowhead)')
            .attr('opacity', 0)
            .transition()
            .delay((d, i) => i * 100 + 200)
            .duration(500)
            .attr('opacity', 0.5);
        
        // Arrow marker
        svg.append('defs')
            .append('marker')
            .attr('id', 'arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 5)
            .attr('refY', 0)
            .attr('markerWidth', 5)
            .attr('markerHeight', 5)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#FFA05F');
    }
    
    // Interactive CenteredLayer Demo
    function createCenteredLayerDemo() {
        const container = document.getElementById('centered-layer-demo');
        if (!container || container.dataset.initialized) return;
        container.dataset.initialized = 'true';
        
        const width = container.clientWidth;
        const height = 400;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const inputField = document.getElementById('centered-input-values');
        const updateBtn = document.getElementById('centered-update-btn');
        const randomBtn = document.getElementById('centered-random-btn');
        const meanDisplay = document.getElementById('centered-mean-value');
        const outputDisplay = document.getElementById('centered-output-values');
        
        function updateVisualization() {
            // Parse input values
            const values = inputField.value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            if (values.length === 0) return;
            
            const mean = d3.mean(values);
            const centered = values.map(v => v - mean);
            
            // Update displays
            meanDisplay.textContent = mean.toFixed(2);
            outputDisplay.textContent = '[' + centered.map(v => v.toFixed(2)).join(', ') + ']';
            
            // Clear previous visualization
            svg.selectAll('*').remove();
            
            const xScale = d3.scaleBand()
                .domain(values.map((_, i) => i))
                .range([60, width - 60])
                .padding(0.2);
            
            const yExtent = d3.extent([...values, ...centered, 0]);
            const yPadding = Math.abs(yExtent[1] - yExtent[0]) * 0.1;
            
            const yScale = d3.scaleLinear()
                .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
                .range([height - 40, 40]);
            
            // Add axes
            svg.append('g')
                .attr('transform', `translate(0, ${yScale(0)})`)
                .append('line')
                .attr('x1', 50)
                .attr('x2', width - 50)
                .attr('stroke', '#333')
                .attr('stroke-width', 1);
            
            svg.append('g')
                .attr('transform', 'translate(50, 0)')
                .call(d3.axisLeft(yScale).ticks(8));
            
            // Mean line
            svg.append('line')
                .attr('x1', 50)
                .attr('x2', width - 50)
                .attr('y1', yScale(mean))
                .attr('y2', yScale(mean))
                .attr('stroke', '#FC8484')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '5,5')
                .attr('opacity', 0)
                .transition()
                .duration(500)
                .attr('opacity', 1);
            
            svg.append('text')
                .attr('x', width - 45)
                .attr('y', yScale(mean) - 5)
                .text(`mean`)
                .attr('fill', '#FC8484')
                .attr('font-size', '12px')
                .attr('opacity', 0)
                .transition()
                .duration(500)
                .attr('opacity', 1);
            
            // Input bars
            svg.selectAll('.input-bar')
                .data(values)
                .enter()
                .append('rect')
                .attr('class', 'input-bar')
                .attr('x', (d, i) => xScale(i))
                .attr('y', d => d >= 0 ? yScale(d) : yScale(0))
                .attr('width', xScale.bandwidth() / 2 - 2)
                .attr('height', d => Math.abs(yScale(d) - yScale(0)))
                .attr('fill', '#10099F')
                .attr('opacity', 0.7);
            
            // Output bars
            svg.selectAll('.output-bar')
                .data(centered)
                .enter()
                .append('rect')
                .attr('class', 'output-bar')
                .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2 + 2)
                .attr('y', d => d >= 0 ? yScale(d) : yScale(0))
                .attr('width', xScale.bandwidth() / 2 - 2)
                .attr('height', 0)
                .attr('fill', '#2DD2C0')
                .attr('opacity', 0.7)
                .transition()
                .delay((d, i) => i * 50)
                .duration(500)
                .attr('height', d => Math.abs(yScale(d) - yScale(0)));
            
            // Labels
            svg.selectAll('.index-label')
                .data(values)
                .enter()
                .append('text')
                .attr('x', (d, i) => xScale(i) + xScale.bandwidth() / 2)
                .attr('y', height - 20)
                .text((d, i) => `x[${i}]`)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11px')
                .attr('fill', '#666');
            
            // Legend
            const legend = svg.append('g')
                .attr('transform', `translate(${width - 150}, 20)`);
            
            legend.append('rect')
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', '#10099F')
                .attr('opacity', 0.7);
            
            legend.append('text')
                .attr('x', 20)
                .attr('y', 12)
                .text('Input')
                .attr('font-size', '12px');
            
            legend.append('rect')
                .attr('y', 20)
                .attr('width', 15)
                .attr('height', 15)
                .attr('fill', '#2DD2C0')
                .attr('opacity', 0.7);
            
            legend.append('text')
                .attr('x', 20)
                .attr('y', 32)
                .text('Centered Output')
                .attr('font-size', '12px');
        }
        
        updateBtn.addEventListener('click', updateVisualization);
        
        randomBtn.addEventListener('click', () => {
            const count = 5 + Math.floor(Math.random() * 5);
            const values = Array.from({length: count}, () => (Math.random() * 10 - 2).toFixed(1));
            inputField.value = values.join(', ');
            updateVisualization();
        });
        
        // Initial visualization
        updateVisualization();
    }
    
    // MyLinear Flow Visualization
    function createMyLinearFlow() {
        const container = document.getElementById('mylinear-flow-visual');
        if (!container || container.dataset.initialized) return;
        container.dataset.initialized = 'true';
        
        const width = container.clientWidth;
        const height = 250;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const stages = [
            { x: width * 0.15, label: 'Input\nx', color: '#10099F' },
            { x: width * 0.35, label: 'Weights\nW', color: '#10099F' },
            { x: width * 0.5, label: 'Linear\nWx + b', color: '#2DD2C0' },
            { x: width * 0.7, label: 'ReLU\nmax(0, z)', color: '#FC8484' },
            { x: width * 0.85, label: 'Output\ny', color: '#FFA05F' }
        ];
        
        const y = height / 2;
        
        // Draw connections
        for (let i = 0; i < stages.length - 1; i++) {
            svg.append('line')
                .attr('x1', stages[i].x + 30)
                .attr('y1', y)
                .attr('x2', stages[i + 1].x - 30)
                .attr('y2', y)
                .attr('stroke', '#ddd')
                .attr('stroke-width', 2)
                .attr('marker-end', 'url(#arrow-mylinear)');
        }
        
        // Draw stages
        stages.forEach((stage, i) => {
            const g = svg.append('g')
                .attr('transform', `translate(${stage.x}, ${y})`);
            
            g.append('circle')
                .attr('r', 30)
                .attr('fill', stage.color)
                .attr('opacity', 0)
                .transition()
                .delay(i * 200)
                .duration(500)
                .attr('opacity', 0.2);
            
            g.append('circle')
                .attr('r', 30)
                .attr('fill', 'none')
                .attr('stroke', stage.color)
                .attr('stroke-width', 2)
                .attr('opacity', 0)
                .transition()
                .delay(i * 200)
                .duration(500)
                .attr('opacity', 1);
            
            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('dy', '0.3em')
                .text(stage.label)
                .attr('font-size', '12px')
                .attr('fill', '#333')
                .attr('opacity', 0)
                .transition()
                .delay(i * 200 + 200)
                .duration(300)
                .attr('opacity', 1)
                .selectAll('tspan')
                .data(stage.label.split('\n'))
                .enter()
                .append('tspan')
                .attr('x', 0)
                .attr('dy', (d, i) => i === 0 ? '-0.3em' : '1.2em')
                .text(d => d);
        });
        
        // Arrow marker
        svg.append('defs')
            .append('marker')
            .attr('id', 'arrow-mylinear')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#999');
        
        // Animate flow
        function animateFlow() {
            const particle = svg.append('circle')
                .attr('r', 4)
                .attr('fill', '#FFA05F')
                .attr('cx', stages[0].x)
                .attr('cy', y);
            
            stages.forEach((stage, i) => {
                if (i > 0) {
                    particle.transition()
                        .delay(i * 600)
                        .duration(600)
                        .attr('cx', stage.x);
                }
            });
            
            particle.transition()
                .delay(stages.length * 600)
                .duration(200)
                .attr('opacity', 0)
                .remove();
        }
        
        // Repeat animation
        animateFlow();
        setInterval(animateFlow, 4000);
    }
    
    // MyLinear Interactive Demo
    function createMyLinearDemo() {
        const container = document.getElementById('mylinear-demo');
        if (!container || container.dataset.initialized) return;
        container.dataset.initialized = 'true';
        
        const width = container.clientWidth;
        const height = 450;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);
        
        const inputSizeSlider = document.getElementById('mylinear-input-size');
        const outputSizeSlider = document.getElementById('mylinear-output-size');
        const inputSizeValue = document.getElementById('mylinear-input-size-value');
        const outputSizeValue = document.getElementById('mylinear-output-size-value');
        const randomizeBtn = document.getElementById('mylinear-randomize-btn');
        
        let weights = [];
        let bias = [];
        
        function initializeWeights() {
            const inputSize = parseInt(inputSizeSlider.value);
            const outputSize = parseInt(outputSizeSlider.value);
            
            weights = Array.from({length: inputSize}, () => 
                Array.from({length: outputSize}, () => (Math.random() - 0.5) * 2)
            );
            bias = Array.from({length: outputSize}, () => (Math.random() - 0.5));
        }
        
        function drawNetwork() {
            svg.selectAll('*').remove();
            
            const inputSize = parseInt(inputSizeSlider.value);
            const outputSize = parseInt(outputSizeSlider.value);
            
            const layerX = [width * 0.2, width * 0.5, width * 0.8];
            
            // Input nodes
            const inputY = d3.scaleLinear()
                .domain([0, inputSize - 1])
                .range([100, height - 100]);
            
            // Hidden (linear) nodes
            const linearY = d3.scaleLinear()
                .domain([0, outputSize - 1])
                .range([150, height - 150]);
            
            // Output nodes (after ReLU)
            const outputY = d3.scaleLinear()
                .domain([0, outputSize - 1])
                .range([150, height - 150]);
            
            // Draw connections (weights)
            for (let i = 0; i < inputSize; i++) {
                for (let j = 0; j < outputSize; j++) {
                    const weight = weights[i][j];
                    svg.append('line')
                        .attr('x1', layerX[0])
                        .attr('y1', inputY(i))
                        .attr('x2', layerX[1])
                        .attr('y2', linearY(j))
                        .attr('stroke', weight > 0 ? '#10099F' : '#FC8484')
                        .attr('stroke-width', Math.abs(weight) * 2)
                        .attr('opacity', Math.min(0.3 + Math.abs(weight) * 0.3, 0.8));
                }
            }
            
            // Draw connections (after ReLU)
            for (let j = 0; j < outputSize; j++) {
                svg.append('line')
                    .attr('x1', layerX[1])
                    .attr('y1', linearY(j))
                    .attr('x2', layerX[2])
                    .attr('y2', outputY(j))
                    .attr('stroke', '#2DD2C0')
                    .attr('stroke-width', 2)
                    .attr('opacity', 0.5);
            }
            
            // Draw input nodes
            for (let i = 0; i < inputSize; i++) {
                svg.append('circle')
                    .attr('cx', layerX[0])
                    .attr('cy', inputY(i))
                    .attr('r', 12)
                    .attr('fill', '#10099F')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
                
                svg.append('text')
                    .attr('x', layerX[0] - 30)
                    .attr('y', inputY(i) + 4)
                    .text(`x${i}`)
                    .attr('text-anchor', 'end')
                    .attr('font-size', '12px')
                    .attr('fill', '#333');
            }
            
            // Draw linear nodes
            for (let j = 0; j < outputSize; j++) {
                svg.append('circle')
                    .attr('cx', layerX[1])
                    .attr('cy', linearY(j))
                    .attr('r', 14)
                    .attr('fill', '#2DD2C0')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
                
                // Show bias
                svg.append('text')
                    .attr('x', layerX[1])
                    .attr('y', linearY(j) - 20)
                    .text(`b${j}=${bias[j].toFixed(2)}`)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10px')
                    .attr('fill', '#666');
            }
            
            // Draw output nodes (after ReLU)
            for (let j = 0; j < outputSize; j++) {
                svg.append('circle')
                    .attr('cx', layerX[2])
                    .attr('cy', outputY(j))
                    .attr('r', 12)
                    .attr('fill', '#FC8484')
                    .attr('stroke', 'white')
                    .attr('stroke-width', 2);
                
                svg.append('text')
                    .attr('x', layerX[2] + 30)
                    .attr('y', outputY(j) + 4)
                    .text(`y${j}`)
                    .attr('text-anchor', 'start')
                    .attr('font-size', '12px')
                    .attr('fill', '#333');
            }
            
            // Labels
            svg.append('text')
                .attr('x', layerX[0])
                .attr('y', 60)
                .text('Input')
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', '#10099F');
            
            svg.append('text')
                .attr('x', layerX[1])
                .attr('y', 60)
                .text('Wx + b')
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', '#2DD2C0');
            
            svg.append('text')
                .attr('x', layerX[2])
                .attr('y', 60)
                .text('ReLU Output')
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px')
                .attr('font-weight', 'bold')
                .attr('fill', '#FC8484');
            
            // Weight matrix visualization
            const matrixG = svg.append('g')
                .attr('transform', `translate(${width * 0.15}, ${height - 80})`);
            
            matrixG.append('text')
                .attr('x', 0)
                .attr('y', -5)
                .text(`Weight Matrix W (${inputSize}×${outputSize})`)
                .attr('font-size', '12px')
                .attr('fill', '#666');
            
            const cellSize = Math.min(20, 150 / Math.max(inputSize, outputSize));
            
            for (let i = 0; i < inputSize; i++) {
                for (let j = 0; j < outputSize; j++) {
                    const weight = weights[i][j];
                    matrixG.append('rect')
                        .attr('x', j * cellSize)
                        .attr('y', i * cellSize)
                        .attr('width', cellSize - 1)
                        .attr('height', cellSize - 1)
                        .attr('fill', weight > 0 ? '#10099F' : '#FC8484')
                        .attr('opacity', Math.abs(weight) * 0.5 + 0.2);
                }
            }
        }
        
        inputSizeSlider.addEventListener('input', () => {
            inputSizeValue.textContent = inputSizeSlider.value;
            initializeWeights();
            drawNetwork();
        });
        
        outputSizeSlider.addEventListener('input', () => {
            outputSizeValue.textContent = outputSizeSlider.value;
            initializeWeights();
            drawNetwork();
        });
        
        randomizeBtn.addEventListener('click', () => {
            initializeWeights();
            drawNetwork();
        });
        
        // Initialize
        initializeWeights();
        drawNetwork();
    }
    
    // Initialize custom layer visualizations
    function initSlideVisualizations(slide) {
        if (!slide) return;
        
        // Call existing initialization functions...
        // [Previous visualization initialization code remains here]
        
        // Add custom layer visualizations
        if (slide.querySelector('#centered-layer-visual')) {
            createCenteredLayerVisual();
        }
        
        if (slide.querySelector('#centered-layer-demo')) {
            createCenteredLayerDemo();
        }
        
        if (slide.querySelector('#mylinear-flow-visual')) {
            createMyLinearFlow();
        }
        
        if (slide.querySelector('#mylinear-demo')) {
            createMyLinearDemo();
        }
        
        // Module Hierarchy Visualization
        if (slide.querySelector('#module-hierarchy')) {
            createModuleHierarchy();
        }

        // Forward Flow Visualization
        if (slide.querySelector('#forward-flow-viz')) {
            createForwardFlowViz();
        }

        // MLP Builder
        if (slide.querySelector('#mlp-builder')) {
            createMLPBuilder();
        }

        // Sequential Flow
        if (slide.querySelector('#sequential-flow')) {
            createSequentialFlow();
        }

        // Control Flow Simulator
        if (slide.querySelector('#control-flow-sim')) {
            createControlFlowSim();
        }

        // Module Tree
        if (slide.querySelector('#module-tree')) {
            createModuleTree();
        }

        // Module Composer
        if (slide.querySelector('#module-composer')) {
            createModuleComposer();
        }

        // === PARAMETER MANAGEMENT VISUALIZATIONS ===
        
        // Parameter Lifecycle
        if (slide.querySelector('#param-lifecycle')) {
            createParameterLifecycle();
        }

        // Parameter Inspector
        if (slide.querySelector('#param-inspector')) {
            createParameterInspector();
        }

        // Parameter Tree Explorer
        if (slide.querySelector('#param-tree-explorer')) {
            createParameterTreeExplorer();
        }

        // Initialization Comparison
        if (slide.querySelector('#init-comparison')) {
            createInitComparison();
        }

        // Shared Parameter Visualization
        if (slide.querySelector('#shared-param-viz')) {
            createSharedParamViz();
        }

        // Save/Load Simulator
        if (slide.querySelector('#save-load-sim')) {
            createSaveLoadSimulator();
        }

        // Parameter Surgery Playground
        if (slide.querySelector('#param-surgery')) {
            createParameterSurgery();
        }

        // === LAZY INITIALIZATION VISUALIZATIONS ===
        
        // Lazy Init Network
        if (slide.querySelector('#lazy-init-network')) {
            createLazyInitNetwork();
        }

        // Lazy Init Timeline
        if (slide.querySelector('#lazy-init-timeline')) {
            createLazyInitTimeline();
        }

        // Framework Comparison
        if (slide.querySelector('#framework-lazy-comparison')) {
            createFrameworkLazyComparison();
        }

        // Interactive Lazy Init Demo
        if (slide.querySelector('#lazy-init-demo')) {
            createLazyInitDemo();
        }

        // === FILE I/O VISUALIZATIONS ===
        
        // IO Workflow Visualization
        if (slide.querySelector('#io-workflow-container')) {
            createIOWorkflow();
        }

        // Tensor Size Visualization
        if (slide.querySelector('#tensor-size-viz')) {
            createTensorSizeViz();
        }

        // State Dict Visualization
        if (slide.querySelector('#state-dict-container')) {
            createStateDictViz();
        }

        // Model Comparison Visualization
        if (slide.querySelector('#model-comparison-container')) {
            createModelComparisonViz();
        }

        // Checkpoint Timeline
        if (slide.querySelector('#checkpoint-timeline-viz')) {
            createCheckpointTimeline();
        }

        // Transfer Learning Visualization
        if (slide.querySelector('#transfer-learning-viz')) {
            createTransferLearningViz();
        }

        // Tab Switching for Code Examples
        setupCodeTabs();
    }

    // === FILE I/O VISUALIZATION FUNCTIONS ===
    
    function createIOWorkflow() {
        const container = d3.select('#io-workflow-container');
        if (container.empty()) return;
        
        container.selectAll('*').remove();
        const width = container.node().getBoundingClientRect().width;
        const height = 400;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create workflow stages
        const stages = [
            { x: width * 0.15, y: height * 0.5, label: 'Model\nTraining', icon: '🧠' },
            { x: width * 0.35, y: height * 0.5, label: 'Extract\nParameters', icon: '📤' },
            { x: width * 0.5, y: height * 0.5, label: 'Serialize\nto Disk', icon: '💾' },
            { x: width * 0.65, y: height * 0.5, label: 'Load from\nDisk', icon: '📥' },
            { x: width * 0.85, y: height * 0.5, label: 'Restore\nModel', icon: '🔄' }
        ];

        // Add arrowhead marker
        svg.append('defs').append('marker')
            .attr('id', 'io-arrowhead')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 45)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#10099F');

        // Draw connections
        const connections = svg.append('g').attr('class', 'connections');
        for (let i = 0; i < stages.length - 1; i++) {
            connections.append('line')
                .attr('x1', stages[i].x + 40)
                .attr('y1', stages[i].y)
                .attr('x2', stages[i + 1].x - 40)
                .attr('y2', stages[i + 1].y)
                .attr('stroke', '#EEEEEE')
                .attr('stroke-width', 3)
                .attr('marker-end', 'url(#io-arrowhead)');
        }

        // Draw stages
        const stageGroups = svg.selectAll('.stage')
            .data(stages)
            .enter()
            .append('g')
            .attr('class', 'stage')
            .attr('transform', d => `translate(${d.x}, ${d.y})`);

        stageGroups.append('circle')
            .attr('r', 40)
            .attr('fill', 'white')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 3);

        stageGroups.append('text')
            .attr('y', -5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px')
            .text(d => d.icon);

        stageGroups.append('text')
            .attr('y', 70)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', 'bold')
            .attr('fill', '#10099F')
            .selectAll('tspan')
            .data(d => d.label.split('\n'))
            .enter()
            .append('tspan')
            .attr('x', 0)
            .attr('dy', (d, i) => i === 0 ? 0 : '1.2em')
            .text(d => d);

        // Animate workflow button
        d3.select('#io-workflow-animate').on('click', function() {
            animateWorkflow();
        });

        d3.select('#io-workflow-reset').on('click', function() {
            resetWorkflow();
        });

        function animateWorkflow() {
            // Remove existing particles
            svg.selectAll('.particle').remove();
            
            // Create animated particle
            const particle = svg.append('circle')
                .attr('class', 'particle')
                .attr('r', 8)
                .attr('fill', '#2DD2C0')
                .attr('cx', stages[0].x)
                .attr('cy', stages[0].y);

            // Animate through stages
            stages.forEach((stage, i) => {
                if (i < stages.length - 1) {
                    particle.transition()
                        .delay(i * 800)
                        .duration(800)
                        .attr('cx', stages[i + 1].x)
                        .attr('cy', stages[i + 1].y)
                        .on('start', function() {
                            // Highlight current stage
                            stageGroups.filter((d, idx) => idx === i + 1)
                                .select('circle')
                                .transition()
                                .duration(400)
                                .attr('fill', '#E8F4FF');
                        });
                }
            });

            // Remove particle at end
            particle.transition()
                .delay(stages.length * 800)
                .remove();
        }

        function resetWorkflow() {
            svg.selectAll('.stage circle')
                .transition()
                .duration(300)
                .attr('fill', 'white');
            svg.selectAll('.particle').remove();
        }
    }

    function createTensorSizeViz() {
        const container = d3.select('#tensor-size-viz');
        if (container.empty()) return;
        
        container.selectAll('*').remove();
        const width = container.node().getBoundingClientRect().width;
        const height = 200;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Sample tensor sizes
        const tensorSizes = [
            { name: 'Scalar', shape: '[]', elements: 1, size: '4B' },
            { name: 'Vector', shape: '[100]', elements: 100, size: '400B' },
            { name: 'Matrix', shape: '[256, 512]', elements: 131072, size: '512KB' },
            { name: 'Conv Weights', shape: '[64, 3, 7, 7]', elements: 9408, size: '37KB' }
        ];

        const barHeight = 30;
        const margin = { top: 20, right: 100, bottom: 20, left: 120 };
        const chartWidth = width - margin.left - margin.right;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Scale for bar width
        const xScale = d3.scaleLog()
            .domain([1, 150000])
            .range([10, chartWidth]);

        // Draw bars
        const bars = g.selectAll('.bar')
            .data(tensorSizes)
            .enter()
            .append('g')
            .attr('class', 'bar')
            .attr('transform', (d, i) => `translate(0, ${i * (barHeight + 10)})`);

        bars.append('rect')
            .attr('width', d => xScale(d.elements))
            .attr('height', barHeight)
            .attr('fill', '#10099F')
            .attr('rx', 4)
            .style('opacity', 0)
            .transition()
            .delay((d, i) => i * 100)
            .duration(500)
            .style('opacity', 1);

        bars.append('text')
            .attr('x', -10)
            .attr('y', barHeight / 2)
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .text(d => d.name);

        bars.append('text')
            .attr('x', d => xScale(d.elements) + 10)
            .attr('y', barHeight / 2)
            .attr('alignment-baseline', 'middle')
            .attr('font-size', '11px')
            .attr('fill', '#666')
            .text(d => `${d.shape} → ${d.size}`);
    }

    function createStateDictViz() {
        const container = d3.select('#state-dict-container');
        if (container.empty()) return;
        
        container.selectAll('*').remove();
        const width = container.node().getBoundingClientRect().width;
        const height = 300;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Model structure
        const layers = [
            { name: 'hidden.weight', shape: '[256, 20]', params: 5120 },
            { name: 'hidden.bias', shape: '[256]', params: 256 },
            { name: 'output.weight', shape: '[10, 256]', params: 2560 },
            { name: 'output.bias', shape: '[10]', params: 10 }
        ];

        const g = svg.append('g')
            .attr('transform', 'translate(50, 50)');

        // Draw state dict as a tree
        const nodeHeight = 50;
        const nodeWidth = 180;

        // Root node
        g.append('rect')
            .attr('x', width / 2 - nodeWidth / 2 - 50)
            .attr('y', 0)
            .attr('width', nodeWidth)
            .attr('height', 40)
            .attr('fill', '#10099F')
            .attr('rx', 5);

        g.append('text')
            .attr('x', width / 2 - 50)
            .attr('y', 25)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-weight', 'bold')
            .text('state_dict()');

        // Parameter nodes
        layers.forEach((layer, i) => {
            const x = (i % 2 === 0 ? width / 3 : 2 * width / 3) - nodeWidth / 2 - 50;
            const y = 80 + Math.floor(i / 2) * 80;

            // Connection line
            g.append('line')
                .attr('x1', width / 2 - 50)
                .attr('y1', 40)
                .attr('x2', x + nodeWidth / 2)
                .attr('y2', y)
                .attr('stroke', '#CCCCCC')
                .attr('stroke-width', 2)
                .style('opacity', 0)
                .transition()
                .delay(i * 200)
                .duration(500)
                .style('opacity', 1);

            // Parameter node
            const node = g.append('g')
                .attr('transform', `translate(${x}, ${y})`)
                .style('opacity', 0);

            node.transition()
                .delay(i * 200 + 300)
                .duration(500)
                .style('opacity', 1);

            node.append('rect')
                .attr('width', nodeWidth)
                .attr('height', nodeHeight)
                .attr('fill', 'white')
                .attr('stroke', '#2DD2C0')
                .attr('stroke-width', 2)
                .attr('rx', 5);

            node.append('text')
                .attr('x', nodeWidth / 2)
                .attr('y', 20)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 'bold')
                .attr('font-size', '12px')
                .text(layer.name);

            node.append('text')
                .attr('x', nodeWidth / 2)
                .attr('y', 37)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11px')
                .attr('fill', '#666')
                .text(`${layer.shape} (${layer.params.toLocaleString()} params)`);
        });

        // Total parameters
        const totalParams = layers.reduce((sum, l) => sum + l.params, 0);
        g.append('text')
            .attr('x', width / 2 - 50)
            .attr('y', 270)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('fill', '#10099F')
            .text(`Total: ${totalParams.toLocaleString()} parameters`)
            .style('opacity', 0)
            .transition()
            .delay(1000)
            .duration(500)
            .style('opacity', 1);
    }

    function createModelComparisonViz() {
        const container = d3.select('#model-comparison-container');
        if (container.empty()) return;
        
        container.selectAll('*').remove();
        const width = container.node().getBoundingClientRect().width;
        const height = 400;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Two models side by side
        const modelWidth = 150;
        const modelHeight = 250;
        const spacing = 100;

        const originalX = width / 2 - spacing - modelWidth;
        const cloneX = width / 2 + spacing;

        // Draw original model
        drawModel(svg, originalX, 50, 'Original Model', '#10099F');

        // Draw cloned model
        drawModel(svg, cloneX, 50, 'Cloned Model', '#2DD2C0');

        // Comparison controls
        const outputDisplay = d3.select('#comparison-output');

        d3.select('#compare-models').on('click', function() {
            // Simulate comparison
            outputDisplay.html(`
                <div style="color: green; font-weight: bold;">✓ Models Match!</div>
                <pre>Original output: tensor([[0.1234, -0.5678, ...]])
Clone output:    tensor([[0.1234, -0.5678, ...]])
Difference:      tensor([[0.0000, 0.0000, ...]])</pre>
            `);

            // Animate connection
            const connectionLine = svg.append('line')
                .attr('x1', originalX + modelWidth)
                .attr('y1', 175)
                .attr('x2', originalX + modelWidth)
                .attr('y2', 175)
                .attr('stroke', '#2DD2C0')
                .attr('stroke-width', 3)
                .style('stroke-dasharray', '5,5');

            connectionLine.transition()
                .duration(500)
                .attr('x2', cloneX);
        });

        d3.select('#add-noise').on('click', function() {
            // Simulate adding noise
            outputDisplay.html(`
                <div style="color: orange; font-weight: bold;">⚠ Noise Added to Clone</div>
                <pre>Original output: tensor([[0.1234, -0.5678, ...]])
Clone output:    tensor([[0.1456, -0.5432, ...]])
Difference:      tensor([[0.0222, 0.0246, ...]])</pre>
            `);

            // Remove connection line
            svg.selectAll('line').remove();
        });

        d3.select('#reset-comparison').on('click', function() {
            outputDisplay.html('');
            svg.selectAll('line').remove();
        });

        function drawModel(svg, x, y, label, color) {
            const g = svg.append('g')
                .attr('transform', `translate(${x}, ${y})`);

            // Model box
            g.append('rect')
                .attr('width', modelWidth)
                .attr('height', modelHeight)
                .attr('fill', 'white')
                .attr('stroke', color)
                .attr('stroke-width', 3)
                .attr('rx', 10);

            // Label
            g.append('text')
                .attr('x', modelWidth / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 'bold')
                .attr('fill', color)
                .text(label);

            // Layers
            const layers = ['Input', 'Hidden', 'Output'];
            const layerHeight = 60;

            layers.forEach((layer, i) => {
                const layerY = 30 + i * 80;

                g.append('rect')
                    .attr('x', 10)
                    .attr('y', layerY)
                    .attr('width', modelWidth - 20)
                    .attr('height', layerHeight)
                    .attr('fill', i === 1 ? '#F0F0F0' : '#F8F8F8')
                    .attr('stroke', '#CCCCCC')
                    .attr('rx', 5);

                g.append('text')
                    .attr('x', modelWidth / 2)
                    .attr('y', layerY + layerHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('alignment-baseline', 'middle')
                    .text(layer);
            });
        }
    }

    function createCheckpointTimeline() {
        const container = d3.select('#checkpoint-timeline-viz');
        if (container.empty()) return;
        
        container.selectAll('*').remove();
        const width = container.node().getBoundingClientRect().width;
        const height = 150;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Timeline data
        const checkpoints = [
            { epoch: 0, loss: 2.3 },
            { epoch: 10, loss: 1.8 },
            { epoch: 20, loss: 1.2 },
            { epoch: 30, loss: 0.9 },
            { epoch: 40, loss: 0.7 },
            { epoch: 50, loss: 0.5 }
        ];

        const margin = { top: 20, right: 30, bottom: 30, left: 50 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Scales
        const xScale = d3.scaleLinear()
            .domain([0, 50])
            .range([0, chartWidth]);

        // Draw axis
        g.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale).ticks(5))
            .append('text')
            .attr('x', chartWidth / 2)
            .attr('y', 30)
            .attr('fill', 'black')
            .style('text-anchor', 'middle')
            .text('Epoch');

        // Draw timeline
        g.append('line')
            .attr('x1', 0)
            .attr('y1', chartHeight / 2)
            .attr('x2', chartWidth)
            .attr('y2', chartHeight / 2)
            .attr('stroke', '#CCCCCC')
            .attr('stroke-width', 2);

        // Draw checkpoints
        const checkpointGroups = g.selectAll('.checkpoint')
            .data(checkpoints)
            .enter()
            .append('g')
            .attr('class', 'checkpoint')
            .attr('transform', d => `translate(${xScale(d.epoch)}, ${chartHeight / 2})`)
            .style('opacity', 0);

        checkpointGroups.transition()
            .delay((d, i) => i * 200)
            .duration(500)
            .style('opacity', 1);

        checkpointGroups.append('circle')
            .attr('r', 8)
            .attr('fill', '#10099F');

        checkpointGroups.append('text')
            .attr('y', -15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('fill', '#666')
            .text(d => `Loss: ${d.loss}`);

        // Add save icon at checkpoints
        checkpointGroups.append('text')
            .attr('y', 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .text('💾');
    }

    function createTransferLearningViz() {
        const container = d3.select('#transfer-learning-viz');
        if (container.empty()) return;
        
        container.selectAll('*').remove();
        const width = container.node().getBoundingClientRect().width;
        const height = 250;

        const svg = container.append('svg')
            .attr('width', width)
            .attr('height', height);

        // Draw pretrained and fine-tuned models
        const modelWidth = 120;
        const layerHeight = 40;
        const layers = ['Conv1', 'Conv2', 'Conv3', 'FC'];

        // Pretrained model
        const pretrainedX = width / 3 - modelWidth / 2;
        drawTransferModel(svg, pretrainedX, 30, 'Pretrained', layers, [true, true, true, false]);

        // Arrow marker
        svg.append('defs').append('marker')
            .attr('id', 'transfer-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 8)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#10099F');

        // Arrow
        svg.append('path')
            .attr('d', `M${pretrainedX + modelWidth + 20},${height / 2} L${2 * width / 3 - modelWidth / 2 - 20},${height / 2}`)
            .attr('stroke', '#10099F')
            .attr('stroke-width', 3)
            .attr('marker-end', 'url(#transfer-arrow)')
            .style('opacity', 0)
            .transition()
            .delay(500)
            .duration(500)
            .style('opacity', 1);

        // Fine-tuned model
        const finetunedX = 2 * width / 3 - modelWidth / 2;
        setTimeout(() => {
            drawTransferModel(svg, finetunedX, 30, 'Fine-tuned', layers, [true, true, true, true]);
        }, 800);

        function drawTransferModel(svg, x, y, label, layers, frozen) {
            const g = svg.append('g')
                .attr('transform', `translate(${x}, ${y})`)
                .style('opacity', 0);

            g.transition()
                .duration(500)
                .style('opacity', 1);

            // Label
            g.append('text')
                .attr('x', modelWidth / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 'bold')
                .attr('fill', '#10099F')
                .text(label);

            // Layers
            layers.forEach((layer, i) => {
                const layerY = i * (layerHeight + 5);
                const isFrozen = !frozen[i];

                const layerG = g.append('g')
                    .attr('transform', `translate(0, ${layerY})`);

                layerG.append('rect')
                    .attr('width', modelWidth)
                    .attr('height', layerHeight)
                    .attr('fill', isFrozen ? '#E0E0E0' : '#2DD2C0')
                    .attr('stroke', '#999')
                    .attr('stroke-width', 2)
                    .attr('rx', 5);

                layerG.append('text')
                    .attr('x', modelWidth / 2)
                    .attr('y', layerHeight / 2)
                    .attr('text-anchor', 'middle')
                    .attr('alignment-baseline', 'middle')
                    .attr('font-weight', 'bold')
                    .attr('fill', isFrozen ? '#666' : 'white')
                    .text(layer);

                if (isFrozen) {
                    layerG.append('text')
                        .attr('x', modelWidth - 10)
                        .attr('y', layerHeight / 2)
                        .attr('text-anchor', 'end')
                        .attr('alignment-baseline', 'middle')
                        .attr('font-size', '16px')
                        .text('🔒');
                }
            });
        }
    }

    function setupCodeTabs() {
        // Setup tab switching for all code tabs
        document.querySelectorAll('.tab-header').forEach(button => {
            button.addEventListener('click', function() {
                const framework = this.getAttribute('data-framework');
                const tabGroup = this.closest('.code-tabs');
                
                if (!tabGroup) return;
                
                // Update active tab header
                tabGroup.querySelectorAll('.tab-header').forEach(h => h.classList.remove('active'));
                this.classList.add('active');
                
                // Update active tab content
                tabGroup.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
                const targetPane = tabGroup.querySelector(`.tab-pane[data-framework="${framework}"]`);
                if (targetPane) {
                    targetPane.classList.add('active');
                }
            });
        });
    }

    // ===========================
    // GPU VISUALIZATIONS
    // ===========================

    // GPU Timeline Visualization
    window.createGPUTimeline = function() {
        const container = document.getElementById('gpu-timeline-viz');
        if (!container || container.querySelector('svg')) return;

        const width = container.clientWidth;
        const height = 400;
        const margin = {top: 40, right: 60, bottom: 60, left: 80};
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Data: GPU performance over time
        const data = [
            {year: 2000, performance: 1, label: 'GeForce 256'},
            {year: 2005, performance: 10, label: 'GeForce 7800'},
            {year: 2010, performance: 100, label: 'Tesla C2050'},
            {year: 2015, performance: 1000, label: 'Tesla K80'},
            {year: 2020, performance: 10000, label: 'A100'},
            {year: 2024, performance: 50000, label: 'H100'}
        ];

        const xScale = d3.scaleLinear()
            .domain([2000, 2025])
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLog()
            .domain([1, 100000])
            .range([height - margin.bottom, margin.top]);

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale).tickFormat(d => d + 'x'));

        // Add axis labels
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height - 10)
            .style('text-anchor', 'middle')
            .text('Year');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 20)
            .attr('x', -height / 2)
            .style('text-anchor', 'middle')
            .text('Relative Performance');

        // Create line
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.performance))
            .curve(d3.curveMonotoneX);

        // Add the line with animation
        const path = svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 3)
            .attr('d', line);

        const totalLength = path.node().getTotalLength();
        
        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .ease(d3.easeLinear)
            .attr('stroke-dashoffset', 0);

        // Add points with labels
        setTimeout(() => {
            const points = svg.selectAll('.point')
                .data(data)
                .enter().append('g')
                .attr('class', 'point')
                .attr('transform', d => `translate(${xScale(d.year)},${yScale(d.performance)})`);

            points.append('circle')
                .attr('r', 0)
                .attr('fill', '#2DD2C0')
                .transition()
                .delay((d, i) => i * 200)
                .duration(500)
                .attr('r', 6);

            points.append('text')
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('opacity', 0)
                .text(d => d.label)
                .transition()
                .delay((d, i) => i * 200 + 500)
                .duration(500)
                .style('opacity', 1);
        }, 2000);
    }

    // Device Transfer Visualization
    window.createDeviceTransferViz = function() {
        const container = document.getElementById('device-transfer-viz');
        if (!container || container.querySelector('svg')) return;

        const width = container.clientWidth;
        const height = 350;
        
        const svg = d3.select(container)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create device representations
        const devices = [
            {name: 'CPU', x: width * 0.2, y: height * 0.5, color: '#10099F'},
            {name: 'GPU 0', x: width * 0.5, y: height * 0.3, color: '#2DD2C0'},
            {name: 'GPU 1', x: width * 0.8, y: height * 0.3, color: '#FC8484'}
        ];

        // Draw devices
        const deviceGroups = svg.selectAll('.device')
            .data(devices)
            .enter().append('g')
            .attr('class', 'device')
            .attr('transform', d => `translate(${d.x},${d.y})`);

        deviceGroups.append('rect')
            .attr('x', -60)
            .attr('y', -40)
            .attr('width', 120)
            .attr('height', 80)
            .attr('fill', d => d.color)
            .attr('opacity', 0.2)
            .attr('rx', 10);

        deviceGroups.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 5)
            .style('font-weight', 'bold')
            .text(d => d.name);

        // Animate data flow
        function animateFlow() {
            const particle = svg.append('circle')
                .attr('cx', devices[0].x)
                .attr('cy', devices[0].y)
                .attr('r', 5)
                .attr('fill', '#FFA05F');

            particle.transition()
                .duration(1500)
                .attr('cx', devices[1].x)
                .attr('cy', devices[1].y)
                .transition()
                .duration(1500)
                .attr('cx', devices[2].x)
                .attr('cy', devices[2].y)
                .transition()
                .duration(200)
                .attr('r', 0)
                .remove()
                .on('end', () => {
                    setTimeout(animateFlow, 1000);
                });
        }
        
        setTimeout(animateFlow, 500);
    }

    // Interactive Transfer Demo
    window.createTransferDemo = function() {
        const vizContainer = document.getElementById('transfer-viz');
        const infoContainer = document.getElementById('transfer-info');
        if (!vizContainer || vizContainer.querySelector('svg')) return;

        const width = vizContainer.clientWidth;
        const height = 350;
        
        const svg = d3.select(vizContainer)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // State management
        let tensorX = null;
        let tensorY = {device: 'GPU 1', value: '[Y tensor]'};

        // Device layout
        const devices = {
            'CPU': {x: width * 0.2, y: height * 0.5, color: '#10099F'},
            'GPU 0': {x: width * 0.5, y: height * 0.5, color: '#2DD2C0'},
            'GPU 1': {x: width * 0.8, y: height * 0.5, color: '#FC8484'}
        };

        // Draw devices
        Object.entries(devices).forEach(([name, device]) => {
            const g = svg.append('g')
                .attr('class', 'device-group')
                .attr('transform', `translate(${device.x},${device.y})`);

            g.append('rect')
                .attr('x', -70)
                .attr('y', -50)
                .attr('width', 140)
                .attr('height', 100)
                .attr('fill', device.color)
                .attr('opacity', 0.15)
                .attr('stroke', device.color)
                .attr('stroke-width', 2)
                .attr('rx', 10);

            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('y', -20)
                .style('font-weight', 'bold')
                .style('font-size', '16px')
                .text(name);

            g.append('text')
                .attr('class', `tensor-${name.replace(' ', '-')}`)
                .attr('text-anchor', 'middle')
                .attr('y', 20)
                .style('font-size', '14px');
        });

        // Initially show Y on GPU 1
        svg.select('.tensor-GPU-1').text(tensorY.value);
        if (infoContainer) {
            infoContainer.textContent = 'Y tensor is on GPU 1. Create X tensor and try operations.';
        }

        // Button handlers
        document.getElementById('create-cpu')?.addEventListener('click', () => {
            tensorX = {device: 'CPU', value: '[X tensor]'};
            updateDisplay();
            if (infoContainer) infoContainer.textContent = 'Created tensor X on CPU';
        });

        document.getElementById('create-gpu0')?.addEventListener('click', () => {
            tensorX = {device: 'GPU 0', value: '[X tensor]'};
            updateDisplay();
            if (infoContainer) infoContainer.textContent = 'Created tensor X on GPU 0';
        });

        document.getElementById('transfer-gpu')?.addEventListener('click', () => {
            if (!tensorX) {
                if (infoContainer) infoContainer.textContent = '⚠️ Create tensor X first!';
                return;
            }
            animateTransfer(tensorX.device, 'GPU 1');
            tensorX.device = 'GPU 1';
            setTimeout(() => {
                updateDisplay();
                if (infoContainer) infoContainer.textContent = 'Transferred X to GPU 1 (same device as Y)';
            }, 1000);
        });

        document.getElementById('compute-op')?.addEventListener('click', () => {
            if (!tensorX) {
                if (infoContainer) infoContainer.textContent = '⚠️ Create tensor X first!';
                return;
            }
            if (tensorX.device !== tensorY.device) {
                if (infoContainer) infoContainer.textContent = '❌ Error: Tensors on different devices!';
                return;
            }
            if (infoContainer) infoContainer.textContent = '✅ Computed X + Y successfully on ' + tensorX.device;
            
            const device = devices[tensorX.device];
            const result = svg.append('text')
                .attr('x', device.x)
                .attr('y', device.y + 40)
                .attr('text-anchor', 'middle')
                .style('font-size', '16px')
                .style('fill', '#2DD2C0')
                .style('font-weight', 'bold')
                .text('[Result]')
                .style('opacity', 0);
            
            result.transition()
                .duration(500)
                .style('opacity', 1)
                .transition()
                .delay(2000)
                .duration(500)
                .style('opacity', 0)
                .remove();
        });

        document.getElementById('reset-transfer')?.addEventListener('click', () => {
            tensorX = null;
            updateDisplay();
            if (infoContainer) infoContainer.textContent = 'Reset complete. Y tensor remains on GPU 1.';
        });

        function updateDisplay() {
            svg.selectAll('[class^="tensor-"]').text('');
            svg.select('.tensor-GPU-1').text(tensorY.value);
            
            if (tensorX) {
                svg.select(`.tensor-${tensorX.device.replace(' ', '-')}`).text(tensorX.value);
            }
        }

        function animateTransfer(from, to) {
            const fromDevice = devices[from];
            const toDevice = devices[to];
            
            const particle = svg.append('circle')
                .attr('cx', fromDevice.x)
                .attr('cy', fromDevice.y)
                .attr('r', 8)
                .attr('fill', '#FFA05F');
            
            particle.transition()
                .duration(1000)
                .attr('cx', toDevice.x)
                .attr('cy', toDevice.y)
                .transition()
                .duration(200)
                .attr('r', 0)
                .remove();
        }
    }

    // Model GPU Demo
    window.createModelGPUDemo = function() {
        const vizContainer = document.getElementById('model-viz');
        if (!vizContainer || vizContainer.querySelector('svg')) return;

        const width = vizContainer.clientWidth;
        const height = 350;
        
        const svg = d3.select(vizContainer)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        let model = null;
        let modelDevice = 'CPU';

        const devices = {
            'CPU': {x: width * 0.3, y: height * 0.5, color: '#10099F'},
            'GPU': {x: width * 0.7, y: height * 0.5, color: '#2DD2C0'}
        };

        Object.entries(devices).forEach(([name, device]) => {
            const g = svg.append('g')
                .attr('transform', `translate(${device.x},${device.y})`);

            g.append('rect')
                .attr('x', -80)
                .attr('y', -60)
                .attr('width', 160)
                .attr('height', 120)
                .attr('fill', device.color)
                .attr('opacity', 0.15)
                .attr('stroke', device.color)
                .attr('stroke-width', 2)
                .attr('rx', 10);

            g.append('text')
                .attr('text-anchor', 'middle')
                .attr('y', -30)
                .style('font-weight', 'bold')
                .style('font-size', '18px')
                .text(name);

            g.append('g')
                .attr('class', `model-${name}`)
                .attr('transform', 'translate(0, 20)');
        });

        document.getElementById('create-model')?.addEventListener('click', () => {
            model = {
                layers: ['Linear(10, 5)', 'ReLU()', 'Linear(5, 1)'],
                device: 'CPU'
            };
            modelDevice = 'CPU';
            drawModel('CPU');
        });

        document.getElementById('move-gpu')?.addEventListener('click', () => {
            if (!model) return;
            animateModelTransfer();
            modelDevice = 'GPU';
            setTimeout(() => {
                svg.select('.model-CPU').selectAll('*').remove();
                drawModel('GPU');
            }, 1000);
        });

        document.getElementById('check-params')?.addEventListener('click', () => {
            if (!model) return;
            highlightParameters(modelDevice);
        });

        document.getElementById('forward-pass')?.addEventListener('click', () => {
            if (!model) return;
            animateForwardPass(modelDevice);
        });

        document.getElementById('reset-model')?.addEventListener('click', () => {
            model = null;
            svg.selectAll('.model-CPU > *').remove();
            svg.selectAll('.model-GPU > *').remove();
        });

        function drawModel(device) {
            const g = svg.select(`.model-${device}`);
            
            model.layers.forEach((layer, i) => {
                g.append('rect')
                    .attr('x', -60)
                    .attr('y', i * 25 - 30)
                    .attr('width', 120)
                    .attr('height', 20)
                    .attr('fill', '#fff')
                    .attr('stroke', devices[device].color)
                    .attr('stroke-width', 2)
                    .attr('rx', 3)
                    .style('opacity', 0)
                    .transition()
                    .delay(i * 100)
                    .duration(300)
                    .style('opacity', 1);

                g.append('text')
                    .attr('x', 0)
                    .attr('y', i * 25 - 18)
                    .attr('text-anchor', 'middle')
                    .style('font-size', '12px')
                    .text(layer)
                    .style('opacity', 0)
                    .transition()
                    .delay(i * 100)
                    .duration(300)
                    .style('opacity', 1);
            });
        }

        function animateModelTransfer() {
            const fromPos = devices['CPU'];
            const toPos = devices['GPU'];
            
            const transferGroup = svg.append('g')
                .attr('transform', `translate(${fromPos.x},${fromPos.y})`);
            
            model.layers.forEach((layer, i) => {
                transferGroup.append('rect')
                    .attr('x', -60)
                    .attr('y', i * 25 - 10)
                    .attr('width', 120)
                    .attr('height', 20)
                    .attr('fill', '#FFA05F')
                    .attr('opacity', 0.6)
                    .attr('rx', 3);
            });
            
            transferGroup.transition()
                .duration(1000)
                .attr('transform', `translate(${toPos.x},${toPos.y})`)
                .transition()
                .duration(200)
                .style('opacity', 0)
                .remove();
        }

        function highlightParameters(device) {
            const g = svg.select(`.model-${device}`);
            g.selectAll('rect')
                .transition()
                .duration(200)
                .attr('fill', '#FFE082')
                .transition()
                .delay(500)
                .duration(200)
                .attr('fill', '#fff');
        }

        function animateForwardPass(device) {
            const g = svg.select(`.model-${device}`);
            
            g.selectAll('rect').each(function(d, i) {
                d3.select(this)
                    .transition()
                    .delay(i * 300)
                    .duration(300)
                    .attr('fill', '#2DD2C0')
                    .transition()
                    .duration(300)
                    .attr('fill', '#fff');
            });
        }
    }

    // Initialize GPU visualizations when slides change
    if (typeof Reveal !== 'undefined') {
        Reveal.on('slidechanged', function(event) {
            const slide = event.currentSlide;
            if (!slide) return;

            // GPU Timeline
            if (slide.querySelector('#gpu-timeline-viz')) {
                setTimeout(() => createGPUTimeline(), 100);
            }

            // Device Transfer Viz
            if (slide.querySelector('#device-transfer-viz')) {
                setTimeout(() => createDeviceTransferViz(), 100);
            }

            // Transfer Demo
            if (slide.querySelector('#transfer-demo')) {
                setTimeout(() => createTransferDemo(), 100);
            }

            // Model GPU Demo
            if (slide.querySelector('#model-gpu-demo')) {
                setTimeout(() => createModelGPUDemo(), 100);
            }
        });

        // Also initialize on current slide
        if (Reveal.getCurrentSlide) {
            const currentSlide = Reveal.getCurrentSlide();
            if (currentSlide) {
                if (currentSlide.querySelector('#gpu-timeline-viz')) createGPUTimeline();
                if (currentSlide.querySelector('#device-transfer-viz')) createDeviceTransferViz();
                if (currentSlide.querySelector('#transfer-demo')) createTransferDemo();
                if (currentSlide.querySelector('#model-gpu-demo')) createModelGPUDemo();
            }
        }
    }

})();