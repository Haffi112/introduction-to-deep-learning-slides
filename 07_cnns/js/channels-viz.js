// Multi-channel Convolution and Feature Maps Visualization
(function() {
    let featureMapsContainer;
    
    // Predefined filters for demonstration
    const filters = {
        edge_horizontal: [
            [-1, -1, -1],
            [0, 0, 0],
            [1, 1, 1]
        ],
        edge_vertical: [
            [-1, 0, 1],
            [-1, 0, 1],
            [-1, 0, 1]
        ],
        blur: [
            [1/9, 1/9, 1/9],
            [1/9, 1/9, 1/9],
            [1/9, 1/9, 1/9]
        ],
        sharpen: [
            [0, -1, 0],
            [-1, 5, -1],
            [0, -1, 0]
        ],
        edge_diagonal1: [
            [0, 1, 1],
            [-1, 0, 1],
            [-1, -1, 0]
        ],
        edge_diagonal2: [
            [1, 1, 0],
            [1, 0, -1],
            [0, -1, -1]
        ]
    };
    
    const filterNames = [
        'Horizontal Edges',
        'Vertical Edges',
        'Blur',
        'Sharpen',
        'Diagonal Edges /',
        'Diagonal Edges \\'
    ];
    
    function initFeatureMapsDemo() {
        featureMapsContainer = document.getElementById('feature-maps-container');
        if (!featureMapsContainer) return;
        
        // Clear previous content
        featureMapsContainer.innerHTML = '';
        
        setupFeatureMapsControls();
        
        // Initial display
        applyFilters();
    }
    
    function createSampleImage() {
        // Create a simple 8x8 synthetic image with patterns
        const size = 8;
        const image = [];
        
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                // Create a pattern with edges
                let value = 0;
                
                // Vertical edge in the middle
                if (j === 3 || j === 4) {
                    value = 1;
                }
                
                // Horizontal edge
                if (i === 3 || i === 4) {
                    value = Math.max(value, 0.7);
                }
                
                // Corner pattern
                if ((i < 2 && j < 2) || (i >= 6 && j >= 6)) {
                    value = 0.5;
                }
                
                row.push(value);
            }
            image.push(row);
        }
        
        return image;
    }
    
    function applyConvolution(image, kernel) {
        const outputSize = image.length - kernel.length + 1;
        const output = [];
        
        for (let i = 0; i < outputSize; i++) {
            const row = [];
            for (let j = 0; j < outputSize; j++) {
                let sum = 0;
                for (let ki = 0; ki < kernel.length; ki++) {
                    for (let kj = 0; kj < kernel[0].length; kj++) {
                        sum += image[i + ki][j + kj] * kernel[ki][kj];
                    }
                }
                row.push(sum);
            }
            output.push(row);
        }
        
        return output;
    }
    
    function visualizeFeatureMap(featureMap, title, container) {
        const div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.padding = '10px';
        div.style.background = 'white';
        div.style.borderRadius = '8px';
        div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        
        // Title
        const titleEl = document.createElement('h5');
        titleEl.textContent = title;
        titleEl.style.color = '#10099F';
        titleEl.style.fontSize = '12px';
        titleEl.style.marginBottom = '8px';
        div.appendChild(titleEl);
        
        // Create canvas for visualization
        const canvas = document.createElement('canvas');
        const scale = 20;
        canvas.width = featureMap[0].length * scale;
        canvas.height = featureMap.length * scale;
        canvas.style.border = '1px solid #ddd';
        
        const ctx = canvas.getContext('2d');
        
        // Find min and max for normalization
        let min = Infinity, max = -Infinity;
        featureMap.forEach(row => {
            row.forEach(val => {
                min = Math.min(min, val);
                max = Math.max(max, val);
            });
        });
        
        // Draw feature map
        featureMap.forEach((row, i) => {
            row.forEach((val, j) => {
                // Normalize to 0-1
                const normalized = (val - min) / (max - min + 0.001);
                
                // Color based on value
                if (val > 0) {
                    // Positive values in blue
                    const intensity = Math.floor(normalized * 255);
                    ctx.fillStyle = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
                } else {
                    // Negative values in red
                    const intensity = Math.floor((1 - normalized) * 255);
                    ctx.fillStyle = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
                }
                
                ctx.fillRect(j * scale, i * scale, scale, scale);
                
                // Add grid
                ctx.strokeStyle = '#eee';
                ctx.strokeRect(j * scale, i * scale, scale, scale);
            });
        });
        
        div.appendChild(canvas);
        
        // Add value range
        const rangeEl = document.createElement('p');
        rangeEl.style.fontSize = '10px';
        rangeEl.style.color = '#666';
        rangeEl.style.marginTop = '5px';
        rangeEl.textContent = `Range: [${min.toFixed(2)}, ${max.toFixed(2)}]`;
        div.appendChild(rangeEl);
        
        container.appendChild(div);
    }
    
    function applyFilters() {
        if (!featureMapsContainer) return;
        
        featureMapsContainer.innerHTML = '';
        
        const numFiltersSlider = document.getElementById('num-filters');
        const filterCountSpan = document.getElementById('filter-count');
        
        if (!numFiltersSlider) return;
        
        const numFilters = parseInt(numFiltersSlider.value);
        if (filterCountSpan) {
            filterCountSpan.textContent = numFilters;
        }
        
        // Create sample image
        const image = createSampleImage();
        
        // First show the original image
        visualizeFeatureMap(image, 'Input Image', featureMapsContainer);
        
        // Apply selected number of filters
        const filterKeys = Object.keys(filters);
        for (let i = 0; i < numFilters && i < filterKeys.length; i++) {
            const kernel = filters[filterKeys[i]];
            const featureMap = applyConvolution(image, kernel);
            visualizeFeatureMap(featureMap, filterNames[i], featureMapsContainer);
        }
    }
    
    function setupFeatureMapsControls() {
        const numFiltersSlider = document.getElementById('num-filters');
        const applyBtn = document.getElementById('apply-filters');
        
        if (numFiltersSlider) {
            numFiltersSlider.addEventListener('input', () => {
                const filterCountSpan = document.getElementById('filter-count');
                if (filterCountSpan) {
                    filterCountSpan.textContent = numFiltersSlider.value;
                }
            });
        }
        
        if (applyBtn) {
            applyBtn.addEventListener('click', applyFilters);
        }
    }
    
    // Initialize convolution calculator
    function initConvCalculator() {
        const inputDiv = document.getElementById('input-matrix');
        const kernelDiv = document.getElementById('kernel-matrix');
        const outputDiv = document.getElementById('output-matrix');
        
        if (!inputDiv || !kernelDiv || !outputDiv) return;
        
        // Create 5x5 input matrix
        const inputSize = 5;
        const inputMatrix = [];
        const inputTable = document.createElement('table');
        inputTable.style.borderCollapse = 'collapse';
        
        for (let i = 0; i < inputSize; i++) {
            const row = [];
            const tr = document.createElement('tr');
            for (let j = 0; j < inputSize; j++) {
                const value = Math.floor(Math.random() * 10);
                row.push(value);
                
                const td = document.createElement('td');
                td.style.width = '30px';
                td.style.height = '30px';
                td.style.border = '1px solid #ddd';
                td.style.textAlign = 'center';
                td.style.fontSize = '12px';
                td.contentEditable = true;
                td.textContent = value;
                td.dataset.row = i;
                td.dataset.col = j;
                tr.appendChild(td);
            }
            inputMatrix.push(row);
            inputTable.appendChild(tr);
        }
        inputDiv.appendChild(inputTable);
        
        // Create 3x3 kernel matrix
        const kernelSize = 3;
        const kernelMatrix = filters.edge_horizontal;
        const kernelTable = document.createElement('table');
        kernelTable.style.borderCollapse = 'collapse';
        
        for (let i = 0; i < kernelSize; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < kernelSize; j++) {
                const td = document.createElement('td');
                td.style.width = '30px';
                td.style.height = '30px';
                td.style.border = '1px solid #ddd';
                td.style.textAlign = 'center';
                td.style.fontSize = '12px';
                td.contentEditable = true;
                td.textContent = kernelMatrix[i][j];
                td.dataset.row = i;
                td.dataset.col = j;
                tr.appendChild(td);
            }
            kernelTable.appendChild(tr);
        }
        kernelDiv.appendChild(kernelTable);
        
        // Setup calculator controls
        setupCalculatorControls();
        
        // Initial computation
        computeConvolution();
    }
    
    function setupCalculatorControls() {
        const randomizeBtn = document.getElementById('randomize-input');
        const presetSelect = document.getElementById('preset-kernel');
        const computeBtn = document.getElementById('compute-conv');
        
        if (randomizeBtn) {
            randomizeBtn.addEventListener('click', () => {
                const inputTable = document.querySelector('#input-matrix table');
                if (inputTable) {
                    const cells = inputTable.querySelectorAll('td');
                    cells.forEach(cell => {
                        cell.textContent = Math.floor(Math.random() * 10);
                    });
                    computeConvolution();
                }
            });
        }
        
        if (presetSelect) {
            presetSelect.addEventListener('change', () => {
                const preset = presetSelect.value;
                let kernel;
                
                switch(preset) {
                    case 'identity':
                        kernel = [[0,0,0],[0,1,0],[0,0,0]];
                        break;
                    case 'edge':
                        kernel = filters.edge_horizontal;
                        break;
                    case 'blur':
                        kernel = filters.blur;
                        break;
                    case 'sharpen':
                        kernel = filters.sharpen;
                        break;
                    default:
                        kernel = [[0,0,0],[0,1,0],[0,0,0]];
                }
                
                const kernelTable = document.querySelector('#kernel-matrix table');
                if (kernelTable) {
                    const cells = kernelTable.querySelectorAll('td');
                    let idx = 0;
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            cells[idx].textContent = kernel[i][j].toFixed(2);
                            idx++;
                        }
                    }
                    computeConvolution();
                }
            });
        }
        
        if (computeBtn) {
            computeBtn.addEventListener('click', computeConvolution);
        }
    }
    
    function computeConvolution() {
        const inputTable = document.querySelector('#input-matrix table');
        const kernelTable = document.querySelector('#kernel-matrix table');
        const outputDiv = document.getElementById('output-matrix');
        
        if (!inputTable || !kernelTable || !outputDiv) return;
        
        // Read input matrix
        const inputMatrix = [];
        const inputRows = inputTable.querySelectorAll('tr');
        inputRows.forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(cell => {
                rowData.push(parseFloat(cell.textContent) || 0);
            });
            inputMatrix.push(rowData);
        });
        
        // Read kernel matrix
        const kernelMatrix = [];
        const kernelRows = kernelTable.querySelectorAll('tr');
        kernelRows.forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(cell => {
                rowData.push(parseFloat(cell.textContent) || 0);
            });
            kernelMatrix.push(rowData);
        });
        
        // Compute convolution
        const outputMatrix = applyConvolution(inputMatrix, kernelMatrix);
        
        // Display output
        outputDiv.innerHTML = '';
        const outputTable = document.createElement('table');
        outputTable.style.borderCollapse = 'collapse';
        
        outputMatrix.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(val => {
                const td = document.createElement('td');
                td.style.width = '40px';
                td.style.height = '30px';
                td.style.border = '1px solid #ddd';
                td.style.textAlign = 'center';
                td.style.fontSize = '12px';
                td.style.backgroundColor = '#e8f5e9';
                td.textContent = val.toFixed(1);
                tr.appendChild(td);
            });
            outputTable.appendChild(tr);
        });
        
        outputDiv.appendChild(outputTable);
    }
    
    // Initialize when slide is shown
    Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#feature-maps-demo')) {
            setTimeout(initFeatureMapsDemo, 100);
        }
        if (event.currentSlide.querySelector('#conv-calculator')) {
            setTimeout(initConvCalculator, 100);
        }
    });
    
    // Also initialize if already on the slide
    if (document.querySelector('.present #feature-maps-demo')) {
        setTimeout(initFeatureMapsDemo, 100);
    }
    if (document.querySelector('.present #conv-calculator')) {
        setTimeout(initConvCalculator, 100);
    }
})();