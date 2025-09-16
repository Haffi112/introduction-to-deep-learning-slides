// LeNet Training Visualization
(function() {
    const svg = d3.select('#lenet-training-svg');
    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 100, bottom: 60, left: 60 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;
    
    // Training data (simulated)
    const trainingData = {
        epochs: [],
        trainLoss: [],
        trainAcc: [],
        valLoss: [],
        valAcc: []
    };
    
    let isTraining = false;
    let currentEpoch = 0;
    let animationTimer = null;
    
    function init() {
        svg.selectAll('*').remove();
        
        // Create plot area
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
        
        // Create scales
        const xScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, plotWidth]);
        
        const yScaleLoss = d3.scaleLinear()
            .domain([0, 2.5])
            .range([plotHeight, 0]);
        
        const yScaleAcc = d3.scaleLinear()
            .domain([0, 100])
            .range([plotHeight, 0]);
        
        // Add axes
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${plotHeight})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        g.append('g')
            .attr('class', 'y-axis-loss')
            .call(d3.axisLeft(yScaleLoss));
        
        g.append('g')
            .attr('class', 'y-axis-acc')
            .attr('transform', `translate(${plotWidth}, 0)`)
            .call(d3.axisRight(yScaleAcc));
        
        // Add axis labels
        g.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', plotHeight + 40)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .text('Epoch');
        
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -plotHeight / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('fill', '#FC8484')
            .text('Loss');
        
        g.append('text')
            .attr('transform', 'rotate(90)')
            .attr('x', plotHeight / 2)
            .attr('y', -plotWidth - 40)
            .attr('text-anchor', 'middle')
            .attr('font-weight', 'bold')
            .attr('fill', '#2DD2C0')
            .text('Accuracy (%)');
        
        // Add legend
        const legend = svg.append('g')
            .attr('transform', `translate(${width / 2 - 150}, 20)`);
        
        const legendItems = [
            { name: 'Train Loss', color: '#FC8484', dash: false },
            { name: 'Val Loss', color: '#FC8484', dash: true },
            { name: 'Train Acc', color: '#2DD2C0', dash: false },
            { name: 'Val Acc', color: '#2DD2C0', dash: true }
        ];
        
        legendItems.forEach((item, i) => {
            const x = (i % 2) * 150;
            const y = Math.floor(i / 2) * 20;
            
            legend.append('line')
                .attr('x1', x)
                .attr('y1', y)
                .attr('x2', x + 20)
                .attr('y2', y)
                .attr('stroke', item.color)
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', item.dash ? '5,5' : null);
            
            legend.append('text')
                .attr('x', x + 25)
                .attr('y', y)
                .attr('dominant-baseline', 'middle')
                .attr('font-size', '12px')
                .text(item.name);
        });
        
        // Create line generators
        const lineLoss = d3.line()
            .x(d => xScale(d))
            .y(d => yScaleLoss(trainingData.trainLoss[d]))
            .curve(d3.curveMonotoneX);
        
        const lineValLoss = d3.line()
            .x(d => xScale(d))
            .y(d => yScaleLoss(trainingData.valLoss[d]))
            .curve(d3.curveMonotoneX);
        
        const lineAcc = d3.line()
            .x(d => xScale(d))
            .y(d => yScaleAcc(trainingData.trainAcc[d]))
            .curve(d3.curveMonotoneX);
        
        const lineValAcc = d3.line()
            .x(d => xScale(d))
            .y(d => yScaleAcc(trainingData.valAcc[d]))
            .curve(d3.curveMonotoneX);
        
        // Add paths for lines
        g.append('path')
            .attr('class', 'line-train-loss')
            .attr('fill', 'none')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2);
        
        g.append('path')
            .attr('class', 'line-val-loss')
            .attr('fill', 'none')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
        
        g.append('path')
            .attr('class', 'line-train-acc')
            .attr('fill', 'none')
            .attr('stroke', '#2DD2C0')
            .attr('stroke-width', 2);
        
        g.append('path')
            .attr('class', 'line-val-acc')
            .attr('fill', 'none')
            .attr('stroke', '#2DD2C0')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5');
        
        // Add current epoch indicator
        g.append('circle')
            .attr('class', 'epoch-indicator')
            .attr('r', 5)
            .attr('fill', '#10099F')
            .style('display', 'none');
        
        // Store scales and line generators for updates
        svg.node().xScale = xScale;
        svg.node().yScaleLoss = yScaleLoss;
        svg.node().yScaleAcc = yScaleAcc;
        svg.node().lineLoss = lineLoss;
        svg.node().lineValLoss = lineValLoss;
        svg.node().lineAcc = lineAcc;
        svg.node().lineValAcc = lineValAcc;
        
        reset();
    }
    
    function startTraining() {
        if (isTraining) return;
        
        isTraining = true;
        currentEpoch = 0;
        
        // Clear previous data
        trainingData.epochs = [];
        trainingData.trainLoss = [];
        trainingData.trainAcc = [];
        trainingData.valLoss = [];
        trainingData.valAcc = [];
        
        // Start animation
        animationTimer = setInterval(updateTraining, 500);
    }
    
    function updateTraining() {
        if (currentEpoch >= 10) {
            stopTraining();
            return;
        }
        
        // Simulate training data
        const epoch = currentEpoch;
        const trainLoss = 2.3 * Math.exp(-epoch * 0.3) + 0.1 + Math.random() * 0.1;
        const valLoss = 2.3 * Math.exp(-epoch * 0.25) + 0.15 + Math.random() * 0.15;
        const trainAcc = 100 * (1 - Math.exp(-epoch * 0.4)) - 5 + Math.random() * 3;
        const valAcc = 100 * (1 - Math.exp(-epoch * 0.35)) - 8 + Math.random() * 4;
        
        trainingData.epochs.push(epoch);
        trainingData.trainLoss.push(trainLoss);
        trainingData.trainAcc.push(Math.min(95, trainAcc));
        trainingData.valLoss.push(valLoss);
        trainingData.valAcc.push(Math.min(89, valAcc));
        
        updatePlot();
        currentEpoch++;
    }
    
    function updatePlot() {
        const g = svg.select('g');
        const { xScale, yScaleLoss, yScaleAcc, lineLoss, lineValLoss, lineAcc, lineValAcc } = svg.node();
        
        // Update lines
        g.select('.line-train-loss')
            .datum(trainingData.epochs)
            .attr('d', lineLoss);
        
        g.select('.line-val-loss')
            .datum(trainingData.epochs)
            .attr('d', lineValLoss);
        
        g.select('.line-train-acc')
            .datum(trainingData.epochs)
            .attr('d', lineAcc);
        
        g.select('.line-val-acc')
            .datum(trainingData.epochs)
            .attr('d', lineValAcc);
        
        // Update epoch indicator
        if (trainingData.epochs.length > 0) {
            const lastEpoch = trainingData.epochs[trainingData.epochs.length - 1];
            const lastAcc = trainingData.trainAcc[trainingData.trainAcc.length - 1];
            
            g.select('.epoch-indicator')
                .style('display', 'block')
                .attr('cx', xScale(lastEpoch))
                .attr('cy', yScaleAcc(lastAcc))
                .transition()
                .duration(200)
                .attr('r', 8)
                .transition()
                .duration(200)
                .attr('r', 5);
        }
        
        // Add final stats
        if (currentEpoch === 10) {
            const finalTrainAcc = trainingData.trainAcc[trainingData.trainAcc.length - 1];
            const finalValAcc = trainingData.valAcc[trainingData.valAcc.length - 1];
            
            g.append('text')
                .attr('class', 'final-stats')
                .attr('x', plotWidth / 2)
                .attr('y', -10)
                .attr('text-anchor', 'middle')
                .attr('font-weight', 'bold')
                .attr('fill', '#10099F')
                .text(`Final: Train Acc ${finalTrainAcc.toFixed(1)}%, Val Acc ${finalValAcc.toFixed(1)}%`);
        }
    }
    
    function stopTraining() {
        isTraining = false;
        if (animationTimer) {
            clearInterval(animationTimer);
            animationTimer = null;
        }
    }
    
    function reset() {
        stopTraining();
        currentEpoch = 0;
        
        // Clear data
        trainingData.epochs = [];
        trainingData.trainLoss = [];
        trainingData.trainAcc = [];
        trainingData.valLoss = [];
        trainingData.valAcc = [];
        
        // Clear plot
        const g = svg.select('g');
        g.selectAll('.line-train-loss, .line-val-loss, .line-train-acc, .line-val-acc')
            .attr('d', null);
        g.select('.epoch-indicator').style('display', 'none');
        g.select('.final-stats').remove();
    }
    
    // Event handlers
    document.getElementById('lenet-train-start').addEventListener('click', startTraining);
    document.getElementById('lenet-train-reset').addEventListener('click', reset);
    
    // Initialize when slide is shown
    Reveal.on('slidechanged', event => {
        if (event.currentSlide.querySelector('#lenet-training-svg')) {
            init();
        }
    });
    
    // Initial check
    if (document.querySelector('#lenet-training-svg')) {
        init();
    }
})();