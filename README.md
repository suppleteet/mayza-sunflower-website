# Sunflower Garden Nursery School Website

Static multi-page website for Sunflower Garden Nursery School.

## Files

- `index.html` is the home page.
- `about.html`, `life.html`, and `contact.html` are separate page loads.
  - `life.html` also carries the nutrition content (`#nutrition`).
  - `contact.html` also carries the enrollment content (`#enrollment`).
- `styles.css` contains the visual design and responsive layout.
- `script.js` handles the mobile menu and footer year.
- `assets/sunflower-logo-refined.png` is the transparent logo used for the favicon, header mark, and home hero.
- `assets/mayza.png` is the founder portrait on the about page.

## Preview

Run the local dev server from this folder (serves with no-cache headers):

```powershell
python serve.py        # optional: python serve.py 8080
```

Then visit `http://localhost:8000`.

## Content Notes

The public copy does not include a phone number or email address yet. Add those details in the `#tour` section when they are ready.
