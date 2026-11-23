# AGENTS.md: Meghana OS

Personal portfolio styled as a Windows XP (Luna) desktop. Visitors boot it, log in, explore apps, and shut it down. Read `docs/SPEC.md` before building anything. Build only what the current prompt asks for.

## Stack

- React (Vite), JavaScript with JSDoc comments (no TypeScript unless told otherwise)
- Tailwind CSS v4 (`@tailwindcss/vite` plugin, `@import "tailwindcss";` in `src/index.css`)
- Zustand for global state
- No UI kit, no component library. XP look is hand-built with Tailwind and CSS.
- Do not add any dependency without listing it and the reason in your final report.

## Commands

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`

After every task, run `npm run build` and `npm run lint`. Fix errors before reporting. Never report a task done if the build fails.

## Folder structure

```
src/
  os/            boot, login, shutdown, desktop shell, taskbar, start menu
  windows/       window manager (store, Window frame, drag, stacking)
  apps/          one folder per app (notepad, explorer, webexplorer, mail, pictures, rover, ...)
  fs/            virtual filesystem (tree, helpers, file-type handlers)
  content/       ALL visitor-facing text and data (about, projects, experience, rover script, notes)
  hooks/
  assets/        icons, wallpaper, photos, sounds (own or licensed only)
  styles/        tokens.css and shared XP styles
docs/
  SPEC.md
  PROMPTS.md
```

## Hard rules

1. **One window manager.** Apps never create their own windows, dragging, z-index or focus logic. They only render their content inside the shared `Window` frame.
2. **OS states are separate:** `boot`, `login`, `desktop`, `shutdown`. Switching states never reloads the page. State lives in one Zustand store.
3. **Content lives in `src/content/`.** Never hardcode portfolio text inside components. Components read from content files or the virtual filesystem.
4. **Rover is scripted.** No LLM, no AI API, no network calls. Conversation data is a separate file in `src/content/rover.js`. The Rover component only renders that data.
5. **No fake controls.** If a feature is not built in the current phase, do not render its button or menu item, or render it clearly disabled. Every visible control must work.
6. **No Microsoft assets.** No Microsoft logos, wordmarks, icons, wallpaper (Bliss), fonts bundled from Windows, or the Windows startup/shutdown sounds. Use placeholder icons from `src/assets/icons/` and tell me which ones are placeholders. App names: "Web Explorer" (not Internet Explorer), "Mail" (not Outlook Express).
7. **Placeholders.** Anything I have not supplied (email, profile URLs, project results, photos) is written as `[PLACEHOLDER: what goes here]` in `src/content/`. Never invent facts about me, my work, results, or dates.
8. **External links** open in a new tab with `rel="noopener noreferrer"`. Never put LinkedIn or GitHub in an iframe.
9. **Audio** is optional, starts only after a user click, has a visible mute control, and the preference persists in `localStorage`. If audio fails, continue silently.
10. **Mobile (under 768px):** windows open maximised, one at a time, no dragging, desktop icons become a grid. Never ship a layout that needs a mouse to navigate.
11. **Accessibility basics:** real `<button>` elements for controls, visible focus ring, `aria-label` on icon-only buttons, alt text on images, and `prefers-reduced-motion` respected for animations.
12. **Secrets** never go in client code. Mail uses a form service endpoint read from `import.meta.env.VITE_MAIL_ENDPOINT`.

## XP design tokens (put in `src/styles/tokens.css`)

- Title bar gradient: `#2f86f7 0%, #0f64e8 8%, #0058e6 90%, #0044c4 100%`
- Window frame: `#0058e6`, 4px, top radius 9px
- Dialog / window body: `#ece9d8`
- Taskbar: `#245edb` (gradient `#3168d5, #245edb, #2457cf, #1941a5`)
- Start button: green gradient `#69c765, #3c9d3c, #2e8b2e, #226d22`, italic bold "start"
- Selection: `#316ac5`
- Close button: red gradient `#ee7a58` to `#c43a18`
- Font stack: `Tahoma, 'Noto Sans', Verdana, sans-serif`; title text `'Trebuchet MS', 'Noto Sans', sans-serif`
- Progress bar: segmented green blocks

Follow the Figma screens I attach as the visual source of truth. If a screen conflicts with these tokens, the screen wins.

## Working style

- Build in small steps. After each task, give a short report: files created or changed, what works, what is placeholder, what you did not do.
- If something in the prompt is ambiguous, pick the simplest option, state your choice in the report, and continue.
- Commit-ready: code should be formatted and free of dead code and `console.log`.
- Do not touch files outside the scope of the current prompt.

## Definition of done (every prompt)

- [ ] Build and lint pass
- [ ] Works at 1440x900 and at 390x844
- [ ] No console errors
- [ ] No hardcoded portfolio text in components
- [ ] Report lists placeholders and anything skipped
