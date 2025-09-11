// Dilated convolution visualization

document.addEventListener('DOMContentLoaded', function() {
    
    function initDilatedConvDemo() {
        const dilatedSvg = document.getElementById('dilated-svg');
        
        if (!dilatedSvg) return;
        
        const inputSize = 7;
        const kernelSize = 3;
        const cellSize = 35;
        const padding = 20;
        
        // Create comparison of regular vs dilated convolution
        function createDilatedVisualization() {
            // Regular convolution (dilation = 1)
            const regularGroup = createConvolutionGrid(1, 50, 50);
            
            // Dilated convolution (dilation = 2)
            const dilatedGroup = createConvolutionGrid(2, 250, 50);
            
            const svg = `
                <g id="regular-conv">
                    <text x="150" y="30" text-anchor="middle" font-weight="bold" fill="#10099F">
                        Regular Conv (3×3)
                    </text>
                    ${regularGroup}
                    <text x="150" y="240" text-anchor="middle" font-size="12" fill="#666">
                        Receptive Field: 3×3
                    </text>
                </g>
                
                <g id="dilated-conv">
                    <text x="350" y="30" text-anchor="middle" font-weight="bold" fill="#10099F">
                        Dilated Conv (dilation=2)
                    </text>
                    ${dilatedGroup}
                    <text x="350" y="240" text-anchor="middle" font-size="12" fill="#666">
                        Receptive Field: 5×5
                    </text>
                </g>
            `;
            
            dilatedSvg.innerHTML = svg;
        }
        
        function createConvolutionGrid(dilation, offsetX, offsetY) {
            let svg = '';
            
            // Draw input grid
            for (let i = 0; i < inputSize; i++) {
                for (let j = 0; j < inputSize; j++) {
                    const x = offsetX + j * cellSize;
                    const y = offsetY + i * cellSize;
                    
                    svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}"
                            fill="white" stroke="#ddd" stroke-width="1"/>`;
                }
            }
            
            // Highlight kernel positions
            const centerI = Math.floor(inputSize / 2);
            const centerJ = Math.floor(inputSize / 2);
            
            for (let ki = 0; ki < kernelSize; ki++) {
                for (let kj = 0; kj < kernelSize; kj++) {
                    const i = centerI - (kernelSize - 1) / 2 * dilation + ki * dilation;
                    const j = centerJ - (kernelSize - 1) / 2 * dilation + kj * dilation;
                    
                    if (i >= 0 && i < inputSize && j >= 0 && j < inputSize) {
                        const x = offsetX + j * cellSize;
                        const y = offsetY + i * cellSize;
                        
                        // Kernel element
                        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}"
                                fill="rgba(16, 9, 159, 0.3)" stroke="#10099F" stroke-width="2"/>`;
                        
                        // Draw kernel weight indicator
                        svg += `<circle cx="${x + cellSize/2}" cy="${y + cellSize/2}" r="8"
                                fill="#10099F"/>`;
                        svg += `<text x="${x + cellSize/2}" y="${y + cellSize/2 + 3}"
                                text-anchor="middle" font-size="10" fill="white">w</text>`;
                    }
                }
            }
            
            // Draw connections between kernel elements
            if (dilation > 1) {
                for (let ki = 0; ki < kernelSize - 1; ki++) {
                    for (let kj = 0; kj < kernelSize; kj++) {
                        const i1 = centerI - (kernelSize - 1) / 2 * dilation + ki * dilation;
                        const j1 = centerJ - (kernelSize - 1) / 2 * dilation + kj * dilation;
                        const i2 = i1 + dilation;
                        const j2 = j1;
                        
                        if (i1 >= 0 && i1 < inputSize && j1 >= 0 && j1 < inputSize &&
                            i2 >= 0 && i2 < inputSize && j2 >= 0 && j2 < inputSize) {
                            const x1 = offsetX + j1 * cellSize + cellSize/2;
                            const y1 = offsetY + i1 * cellSize + cellSize/2;
                            const x2 = offsetX + j2 * cellSize + cellSize/2;
                            const y2 = offsetY + i2 * cellSize + cellSize/2;
                            
                            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                                    stroke="#FFA05F" stroke-width="2" stroke-dasharray="3,3" opacity="0.7"/>`;
                        }
                    }
                }
                
                for (let ki = 0; ki < kernelSize; ki++) {
                    for (let kj = 0; kj < kernelSize - 1; kj++) {
                        const i1 = centerI - (kernelSize - 1) / 2 * dilation + ki * dilation;
                        const j1 = centerJ - (kernelSize - 1) / 2 * dilation + kj * dilation;
                        const i2 = i1;
                        const j2 = j1 + dilation;
                        
                        if (i1 >= 0 && i1 < inputSize && j1 >= 0 && j1 < inputSize &&
                            i2 >= 0 && i2 < inputSize && j2 >= 0 && j2 < inputSize) {
                            const x1 = offsetX + j1 * cellSize + cellSize/2;
                            const y1 = offsetY + i1 * cellSize + cellSize/2;
                            const x2 = offsetX + j2 * cellSize + cellSize/2;
                            const y2 = offsetY + i2 * cellSize + cellSize/2;
                            
                            svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"
                                    stroke="#FFA05F" stroke-width="2" stroke-dasharray="3,3" opacity="0.7"/>`;
                        }
                    }
                }
            }
            
            // Highlight effective receptive field
            const effectiveSize = (kernelSize - 1) * dilation + 1;
            const rfStartI = centerI - (effectiveSize - 1) / 2;
            const rfStartJ = centerJ - (effectiveSize - 1) / 2;
            
            const rfX = offsetX + rfStartJ * cellSize;
            const rfY = offsetY + rfStartI * cellSize;
            const rfSize = effectiveSize * cellSize;
            
            svg += `<rect x="${rfX}" y="${rfY}" width="${rfSize}" height="${rfSize}"
                    fill="none" stroke="#2DD2C0" stroke-width="2" stroke-dasharray="5,5" rx="5"/>`;
            
            return svg;
        }
        
        // Initial render
        createDilatedVisualization();
    }
    
    // Initialize when slide is shown
    Reveal.addEventListener('slidechanged', function(event) {
        const currentSlide = event.currentSlide;
        if (currentSlide.querySelector('#dilated-demo')) {
            initDilatedConvDemo();
        }
    });
    
    // Also try to initialize on load
    if (document.getElementById('dilated-demo')) {
        initDilatedConvDemo();
    }
});