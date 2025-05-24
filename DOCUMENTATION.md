# PGN Parser Output Structure

This document describes the structure of the parsed PGN result as returned by the @mliebelt/pgn-parser library, as used in this project.

## Example Output

```
[
  {
    "tags": {
      "Event": "F/S Return Match",
      "Site": "Belgrade, Serbia JUG",
      "Date": {
        "value": "1992.11.04",
        "year": 1992,
        "month": 11,
        "day": 4
      },
      "Round": "29",
      "White": "Fischer, Robert J.",
      "Black": "Spassky, Boris V.",
      "Result": "1/2-1/2",
      "messages": []
    },
    "gameComment": null,
    "moves": [
      {
        "moveNumber": 1,
        "notation": {
          "fig": null,
          "strike": null,
          "col": "e",
          "row": "4",
          "check": null,
          "promotion": null,
          "notation": "e4"
        },
        "variations": [],
        "nag": null,
        "commentDiag": null,
        "turn": "w"
      },
      {
        "moveNumber": null,
        "notation": {
          "fig": null,
          "strike": null,
          "col": "e",
          "row": "5",
          "check": null,
          "promotion": null,
          "notation": "e5"
        },
        "variations": [],
        "nag": null,
        "commentDiag": null,
        "turn": "b"
      },
      {
        "moveNumber": 2,
        "notation": {
          "fig": "N",
          "strike": null,
          "col": "f",
          "row": "3",
          "check": null,
          "promotion": null,
          "notation": "Nf3"
        },
        "variations": [],
        "nag": null,
        "commentDiag": null,
        "turn": "w"
      },
      {
        "moveNumber": null,
        "notation": {
          "fig": "N",
          "strike": null,
          "col": "c",
          "row": "6",
          "check": null,
          "promotion": null,
          "notation": "Nc6"
        },
        "variations": [],
        "nag": null,
        "commentDiag": null,
        "turn": "b"
      },
      {
        "moveNumber": 3,
        "notation": {
          "fig": "B",
          "strike": null,
          "col": "b",
          "row": "5",
          "check": null,
          "promotion": null,
          "notation": "Bb5"
        },
        "variations": [],
        "nag": null,
        "commentDiag": null,
        "turn": "w"
      },
      {
        "moveNumber": null,
        "notation": {
          "fig": null,
          "strike": null,
          "col": "a",
          "row": "6",
          "check": null,
          "promotion": null,
          "notation": "a6"
        },
        "variations": [],
        "nag": null,
        "commentDiag": null,
        "turn": "b"
      }
    ],
    "messages": []
  }
]
```

## Notes
- The root is an array (one element per game; this project only supports single-game PGNs).
- Game metadata is under the `tags` property.
- Moves are in the `moves` array, each with a `notation` object and other move details.

## Project Type Rules
Always prefer custom types defined in `src/types` (such as `ParseTree`, `PgnMove`, etc.) over types from third-party libraries. All code should use these custom types for consistency and accuracy, unless there is a strong, documented reason to do otherwise.
`PgnMove` in `src/types` is the correct and canonical move type for this project. The `moveNumber` property is often `null` for black's moves, as this is how the parser typically returns the data.

## State Management with Zustand

This project uses [Zustand](https://github.com/pmndrs/zustand) for global state management. Zustand provides a simple, scalable, and modular way to manage application state outside of React component trees.

### What Zustand Manages
- The move tree structure (`moveTree`)
- The currently selected move node (`currentNode`)
- The parsed PGN data (`parsed`)
- Selectors and actions for updating and accessing this state (e.g., `setMoveTree`, `setCurrentNode`, `setParsed`, and dynamic selectors like `getCurrentBranchGroup`)

### Why Zustand?
- Keeps board, move tree, and sidebar in sync across the app
- Centralizes state for future editing features (add/edit/delete nodes, undo/redo, etc.)
- Avoids prop drilling and makes state accessible from any component
- Scales well as the app grows in complexity

### Future Use
Zustand will be used to manage all global state related to move tree editing, navigation, and UI synchronization. This includes supporting features like:
- Editing the move tree (adding, deleting, or modifying moves/branches)
- Undo/redo functionality
- Keeping the chessboard, move tree graph, and sidebar in sync
- Any other features that require shared state across multiple components

### Component State Access Best Practice

Leaf components (components that do not have children depending on their state) that need access to global state should use the Zustand store directly, rather than receiving state via props. This avoids unnecessary prop drilling, keeps components modular, and makes the codebase easier to maintain and extend. All new and refactored components should follow this pattern unless there is a strong, documented reason to do otherwise.

## Chessboard, Move Tree, and Graph Synchronization

The HomePage component manages the current move node (`currentNode`) as the user steps through the game. This state is used to keep the chessboard and the move tree graph in sync:

- The current FEN (`currentNode.fen`) is passed to the `Chessboard` component to display the correct board position.
- The current node's id (`currentNode.id`) is passed as `selectedNodeId` to the move tree graph (`MoveTreeFlow` via `MoveTreeVisualization`), which highlights the corresponding node in the graph.
- As the user steps forward or backward through the moves (using buttons or keyboard), `currentNode` is updated, and both the chessboard and the graph update automatically to reflect the new position and selection.

This ensures that the board view and the move tree visualization always represent the same point in the game, providing a synchronized and intuitive user experience.

## Assistant Cursor Rules

- When running tests from the chat, always use `npx vitest run` (non-interactive, no extra flags) to avoid configuration errors and ensure consistent results. 