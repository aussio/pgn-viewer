import { MoveTree } from './MoveTree';
import { Chess } from 'chess.js';

/**
 * Convert parsed PGN JSON (from @mliebelt/pgn-parser) to a MoveTree.
 * Only supports single-game PGN (first element of parsed array).
 * @param {object[]} parsedPgn - Output from parsePgn (array with one game object)
 * @returns {MoveTree}
 */
export function moveTreeFromPgn(parsedPgn) {
    if (!Array.isArray(parsedPgn) || parsedPgn.length === 0) {
        throw new Error('No game found in parsed PGN');
    }
    const game = parsedPgn[0];
    const chess = new Chess();

    // Recursive function to build tree nodes
    function buildNodes(moves, parentFen) {
        const nodes = [];
        for (let i = 0; i < moves.length; i++) {
            const moveObj = moves[i];
            const chessCopy = new Chess(parentFen);
            if (moveObj.notation && moveObj.notation.notation) {
                chessCopy.move(moveObj.notation.notation, { sloppy: true });
            }
            const fen = chessCopy.fen();
            const node = {
                fen,
                move: {
                    notation: moveObj.notation?.notation,
                    moveNumber: moveObj.moveNumber,
                    annotations: moveObj.commentDiag || null,
                    nag: moveObj.nag || null,
                    turn: moveObj.turn || null,
                },
                children: [],
            };
            // Add mainline next move as a child
            if (i + 1 < moves.length) {
                const nextNodes = buildNodes(moves.slice(i + 1), fen);
                if (nextNodes.length > 0) node.children.push(...nextNodes);
            }
            // First push the mainline node
            nodes.push(node);
            // Then add variations as siblings (from the same parent FEN)
            if (moveObj.variations && moveObj.variations.length > 0) {
                for (const variation of moveObj.variations) {
                    const varNodes = buildNodes(variation, parentFen);
                    nodes.push(...varNodes);
                }
            }
            break; // Only the first mainline move at this ply; variations are handled above
        }
        return nodes;
    }

    // Root node: before any moves, initial FEN
    const root = {
        fen: chess.fen(),
        move: null,
        children: [],
    };
    if (game.moves && game.moves.length > 0) {
        root.children = buildNodes(game.moves, chess.fen());
    }
    return new MoveTree(root);
} 