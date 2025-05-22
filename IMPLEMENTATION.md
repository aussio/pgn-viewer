# PGN Viewer Implementation Plan

## Overview
This document outlines the steps to build a structured, interactive, and navigable website that transforms a complex PGN file into a book-like, branching, annotated chess experience. The implementation will proceed in vertical slices: for each major feature, both backend logic, UI, and tests will be developed together.

---

## 1. PGN Parsing & Move Tree Structure (Vertical Slice)

### 1.1. Integrate PGN Parser
- [x] Add @mliebelt/pgn-parser to the project dependencies.
- [x] Create a utility to parse raw PGN files into structured JSON.
- [x] **Write tests** for PGN parsing utility (unit tests for various PGN inputs).
- [x] **Implement a basic UI** to upload or input a PGN file and display the parsed JSON (for developer feedback/testing).

### 1.2. Build Move Tree Structure
- [x] Design a custom move tree class (inspired by TreeModel.js) for chess moves.
- [x] Each node should store:
  - FEN string
  - Move details (notation, move number, annotations)
  - Child moves (variations)
  - Unique identifier
- [x] Implement conversion from parsed PGN JSON to the move tree structure.
- [x] **Write tests** for move tree construction (unit tests for tree correctness, edge cases, and variations).
- [x] **Implement a UI** to visualize the move tree structure (e.g., expandable/collapsible tree view for moves/variations).

### 1.3. Move Tree Visualization with React Flow
- [x] Add @xyflow/react (React Flow) to the project dependencies.
- [x] Write a utility to convert the MoveTree structure into React Flow nodes and edges.
- [x] Create a MoveTreeFlow.jsx component that renders the move tree using <ReactFlow />.
- [ ] Customize node rendering to show move notation, FEN, and annotations.
- [x] Visually distinguish mainline and variation branches (e.g., node/edge styles).
- [x] Enable panning, zooming, and dragging in the visualizer.
- [ ] Allow clicking nodes to show move details and sync with the chessboard.
- [x] (Optional) Add minimap, controls, or theming using React Flow features.
- [x] **Write tests** for the data transformation utility and basic UI rendering.

---

## 2. Variation Detection & Chapterization (Vertical Slice)

### 2.1. Define Chapterization Rules
- [ ] Establish criteria for significant variations:
  - Length-based (e.g., >5 moves)
  - Annotation-based (presence of commentary/NAGs)
  - Depth-based (nested variations)
- [ ] **Write tests** for chapterization rule logic (unit tests for rule application on sample trees).
- [ ] **Implement a UI** to allow configuration/visualization of chapterization rules and preview which branches will become chapters.

### 2.2. Implement Chapterization Algorithm
- [ ] Write a recursive function to traverse the move tree and identify:
  - Main line (Chapter 1)
  - Significant branches (subsequent chapters/sub-chapters)
- [ ] Store metadata for each chapter:
  - Title
  - Move range
  - Summary
- [ ] **Write tests** for chapterization output (unit and integration tests for correct chapter assignment and metadata).
- [ ] **Implement a UI** to display the chapter structure (e.g., sidebar/table of contents with chapters and sub-chapters).

---

## 3. Interactive Presentation & Navigation (Vertical Slice)

### 3.1. Layout & Navigation
- [ ] Design a book-like UI:
  - Left sidebar/table of contents for chapters
  - Main content area for moves, annotations, and diagrams
- [ ] Implement breadcrumb navigation for branch hierarchy
- [ ] **Write tests** for navigation logic (unit/integration tests for navigation state, breadcrumbs, and chapter selection).
- [ ] **Implement UI** for sidebar, main content, and breadcrumbs.

### 3.2. Interactive Chessboard
- [ ] Integrate a chessboard library (e.g., Chessboard.js, Chessground, or react-chessboard)
- [ ] Enable clicking moves in notation to update the board
- [ ] Auto-highlight annotated moves
- [ ] **Write tests** for board state updates and move highlighting (unit/integration tests).
- [ ] **Implement UI** for interactive chessboard and move list.

### 3.3. Branch Navigation
- [ ] Embed hyperlinks at branching points for alternative variations
- [ ] Ensure clear parent/child navigation between branches
- [ ] **Write tests** for branch navigation logic (unit/integration tests for correct linking and navigation).
- [ ] **Implement UI** for branch navigation (links/buttons at variation points).

### 3.4. Board Visualization
- [ ] Dynamically generate board diagrams at key positions (annotations/critical moves)
- [ ] Implement caching for generated diagrams
- [ ] **Write tests** for diagram generation and caching logic.
- [ ] **Implement UI** for displaying diagrams inline with annotations.

### 3.5. (Optional) Branch Overview Visualization
- [ ] Create an interactive tree/mind-map of branches
- [ ] Enable navigation by clicking nodes in the overview
- [ ] **Write tests** for overview map logic and navigation.
- [ ] **Implement UI** for the overview map.

---

## 4. Additional Considerations (Applied at Each Stage)
- [ ] Ensure accessibility and responsive design for all UI components.
- [ ] Optimize performance for large PGN files (test with large files at each stage).

---

## 5. Milestones (Vertical Slices)
1. **PGN Parsing & Move Tree (with tests and UI)**
2. **Chapterization Logic (with tests and UI)**
3. **Navigation & Presentation (with tests and UI)**
4. **Interactive Chessboard & Branching (with tests and UI)**
5. **Advanced Features (Branch Map, Caching, etc., with tests and UI)**

---
## 6. Cool additional ideas
- Significance Algorithm
- [ ] Use the lichess API (https://explorer.lichess.ovh/lichess?variant=standard) to send a FEN and get back the most common next moves.
- [ ] Gifs of the lines moving (with whatever the print-supported placeholder would be)

# Out of Scope
- Multi-game PGN files: Only single-game PGN files are supported. The application will not handle or display multiple games from a single PGN file.
