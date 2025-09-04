// Early Stopping Visualization
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('early-stopping-viz');
    if (!container) return;
    
    const margin = {top: 20, right: 120, bottom: 50, left: 60};
    const width = container.offsetWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select('#early-stopping-viz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    
    // Line generators
    const trainLine = d3.line()
        .x(d => xScale(d.epoch))
        .y(d => yScale(d.loss))
        .curve(d3.curveMonotoneX);
    
    const valLine = d3.line()
        .x(d => xScale(d.epoch))
        .y(d => yScale(d.loss))
        .curve(d3.curveMonotoneX);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale).ticks(10))
        .append('text')
        .attr('x', width / 2)
        .attr('y', 40)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Epoch');
    
    g.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -40)
        .attr('x', -height / 2)
        .attr('fill', 'black')
        .style('text-anchor', 'middle')
        .text('Loss');
    
    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width + margin.left + 20}, ${margin.top + 20})`);
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 0)
        .attr('y2', 0)
        .style('stroke', '#10099F')
        .style('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 5)
        .text('Training')
        .style('font-size', '12px');
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 20)
        .attr('y2', 20)
        .style('stroke', '#FC8484')
        .style('stroke-width', 2);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 25)
        .text('Validation')
        .style('font-size', '12px');
    
    // Data paths
    const trainPath = g.append('path')
        .style('stroke', '#10099F')
        .style('stroke-width', 2)
        .style('fill', 'none');
    
    const valPath = g.append('path')
        .style('stroke', '#FC8484')
        .style('stroke-width', 2)
        .style('fill', 'none');
    
    // Early stopping marker
    const stopMarker = g.append('g')
        .style('display', 'none');
    
    stopMarker.append('line')
        .style('stroke', '#FFA05F')
        .style('stroke-width', 2)
        .style('stroke-dasharray', '5,5');
    
    stopMarker.append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -5)
        .style('fill', '#FFA05F')
        .style('font-weight', 'bold')
        .text('Early Stop');
    
    // Controls
    const patienceSlider = document.getElementById('patience-slider');
    const patienceValue = document.getElementById('patience-value');
    const noiseSlider = document.getElementById('noise-slider');
    const noiseValue = document.getElementById('noise-value');
    const startButton = document.getElementById('start-training');
    const resetButton = document.getElementById('reset-training');
    const statusDiv = document.getElementById('training-status');
    
    let animationId = null;
    let currentEpoch = 0;
    let trainData = [];
    let valData = [];
    let bestValLoss = Infinity;
    let epochsSinceImprovement = 0;
    let stoppedEpoch = -1;
    
    // Generate data function
    function generateData(epoch, noiseLevel) {
        const baseTrainLoss = 0.8 * Math.exp(-epoch / 20) + 0.05;
        const trainNoise = (Math.random() - 0.5) * 0.02;
        
        const baseValLoss = 0.8 * Math.exp(-epoch / 15) + 0.15;
        const valNoise = (Math.random() - 0.5) * (0.02 + noiseLevel * 0.003);
        const overfittingTerm = noiseLevel > 0 ? Math.max(0, (epoch - 30) * 0.003 * noiseLevel / 20) : 0;
        
        return {
            epoch: epoch,
            trainLoss: Math.max(0.01, baseTrainLoss + trainNoise),
            valLoss: Math.max(0.01, baseValLoss + valNoise + overfittingTerm)
        };
    }
    
    // Animation function
    function animate() {
        if (currentEpoch > 100 || stoppedEpoch > 0) {
            if (stoppedEpoch > 0) {
                statusDiv.textContent = `Training stopped at epoch ${stoppedEpoch} (patience criterion met)`;
                statusDiv.style.color = '#2DD2C0';
            } else {
                statusDiv.textContent = 'Training completed (100 epochs)';
                statusDiv.style.color = '#10099F';
            }
            return;
        }
        
        const noiseLevel = parseFloat(noiseSlider.value) / 100;
        const patience = parseInt(patienceSlider.value);
        
        // Generate new data point
        const data = generateData(currentEpoch, noiseLevel);
        trainData.push({epoch: data.epoch, loss: data.trainLoss});
        valData.push({epoch: data.epoch, loss: data.valLoss});
        
        // Check for improvement
        if (data.valLoss < bestValLoss - 0.001) {
            bestValLoss = data.valLoss;
            epochsSinceImprovement = 0;
        } else {
            epochsSinceImprovement++;
        }
        
        // Check early stopping criterion
        if (epochsSinceImprovement >= patience && stoppedEpoch < 0) {
            stoppedEpoch = currentEpoch;
            
            // Show early stopping marker
            stopMarker.style('display', 'block');
            stopMarker.select('line')
                .attr('x1', xScale(stoppedEpoch))
                .attr('x2', xScale(stoppedEpoch))
                .attr('y1', 0)
                .attr('y2', height);
            stopMarker.select('text')
                .attr('x', xScale(stoppedEpoch));
        }
        
        // Update paths
        trainPath.datum(trainData)
            .attr('d', trainLine);
        
        valPath.datum(valData)
            .attr('d', valLine);
        
        // Update status
        statusDiv.textContent = `Epoch ${currentEpoch} | Train Loss: ${data.trainLoss.toFixed(4)} | Val Loss: ${data.valLoss.toFixed(4)} | Patience: ${epochsSinceImprovement}/${patience}`;
        statusDiv.style.color = '#262626';
        
        currentEpoch++;
        
        if (stoppedEpoch < 0) {
            animationId = setTimeout(animate, 100);
        } else {
            statusDiv.textContent = `Training stopped at epoch ${stoppedEpoch} (patience criterion met)`;
            statusDiv.style.color = '#2DD2C0';
        }
    }
    
    // Event handlers
    startButton.addEventListener('click', function() {
        if (animationId) {
            clearTimeout(animationId);
        }
        reset();
        animate();
    });
    
    resetButton.addEventListener('click', function() {
        if (animationId) {
            clearTimeout(animationId);
            animationId = null;
        }
        reset();
    });
    
    function reset() {
        currentEpoch = 0;
        trainData = [];
        valData = [];
        bestValLoss = Infinity;
        epochsSinceImprovement = 0;
        stoppedEpoch = -1;
        
        trainPath.datum([]).attr('d', null);
        valPath.datum([]).attr('d', null);
        stopMarker.style('display', 'none');
        statusDiv.textContent = 'Ready to start training';
        statusDiv.style.color = '#262626';
    }
    
    // Update slider displays
    patienceSlider.addEventListener('input', function() {
        patienceValue.textContent = this.value;
    });
    
    noiseSlider.addEventListener('input', function() {
        noiseValue.textContent = this.value + '%';
    });
    
    // Initial state
    reset();
});