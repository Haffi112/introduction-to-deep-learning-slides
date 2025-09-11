// Alternative padding types visualization

document.addEventListener('DOMContentLoaded', function() {
    
    function initPaddingTypesDemo() {
        const paddingTypeSelect = document.getElementById('padding-type');
        const applyBtn = document.getElementById('apply-padding-type');
        const originalCanvas = document.getElementById('original-canvas');
        const paddedCanvas = document.getElementById('padded-canvas');
        
        if (!paddingTypeSelect || !originalCanvas) return;
        
        const originalCtx = originalCanvas.getContext('2d');
        const paddedCtx = paddedCanvas.getContext('2d');
        
        // Create a simple test pattern
        const imageSize = 5;
        const padding = 2;
        const cellSize = 30;
        
        // Create test image data
        const testImage = [
            [1, 2, 3, 4, 5],
            [6, 7, 8, 9, 10],
            [11, 12, 13, 14, 15],
            [16, 17, 18, 19, 20],
            [21, 22, 23, 24, 25]
        ];
        
        function drawOriginal() {
            originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
            
            for (let i = 0; i < imageSize; i++) {
                for (let j = 0; j < imageSize; j++) {
                    const value = testImage[i][j];
                    const intensity = (value / 25) * 255;
                    
                    originalCtx.fillStyle = `rgb(${16}, ${9}, ${159}, ${intensity/255})`;
                    originalCtx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    
                    originalCtx.strokeStyle = '#ddd';
                    originalCtx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
                    
                    // Draw value
                    originalCtx.fillStyle = 'white';
                    originalCtx.font = '12px Arial';
                    originalCtx.textAlign = 'center';
                    originalCtx.textBaseline = 'middle';
                    originalCtx.fillText(value, j * cellSize + cellSize/2, i * cellSize + cellSize/2);
                }
            }
        }
        
        function applyPadding(type) {
            const paddedSize = imageSize + 2 * padding;
            const paddedImage = Array(paddedSize).fill().map(() => Array(paddedSize).fill(0));
            
            // Copy original image to center
            for (let i = 0; i < imageSize; i++) {
                for (let j = 0; j < imageSize; j++) {
                    paddedImage[i + padding][j + padding] = testImage[i][j];
                }
            }
            
            // Apply padding based on type
            switch(type) {
                case 'zero':
                    // Already filled with zeros
                    break;
                    
                case 'reflect':
                    // Reflect padding
                    for (let p = 1; p <= padding; p++) {
                        // Top and bottom
                        for (let j = padding; j < paddedSize - padding; j++) {
                            paddedImage[padding - p][j] = paddedImage[padding + p - 1][j];
                            paddedImage[paddedSize - padding + p - 1][j] = paddedImage[paddedSize - padding - p][j];
                        }
                        // Left and right
                        for (let i = padding; i < paddedSize - padding; i++) {
                            paddedImage[i][padding - p] = paddedImage[i][padding + p - 1];
                            paddedImage[i][paddedSize - padding + p - 1] = paddedImage[i][paddedSize - padding - p];
                        }
                    }
                    // Corners
                    for (let pi = 1; pi <= padding; pi++) {
                        for (let pj = 1; pj <= padding; pj++) {
                            // Top-left
                            paddedImage[padding - pi][padding - pj] = paddedImage[padding + pi - 1][padding + pj - 1];
                            // Top-right
                            paddedImage[padding - pi][paddedSize - padding + pj - 1] = paddedImage[padding + pi - 1][paddedSize - padding - pj];
                            // Bottom-left
                            paddedImage[paddedSize - padding + pi - 1][padding - pj] = paddedImage[paddedSize - padding - pi][padding + pj - 1];
                            // Bottom-right
                            paddedImage[paddedSize - padding + pi - 1][paddedSize - padding + pj - 1] = paddedImage[paddedSize - padding - pi][paddedSize - padding - pj];
                        }
                    }
                    break;
                    
                case 'replicate':
                    // Replicate edge values
                    for (let p = 1; p <= padding; p++) {
                        // Top and bottom
                        for (let j = padding; j < paddedSize - padding; j++) {
                            paddedImage[padding - p][j] = paddedImage[padding][j];
                            paddedImage[paddedSize - padding + p - 1][j] = paddedImage[paddedSize - padding - 1][j];
                        }
                        // Left and right
                        for (let i = padding; i < paddedSize - padding; i++) {
                            paddedImage[i][padding - p] = paddedImage[i][padding];
                            paddedImage[i][paddedSize - padding + p - 1] = paddedImage[i][paddedSize - padding - 1];
                        }
                    }
                    // Corners
                    for (let pi = 1; pi <= padding; pi++) {
                        for (let pj = 1; pj <= padding; pj++) {
                            paddedImage[padding - pi][padding - pj] = paddedImage[padding][padding];
                            paddedImage[padding - pi][paddedSize - padding + pj - 1] = paddedImage[padding][paddedSize - padding - 1];
                            paddedImage[paddedSize - padding + pi - 1][padding - pj] = paddedImage[paddedSize - padding - 1][padding];
                            paddedImage[paddedSize - padding + pi - 1][paddedSize - padding + pj - 1] = paddedImage[paddedSize - padding - 1][paddedSize - padding - 1];
                        }
                    }
                    break;
                    
                case 'circular':
                    // Wrap around
                    for (let i = 0; i < paddedSize; i++) {
                        for (let j = 0; j < paddedSize; j++) {
                            if (i < padding || i >= paddedSize - padding || j < padding || j >= paddedSize - padding) {
                                const origI = ((i - padding) % imageSize + imageSize) % imageSize;
                                const origJ = ((j - padding) % imageSize + imageSize) % imageSize;
                                paddedImage[i][j] = testImage[origI][origJ];
                            }
                        }
                    }
                    break;
            }
            
            drawPadded(paddedImage, type);
        }
        
        function drawPadded(paddedImage, type) {
            const paddedSize = paddedImage.length;
            const scaledCellSize = 200 / paddedSize;
            
            paddedCtx.clearRect(0, 0, paddedCanvas.width, paddedCanvas.height);
            
            for (let i = 0; i < paddedSize; i++) {
                for (let j = 0; j < paddedSize; j++) {
                    const value = paddedImage[i][j];
                    
                    // Determine if this is padding area
                    const isPadding = i < padding || i >= paddedSize - padding || 
                                     j < padding || j >= paddedSize - padding;
                    
                    if (value === 0 && type === 'zero') {
                        paddedCtx.fillStyle = '#e3f2fd';
                    } else if (isPadding) {
                        const intensity = (value / 25) * 255;
                        // Different colors for different padding types
                        if (type === 'reflect') {
                            paddedCtx.fillStyle = `rgba(45, 210, 192, ${intensity/255 * 0.7})`;
                        } else if (type === 'replicate') {
                            paddedCtx.fillStyle = `rgba(255, 160, 95, ${intensity/255 * 0.7})`;
                        } else if (type === 'circular') {
                            paddedCtx.fillStyle = `rgba(252, 132, 132, ${intensity/255 * 0.7})`;
                        } else {
                            paddedCtx.fillStyle = '#e3f2fd';
                        }
                    } else {
                        const intensity = (value / 25) * 255;
                        paddedCtx.fillStyle = `rgb(${16}, ${9}, ${159}, ${intensity/255})`;
                    }
                    
                    paddedCtx.fillRect(j * scaledCellSize, i * scaledCellSize, scaledCellSize, scaledCellSize);
                    
                    paddedCtx.strokeStyle = isPadding ? '#999' : '#ddd';
                    paddedCtx.strokeRect(j * scaledCellSize, i * scaledCellSize, scaledCellSize, scaledCellSize);
                    
                    // Draw value if not zero
                    if (value !== 0) {
                        paddedCtx.fillStyle = 'white';
                        paddedCtx.font = '10px Arial';
                        paddedCtx.textAlign = 'center';
                        paddedCtx.textBaseline = 'middle';
                        paddedCtx.fillText(value, j * scaledCellSize + scaledCellSize/2, i * scaledCellSize + scaledCellSize/2);
                    }
                }
            }
        }
        
        applyBtn.addEventListener('click', function() {
            const selectedType = paddingTypeSelect.value;
            applyPadding(selectedType);
        });
        
        // Initial draw
        drawOriginal();
        applyPadding('zero');
    }
    
    // Initialize when slide is shown
    Reveal.addEventListener('slidechanged', function(event) {
        const currentSlide = event.currentSlide;
        if (currentSlide.querySelector('#padding-types-demo')) {
            initPaddingTypesDemo();
        }
    });
    
    // Also try to initialize on load
    if (document.getElementById('padding-types-demo')) {
        initPaddingTypesDemo();
    }
});