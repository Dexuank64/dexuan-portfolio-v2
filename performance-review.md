# Portfolio performance review

## Results

The main bottleneck was media loading and media size. Source inspection found no WebGL renderer, GSAP dependency, requestAnimationFrame loop or scroll event listener. Navigation uses native smooth scrolling; hashchange and popstate handlers have cleanup.

| Resource | Before | After |
| --- | ---: | ---: |
| Local asset directory | 351.44 MB | 121.34 MB |
| 25 animated demonstrations | 143.25 MB (GIF) | 20.49 MB (animated WebP) |
| Static images, including new still frames | 15.61 MB | 1.90 MB |
| hero-showreel.mp4 | 16.80 MB | 5.96 MB |
| icarus-final-trailer.mp4 | 34.19 MB | 13.43 MB |
| palegrave-final-trailer.mp4 | 25.47 MB | 10.97 MB |
| witcher3-combat.mp4 | 36.55 MB | 17.61 MB |

The local asset directory is 65.5% smaller. This is a file-size comparison, not a claim about initial page transfer size. It includes removal of unused intermediate demo MP4s. The Centipede clip was also copied from the user-provided URL into the project (approximately 0.67 MB); it no longer depends on a temporary external link.

## Changes by review area

1. Videos and images: H.264/AAC project videos are capped at 1280px width without upscaling, with fast-start metadata. The decorative hero uses 24 fps and no audio. Original user files were untouched. Static images use WebP where smaller. All 25 demonstrations remain automatic looping images with no play button, using animated WebP; their full durations were checked against the originals.
2. WebGL dynamic background: none is present. The background is a video. It pauses outside the nearby viewport and while the document is hidden. Reduced-motion and data-saving preferences prevent decorative autoplay.
3. Scroll listeners: none are present. A shared IntersectionObserver with a 200px margin handles media visibility. A single document visibility listener is added while media is mounted and removed when the last subscription is released.
4. GSAP: absent from package dependencies and application source. No GSAP or animation-library bundle is loaded. Existing CSS transitions and native smooth scrolling remain.
5. Initial load: controlled project videos use preload="none" and local posters. The hero alone starts automatically. Detail images initially use lightweight still frames, loading animation only near the viewport and returning to stills outside it. Image dimensions reserve space; image decoding is asynchronous. Portrait loading has high priority on the home page.

## Validation

- Production build passed; rendered markup checks passed for seven home/archive/about/detail routes and every locally referenced asset exists.
- Home: the hero was playing while both project trailers remained at readyState 0 before interaction.
- Native trailer play control loaded and played the compressed Icarus trailer. Scrolling away paused it and the hero; the unplayed Palegrave trailer stayed unloaded.
- ICARUS detail: initially 0 animated sources and 18 stills. In the projectile section, only 5 nearby animations were active; no broken image was found.
- About layout and the animated detail layout were visually checked. Browser console showed no errors during the checked navigation.
- No online Lighthouse, throttled-network or cross-device benchmark was run; these numbers are local file sizes and observed browser behaviour.

## Source preservation

Media originals used for optimization are backed up outside the deliverable at `work/performance-originals`. The user's Desktop and Downloads files were not changed.
