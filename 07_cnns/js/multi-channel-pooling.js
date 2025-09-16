// multi-channel-pooling.js - Multi-channel pooling visualization
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('multi-channel-pooling-demo')) return;

    const svg = d3.select('#multi-channel-svg');
    const width = 800;
    const height = 450;
    
    // UI Colors
    const colors = {
        primary: '#10099F',
        secondary: '#2DD2C0',
        highlight: '#FFA05F',
        error: '#FC8484',
        success: '#00FFBA',
        light: '#F5F5F5',
        dark: '#262626',
        gray: '#EEEEEE',
        channels: {
            1: ['#10099F'],
            3: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            64: ['#10099F', '#2DD2C0', '#FFA05F', '#FC8484']
        }
    };

    // State
    let channelCount = 3;
    let poolSize = 2;
    let animating = false;

    // Generate random data for channels
    function generateChannelData(channels, size) {
        const data = [];
        for (let c = 0; c < channels; c++) {
            const channelData = [];
            for (let i = 0; i < size; i++) {
                const row = [];
                for (let j = 0; j < size; j++) {
                    row.push(Math.floor(Math.random() * 10));
                }
                channelData.push(row);
            }
            data.push(channelData);
        }
        return data;
    }

    // Perform max pooling on a channel
    function poolChannel(channel, pSize) {
        const inputSize = channel.length;
        const outputSize = Math.floor(inputSize / pSize);
        const output = [];
        
        for (let i = 0; i < outputSize; i++) {
            const row = [];
            for (let j = 0; j < outputSize; j++) {
                let maxVal = -Infinity;
                for (let di = 0; di < pSize; di++) {
                    for (let dj = 0; dj < pSize; dj++) {
                        maxVal = Math.max(maxVal, channel[i * pSize + di][j * pSize + dj]);
                    }
                }
                row.push(maxVal);
            }
            output.push(row);
        }
        
        return output;
    }

    // Draw the visualization
    function draw() {
        svg.selectAll('*').remove();
        
        const inputSize = 4;
        const outputSize = Math.floor(inputSize / poolSize);
        const cellSize = 30;
        const channelSpacing = 120;
        const verticalOffset = 80;
        
        // Generate data
        const inputData = generateChannelData(channelCount, inputSize);
        const outputData = inputData.map(channel => poolChannel(channel, poolSize));
        
        // Determine how many channels to show (max 4 for visualization)
        const displayChannels = Math.min(channelCount, 4);
        const channelColors = channelCount === 1 ? colors.channels[1] :
                             channelCount === 3 ? colors.channels[3] :
                             colors.channels[64];
        
        // Create main group
        const mainGroup = svg.append('g')
            .attr('transform', 'translate(50, 30)');
        
        // Title
        mainGroup.append('text')
            .attr('x', 350)
            .attr('y', 0)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.dark)
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text(`${channelCount} Channel${channelCount > 1 ? 's' : ''} - Independent Pooling`);
        
        // Draw each channel
        for (let c = 0; c < displayChannels; c++) {
            const channelGroup = mainGroup.append('g')
                .attr('transform', `translate(${c * channelSpacing}, ${verticalOffset})`);
            
            const channelColor = channelColors[c % channelColors.length];
            
            // Channel label
            channelGroup.append('text')
                .attr('x', inputSize * cellSize / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .attr('fill', channelColor)
                .style('font-size', '12px')
                .style('font-weight', 'bold')
                .text(channelCount === 3 ? ['R', 'G', 'B'][c] : `Ch ${c}`);
            
            // Draw input channel
            const inputGroup = channelGroup.append('g')
                .attr('class', `input-channel-${c}`);
            
            for (let i = 0; i < inputSize; i++) {
                for (let j = 0; j < inputSize; j++) {
                    const cellGroup = inputGroup.append('g')
                        .attr('transform', `translate(${j * cellSize}, ${i * cellSize})`);
                    
                    cellGroup.append('rect')
                        .attr('width', cellSize - 1)
                        .attr('height', cellSize - 1)
                        .attr('fill', colors.light)
                        .attr('stroke', channelColor)
                        .attr('stroke-width', 1);
                    
                    cellGroup.append('text')
                        .attr('x', cellSize / 2)
                        .attr('y', cellSize / 2)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('fill', colors.dark)
                        .style('font-size', '10px')
                        .text(inputData[c][i][j]);
                }
            }
            
            // Draw output channel
            const outputGroup = channelGroup.append('g')
                .attr('class', `output-channel-${c}`)
                .attr('transform', `translate(0, ${inputSize * cellSize + 50})`);
            
            for (let i = 0; i < outputSize; i++) {
                for (let j = 0; j < outputSize; j++) {
                    const cellGroup = outputGroup.append('g')
                        .attr('transform', `translate(${j * cellSize * 2}, ${i * cellSize * 2})`);
                    
                    cellGroup.append('rect')
                        .attr('width', cellSize * 2 - 2)
                        .attr('height', cellSize * 2 - 2)
                        .attr('fill', channelColor)
                        .attr('fill-opacity', 0.2)
                        .attr('stroke', channelColor)
                        .attr('stroke-width', 2);
                    
                    cellGroup.append('text')
                        .attr('x', cellSize)
                        .attr('y', cellSize)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('fill', colors.dark)
                        .style('font-size', '14px')
                        .style('font-weight', 'bold')
                        .text(outputData[c][i][j]);
                }
            }
            
            // Draw arrow for each channel
            const arrow = channelGroup.append('g');
            arrow.append('path')
                .attr('d', `M ${inputSize * cellSize / 2} ${inputSize * cellSize + 5} 
                           L ${inputSize * cellSize / 2} ${inputSize * cellSize + 45}`)
                .attr('stroke', channelColor)
                .attr('stroke-width', 2)
                .attr('fill', 'none')
                .attr('marker-end', `url(#arrowhead-${c})`);
            
            // Arrow marker
            svg.append('defs').append('marker')
                .attr('id', `arrowhead-${c}`)
                .attr('markerWidth', 8)
                .attr('markerHeight', 8)
                .attr('refX', 4)
                .attr('refY', 4)
                .attr('orient', 'auto')
                .append('polygon')
                .attr('points', '0 0, 8 4, 0 8')
                .attr('fill', channelColor);
        }
        
        // If more than 4 channels, show ellipsis
        if (channelCount > 4) {
            mainGroup.append('text')
                .attr('x', 4 * channelSpacing + 20)
                .attr('y', verticalOffset + inputSize * cellSize / 2)
                .attr('text-anchor', 'middle')
                .attr('fill', colors.dark)
                .style('font-size', '24px')
                .style('font-weight', 'bold')
                .text('...');
            
            mainGroup.append('text')
                .attr('x', 4 * channelSpacing + 20)
                .attr('y', verticalOffset + inputSize * cellSize + 50 + outputSize * cellSize)
                .attr('text-anchor', 'middle')
                .attr('fill', colors.dark)
                .style('font-size', '24px')
                .style('font-weight', 'bold')
                .text('...');
        }
        
        // Add summary text
        const summaryY = verticalOffset + inputSize * cellSize + 50 + outputSize * cellSize * 2 + 30;
        mainGroup.append('text')
            .attr('x', 350)
            .attr('y', summaryY)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.primary)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .text(`Input: ${channelCount}×${inputSize}×${inputSize} → Output: ${channelCount}×${outputSize}×${outputSize}`);
        
        mainGroup.append('text')
            .attr('x', 350)
            .attr('y', summaryY + 20)
            .attr('text-anchor', 'middle')
            .attr('fill', colors.dark)
            .style('font-size', '12px')
            .text('Each channel pooled independently - no mixing!');
    }

    // Animate pooling operation
    function animate() {
        if (animating) return;
        animating = true;
        
        const displayChannels = Math.min(channelCount, 4);
        const inputSize = 4;
        const outputSize = Math.floor(inputSize / poolSize);
        const cellSize = 30;
        
        let currentChannel = 0;
        let currentWindow = 0;
        const totalWindows = outputSize * outputSize;
        
        function animateStep() {
            if (currentChannel >= displayChannels) {
                animating = false;
                draw();
                return;
            }
            
            if (currentWindow >= totalWindows) {
                currentChannel++;
                currentWindow = 0;
                setTimeout(animateStep, 300);
                return;
            }
            
            const row = Math.floor(currentWindow / outputSize);
            const col = currentWindow % outputSize;
            
            // Highlight pooling window
            svg.selectAll(`.highlight-window-${currentChannel}`).remove();
            
            const channelGroup = svg.select(`.input-channel-${currentChannel}`);
            channelGroup.append('rect')
                .attr('class', `highlight-window-${currentChannel}`)
                .attr('x', col * poolSize * cellSize)
                .attr('y', row * poolSize * cellSize)
                .attr('width', poolSize * cellSize)
                .attr('height', poolSize * cellSize)
                .attr('fill', 'none')
                .attr('stroke', colors.highlight)
                .attr('stroke-width', 3)
                .attr('opacity', 0)
                .transition()
                .duration(200)
                .attr('opacity', 1)
                .transition()
                .duration(200)
                .attr('opacity', 0.5);
            
            currentWindow++;
            setTimeout(animateStep, 400);
        }
        
        animateStep();
    }

    // Event handlers
    document.getElementById('channel-count').addEventListener('change', function(e) {
        channelCount = parseInt(e.value);
        draw();
    });
    
    document.getElementById('mc-pool-size').addEventListener('input', function(e) {
        poolSize = parseInt(e.value);
        document.getElementById('mc-pool-size-value').textContent = `${poolSize}×${poolSize}`;
        draw();
    });
    
    document.getElementById('visualize-channels').addEventListener('click', draw);
    document.getElementById('animate-mc-pooling').addEventListener('click', animate);
    
    // Initial draw
    draw();
});