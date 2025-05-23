# PGN Viewer

<img width="600" alt="image" src="https://github.com/user-attachments/assets/3a7f94f1-a3ee-44d6-8d75-fb79ddc415cc">

PGN Viewer is a web app for visualizing chess games from PGN files. It parses PGN, displays the parsed JSON, and shows an interactive move tree using React Flow.

## Features
- Paste or input a PGN file to parse and visualize
- View the parsed PGN JSON (toggleable)
- Interactive move tree visualization with mainline and variations
- Clean, modern UI with accessible controls

## CSS & Styling
- **Global styles:** `src/index.css` provides a global reset and base styles (typography, colors, buttons, etc.).
- **Component styles:** Each React component uses its own CSS module (e.g., `App.module.css`, `MoveTreeFlow.module.css`) for scoped styles.

## Project Structure
- See [DOCUMENTATION.md](DOCUMENTATION.md) for details on the PGN parser output structure.
- See [IMPLEMENTATION.md](IMPLEMENTATION.md) for the implementation plan and todos.

## Getting Started
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open the app in your browser and paste a PGN to get started!

---

For more details, see the documentation files in this repo.
