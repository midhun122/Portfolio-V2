# Portfolio-V2
# Midhun Sujith Nair — Portfolio Website

A personal portfolio website built with pure HTML, CSS, and JavaScript.

## Project Structure

```
portfolio/
├── index.html      # Main HTML structure
├── style.css       # All styles and animations
├── main.js         # JavaScript interactions
└── README.md       # This file
```

## Features

- Custom animated cursor with lagging ring effect
- Smooth scroll reveal animations
- Animated skill progress bars
- Scrolling tech stack ticker
- Sticky navbar on scroll
- Working contact form via Formspree
- Fully responsive design

## Tech Stack

- HTML5
- CSS3 (Flexbox, Grid, CSS Variables, Keyframe Animations)
- Vanilla JavaScript (IntersectionObserver, requestAnimationFrame)
- Google Fonts (Syne + DM Mono)
- Formspree (contact form)

## How to Run

1. Download all 3 files into the same folder
2. Open `index.html` in your browser
3. That's it — no install, no build tools needed

## Contact Form Setup

The contact form uses [Formspree](https://formspree.io). To connect it to your own email:

1. Sign up at formspree.io
2. Create a new form
3. Replace the form action URL in `index.html`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

4. Make sure inputs have name attributes:

```html
<input type="text" name="name" />
<input type="email" name="email" />
<textarea name="message"></textarea>
```

## Fonts

Loaded from Google Fonts via CDN in the `<head>` of `index.html`:

- **Syne** — headings and display text
- **DM Mono** — body text, labels, code snippets

## Customization

All colors are CSS variables in `style.css`:

```css
:root {
  --bg: #080808;
  --accent: #e8ff57;
  --accent2: #57ffe8;
  --text: #f4f0e8;
  --muted: #777770;
}
```

Change `--accent` to any color to retheme the whole site instantly.

## Links

- GitHub: https://github.com/midhun122
- LinkedIn: https://www.linkedin.com/in/midhunsujithnair/
- Email: midhunsujith42@gmail.com

## License

Feel free to use this as inspiration for your own portfolio. Built with passion and lots of Tea
.
