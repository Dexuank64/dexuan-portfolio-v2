# Dexuan Kong Portfolio

React + Vite portfolio. The offline preview is `preview.html`; keep the `public` directory next to it. All project videos are local. The ICARUS enemy showcase is an external link.

## Preview and build

Double-click `Start-Preview.cmd` for a local HTTP preview. Keep the console open while previewing. For a fresh source checkout, run `npm install` first. Use Node.js 20.19+ or 22.12+.

```
npm run dev
npm run build
npm run preview
```

## Content

- Home: user-provided background showreel, Icarus and Palegrave.
- Project Archive: six projects ordered by year, followed by two 2025 mini projects.
- About me: biography, experience, tools, company links and resume.
- Read more: full Icarus/Palegrave case studies based on user documents; combat-study writeups remain placeholders.

## Media and performance

Static images and the 25 automatic looping demonstrations use WebP. Demonstrations load near the viewport and switch to still frames outside it. Controlled videos load on interaction; decorative autoplay respects reduced motion and data saving. Video playback pauses outside the nearby viewport or when the tab is hidden.

See `performance-review.md` for measured resource sizes and validation scope.
