# CINEK — immersive artist archive

A full-viewport, scroll-led CINEK site inspired by the **experience** of immersive artist galleries. This is an original implementation, not a copy of Claudia.gallery's source code or assets.

## Features
- Full-screen masked-eye opening, image-led scroll chapters and cinematic transitions
- Music release archive, linked music videos and artist social links
- CREATE CINEK fan prompt builder, scene presets and downloadable JSON prompts
- Responsive mobile navigation, reduced-motion accessibility support
- Read-only catalogue, prompt JSON and API index

## Deploy on GitHub + Render
1. Extract the ZIP. Upload **the contents of this folder** to the repository root, preserving `assets/` and `api/` directories.
2. Create a new Render **Web Service**, connect the repository, select Node, free plan if available.
3. Root Directory: blank. Build Command: `npm install`. Start Command: `npm start`.
4. Or use the included `render.yaml` blueprint.

Run locally with `npm start` and open http://localhost:10000.

## Content and rights
Hero imagery includes two images supplied by the project owner; other images are stills extracted from the user-supplied EMPTY BED video. The source video is credited to its owners and may require permission for public/commercial display. The site is an independent fan catalogue, not an official CINEK project or an endorsed token. Prompts are fan templates and do not grant rights to the artist's identity, voice or likeness. Links and release metadata should be rechecked before launch.

## Important
This build **does not** host an image generator, provide a live MCP server, mint a token, or replicate Claudia.gallery pixel-for-pixel. The JSON endpoints are static and read-only. The intended effect is an immersive scroll-led experience using original site code.


## V2 character wiki and film galleries
- `/wiki.html` detailed source-labelled character guide and creation workflow.
- `/looks.html` six reference entries with fullscreen viewer; not six confirmed official looks.
- `/films.html` verified video collection and `/film.html?id=empty-bed`, `our-song`, or `remedy` for dedicated pages.
- `/films.json`, `/looks.json` static machine-readable collections.
- Media rights/artist authorization are not established; obtain clearance before public/commercial use.

## Social footer

Every page includes a responsive social/streaming footer linking to the artist Linktree, YouTube, Instagram, TikTok, Facebook, Apple Music, and Amazon Music. The Facebook share URL is owner-provided and its canonical profile remains unverified.
