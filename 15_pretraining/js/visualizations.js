// visualizations.js - Interactive visualizations for NLP Pretraining lecture

// ============================================================================
// Skip-Gram Visualization
// ============================================================================

function createSkipGramViz() {
    const container = d3.select('#skipgram-viz');
    const width = 700;
    const height = 400;

    // Clear existing
    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const centerWord = d3.select('#skipgram-word').property('value');

    // Define positions
    const centerPos = { x: width / 2, y: height / 2 };
    const contextWords = ['the', 'man', 'his', 'son'];
    const contextPositions = [
        { x: width / 2 - 150, y: height / 2 - 100 },
        { x: width / 2 - 150, y: height / 2 + 100 },
        { x: width / 2 + 150, y: height / 2 - 100 },
        { x: width / 2 + 150, y: height / 2 + 100 }
    ];

    // Draw connections
    const links = svg.selectAll('.link')
        .data(contextPositions)
        .enter()
        .append('line')
        .attr('class', 'link')
        .attr('x1', centerPos.x)
        .attr('y1', centerPos.y)
        .attr('x2', d => d.x)
        .attr('y2', d => d.y);

    // Draw context nodes
    const contextNodes = svg.selectAll('.context-node')
        .data(contextPositions)
        .enter()
        .append('g')
        .attr('transform', (d, i) => `translate(${d.x}, ${d.y})`);

    contextNodes.append('circle')
        .attr('class', 'node context')
        .attr('r', 30);

    contextNodes.append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .text((d, i) => contextWords[i]);

    // Draw center node
    const centerNode = svg.append('g')
        .attr('transform', `translate(${centerPos.x}, ${centerPos.y})`);

    centerNode.append('circle')
        .attr('class', 'node')
        .attr('r', 40);

    centerNode.append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .text(centerWord);

    return { svg, centerPos, contextPositions, links };
}

function animateSkipGram() {
    const viz = createSkipGramViz();
    const { svg, centerPos, contextPositions } = viz;

    // Create particles
    contextPositions.forEach((targetPos, i) => {
        for (let j = 0; j < 3; j++) {
            setTimeout(() => {
                const particle = svg.append('circle')
                    .attr('class', 'particle')
                    .attr('cx', centerPos.x)
                    .attr('cy', centerPos.y)
                    .attr('r', 0);

                particle.transition()
                    .duration(1000)
                    .attr('cx', targetPos.x)
                    .attr('cy', targetPos.y)
                    .attr('r', 6)
                    .transition()
                    .duration(500)
                    .attr('r', 0)
                    .remove();
            }, i * 300 + j * 100);
        }
    });
}

// Event listeners for skip-gram
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('skipgram-viz')) {
        createSkipGramViz();

        document.getElementById('skipgram-animate').addEventListener('click', animateSkipGram);
        document.getElementById('skipgram-reset').addEventListener('click', createSkipGramViz);
        document.getElementById('skipgram-word').addEventListener('change', createSkipGramViz);
    }
});

// ============================================================================
// CBOW Visualization
// ============================================================================

function createCBOWViz() {
    const container = d3.select('#cbow-viz');
    const width = 700;
    const height = 400;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    const targetWord = d3.select('#cbow-word').property('value');

    const centerPos = { x: width / 2, y: height / 2 };
    const contextWords = ['the', 'man', 'his', 'son'];
    const contextPositions = [
        { x: width / 2 - 150, y: height / 2 - 100 },
        { x: width / 2 - 150, y: height / 2 + 100 },
        { x: width / 2 + 150, y: height / 2 - 100 },
        { x: width / 2 + 150, y: height / 2 + 100 }
    ];

    // Draw connections
    contextPositions.forEach(pos => {
        svg.append('line')
            .attr('class', 'link')
            .attr('x1', pos.x)
            .attr('y1', pos.y)
            .attr('x2', centerPos.x)
            .attr('y2', centerPos.y);
    });

    // Draw context nodes
    contextPositions.forEach((pos, i) => {
        const g = svg.append('g')
            .attr('transform', `translate(${pos.x}, ${pos.y})`);

        g.append('circle')
            .attr('class', 'node context')
            .attr('r', 30);

        g.append('text')
            .attr('class', 'node-label')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em')
            .text(contextWords[i]);
    });

    // Draw center node
    const centerNode = svg.append('g')
        .attr('transform', `translate(${centerPos.x}, ${centerPos.y})`);

    centerNode.append('circle')
        .attr('class', 'node')
        .attr('r', 40);

    centerNode.append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .text(targetWord);

    return { svg, centerPos, contextPositions };
}

function animateCBOW() {
    const viz = createCBOWViz();
    const { svg, centerPos, contextPositions } = viz;

    // Animate particles from context to center
    contextPositions.forEach((sourcePos, i) => {
        for (let j = 0; j < 3; j++) {
            setTimeout(() => {
                const particle = svg.append('circle')
                    .attr('class', 'particle')
                    .attr('cx', sourcePos.x)
                    .attr('cy', sourcePos.y)
                    .attr('r', 0);

                particle.transition()
                    .duration(1000)
                    .attr('cx', centerPos.x)
                    .attr('cy', centerPos.y)
                    .attr('r', 6)
                    .transition()
                    .duration(500)
                    .attr('r', 0)
                    .remove();
            }, i * 300 + j * 100);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cbow-viz')) {
        createCBOWViz();

        document.getElementById('cbow-animate').addEventListener('click', animateCBOW);
        document.getElementById('cbow-reset').addEventListener('click', createCBOWViz);
        document.getElementById('cbow-word').addEventListener('change', createCBOWViz);
    }
});

// ============================================================================
// Negative Sampling Visualization
// ============================================================================

function updateNegativeSampling() {
    const k = parseInt(document.getElementById('neg-k').value);
    document.getElementById('neg-k-value').textContent = k;

    const vocabSize = 10000;
    const savings = Math.floor(vocabSize / (k + 1));
    document.getElementById('comp-savings').textContent = `${savings}×`;
}

function sampleNegativeWords() {
    const k = parseInt(document.getElementById('neg-k').value);
    const vocabulary = ['cat', 'dog', 'house', 'computer', 'tree', 'book', 'car', 'apple', 'music', 'sun',
                        'moon', 'star', 'ocean', 'mountain', 'river', 'flower', 'bird', 'cloud', 'rain', 'snow'];

    const negSampleList = document.getElementById('neg-sample-list');
    negSampleList.innerHTML = '';

    // Sample k random words
    const shuffled = [...vocabulary].sort(() => 0.5 - Math.random());
    const samples = shuffled.slice(0, k);

    samples.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'token';
        span.style.background = '#FC8484';
        span.textContent = word;
        negSampleList.appendChild(span);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('neg-k')) {
        document.getElementById('neg-k').addEventListener('input', updateNegativeSampling);
        document.getElementById('neg-sample').addEventListener('click', sampleNegativeWords);
        sampleNegativeWords();
    }
});

// ============================================================================
// Hierarchical Softmax Tree Visualization
// ============================================================================

function createTreeViz() {
    const container = d3.select('#tree-viz');
    const width = 700;
    const height = 450;

    container.selectAll('*').remove();

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Tree structure
    const treeData = {
        name: 'root',
        children: [
            {
                name: 'n(w3,2)',
                children: [
                    { name: 'w1' },
                    { name: 'w2' }
                ]
            },
            {
                name: 'n(w3,3)',
                children: [
                    { name: 'w3' },
                    { name: 'w4' }
                ]
            }
        ]
    };

    const treeLayout = d3.tree().size([width - 100, height - 100]);
    const root = d3.hierarchy(treeData);
    treeLayout(root);

    // Draw links
    svg.selectAll('.tree-link')
        .data(root.links())
        .enter()
        .append('line')
        .attr('class', 'tree-link')
        .attr('x1', d => d.source.x + 50)
        .attr('y1', d => d.source.y + 50)
        .attr('x2', d => d.target.x + 50)
        .attr('y2', d => d.target.y + 50);

    // Draw nodes
    const nodes = svg.selectAll('.tree-node-group')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', 'tree-node-group')
        .attr('transform', d => `translate(${d.x + 50}, ${d.y + 50})`);

    nodes.append('circle')
        .attr('class', d => {
            const isLeaf = !d.children;
            return `tree-node ${isLeaf ? 'leaf' : ''}`;
        })
        .attr('r', 25)
        .attr('data-name', d => d.data.name);

    nodes.append('text')
        .attr('class', 'node-label')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .style('font-size', '11px')
        .text(d => d.data.name);

    return svg;
}

function highlightPath(targetWord) {
    const svg = d3.select('#tree-viz svg');

    // Reset all highlights
    svg.selectAll('.tree-node').classed('highlighted', false);
    svg.selectAll('.tree-link').classed('highlighted', false);

    // Define paths for each word
    const paths = {
        'w1': ['root', 'n(w3,2)', 'w1'],
        'w2': ['root', 'n(w3,2)', 'w2'],
        'w3': ['root', 'n(w3,3)', 'w3'],
        'w4': ['root', 'n(w3,3)', 'w4']
    };

    const path = paths[targetWord];
    if (!path) return;

    // Highlight nodes in path
    path.forEach(nodeName => {
        svg.selectAll('.tree-node')
            .filter(function() {
                return d3.select(this).attr('data-name') === nodeName;
            })
            .classed('highlighted', true);
    });

    // Show calculation
    const calc = document.getElementById('path-calculation');
    if (targetWord === 'w3') {
        calc.innerHTML = `
            <strong>Path to w₃:</strong> root → right → left<br>
            <div style="margin-top: 10px;">
                <code>P(w₃ | wc) = σ(u₁ᵀvc) · σ(-u₂ᵀvc) · σ(u₃ᵀvc)</code>
            </div>
            <div style="margin-top: 10px; font-size: 0.9em; color: #666;">
                Where σ is the sigmoid function, and u₁, u₂, u₃ are node vectors on the path
            </div>
        `;
    } else {
        calc.innerHTML = `<strong>Path to ${targetWord}:</strong> ${path.join(' → ')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tree-viz')) {
        createTreeViz();

        document.getElementById('tree-highlight').addEventListener('click', () => {
            const word = document.getElementById('tree-word').value;
            highlightPath(word);
        });

        document.getElementById('tree-reset').addEventListener('click', () => {
            createTreeViz();
            document.getElementById('path-calculation').innerHTML = '<strong>Click "Show Path" to see the probability calculation</strong>';
        });
    }
});

// ============================================================================
// BPE Algorithm Animation
// ============================================================================

const bpeSteps = [
    { merge: 'Initial', tokens: [
        ['f', 'a', 's', 't', '_'],
        ['f', 'a', 's', 't', 'e', 'r', '_'],
        ['t', 'a', 'l', 'l', '_'],
        ['t', 'a', 'l', 'l', 'e', 'r', '_']
    ], vocab: [] },
    { merge: 't, a', tokens: [
        ['f', 'a', 's', 't', '_'],
        ['f', 'a', 's', 't', 'e', 'r', '_'],
        ['ta', 'l', 'l', '_'],
        ['ta', 'l', 'l', 'e', 'r', '_']
    ], vocab: ['ta'] },
    { merge: 'ta, l', tokens: [
        ['f', 'a', 's', 't', '_'],
        ['f', 'a', 's', 't', 'e', 'r', '_'],
        ['tal', 'l', '_'],
        ['tal', 'l', 'e', 'r', '_']
    ], vocab: ['ta', 'tal'] },
    { merge: 'tal, l', tokens: [
        ['f', 'a', 's', 't', '_'],
        ['f', 'a', 's', 't', 'e', 'r', '_'],
        ['tall', '_'],
        ['tall', 'e', 'r', '_']
    ], vocab: ['ta', 'tal', 'tall'] },
    { merge: 'f, a', tokens: [
        ['fa', 's', 't', '_'],
        ['fa', 's', 't', 'e', 'r', '_'],
        ['tall', '_'],
        ['tall', 'e', 'r', '_']
    ], vocab: ['ta', 'tal', 'tall', 'fa'] },
    { merge: 'fa, s', tokens: [
        ['fas', 't', '_'],
        ['fas', 't', 'e', 'r', '_'],
        ['tall', '_'],
        ['tall', 'e', 'r', '_']
    ], vocab: ['ta', 'tal', 'tall', 'fa', 'fas'] },
    { merge: 'fas, t', tokens: [
        ['fast', '_'],
        ['fast', 'e', 'r', '_'],
        ['tall', '_'],
        ['tall', 'e', 'r', '_']
    ], vocab: ['ta', 'tal', 'tall', 'fa', 'fas', 'fast'] },
    { merge: 'e, r', tokens: [
        ['fast', '_'],
        ['fast', 'er', '_'],
        ['tall', '_'],
        ['tall', 'er', '_']
    ], vocab: ['ta', 'tal', 'tall', 'fa', 'fas', 'fast', 'er'] },
    { merge: 'er, _', tokens: [
        ['fast', '_'],
        ['fast', 'er_'],
        ['tall', '_'],
        ['tall', 'er_']
    ], vocab: ['ta', 'tal', 'tall', 'fa', 'fas', 'fast', 'er', 'er_'] },
    { merge: 'tall, _', tokens: [
        ['fast', '_'],
        ['fast', 'er_'],
        ['tall_'],
        ['tall', 'er_']
    ], vocab: ['ta', 'tal', 'tall', 'fa', 'fas', 'fast', 'er', 'er_', 'tall_'] },
    { merge: 'fast, _', tokens: [
        ['fast_'],
        ['fast', 'er_'],
        ['tall_'],
        ['tall', 'er_']
    ], vocab: ['ta', 'tal', 'tall', 'fa', 'fas', 'fast', 'er', 'er_', 'tall_', 'fast_'] }
];

let currentBPEStep = 0;
let bpeInterval = null;

function displayBPEStep(step) {
    const stepData = bpeSteps[step];
    document.getElementById('bpe-step-num').textContent = step;
    document.getElementById('bpe-merge-info').textContent =
        step === 0 ? 'Initial state' : `Merged: ${stepData.merge}`;

    const tokensDiv = document.getElementById('bpe-tokens');
    tokensDiv.innerHTML = '';

    const freqs = [4, 3, 5, 4];
    stepData.tokens.forEach((tokenSeq, i) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'bpe-step';

        tokenSeq.forEach(token => {
            const span = document.createElement('span');
            span.className = 'token';
            if (token.length > 1) {
                span.classList.add('merged-token');
            }
            span.textContent = token;
            stepDiv.appendChild(span);
            stepDiv.appendChild(document.createTextNode(' '));
        });

        stepDiv.appendChild(document.createTextNode(`(freq: ${freqs[i]})`));
        tokensDiv.appendChild(stepDiv);
    });

    const vocabDiv = document.getElementById('bpe-vocab');
    if (stepData.vocab.length === 0) {
        vocabDiv.textContent = '(none yet)';
    } else {
        vocabDiv.textContent = stepData.vocab.join(', ');
    }
}

function nextBPEStep() {
    currentBPEStep = (currentBPEStep + 1) % bpeSteps.length;
    displayBPEStep(currentBPEStep);
}

function resetBPE() {
    currentBPEStep = 0;
    displayBPEStep(currentBPEStep);
    if (bpeInterval) {
        clearInterval(bpeInterval);
        bpeInterval = null;
    }
    document.getElementById('bpe-auto').checked = false;
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bpe-viz')) {
        displayBPEStep(0);

        document.getElementById('bpe-step').addEventListener('click', nextBPEStep);
        document.getElementById('bpe-reset-algo').addEventListener('click', resetBPE);

        document.getElementById('bpe-auto').addEventListener('change', (e) => {
            if (e.target.checked) {
                bpeInterval = setInterval(nextBPEStep, 1500);
            } else {
                if (bpeInterval) {
                    clearInterval(bpeInterval);
                    bpeInterval = null;
                }
            }
        });
    }
});

// ============================================================================
// Word Vector Space Visualization
// ============================================================================

function createWordSpace() {
    const container = d3.select('#word-space-viz');
    container.selectAll('*').remove();

    const width = 600;
    const height = 400;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height);

    // Simulated 2D word embeddings (normally from t-SNE)
    const words = [
        { word: 'king', x: 450, y: 150, category: 'royalty' },
        { word: 'queen', x: 420, y: 200, category: 'royalty' },
        { word: 'man', x: 350, y: 160, category: 'person' },
        { word: 'woman', x: 320, y: 210, category: 'person' },
        { word: 'prince', x: 480, y: 180, category: 'royalty' },
        { word: 'princess', x: 450, y: 230, category: 'royalty' },
        { word: 'cat', x: 150, y: 100, category: 'animal' },
        { word: 'dog', x: 180, y: 110, category: 'animal' },
        { word: 'kitten', x: 140, y: 130, category: 'animal' },
        { word: 'puppy', x: 190, y: 140, category: 'animal' },
        { word: 'Paris', x: 250, y: 300, category: 'city' },
        { word: 'France', x: 280, y: 330, category: 'country' },
        { word: 'London', x: 300, y: 290, category: 'city' },
        { word: 'England', x: 330, y: 320, category: 'country' }
    ];

    const colorScale = {
        'royalty': '#10099F',
        'person': '#2DD2C0',
        'animal': '#FC8484',
        'city': '#FAC55B',
        'country': '#FFA05F'
    };

    // Draw words
    const wordGroups = svg.selectAll('.word-point')
        .data(words)
        .enter()
        .append('g')
        .attr('class', 'word-point')
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

    wordGroups.append('circle')
        .attr('r', 5)
        .attr('fill', d => colorScale[d.category])
        .attr('opacity', 0.7);

    wordGroups.append('text')
        .attr('x', 8)
        .attr('y', 4)
        .style('font-size', '11px')
        .style('fill', '#262626')
        .text(d => d.word);

    return { svg, words };
}

function findSimilarWords(searchWord) {
    const viz = createWordSpace();
    const { svg, words } = viz;

    const target = words.find(w => w.word.toLowerCase() === searchWord.toLowerCase());
    if (!target) {
        alert('Word not found in vocabulary. Try: king, cat, Paris, etc.');
        return;
    }

    // Highlight target and nearest neighbors
    svg.selectAll('.word-point circle')
        .transition()
        .duration(500)
        .attr('r', d => d.word === target.word ? 8 : 5)
        .attr('stroke', d => d.word === target.word ? '#FF6B6B' : 'none')
        .attr('stroke-width', 3);

    // Calculate distances and find nearest
    const distances = words
        .filter(w => w.word !== target.word)
        .map(w => ({
            ...w,
            dist: Math.sqrt((w.x - target.x)**2 + (w.y - target.y)**2)
        }))
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);

    // Draw lines to nearest neighbors
    distances.forEach((neighbor, i) => {
        svg.append('line')
            .attr('x1', target.x)
            .attr('y1', target.y)
            .attr('x2', target.x)
            .attr('y2', target.y)
            .attr('stroke', '#2DD2C0')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0)
            .transition()
            .delay(i * 200)
            .duration(500)
            .attr('x2', neighbor.x)
            .attr('y2', neighbor.y)
            .attr('opacity', 0.6);
    });
}

function showAnalogyDemo() {
    const viz = createWordSpace();
    const { svg, words } = viz;

    // Show king - man + woman ≈ queen
    const king = words.find(w => w.word === 'king');
    const man = words.find(w => w.word === 'man');
    const woman = words.find(w => w.word === 'woman');
    const queen = words.find(w => w.word === 'queen');

    if (!king || !man || !woman || !queen) return;

    // Draw vector arrows
    const arrows = [
        { from: king, to: man, color: '#FC8484', label: 'king - man' },
        { from: woman, to: queen, color: '#2DD2C0', label: '+ woman' }
    ];

    arrows.forEach((arrow, i) => {
        setTimeout(() => {
            // Arrow line
            svg.append('line')
                .attr('x1', arrow.from.x)
                .attr('y1', arrow.from.y)
                .attr('x2', arrow.from.x)
                .attr('y2', arrow.from.y)
                .attr('stroke', arrow.color)
                .attr('stroke-width', 3)
                .attr('marker-end', 'url(#arrowhead)')
                .transition()
                .duration(1000)
                .attr('x2', arrow.to.x)
                .attr('y2', arrow.to.y);
        }, i * 1200);
    });

    // Highlight relevant words
    [king, man, woman, queen].forEach(word => {
        svg.selectAll('.word-point')
            .filter(d => d.word === word.word)
            .select('circle')
            .transition()
            .duration(500)
            .attr('r', 8)
            .attr('stroke', '#10099F')
            .attr('stroke-width', 2);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('word-space-viz')) {
        createWordSpace();

        document.getElementById('word-find').addEventListener('click', () => {
            const word = document.getElementById('word-search').value;
            if (word) findSimilarWords(word);
        });

        document.getElementById('word-analogy-demo').addEventListener('click', showAnalogyDemo);
    }
});

// ============================================================================
// BERT Input Embedding Visualization
// ============================================================================

function showBERTEmbeddings() {
    const mode = document.getElementById('bert-mode').value;
    const display = document.getElementById('bert-embeddings-display');

    if (mode === 'single') {
        document.getElementById('bert-tokens-display').textContent = '[CLS] this movie is great [SEP]';

        display.innerHTML = `
            <svg width="650" height="200">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#10099F;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#10099F;stop-opacity:0.7" />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#2DD2C0;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#2DD2C0;stop-opacity:0.7" />
                    </linearGradient>
                    <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#FAC55B;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#FAC55B;stop-opacity:0.7" />
                    </linearGradient>
                </defs>

                ${['[CLS]', 'this', 'movie', 'is', 'great', '[SEP]'].map((token, i) => `
                    <g transform="translate(${i * 100 + 20}, 0)">
                        <text x="35" y="20" text-anchor="middle" font-size="11" fill="#666">${token}</text>

                        <rect x="10" y="30" width="70" height="40" fill="url(#grad1)" rx="3" />
                        <text x="45" y="54" text-anchor="middle" font-size="10" fill="white">Token</text>

                        <text x="45" y="85" font-size="14" text-anchor="middle">+</text>

                        <rect x="10" y="95" width="70" height="40" fill="url(#grad2)" rx="3" />
                        <text x="45" y="119" text-anchor="middle" font-size="10" fill="white">Segment A</text>

                        <text x="45" y="150" font-size="14" text-anchor="middle">+</text>

                        <rect x="10" y="160" width="70" height="40" fill="url(#grad3)" rx="3" />
                        <text x="45" y="184" text-anchor="middle" font-size="10" fill="#666">Pos ${i}</text>
                    </g>
                `).join('')}
            </svg>
        `;
    } else {
        document.getElementById('bert-tokens-display').textContent = '[CLS] first sentence [SEP] second sentence [SEP]';

        display.innerHTML = `
            <div style="font-size: 0.9em; color: #666;">
                <p><strong>Segment A (blue):</strong> [CLS] first sentence [SEP]</p>
                <p><strong>Segment B (teal):</strong> second sentence [SEP]</p>
                <p style="margin-top: 10px;">Each token's final embedding is the sum of its token, segment, and position embeddings.</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bert-input-viz')) {
        showBERTEmbeddings();
        document.getElementById('bert-show').addEventListener('click', showBERTEmbeddings);
        document.getElementById('bert-mode').addEventListener('change', showBERTEmbeddings);
    }
});

// ============================================================================
// nanochat Metrics Visualization
// ============================================================================

function createNanochatMetrics() {
    const container = d3.select('#nanochat-metrics');
    if (container.empty()) return;

    container.selectAll('*').remove();

    const width = 700;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background', '#f9f9f9')
        .style('border-radius', '5px');

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Example data from speedrun results
    const metricsData = [
        { name: 'CORE', base: 0.2219, sft: null, color: '#10099F' },
        { name: 'ARC-Challenge', base: null, sft: 0.2807, color: '#2DD2C0' },
        { name: 'ARC-Easy', base: null, sft: 0.3876, color: '#2DD2C0' },
        { name: 'GSM8K', base: null, sft: 0.0455, color: '#FAC55B' },
        { name: 'HumanEval', base: null, sft: 0.0854, color: '#FFA05F' },
        { name: 'MMLU', base: null, sft: 0.3151, color: '#FC8484' }
    ];

    // Create scales
    const xScale = d3.scaleBand()
        .domain(metricsData.map(d => d.name))
        .range([0, chartWidth])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, 0.5])
        .range([chartHeight, 0]);

    // Add axes
    chart.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end')
        .style('font-size', '11px');

    chart.append('g')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d.toFixed(2)))
        .style('font-size', '11px');

    // Add Y axis label
    chart.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -45)
        .attr('x', -chartHeight / 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Score (Accuracy)');

    // Add bars
    metricsData.forEach(d => {
        const score = d.sft !== null ? d.sft : d.base;
        if (score !== null) {
            chart.append('rect')
                .attr('x', xScale(d.name))
                .attr('y', chartHeight)
                .attr('width', xScale.bandwidth())
                .attr('height', 0)
                .attr('fill', d.color)
                .attr('opacity', 0.8)
                .transition()
                .duration(800)
                .attr('y', yScale(score))
                .attr('height', chartHeight - yScale(score));

            // Add value labels on top of bars
            chart.append('text')
                .attr('x', xScale(d.name) + xScale.bandwidth() / 2)
                .attr('y', yScale(score) - 5)
                .attr('text-anchor', 'middle')
                .style('font-size', '10px')
                .style('font-weight', 'bold')
                .style('fill', '#262626')
                .style('opacity', 0)
                .text((score * 100).toFixed(1) + '%')
                .transition()
                .delay(800)
                .duration(400)
                .style('opacity', 1);
        }
    });

    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width - 150}, 10)`);

    const legendItems = [
        { label: 'Base Model', type: 'base' },
        { label: 'After SFT', type: 'sft' }
    ];

    legendItems.forEach((item, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);

        legendRow.append('rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', item.type === 'base' ? '#10099F' : '#2DD2C0')
            .attr('opacity', 0.8);

        legendRow.append('text')
            .attr('x', 18)
            .attr('y', 10)
            .style('font-size', '11px')
            .style('fill', '#666')
            .text(item.label);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('nanochat-metrics')) {
        // Wait a bit for Reveal.js to initialize
        setTimeout(createNanochatMetrics, 500);

        // Also recreate when navigating to this slide
        if (typeof Reveal !== 'undefined') {
            Reveal.on('slidechanged', event => {
                if (event.currentSlide.querySelector('#nanochat-metrics')) {
                    createNanochatMetrics();
                }
            });
        }
    }
});

console.log('Visualizations loaded successfully');
