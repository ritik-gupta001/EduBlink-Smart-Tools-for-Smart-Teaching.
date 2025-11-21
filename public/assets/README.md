# Hero Image Placeholder

To add your hero image:

1. Place your hero image in this folder: `public/assets/`
2. Name it `hero.png` (or update the reference in `public/index.html`)
3. Recommended dimensions: 800x600px or similar aspect ratio
4. Supported formats: PNG, JPG, SVG, WebP

## Using Your Image

The hero image is referenced in `public/index.html` at line 91:

```html
<img src="assets/hero.png" alt="AI Education Illustration" loading="lazy">
```

If you have the image at:
```
/mnt/data/5517068f-fb00-4a80-a8b1-0548ee6c46f7.png
```

Copy it to this folder and rename it to `hero.png`.

## Alternative: Use a Placeholder

If you don't have a hero image yet, you can:

1. Use a placeholder service:
   - Replace `assets/hero.png` with `https://placehold.co/800x600/4f46e5/ffffff?text=EduBlink+AI`

2. Or download a free education-themed illustration from:
   - [Undraw](https://undraw.co/)
   - [DrawKit](https://www.drawkit.com/)
   - [Freepik](https://www.freepik.com/)

## Example Code for External Image

In `public/index.html`, change line 91 to:

```html
<img src="https://placehold.co/800x600/4f46e5/ffffff?text=EduBlink+AI" alt="AI Education Illustration" loading="lazy">
```
