// Parameter Comparison Visualization (MLP vs CNN)
(function() {
    // This file is intentionally minimal since the parameter comparison
    // is shown through static HTML/CSS in the slides. The actual calculations
    // are displayed directly in the presentation content.
    
    // If we need dynamic parameter calculation in the future, we can add it here
    function calculateMLPParams(inputSize, hiddenSize) {
        return inputSize * inputSize * hiddenSize;
    }
    
    function calculateCNNParams(kernelSize, numFilters) {
        return kernelSize * kernelSize * numFilters;
    }
    
    // Initialize any parameter comparison demos
    function initParameterComparison() {
        // Currently handled through static content in slides
        // Can be extended for interactive comparisons if needed
    }
    
    // Initialize when slide is shown
    Reveal.on('slidechanged', event => {
        const slide = event.currentSlide;
        if (slide && slide.querySelector('.parameter-comparison')) {
            initParameterComparison();
        }
    });
})();