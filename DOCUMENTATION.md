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