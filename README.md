# Website Under Maintenance Template

A modern, responsive, and SEO-friendly "Website Under Maintenance" HTML template built with HTML5, CSS3, and JavaScript. Perfect for consulting firms, startups, agencies, tech brands, and personal portfolios.

## 🎨 Features

- **Clean & Professional Design** - Modern UI with smooth animations
- **Animated SVG Illustration** - Custom maintenance-themed illustration with rotating gears
- **Countdown Timer** - Animated countdown showing days, hours, minutes, and seconds
- **Dark/Light Mode Toggle** - Seamless theme switching with local storage persistence
- **Email Notification Form** - Collect visitor emails for launch notifications
- **Social Media Integration** - Links to Facebook, Twitter, LinkedIn, and Instagram
- **Preloader Animation** - Smooth loading experience
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **SEO Optimized** - Complete meta tags, Open Graph, and Twitter Card support
- **Accessibility Compliant** - WCAG compliant with ARIA labels and keyboard navigation
- **Fast Loading** - Optimized CSS/JS with minimal dependencies

## 📁 File Structure

```
maintenance-theme/
├── index.html          # Main HTML file
├── css/
│   └── style.css      # Main stylesheet
├── js/
│   └── main.js        # JavaScript functionality
├── images/             # Image assets folder
├── assets/             # Additional assets (favicon, etc.)
│   └── favicon.svg     # SVG favicon
└── README.md           # This file
```

## 🚀 Quick Start

1. **Download or clone** the template files
2. **Open `index.html`** in your web browser to preview
3. **Customize** the content, colors, and countdown date (see customization guide below)
4. **Deploy** to your web server

## ⚙️ Customization Guide

### 1. Change Countdown End Date

Edit the `countdownEndDate` in `js/main.js`:

```javascript
const CONFIG = {
    // Change this date to your maintenance end date
    countdownEndDate: new Date('2024-12-31T23:59:59'),
    // ... other config
};
```

**Format**: `new Date('YYYY-MM-DDTHH:MM:SS')`

Example:
```javascript
countdownEndDate: new Date('2025-01-15T14:30:00'), // January 15, 2025 at 2:30 PM
```

### 2. Edit Maintenance Text

Edit the headline and subtext in `index.html`:

```html
<h1 class="headline fade-in-up">We're Under Maintenance</h1>
<p class="subtext fade-in-up">Our website is getting a quick tune-up. We'll be back soon!</p>
```

### 3. Customize Theme Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
    --primary-blue: #2563eb;      /* Primary brand color */
    --accent-blue: #3b82f6;       /* Accent/hover color */
    --background-white: #ffffff;   /* Light mode background */
    --neutral-gray: #f3f4f6;       /* Light mode surface */
    --text-gray: #1f2937;          /* Light mode text */
    --text-light: #6b7280;         /* Light mode secondary text */
    /* ... more colors */
}
```

### 4. Enable/Disable Dark Mode by Default

In `js/main.js`, change the `defaultDarkMode` setting:

```javascript
const CONFIG = {
    defaultDarkMode: false,  // Set to true to enable dark mode by default
    // ... other config
};
```

Or remove the default setting to always use system preference:

```javascript
let theme = savedTheme || (prefersDark ? 'dark' : 'light');
```

### 5. Replace Illustration

The SVG illustration is embedded directly in `index.html`. You can:

- **Replace with your own SVG**: Find the `<svg class="maintenance-illustration">` section and replace with your custom SVG
- **Use an image**: Replace the entire `.illustration-wrapper` div with an `<img>` tag
- **Use Lottie animation**: Replace with a Lottie animation library

Example with image:
```html
<div class="illustration-wrapper">
    <img src="./images/your-illustration.svg" alt="Maintenance illustration" class="maintenance-illustration">
</div>
```

### 6. Replace Favicon

Replace the favicon files in the `assets/` folder:

1. **favicon.svg** - Modern SVG favicon (already included)
2. **favicon.ico** - Traditional favicon (create from SVG)
3. **apple-touch-icon.png** - iOS home screen icon (180x180px)

Update the favicon links in `index.html` `<head>` section if using different filenames.

### 7. Update Form Submission Endpoint

In `js/main.js`, update the `formEndpoint`:

```javascript
const CONFIG = {
    formEndpoint: 'https://your-backend.com/api/notify',
    // ... other config
};
```

Then uncomment and modify the fetch code in the `handleFormSubmit` function:

```javascript
const response = await fetch(CONFIG.formEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email })
});
```

### 8. Update Social Media Links

Edit the social media links in `index.html`:

```html
<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-link">
    <!-- Facebook icon -->
</a>
```

Replace URLs with your actual social media profiles.

### 9. Update SEO Meta Tags

Edit the meta tags in `index.html` `<head>` section:

```html
<title>Website Under Maintenance | We'll Be Back Soon</title>
<meta name="description" content="Your description here">
<meta property="og:url" content="https://yourwebsite.com">
<meta property="og:image" content="./assets/og-image.jpg">
```

### 10. Update Copyright Information

Edit the footer text in `index.html`:

```html
<p class="footer-text">&copy; <span id="current-year"></span> Your Company Name. All rights reserved.</p>
```

## 🎨 Color Palette

The template uses a professional color palette:

- **Primary Blue**: `#2563eb` - Main brand color
- **Accent Blue**: `#3b82f6` - Hover states and accents
- **Background White**: `#ffffff` - Light mode background
- **Neutral Gray**: `#f3f4f6` - Light mode surface
- **Text Gray**: `#1f2937` - Primary text color
- **Dark Mode Background**: `#0f172a` - Dark mode background
- **Dark Mode Text**: `#e2e8f0` - Dark mode text color

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility Features

- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- WCAG contrast compliance
- Reduced motion support

## 🔧 Technical Details

- **CSS**: Custom properties (CSS variables) for theming
- **JavaScript**: Vanilla JavaScript (no dependencies)
- **Fonts**: Google Fonts (Inter) with fallbacks
- **Animations**: CSS keyframes and transitions
- **Storage**: localStorage for theme preference
- **Performance**: Optimized assets and minimal JS

## 🚀 Production Deployment

For production deployment, see `PRODUCTION.md` for:
- Minification instructions
- Security best practices
- Performance optimization
- Analytics integration
- Testing checklist
- Deployment guidelines

## 📝 License

This template is provided as-is. Feel free to modify and use for your projects.

## 🤝 Support

For customization help or questions:
1. Check this README for common customization tasks
2. Review the code comments for inline documentation
3. Modify the code to fit your specific needs

## 📄 Changelog

### Version 1.0.0
- Initial release
- Dark/Light mode toggle
- Animated countdown timer
- Email notification form
- Social media integration
- SEO optimization
- Full responsive design

---

**Built with ❤️ for modern web experiences**

