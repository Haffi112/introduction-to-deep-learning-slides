# CLAUDE.md

This file provides guidance for developing presentation slides for an Introduction to Deep Learning course using web-based presentation frameworks.

## Project Context

You are assisting in creating educational slides for a deep learning course. The slides should be:
- Clear and pedagogically sound for students new to deep learning
- Visually engaging with interactive JavaScript animations
- Built using the Reveal.js framework
- Focused on explaining concepts through visual demonstrations

## Course Topics

The course is based on the book "Dive into deep learning" and covers the following topics:
- Introduction
- Preliminaries
- Linear Neural Networks for Regression
- Linear Neural Networks for Classification
- Multilayer Perceptrons
- Builder's guide
- Convolutional Neural Networks
- Modern Convolutional Neural Networks
- Recurrent Neural Networks
- Modern Recurrent Neural Networks
- Attention Mechanisms and Transformers
- Optimization Algorithms
- Computational Performance
- Computer Vision
- Natural Language Processing: Pretraining
- Natural Language Processing: Applications
- Reinforcement Learning
- Gaussian Processes
- Hyperparameter Optimization
- Generative Adversarial Networks
- Recommender Systems

## Technical Guidelines

### Framework Choice
- **Reveal.js** - for stability and extensive features

### MCPs

Remember to use MCPs such as:
- Puppeteer to test the slides
- Context7 to look up documentation
- Sequential-thinking if you need to do some planning
- fetch if you need to grab content from the internet

### Animation Requirements
- Use D3.js or P5.js for 2D network visualizations
- Implement interactive demos where students can:
  - Adjust network parameters
  - See real-time activation propagation
  - Visualize gradient flow during backpropagation
  - Experiment with different activation functions

### Code Style
- Keep JavaScript animations modular and reusable
- Use ES6+ syntax for clarity
- Comment complex mathematical operations
- Ensure animations are performant (60fps target)

## Slide Structure Guidelines

### Title Slides
- Course/section title
- Clear learning objectives
- Estimated time for section
- **REQUIRED**: Use the `truncate-title` class on ALL slide titles (h1, h2, h3)
- **REQUIRED**: Include University of Iceland logo on all title slides
- Logo placement: Centered above the title (positioning handled automatically by CSS in shared/css/common.css)
- Example structure:
```html
<section class="title-slide">
    <img src="../shared/images/uoi_logo_blue.png" alt="University of Iceland Logo" class="ui-logo">
    <h1>Lecture Title</h1>
    <p>Subtitle or description</p>
    <p class="mt-lg">
        <small>Instructor: Name</small><br>
        <small>University of Iceland</small>
    </p>
</section>
```
Note: The logo positioning is handled automatically by CSS - no need for manual positioning.

### Concept Slides
- One main concept per slide
- Visual representation before mathematical notation
- Build complexity gradually
- Use animations to show processes step-by-step

### Interactive Demo Slides
- Clear instructions for interaction
- Reset button for demonstrations
- Parameter ranges clearly labeled
- Visual feedback for user actions

### Control Positioning for Interactive Visualizations

When adding controls (sliders, buttons, inputs) to interactive demos, ensure they are visible and accessible:

**⚠️ CRITICAL WARNING**: Never use the class name "controls" for your interactive elements!
- Reveal.js reserves the `.controls` class for its navigation arrows
- Using `class="controls"` will cause your elements to be hidden or repositioned by Reveal's CSS
- **Always use alternative class names like `demo-controls`, `interactive-controls`, or `viz-controls`**

**IMPORTANT**: Always ensure controls are in the foreground by using proper z-index hierarchy:
- Visualization containers: z-index: 1
- Control containers: z-index: 100+
- Individual controls: z-index: 101-103
- This prevents controls from being hidden behind SVG elements or other visualization content

#### 1. Above visualization approach (recommended)
Place controls above the visualization for better visibility:
```html
<div class="demo-controls" style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px; padding: 10px; background: #f9f9f9; border-radius: 5px; z-index: 100; position: relative;">
    <label style="display: flex; align-items: center; gap: 8px;">
        Parameter: 
        <input type="range" id="param-slider" style="width: 150px;">
        <span id="param-value" style="font-family: monospace;">0</span>
    </label>
    <button style="background: #10099F; color: white; border: none; padding: 8px 16px; border-radius: 5px;">Action</button>
</div>
<div class="demo-container">
    <!-- visualization content -->
</div>
```

#### 2. Overlay approach for space-constrained slides
Use absolute positioning when space is limited:
```html
<div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(255, 255, 255, 0.95); padding: 10px 20px; border-radius: 8px;">
    <!-- control elements -->
</div>
```

#### Best Practices
- **Avoid Reveal.js reserved class names** (controls, navigate, progress, backgrounds)
- **Always use inline styles** for critical UI elements to avoid CSS conflicts
- **Test visibility** at different zoom levels and screen sizes
- **Use UI brand colors** (#10099F) for buttons and interactive elements
- **Provide visual feedback** with hover states and clear labels
- **Center controls** for better visual balance on slides
- **Add scoped CSS overrides** if needed to ensure visibility:
```css
/* Ensure demo controls are always visible */
.interactive-demo .demo-controls {
    display: flex !important;
    position: relative;
    z-index: 100;
    pointer-events: auto;
}
.interactive-demo .demo-controls button { 
    pointer-events: auto; 
}
```

### Slides that transition vertically
- Slides that transition vertically go deeper into the content. They should be closely linked to the previous slide.
- If there is a strong thematic progression from one slide to the next, you should use a vertical transition.
- If the slides only split up a concept into two subsections, you should not use a vertical transition.
- Close to the bottom most slide of the vertical transition there should always have a multiple choice question that students should answer to test their understanding.
- Multiple choice questions should also be placed after important slides.

### Multiple Choice Questions

All presentations must use the standardized multiple choice question system for consistency and proper functionality.

#### Implementation

Use the `data-mcq` attribute on a div element with a JSON configuration:

```html
<section>
    <h2 class="truncate-title">Test Your Understanding</h2>
    <div data-mcq='{
        "question": "What is the main purpose of gradient descent?",
        "type": "single",
        "options": [
            {
                "text": "To increase the loss function",
                "correct": false,
                "explanation": "Gradient descent minimizes, not maximizes, the loss function."
            },
            {
                "text": "To find parameters that minimize the loss function",
                "correct": true,
                "explanation": "Correct! Gradient descent iteratively updates parameters to minimize the loss."
            },
            {
                "text": "To calculate derivatives",
                "correct": false,
                "explanation": "While it uses derivatives, the purpose is optimization, not just calculation."
            },
            {
                "text": "To visualize the data",
                "correct": false,
                "explanation": "Gradient descent is an optimization algorithm, not a visualization tool."
            }
        ]
    }'></div>
</section>
```

#### Required Structure
- **question**: The question text to display
- **type**: Either "single" (radio buttons) or "multiple" (checkboxes for multiple correct answers)
- **options**: Array of answer options, each with:
  - **text**: The option text
  - **correct**: Boolean indicating if this is a correct answer
  - **explanation**: Detailed explanation shown after submission (explain why correct or why incorrect)

#### Features
- Questions are automatically shuffled on each page load
- Visual feedback for correct/incorrect answers
- Detailed explanations appear after submission
- Mobile-friendly interface
- "Try Again" button reshuffles and resets the question
- Supports both single-choice and multiple-choice questions

#### Placement Guidelines
- Add a "Test Your Understanding" slide at the end of each vertical slide section
- Place after important concept explanations
- Use 4-5 options per question for optimal engagement
- Ensure explanations are educational and helpful
- Write clear, unambiguous questions
- Avoid "all of the above" or "none of the above" options (they don't work well with shuffling)

#### Important Notes
- **NEVER** use the old `quiz-container` class format
- **ALWAYS** include the `multiple-choice.js` script from shared/js/
- Questions automatically initialize when slides load
- The JSON must be properly formatted (use single quotes for the HTML attribute)
- Test questions work correctly with shuffling enabled
- Explanations should teach, not just state correct/incorrect

### Math Notation
- Use LaTeX for equations
- Define notation before use
- Provide intuitive explanations alongside formulas
- Example: `$$\frac{\partial L}{\partial w} = \frac{\partial L}{\partial z} \cdot \frac{\partial z}{\partial w}$$`
- Color parts of the equation if necessary to highlight the different parts and explain them using the same color.

#### MathJax Configuration
When configuring Reveal.js with MathJax, use MathJax 2 for compatibility:
```javascript
math: {
    mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js',
    config: 'TeX-AMS_HTML-full'
}
```
**Important:** Use MathJax 2, not MathJax 3. The standard Reveal.js math plugin is designed for MathJax 2, and MathJax 3 requires different configuration that can cause errors.

### Avoiding Reveal.js Naming Conflicts

Reveal.js reserves certain class names for its own functionality. Using these names for your elements will cause unexpected behavior:

#### Reserved Class Names to Avoid:
- **`.controls`** - Used for navigation arrows (will hide your elements)
- **`.navigate`** - Used for navigation controls
- **`.progress`** - Used for the progress bar
- **`.backgrounds`** - Used for slide backgrounds
- **`.speaker-notes`** - Used for speaker notes

#### Recommended Naming Conventions:
Instead of reserved names, use prefixed alternatives:
- `demo-controls` or `interactive-controls` instead of `controls`
- `demo-navigation` instead of `navigate`
- `demo-progress` or `viz-progress` instead of `progress`
- `slide-bg` or `custom-background` instead of `backgrounds`

#### Debugging Visibility Issues:
If your elements disappear or behave unexpectedly:
1. Check if you're using a reserved class name
2. Inspect the element to see if Reveal's CSS is overriding your styles
3. Add explicit inline styles with `!important` if necessary
4. Use unique ID selectors for JavaScript targeting

### Source Citations
- Never put sources directly at the bottom of slides - they take up too much vertical space
- Use a book icon (📚) in the lower left corner for slides with sources
- Add `data-sources` attribute to the section with a JSON array of sources
- Clicking the icon opens a modal with all sources
- Example: `<section data-sources='[{"text": "Paper Title", "url": "https://..."}]'>`
- **REQUIRED**: Include `source-modal-v2.js` from shared/js/ in your presentation
- The script automatically:
  - Adds the book icon to slides with `data-sources`
  - Creates and manages the modal
  - Handles all interactions

Implementation:
```html
<!-- Include in your HTML -->
<script src="../shared/js/source-modal-v2.js"></script>

<!-- On a slide -->
<section data-sources='[{"text": "Dive into Deep Learning - Chapter 1", "url": "https://d2l.ai/chapter_introduction/index.html"}, {"text": "Deep Learning Book - Ian Goodfellow", "url": "https://www.deeplearningbook.org/"}]'>
    <h2>Slide Title</h2>
    <p>Content here...</p>
</section>
```

## Visual Design Principles

### University of Iceland Branding

#### Color Palette
All presentations must use the official University of Iceland color scheme:
- **Primary Color**: #10099F (UI Blue) - Use for headings, links, and primary elements
- **Supporting Colors**:
  - #2DD2C0 (Teal) - Use for success states and secondary highlights
  - #00FFBA (Mint) - Use for interactive hover states
  - #FAC55B (Yellow) - Use for warnings or attention elements
  - #FC8484 (Coral) - Use for errors or output layers
  - #FFA05F (Orange) - Use for gradients and transitions
  - #EEEEEE (Light Gray) - Use for borders and subtle backgrounds
  - #F5F5F5 (Lighter Gray) - Use for main backgrounds
  - #262626 (Dark) - Use for body text

#### Typography
- **Primary Font**: Atkinson Hyperlegible (available in shared/fonts/)
- **Fallback Fonts**: 'Source Sans Pro', Helvetica, sans-serif
- **Code Font**: 'Source Code Pro', monospace

#### Logo Usage
- Use `uoi_logo_blue.png` on light backgrounds (default)
- Use `uoi_logo_white.png` only on dark backgrounds if needed
- Logo must appear on all title slides
- Position: Centered above title (handled by CSS)
- Size: 330px width
- CSS automatically handles responsive sizing

### Neural Network Visualization Colors
Adapted to use University of Iceland colors:
- Input layer: UI Blue (#10099F)
- Hidden layers: Teal (#2DD2C0)
- Output layer: Coral (#FC8484)
- Gradients: Orange (#FFA05F)
- Weights: Gray scale from #EEEEEE to #262626 based on magnitude

### Animation Timing
- Forward propagation: 2-3 seconds total
- Backpropagation: 3-4 seconds total
- Smooth transitions between states
- Pause options for explanation
- Use particles with values that traverse the edges of the network to show the flow of information

## Common Patterns

### Network Visualization Structure
```javascript
// Basic structure for neural network visualization
const network = {
  layers: [
    { type: 'input', neurons: 3 },
    { type: 'hidden', neurons: 4 },
    { type: 'output', neurons: 2 }
  ],
  connections: generateConnections(layers),
  activations: initializeActivations(layers)
};
```

### Animation Loop Pattern
```javascript
// Standard animation pattern for demonstrations
function animate() {
  updateActivations();
  renderNetwork();
  if (!paused) {
    requestAnimationFrame(animate);
  }
}
```

## Best Practices

1. **Accessibility**: Include alt text for visualizations and keyboard navigation
2. **Performance**: Optimize animations for smooth playback on various devices
3. **Clarity**: Avoid overwhelming students with too many moving parts at once
4. **Interactivity**: Make demos forgiving - no way to "break" them
5. **Progressive Disclosure**: Reveal complexity gradually through slide progression

## Testing Checklist

Before finalizing slides:
- [ ] Test all animations on different screen sizes
- [ ] Verify math notation renders correctly
- [ ] Check slide navigation works smoothly
- [ ] Ensure interactive elements are responsive
- [ ] Validate color contrast for readability
- [ ] Test presenter mode functionality

## Branding Compliance Checklist

Before creating any new presentation:
- [ ] Use the UI color scheme defined above
- [ ] Include Atkinson Hyperlegible as the primary font
- [ ] Add the UI logo to all title slides
- [ ] Use light backgrounds (white or #F5F5F5) instead of dark themes
- [ ] Ensure all interactive elements use UI brand colors
- [ ] Test color contrast for accessibility

## Shared Resources Directory Structure

The project uses a modular structure to share common resources across all presentations:

### Directory Layout
```
2025H/
├── shared/                    # Shared resources for all presentations
│   ├── css/
│   │   ├── reveal-theme.css   # Custom Reveal.js theme
│   │   └── common.css         # Common styles across presentations
│   ├── js/
│   │   ├── d3-utils.js        # Reusable D3.js utilities
│   │   ├── animation-lib.js   # Common animation functions
│   │   └── neural-viz.js      # Reusable neural network visualization
│   ├── images/
│   │   └── course-logo.svg    # Course branding
│   └── reveal.js/             # Reveal.js library (place v4.x here)
├── 00_introduction/           # First lecture slides
├── 01_preliminaries/          # Second lecture slides
└── ...                        # Subsequent lectures
```

### Naming Conventions
- Lecture directories: `XX_topic_name` (e.g., `00_introduction`, `01_preliminaries`)
- Main presentation file in each directory: `index.html`
- Lecture-specific resources go in subdirectories: `css/`, `js/`, `images/`

### Using Shared Resources

When creating a new presentation, reference shared resources with relative paths:
```html
<!-- In any lecture's index.html -->
<link rel="stylesheet" href="../shared/reveal.js/dist/reveal.css">
<link rel="stylesheet" href="../shared/css/reveal-theme.css">
<link rel="stylesheet" href="../shared/css/common.css">

<script src="../shared/reveal.js/dist/reveal.js"></script>
<script src="../shared/js/d3-utils.js"></script>
<script src="../shared/js/animation-lib.js"></script>
<script src="../shared/js/neural-viz.js"></script>
<script src="../shared/js/title-handler.js"></script>
```

### Common JavaScript APIs

#### D3 Utilities (d3-utils.js)
- `createSVG(selector, width, height)` - Initialize SVG container
- `createScales(domain, range)` - Create consistent scales
- `drawAxes(svg, xScale, yScale)` - Draw standard axes

#### Animation Library (animation-lib.js)
- `fadeIn(element, duration)` - Fade in animation
- `slideIn(element, direction, duration)` - Slide in from direction
- `pulseAnimation(element)` - Attention-grabbing pulse

#### Neural Network Visualization (neural-viz.js)
- `createNetwork(config)` - Create network visualization
- `animateForwardPass(network, data)` - Animate forward propagation
- `animateBackprop(network, gradients)` - Animate backpropagation
- `highlightPath(network, fromNeuron, toNeuron)` - Highlight connection

#### Title Handler (title-handler.js)
- Automatically handles truncated slide titles with the `truncate-title` class
- Provides click/tap to expand functionality for long titles
- Works on both desktop (hover + click) and mobile (tap)
- Auto-collapses after 3 seconds or when clicking elsewhere
- Shows visual indicator (⋯) when title is truncated and interactive

### Reveal.js Configuration

Standard configuration to include in each presentation:
```javascript
Reveal.initialize({
    hash: true,
    controls: true,
    progress: true,
    center: true,
    transition: 'slide',
    math: {
        mathjax: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js',
        config: 'TeX-AMS_HTML-full',
        TeX: {
            Macros: {
                R: '\\mathbb{R}',
                set: ['\\left\\{#1\\right\\}', 1]
            }
        }
    },
    plugins: [ RevealMath, RevealHighlight, RevealNotes ]
});
```

## Handling Long Titles

**REQUIRED**: Apply the `truncate-title` class to ALL slide titles (h1, h2, h3), not just long ones. This ensures consistency and handles different screen sizes gracefully:

```html
<section>
    <h1 class="truncate-title">The Immediate Impact of Deep Learning on Computer Vision (2013-2015)</h1>
    <p>Content here...</p>
</section>
```

Features:
- Titles with the `truncate-title` class automatically detect if they're truncated
- Users can click/tap to expand and see the full title
- Expanded titles show in a subtle highlighted box
- Auto-collapses after 3 seconds or when clicking elsewhere
- Mobile-friendly with touch support
- Visual indicator (⋯) appears on hover/touch to show interactivity
- **REQUIRED**: Include `title-handler.js` from shared/js/ in your presentation

Implementation:
```html
<!-- Include in your HTML -->
<script src="../shared/js/title-handler.js"></script>
```

This ensures users can always read the full title while maintaining clean slide layouts.

**Why this is required for all titles:**
- Consistency across all presentations
- Handles different screen sizes and zoom levels gracefully
- Short titles remain unaffected (no visual change)
- Long titles automatically become interactive
- Future-proofs presentations for various display contexts

## Tooltips for Technical Terms

**REQUIRED**: All presentations must use the click-based modal tooltip system for consistency and mobile-friendliness.

Use tooltips to provide quick explanations for technical terms without cluttering slides:

```html
<span class="tooltip">ReLU<span class="tooltiptext">Rectified Linear Unit: An activation function defined as f(x) = max(0, x)</span></span>
```

**Implementation Requirements:**
- **REQUIRED**: Include `tooltip-modal.js` from shared/js/ in all presentations
- This creates click-based modal tooltips that work consistently across all devices
- Tooltips appear as centered modals with a backdrop when clicked
- Mobile-friendly with touch support
- Automatically closes with Escape key or backdrop click

```html
<!-- Include in your HTML -->
<script src="../shared/js/tooltip-modal.js"></script>
```

**Features:**
- Terms with tooltips are visually indicated with dotted underline
- Click/tap to open modal with definition
- Modal displays centered on screen for optimal readability
- Backdrop blur effect focuses attention on the tooltip content
- Consistent behavior across all presentations

**Note**: Do not use `tooltip-handler-v2.js` as it provides hover-based tooltips which are less accessible and not mobile-friendly.

## Table Styling

Tables are automatically styled with the UI color scheme:
- Headers have blue background with white text
- Cells have borders and centered text
- Add custom styling in your lecture-specific CSS if needed

## Interactive Visualizations

### Neural Network Animation
When creating neural network visualizations:
- Show edge weights with varying thickness
- Animate signal propagation with particles
- Node sizes can pulse based on activation values
- Use weight-based coloring (positive=blue, negative=red)

### Gradient Descent Visualization
- Show loss landscape with contour lines
- Animate the optimization path
- Include learning rate control
- Display current loss value

## Emphasis Boxes

Use the default emphasis box styling from reveal-theme.css:
```html
<div class="emphasis-box">
    <p>Important concept or takeaway</p>
</div>
```

This creates a subtle bordered box with light background - avoid bright gradients.

## Remember

The goal is to make deep learning concepts intuitive and engaging. When in doubt, prioritize clarity over complexity. Visual explanations should complement, not replace, rigorous mathematical understanding.
