// Object-Oriented Design Visualization for Linear Networks

// Initialize class hierarchy diagram
function initClassHierarchyDiagram() {
    const container = d3.select('#class-hierarchy-diagram');
    if (container.empty()) return;
    
    // Clear any existing content
    container.selectAll('*').remove();
    
    const width = 850;
    const height = 400;
    const margin = { top: 40, right: 50, bottom: 40, left: 50 };
    
    const svg = container.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Define class nodes
    const classes = [
        { id: 'hyperparameters', label: 'HyperParameters', x: width/2, y: 60, color: '#10099F' },
        { id: 'module', label: 'Module', x: width/2 - 200, y: 150, color: '#2DD2C0' },
        { id: 'datamodule', label: 'DataModule', x: width/2, y: 150, color: '#2DD2C0' },
        { id: 'trainer', label: 'Trainer', x: width/2 + 200, y: 150, color: '#2DD2C0' },
        { id: 'linearregression', label: 'LinearRegression', x: width/2 - 200, y: 280, color: '#FC8484' },
        { id: 'syntheticdata', label: 'SyntheticRegressionData', x: width/2, y: 280, color: '#FC8484' },
        { id: 'sgdtrainer', label: 'SGDTrainer', x: width/2 + 200, y: 280, color: '#FC8484' }
    ];
    
    // Define inheritance relationships
    const inheritance = [
        { source: 'hyperparameters', target: 'module' },
        { source: 'hyperparameters', target: 'datamodule' },
        { source: 'hyperparameters', target: 'trainer' },
        { source: 'module', target: 'linearregression' },
        { source: 'datamodule', target: 'syntheticdata' },
        { source: 'trainer', target: 'sgdtrainer' }
    ];
    
    // Draw inheritance arrows
    const arrows = svg.append('g').attr('class', 'inheritance-arrows');
    
    inheritance.forEach(link => {
        const source = classes.find(c => c.id === link.source);
        const target = classes.find(c => c.id === link.target);
        
        arrows.append('line')
            .attr('class', 'inheritance-line')
            .attr('x1', source.x)
            .attr('y1', source.y + 25)
            .attr('x2', target.x)
            .attr('y2', target.y - 25)
            .style('stroke', '#999')
            .style('stroke-width', 2)
            .style('stroke-dasharray', '5,5');
        
        // Add arrowhead - position exactly at the end of the line
        const angle = Math.atan2(target.y - source.y, target.x - source.x);
        const arrowX = target.x;
        const arrowY = target.y - 25;
        
        // Create arrowhead points relative to origin, then transform
        const arrowSize = 8;
        const points = [
            { x: 0, y: 0 },           // Arrow tip
            { x: -arrowSize, y: -arrowSize/2 },  // Top of arrow base
            { x: -arrowSize, y: arrowSize/2 }    // Bottom of arrow base
        ];
        
        // Transform points based on angle and position
        const transformedPoints = points.map(p => {
            const rotatedX = p.x * Math.cos(angle) - p.y * Math.sin(angle);
            const rotatedY = p.x * Math.sin(angle) + p.y * Math.cos(angle);
            return `${arrowX + rotatedX},${arrowY + rotatedY}`;
        }).join(' ');
        
        arrows.append('polygon')
            .attr('points', transformedPoints)
            .style('fill', '#999');
    });
    
    // Draw class boxes
    const classGroups = svg.append('g').attr('class', 'class-boxes');
    
    classes.forEach(cls => {
        const group = classGroups.append('g')
            .attr('class', 'class-box')
            .attr('transform', `translate(${cls.x}, ${cls.y})`);
        
        // Box background
        const rect = group.append('rect')
            .attr('x', -90)
            .attr('y', -25)
            .attr('width', 180)
            .attr('height', 50)
            .attr('rx', 5)
            .style('fill', cls.color)
            .style('fill-opacity', 0.2)
            .style('stroke', cls.color)
            .style('stroke-width', 2);
        
        // Class name
        group.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 5)
            .style('font-size', '14px')
            .style('font-weight', 'bold')
            .style('fill', cls.color)
            .text(cls.label);
        
        // Hover effect
        group.on('mouseover', function() {
            d3.select(this).select('rect')
                .transition()
                .duration(200)
                .style('fill-opacity', 0.4);
        }).on('mouseout', function() {
            d3.select(this).select('rect')
                .transition()
                .duration(200)
                .style('fill-opacity', 0.2);
        });
    });
    
    // Add labels
    svg.append('text')
        .attr('x', width/2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('fill', '#333')
        .text('Class Hierarchy');
}

// Initialize module composition animation
function initModuleComposition() {
    const container = d3.select('#module-composition');
    if (container.empty()) return;
    
    // Clear any existing content
    container.selectAll('*').remove();
    
    const width = 850;
    const height = 350;
    
    const svg = container.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Module components
    const components = [
        { id: 'params', label: 'Parameters', x: 150, y: 100, width: 120, height: 60 },
        { id: 'forward', label: 'forward()', x: 150, y: 200, width: 120, height: 60 },
        { id: 'loss', label: 'loss()', x: 150, y: 280, width: 120, height: 60 },
        { id: 'training', label: 'training_step()', x: 425, y: 150, width: 150, height: 60 },
        { id: 'optimizer', label: 'configure_optimizers()', x: 425, y: 250, width: 150, height: 60 },
        { id: 'output', label: 'Model Output', x: 700, y: 175, width: 120, height: 60 }
    ];
    
    // Draw components
    components.forEach(comp => {
        const group = svg.append('g')
            .attr('class', 'component')
            .attr('transform', `translate(${comp.x - comp.width/2}, ${comp.y - comp.height/2})`);
        
        group.append('rect')
            .attr('width', comp.width)
            .attr('height', comp.height)
            .attr('rx', 8)
            .style('fill', comp.id === 'output' ? '#FC8484' : '#2DD2C0')
            .style('fill-opacity', 0.3)
            .style('stroke', comp.id === 'output' ? '#FC8484' : '#2DD2C0')
            .style('stroke-width', 2);
        
        group.append('text')
            .attr('x', comp.width/2)
            .attr('y', comp.height/2 + 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('fill', '#333')
            .text(comp.label);
    });
    
    // Animate data flow
    function animateDataFlow() {
        const flowPath = [
            { x: 150, y: 100 },
            { x: 150, y: 200 },
            { x: 425, y: 150 },
            { x: 150, y: 280 },
            { x: 425, y: 250 },
            { x: 700, y: 175 }
        ];
        
        flowPath.forEach((point, i) => {
            setTimeout(() => {
                const particle = svg.append('circle')
                    .attr('cx', point.x)
                    .attr('cy', point.y)
                    .attr('r', 0)
                    .style('fill', '#10099F');
                
                particle.transition()
                    .duration(300)
                    .attr('r', 8)
                    .transition()
                    .duration(300)
                    .attr('r', 4)
                    .transition()
                    .delay(2000)
                    .duration(300)
                    .attr('r', 0)
                    .remove();
            }, i * 400);
        });
    }
    
    // Start animation
    animateDataFlow();
    const intervalId = setInterval(animateDataFlow, 4000);
    
    // Track interval for cleanup
    if (window.activeAnimations) {
        window.activeAnimations.intervals.push(intervalId);
    }
}

// Initialize data pipeline visualization
function initDataPipeline() {
    const container = d3.select('#data-pipeline-viz');
    if (container.empty()) return;
    
    // Clear any existing content
    container.selectAll('*').remove();
    
    const width = 850;
    const height = 300;
    
    const svg = container.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Pipeline stages
    const stages = [
        { label: 'Raw Data', x: 100, y: 150, color: '#10099F' },
        { label: 'DataModule', x: 300, y: 150, color: '#2DD2C0' },
        { label: 'DataLoader', x: 500, y: 150, color: '#FAC55B' },
        { label: 'Training', x: 700, y: 150, color: '#FC8484' }
    ];
    
    // Draw pipeline
    stages.forEach((stage, i) => {
        // Draw arrow to next stage
        if (i < stages.length - 1) {
            svg.append('line')
                .attr('x1', stage.x + 40)
                .attr('y1', stage.y)
                .attr('x2', stages[i + 1].x - 40)
                .attr('y2', stages[i + 1].y)
                .style('stroke', '#999')
                .style('stroke-width', 2)
                .attr('marker-end', 'url(#arrowhead)');
        }
        
        // Draw stage circle
        const group = svg.append('g')
            .attr('transform', `translate(${stage.x}, ${stage.y})`);
        
        group.append('circle')
            .attr('r', 35)
            .style('fill', stage.color)
            .style('fill-opacity', 0.3)
            .style('stroke', stage.color)
            .style('stroke-width', 2);
        
        // Stage label
        group.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 5)
            .style('font-size', '12px')
            .style('fill', '#333')
            .text(stage.label);
    });
    
    // Define arrow marker
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('refX', 5)
        .attr('refY', 3)
        .attr('markerWidth', 10)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('polygon')
        .attr('points', '0 0, 6 3, 0 6')
        .style('fill', '#999');
    
    // Animate data batches
    function animateBatch() {
        const batch = svg.append('rect')
            .attr('x', 80)
            .attr('y', 140)
            .attr('width', 20)
            .attr('height', 20)
            .attr('rx', 3)
            .style('fill', '#10099F')
            .style('opacity', 0.8);
        
        batch.transition()
            .duration(3000)
            .ease(d3.easeLinear)
            .attr('x', 710)
            .on('end', function() {
                d3.select(this).remove();
            });
    }
    
    // Start batch animation
    animateBatch();
    const intervalId = setInterval(animateBatch, 1000);
    
    // Track interval for cleanup
    if (window.activeAnimations) {
        window.activeAnimations.intervals.push(intervalId);
    }
}

// Initialize code structure demo
function initCodeStructureDemo() {
    const container = d3.select('#code-structure-demo');
    if (container.empty()) return;
    
    // Clear any existing content
    container.selectAll('*').remove();
    
    // Create tabbed interface
    const tabs = container.append('div')
        .attr('class', 'code-tabs')
        .style('display', 'flex')
        .style('border-bottom', '2px solid #10099F')
        .style('margin-bottom', '10px');
    
    const tabNames = ['Module', 'DataModule', 'Trainer', 'Usage'];
    let activeTab = 'Module';
    
    tabNames.forEach(name => {
        tabs.append('button')
            .attr('class', 'code-tab')
            .style('padding', '10px 20px')
            .style('border', 'none')
            .style('background', name === activeTab ? '#10099F' : 'transparent')
            .style('color', name === activeTab ? 'white' : '#333')
            .style('cursor', 'pointer')
            .style('font-size', '14px')
            .text(name)
            .on('click', function() {
                // Update active tab
                activeTab = name;
                d3.selectAll('.code-tab')
                    .style('background', function() {
                        return d3.select(this).text() === activeTab ? '#10099F' : 'transparent';
                    })
                    .style('color', function() {
                        return d3.select(this).text() === activeTab ? 'white' : '#333';
                    });
                updateCodeContent(name);
            });
    });
    
    // Code content area
    const codeArea = container.append('div')
        .attr('class', 'code-content')
        .style('background', '#f5f5f5')
        .style('padding', '20px')
        .style('border-radius', '5px')
        .style('font-family', 'monospace')
        .style('font-size', '12px')
        .style('height', '250px')
        .style('overflow-y', 'auto');
    
    // Code samples
    const codeSamples = {
        'Module': `class LinearRegressionScratch(Module):
    def __init__(self, num_inputs, lr, sigma=0.01):
        super().__init__()
        self.save_hyperparameters()
        self.w = torch.normal(0, sigma, (num_inputs, 1))
        self.b = torch.zeros(1)
        
    def forward(self, X):
        return torch.matmul(X, self.w) + self.b
    
    def loss(self, y_hat, y):
        return ((y_hat - y) ** 2).mean() / 2
    
    def configure_optimizers(self):
        return SGD([self.w, self.b], self.lr)`,
        
        'DataModule': `class SyntheticRegressionData(DataModule):
    def __init__(self, w, b, noise=0.01, num_train=1000,
                 num_val=100, batch_size=32):
        super().__init__()
        self.save_hyperparameters()
        n = num_train + num_val
        self.X = torch.randn(n, len(w))
        self.y = torch.matmul(self.X, w) + b
        self.y += torch.randn(self.y.shape) * noise
        
    def get_dataloader(self, train):
        if train:
            indices = range(0, self.num_train)
        else:
            indices = range(self.num_train, self.num_train + self.num_val)
        return DataLoader(self.X[indices], self.y[indices],
                         self.batch_size, shuffle=train)`,
        
        'Trainer': `class SGDTrainer(Trainer):
    def prepare_batch(self, batch):
        return batch
    
    def fit_epoch(self):
        self.model.train()
        for batch in self.train_dataloader:
            loss = self.model.training_step(self.prepare_batch(batch))
            self.optim.zero_grad()
            with torch.no_grad():
                loss.backward()
                if self.gradient_clip_val > 0:
                    self.clip_gradients(self.gradient_clip_val)
                self.optim.step()
            self.train_batch_idx += 1`,
        
        'Usage': `# Create synthetic data
data = SyntheticRegressionData(w=torch.tensor([2, -3.4]),
                               b=4.2, noise=0.01)

# Initialize model
model = LinearRegressionScratch(num_inputs=2, lr=0.03)

# Create trainer
trainer = SGDTrainer(max_epochs=10)

# Train the model
trainer.fit(model, data)

# Model is now trained and ready for predictions!`
    };
    
    function updateCodeContent(tabName) {
        codeArea.html(`<pre style="margin: 0; white-space: pre-wrap;">${codeSamples[tabName]}</pre>`);
    }
    
    // Initialize with first tab
    updateCodeContent('Module');
}

// Initialize training loop animation
function initTrainingLoopAnimation() {
    const container = d3.select('#training-loop-animation');
    if (container.empty()) return;
    
    // Clear any existing content
    container.selectAll('*').remove();
    
    const width = 850;
    const height = 400;
    
    const svg = container.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Training loop components
    const steps = [
        { id: 'batch', label: 'Get Batch', x: 150, y: 100 },
        { id: 'forward', label: 'Forward Pass', x: 350, y: 100 },
        { id: 'loss', label: 'Compute Loss', x: 550, y: 100 },
        { id: 'backward', label: 'Backward Pass', x: 550, y: 250 },
        { id: 'update', label: 'Update Params', x: 350, y: 250 },
        { id: 'check', label: 'Check Epoch', x: 150, y: 250 }
    ];
    
    // Draw loop path
    const loopPath = svg.append('path')
        .attr('d', `M 150 130 L 350 130 L 550 130 L 550 220 L 350 220 L 150 220 L 150 130`)
        .style('fill', 'none')
        .style('stroke', '#999')
        .style('stroke-width', 2)
        .style('stroke-dasharray', '5,5');
    
    // Draw steps
    steps.forEach(step => {
        const group = svg.append('g')
            .attr('transform', `translate(${step.x}, ${step.y})`);
        
        group.append('rect')
            .attr('x', -60)
            .attr('y', -20)
            .attr('width', 120)
            .attr('height', 40)
            .attr('rx', 20)
            .style('fill', '#2DD2C0')
            .style('fill-opacity', 0.3)
            .style('stroke', '#2DD2C0')
            .style('stroke-width', 2);
        
        group.append('text')
            .attr('text-anchor', 'middle')
            .attr('y', 5)
            .style('font-size', '12px')
            .style('fill', '#333')
            .text(step.label);
    });
    
    // Center labels
    svg.append('text')
        .attr('x', width/2)
        .attr('y', 40)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', '#10099F')
        .text('Training Loop');
    
    svg.append('text')
        .attr('x', width/2)
        .attr('y', 175)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .style('fill', '#666')
        .text('Epoch Progress');
    
    // Animate loop execution
    let currentStep = 0;
    function animateStep() {
        const step = steps[currentStep];
        
        // Highlight current step
        svg.selectAll('rect')
            .style('fill-opacity', 0.3);
        
        svg.select(`g:nth-child(${currentStep + 2}) rect`)
            .style('fill-opacity', 0.8);
        
        // Move to next step
        currentStep = (currentStep + 1) % steps.length;
    }
    
    // Start animation
    animateStep();
    const intervalId = setInterval(animateStep, 1000);
    
    // Track interval for cleanup
    if (window.activeAnimations) {
        window.activeAnimations.intervals.push(intervalId);
    }
}

// Initialize benefits comparison
function initBenefitsComparison() {
    const container = d3.select('#benefits-comparison');
    if (container.empty()) return;
    
    // Clear any existing content
    container.selectAll('*').remove();
    
    const benefits = [
        { category: 'Modularity', traditional: 3, oo: 9 },
        { category: 'Reusability', traditional: 2, oo: 10 },
        { category: 'Maintainability', traditional: 4, oo: 9 },
        { category: 'Extensibility', traditional: 3, oo: 10 },
        { category: 'Testing', traditional: 5, oo: 9 },
        { category: 'Collaboration', traditional: 4, oo: 8 }
    ];
    
    const width = 850;
    const height = 350;
    const margin = { top: 40, right: 100, bottom: 60, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const svg = container.append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const xScale = d3.scaleBand()
        .domain(benefits.map(d => d.category))
        .range([0, innerWidth])
        .padding(0.3);
    
    const yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([innerHeight, 0]);
    
    // Axes
    g.append('g')
        .attr('transform', `translate(0,${innerHeight})`)
        .call(d3.axisBottom(xScale));
    
    g.append('g')
        .call(d3.axisLeft(yScale));
    
    // Y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 30)
        .attr('x', -height/2)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Score');
    
    // Legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 80}, 60)`);
    
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', '#FC8484');
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text('Traditional');
    
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 25)
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', '#10099F');
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 37)
        .style('font-size', '12px')
        .text('OO Design');
    
    // Bars
    const barWidth = xScale.bandwidth() / 2;
    
    benefits.forEach(benefit => {
        // Traditional bar
        g.append('rect')
            .attr('x', xScale(benefit.category))
            .attr('y', innerHeight)
            .attr('width', barWidth)
            .attr('height', 0)
            .style('fill', '#FC8484')
            .transition()
            .duration(1000)
            .delay(benefits.indexOf(benefit) * 100)
            .attr('y', yScale(benefit.traditional))
            .attr('height', innerHeight - yScale(benefit.traditional));
        
        // OO Design bar
        g.append('rect')
            .attr('x', xScale(benefit.category) + barWidth)
            .attr('y', innerHeight)
            .attr('width', barWidth)
            .attr('height', 0)
            .style('fill', '#10099F')
            .transition()
            .duration(1000)
            .delay(benefits.indexOf(benefit) * 100 + 500)
            .attr('y', yScale(benefit.oo))
            .attr('height', innerHeight - yScale(benefit.oo));
    });
    
    // Title
    svg.append('text')
        .attr('x', width/2)
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .style('fill', '#333')
        .text('Traditional vs Object-Oriented Design');
}