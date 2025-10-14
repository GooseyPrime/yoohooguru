# Accessibility Guidelines for Hero Guru's

Hero Guru's (formerly Modified Masters) is designed with accessibility-first principles to serve disability communities effectively. This document outlines the accessibility features and guidelines implemented throughout the platform.

## Core Accessibility Features

### Accessibility Toolbar
Every Hero Guru's page includes a floating accessibility toolbar that provides:

- **Text Size Options**: Normal, Large, Extra Large text scaling
- **High Contrast Mode**: Enhanced contrast for better visibility
- **Reduced Motion**: Minimizes animations for users sensitive to motion
- **Dyslexia-Friendly Font**: Alternative font options for improved readability

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order throughout the interface
- Visible focus indicators with high contrast outlines
- Consistent keyboard shortcuts across the platform

### Screen Reader Support
- Comprehensive ARIA labels and descriptions
- Semantic HTML structure with proper headings
- Role attributes for complex components
- Alternative text for all images and icons
- Screen reader friendly form labels and validation

### Session Accessibility Features
Distance learning sessions include specific accessibility accommodations:

- **Captions Required**: Request sessions with live captions
- **ASL Interpretation**: Request American Sign Language interpreters
- **Recording Policies**: Clear options for recording preferences
- **Communication Preferences**: Choose between video, phone, chat, or async modes

## Implementation Guidelines

### For Developers

#### HTML Structure
- Use semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- Implement proper heading hierarchy (h1 → h2 → h3)
- Provide meaningful link text (avoid "click here")
- Use form labels with `for` attributes

#### ARIA Attributes
- `aria-label` for elements needing additional context
- `aria-labelledby` to reference descriptive elements
- `aria-describedby` for additional help text
- `role` attributes for custom components
- `aria-expanded` for collapsible content
- `aria-modal` and `aria-hidden` for modals

#### Focus Management
- Implement focus trap in modals and overlays
- Provide skip links for main content
- Ensure focus visibility with outline styles
- Manage focus programmatically in dynamic content

### CSS Classes for Accessibility

The platform includes CSS classes that are automatically applied based on user preferences:

#### Text Size Classes
```css
.a11y-large-text { font-size: 1.125rem; line-height: 1.7; }
.a11y-xlarge-text { font-size: 1.25rem; line-height: 1.8; }
```

#### High Contrast Mode
```css
.a11y-high-contrast { filter: contrast(150%) brightness(110%); }
```

#### Reduced Motion
```css
.a11y-reduced-motion * {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

#### Dyslexia-Friendly Font
```css
.a11y-dyslexia-font * {
  font-family: 'Comic Sans MS', 'Arial', sans-serif;
  letter-spacing: 0.05em;
  word-spacing: 0.1em;
}
```

### For Content Creators

#### Skill Descriptions
- Write clear, concise skill descriptions
- Use simple language when possible
- Include specific accessibility accommodations offered
- Tag skills with relevant accessibility categories

#### Coaching Styles
Label your teaching approach with accessibility-friendly styles:
- **Step-by-step**: Detailed progression approach
- **Slow-pace**: Extended learning timeframes
- **Visual-demos**: Primarily visual instruction
- **Verbal-explainer**: Detailed verbal descriptions
- **Hands-on**: Tactile learning approach

#### Resource Links
- Provide descriptive titles for linked resources
- Indicate resource type (video, document, tool)
- Include accessibility information (captions, transcripts)

## Testing Accessibility

### Manual Testing Checklist
- [ ] Navigate entire interface using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Verify color contrast meets WCAG AA standards
- [ ] Test with accessibility toolbar options enabled
- [ ] Validate form error messages are clear
- [ ] Ensure all images have appropriate alt text

### Automated Testing
- Run axe-core accessibility linter
- Use WAVE web accessibility evaluator
- Validate HTML markup
- Test responsive design at various zoom levels

### User Testing
- Include users with disabilities in testing process
- Gather feedback from assistive technology users
- Test with various accessibility tools and preferences
- Validate real-world usage scenarios

## Compliance Standards

Hero Guru's aims to meet or exceed:
- **WCAG 2.1 AA**: Web Content Accessibility Guidelines Level AA
- **Section 508**: US Federal accessibility requirements
- **ADA**: Americans with Disabilities Act compliance
- **ARIA 1.2**: Accessible Rich Internet Applications specification

## Support and Resources

### Getting Help
- Email: accessibility@yoohoo.guru
- Submit feedback through platform contact form
- Request specific accommodations for sessions

### External Resources
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)

## Continuous Improvement

Accessibility is an ongoing commitment. We regularly:
- Review and update accessibility features
- Gather user feedback and implement improvements
- Train coaches on accessibility best practices
- Monitor compliance with evolving standards
- Expand accommodation options based on community needs

Report accessibility issues or suggestions through our support channels to help us improve the platform for everyone.