/**
 * Interactive Activation Function Visualizations
 * For Multilayer Perceptrons Presentation
 */

(function() {
    'use strict';

    // Wait for Reveal to be ready
    if (typeof Reveal !== 'undefined') {
        Reveal.on('ready', initActivationVisualizations);
        Reveal.on('slidechanged', initActivationVisualizations);
    } else {
        document.addEventListener('DOMContentLoaded', initActivationVisualizations);
    }

    function initActivationVisualizations() {
        // Initialize all activation function plots
        initReLU();
        initSigmoid();
        initTanh();
    }

    // ReLU Visualization
    function initReLU() {
        const plotContainer = document.getElementById('relu-plot');
        const derivContainer = document.getElementById('relu-derivative-plot');
        const input = document.getElementById('relu-input');
        const valueDisplay = document.getElementById('relu-value');
        
        if (!plotContainer || !derivContainer || !input) return;

        // Clear previous content
        plotContainer.innerHTML = '';
        derivContainer.innerHTML = '';

        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        // Create SVG for function
        const svg = d3.select(plotContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create SVG for derivative
        const svgDeriv = d3.select(derivContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-1, 5]).range([height, 0]);
        const yScaleDeriv = d3.scaleLinear().domain([-0.5, 1.5]).range([height, 0]);

        // Add axes for function
        svg.append('g')
            .attr('transform', `translate(0,${yScale(0)})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        svg.append('g')
            .call(d3.axisLeft(yScale).ticks(5));

        // Add axes for derivative
        svgDeriv.append('g')
            .attr('transform', `translate(0,${yScaleDeriv(0)})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        svgDeriv.append('g')
            .call(d3.axisLeft(yScaleDeriv).ticks(5));

        // Add labels
        svg.append('text')
            .attr('x', width/2)
            .attr('y', -5)
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text('ReLU(x) = max(0, x)');

        svgDeriv.append('text')
            .attr('x', width/2)
            .attr('y', -5)
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text('ReLU\'(x)');

        // Generate data points
        const data = [];
        for (let x = -5; x <= 5; x += 0.1) {
            data.push({x: x, y: Math.max(0, x)});
        }

        const derivData = [];
        for (let x = -5; x <= 5; x += 0.1) {
            derivData.push({x: x, y: x > 0 ? 1 : 0});
        }

        // Draw ReLU function
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Draw derivative
        const lineDeriv = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScaleDeriv(d.y))
            .curve(d3.curveStepAfter);

        svgDeriv.append('path')
            .datum(derivData)
            .attr('fill', 'none')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2)
            .attr('d', lineDeriv);

        // Add interactive point
        const circle = svg.append('circle')
            .attr('r', 5)
            .attr('fill', '#2DD2C0');

        const circleDeriv = svgDeriv.append('circle')
            .attr('r', 5)
            .attr('fill', '#2DD2C0');

        // Update function
        function updateReLU() {
            const x = parseFloat(input.value);
            const y = Math.max(0, x);
            const deriv = x > 0 ? 1 : 0;
            
            circle.attr('cx', xScale(x))
                  .attr('cy', yScale(y));
            
            circleDeriv.attr('cx', xScale(x))
                       .attr('cy', yScaleDeriv(deriv));
            
            valueDisplay.textContent = `f(${x.toFixed(1)}) = ${y.toFixed(2)}, f'(${x.toFixed(1)}) = ${deriv}`;
        }

        input.addEventListener('input', updateReLU);
        updateReLU();
    }

    // Sigmoid Visualization
    function initSigmoid() {
        const plotContainer = document.getElementById('sigmoid-plot');
        const derivContainer = document.getElementById('sigmoid-derivative-plot');
        const input = document.getElementById('sigmoid-input');
        const valueDisplay = document.getElementById('sigmoid-value');
        
        if (!plotContainer || !derivContainer || !input) return;

        // Clear previous content
        plotContainer.innerHTML = '';
        derivContainer.innerHTML = '';

        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        // Create SVG for function
        const svg = d3.select(plotContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create SVG for derivative
        const svgDeriv = d3.select(derivContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-0.2, 1.2]).range([height, 0]);
        const yScaleDeriv = d3.scaleLinear().domain([-0.05, 0.3]).range([height, 0]);

        // Add axes for function
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        svg.append('g')
            .call(d3.axisLeft(yScale).ticks(5));

        // Add axes for derivative
        svgDeriv.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        svgDeriv.append('g')
            .call(d3.axisLeft(yScaleDeriv).ticks(5));

        // Add labels
        svg.append('text')
            .attr('x', width/2)
            .attr('y', -5)
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text('sigmoid(x) = 1/(1+e^(-x))');

        svgDeriv.append('text')
            .attr('x', width/2)
            .attr('y', -5)
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text('sigmoid\'(x) = σ(x)(1-σ(x))');

        // Generate data points
        const data = [];
        for (let x = -5; x <= 5; x += 0.1) {
            const sigmoid = 1 / (1 + Math.exp(-x));
            data.push({x: x, y: sigmoid});
        }

        const derivData = [];
        for (let x = -5; x <= 5; x += 0.1) {
            const sigmoid = 1 / (1 + Math.exp(-x));
            derivData.push({x: x, y: sigmoid * (1 - sigmoid)});
        }

        // Draw sigmoid function
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Draw derivative
        const lineDeriv = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScaleDeriv(d.y));

        svgDeriv.append('path')
            .datum(derivData)
            .attr('fill', 'none')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2)
            .attr('d', lineDeriv);

        // Add interactive point
        const circle = svg.append('circle')
            .attr('r', 5)
            .attr('fill', '#2DD2C0');

        const circleDeriv = svgDeriv.append('circle')
            .attr('r', 5)
            .attr('fill', '#2DD2C0');

        // Update function
        function updateSigmoid() {
            const x = parseFloat(input.value);
            const sigmoid = 1 / (1 + Math.exp(-x));
            const deriv = sigmoid * (1 - sigmoid);
            
            circle.attr('cx', xScale(x))
                  .attr('cy', yScale(sigmoid));
            
            circleDeriv.attr('cx', xScale(x))
                       .attr('cy', yScaleDeriv(deriv));
            
            valueDisplay.textContent = `f(${x.toFixed(1)}) = ${sigmoid.toFixed(3)}, f'(${x.toFixed(1)}) = ${deriv.toFixed(3)}`;
        }

        input.addEventListener('input', updateSigmoid);
        updateSigmoid();
    }

    // Tanh Visualization
    function initTanh() {
        const plotContainer = document.getElementById('tanh-plot');
        const derivContainer = document.getElementById('tanh-derivative-plot');
        const input = document.getElementById('tanh-input');
        const valueDisplay = document.getElementById('tanh-value');
        
        if (!plotContainer || !derivContainer || !input) return;

        // Clear previous content
        plotContainer.innerHTML = '';
        derivContainer.innerHTML = '';

        const margin = {top: 20, right: 20, bottom: 40, left: 50};
        const width = plotContainer.clientWidth - margin.left - margin.right;
        const height = 250 - margin.top - margin.bottom;

        // Create SVG for function
        const svg = d3.select(plotContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create SVG for derivative
        const svgDeriv = d3.select(derivContainer)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear().domain([-5, 5]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-1.2, 1.2]).range([height, 0]);
        const yScaleDeriv = d3.scaleLinear().domain([-0.2, 1.2]).range([height, 0]);

        // Add axes for function
        svg.append('g')
            .attr('transform', `translate(0,${yScale(0)})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        svg.append('g')
            .call(d3.axisLeft(yScale).ticks(5));

        // Add axes for derivative
        svgDeriv.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(10));
        
        svgDeriv.append('g')
            .call(d3.axisLeft(yScaleDeriv).ticks(5));

        // Add labels
        svg.append('text')
            .attr('x', width/2)
            .attr('y', -5)
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text('tanh(x)');

        svgDeriv.append('text')
            .attr('x', width/2)
            .attr('y', -5)
            .style('text-anchor', 'middle')
            .style('font-weight', 'bold')
            .text('tanh\'(x) = 1 - tanh²(x)');

        // Generate data points
        const data = [];
        for (let x = -5; x <= 5; x += 0.1) {
            const tanh = Math.tanh(x);
            data.push({x: x, y: tanh});
        }

        const derivData = [];
        for (let x = -5; x <= 5; x += 0.1) {
            const tanh = Math.tanh(x);
            derivData.push({x: x, y: 1 - tanh * tanh});
        }

        // Draw tanh function
        const line = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScale(d.y));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Draw derivative
        const lineDeriv = d3.line()
            .x(d => xScale(d.x))
            .y(d => yScaleDeriv(d.y));

        svgDeriv.append('path')
            .datum(derivData)
            .attr('fill', 'none')
            .attr('stroke', '#FC8484')
            .attr('stroke-width', 2)
            .attr('d', lineDeriv);

        // Add interactive point
        const circle = svg.append('circle')
            .attr('r', 5)
            .attr('fill', '#2DD2C0');

        const circleDeriv = svgDeriv.append('circle')
            .attr('r', 5)
            .attr('fill', '#2DD2C0');

        // Update function
        function updateTanh() {
            const x = parseFloat(input.value);
            const tanh = Math.tanh(x);
            const deriv = 1 - tanh * tanh;
            
            circle.attr('cx', xScale(x))
                  .attr('cy', yScale(tanh));
            
            circleDeriv.attr('cx', xScale(x))
                       .attr('cy', yScaleDeriv(deriv));
            
            valueDisplay.textContent = `f(${x.toFixed(1)}) = ${tanh.toFixed(3)}, f'(${x.toFixed(1)}) = ${deriv.toFixed(3)}`;
        }

        input.addEventListener('input', updateTanh);
        updateTanh();
    }

})();