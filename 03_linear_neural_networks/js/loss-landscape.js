// Loss Landscape Visualization for Linear Regression

function initLossLandscape() {
    // Initialize loss visualization on the appropriate slide
    const vizSlide = document.querySelector('#loss-visualization');
    if (vizSlide) {
        initLossVisualization();
    }
}