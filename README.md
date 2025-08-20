# Introduction to Deep Learning - Interactive Slides

Interactive presentation slides for the Introduction to Deep Learning course at the University of Iceland. These slides feature engaging animations and interactive demos to help students understand complex deep learning concepts intuitively.

## 🎯 Features

- **Interactive Visualizations**: Real-time neural network animations showing forward propagation, backpropagation, and gradient flow
- **Hands-on Demos**: Interactive elements where students can adjust parameters and see immediate effects
- **Modern Web Technologies**: Built with Reveal.js, D3.js, and modern JavaScript
- **Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices
- **University of Iceland Branding**: Consistent use of official colors and typography

## 📚 Course Topics

Based on the book "Dive into Deep Learning", the course covers:

- Introduction to Deep Learning
- Preliminaries and Mathematical Foundations
- Linear Neural Networks (Regression & Classification)
- Multilayer Perceptrons
- Convolutional Neural Networks (CNNs)
- Recurrent Neural Networks (RNNs)
- Attention Mechanisms and Transformers
- Optimization Algorithms
- Computer Vision Applications
- Natural Language Processing
- Reinforcement Learning
- Generative Adversarial Networks (GANs)
- And more...

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic understanding of HTML/CSS/JavaScript (for contributors)
- No installation required for viewing slides!

### Viewing the Slides

1. Clone the repository:
```bash
git clone https://github.com/Haffi112/introduction-to-deep-learning-slides.git
cd introduction-to-deep-learning-slides
```

2. Open any lecture's `index.html` file in your browser:
```bash
# For example, to view the introduction slides:
open 00_introduction/index.html
```

Or use a local web server for better performance:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if http-server is installed)
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

### Navigation

- **Arrow keys**: Navigate between slides
- **ESC**: Overview mode
- **F**: Fullscreen mode
- **S**: Speaker notes (for presenters)
- **?**: Show keyboard shortcuts

## 🤝 Contributing

We welcome contributions to improve these educational materials! Here's how you can help:

### Types of Contributions

- **New Visualizations**: Create interactive demos for complex concepts
- **Bug Fixes**: Report and fix issues with existing slides
- **Content Improvements**: Enhance explanations or add clarifying examples
- **Accessibility**: Improve keyboard navigation and screen reader support
- **Translations**: Help translate slides to other languages

### Contribution Guidelines

1. **Fork the Repository**: Create your own fork of the project
2. **Create a Feature Branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Follow the Style Guide**:
   - Use the University of Iceland color scheme (see CLAUDE.md)
   - Apply `truncate-title` class to all slide titles
   - Keep animations smooth (target 60fps)
   - Write clean, commented JavaScript (ES6+)

4. **Test Your Changes**:
   - Verify animations work on different screen sizes
   - Check math notation renders correctly
   - Test interactive elements thoroughly
   - Ensure color contrast meets accessibility standards

5. **Submit a Pull Request**:
   - Describe your changes clearly
   - Reference any related issues
   - Include screenshots for visual changes

### Project Structure

```
.
├── shared/               # Shared resources for all presentations
│   ├── css/             # Common stylesheets
│   ├── js/              # Reusable JavaScript libraries
│   ├── images/          # Shared images and logos
│   └── fonts/           # Atkinson Hyperlegible font files
├── 00_introduction/     # Introduction lecture
├── 01_basics/           # Basics and preliminaries
├── CLAUDE.md            # Detailed development guidelines
└── README.md            # This file
```

### Development Guidelines

Please read [CLAUDE.md](CLAUDE.md) for detailed guidelines on:
- Animation patterns and best practices
- Neural network visualization standards
- Interactive demo requirements
- University of Iceland branding requirements
- Testing checklist

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **University of Iceland** - For supporting innovative teaching methods
- **Dive into Deep Learning** - The primary textbook resource
- **Reveal.js** - The presentation framework
- **D3.js** - For powerful data visualizations
- All contributors who help make these materials better

## 📧 Contact

For questions or suggestions, please open an issue on GitHub or contact the course instructor at the University of Iceland.

---

Made with ❤️ for students learning deep learning at the University of Iceland