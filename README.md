# Adwait More — Portfolio

A dual-mode portfolio that switches between a minimalist scrolling site and a full-screen 2D platformer.

## Getting Started

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## Adding Your Images

Drop your images into `src/assets/images/` using these exact filenames:

| File | Where it appears |
|---|---|
| `profile.jpg` | Hero section profile photo (both modes) |
| `project-1.jpg` | First project card thumbnail |
| `project-2.jpg` | Second project card thumbnail |
| `project-3.jpg` | Third project card thumbnail |

> If images are missing, graceful placeholders are shown automatically.

## Editing Your Content

All portfolio data lives in one file: `src/data/portfolioData.js`.

- **Add a project**: Copy-paste an entry in the `projects` array.
- **Update skills**: Edit the `skills` array (name + level 0–100).
- **Change bio**: Edit the `about` array (each string is a paragraph).

## Game Mode Map

The platformer zones are defined in `src/components/GameMode/gameLogic.js`. The 4 zones (`zone_about`, `zone_skills`, `zone_projects`, `zone_contact`) generate platforms automatically. To reorder them, change the `zoneOrder` array at the top of the scene.

## Keyboard Controls (Game Mode)

| Key | Action |
|---|---|
| `A` / `←` | Walk left |
| `D` / `→` | Walk right |
| `Space` / `W` / `↑` | Jump |
| `ESC` | Close info panel |
