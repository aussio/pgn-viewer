import { describe, it, expect } from 'vitest';
import { moveTreeFromPgn } from './moveTreeFromPgn';
import type { ParseTree } from '../types/pgn';

// Minimal types for test data, only the fields used in test objects

type TestMove = {
  moveNumber: number | null;
  notation: { notation: string };
  variations: any[];
  turn: 'w' | 'b';
};
type TestParseTree = { moves: TestMove[] };

// Minimal parsed PGN example
// 1. e4 e5 2. Nf3 Nc6
const parsedSimple: TestParseTree = {
    moves: [
        { moveNumber: 1, notation: { notation: 'e4' }, variations: [], turn: 'w' },
        { moveNumber: null, notation: { notation: 'e5' }, variations: [], turn: 'b' },
        { moveNumber: 2, notation: { notation: 'Nf3' }, variations: [], turn: 'w' },
        { moveNumber: null, notation: { notation: 'Nc6' }, variations: [], turn: 'b' },
    ],
};

// Variation example
// 1. e4 e5 2. Nf3 (2. f4 exf4) 2... Nc6
const parsedWithVariation: TestParseTree = {
    moves: [
        { moveNumber: 1, notation: { notation: 'e4' }, variations: [], turn: 'w' },
        { moveNumber: null, notation: { notation: 'e5' }, variations: [], turn: 'b' },
        { moveNumber: 2, notation: { notation: 'Nf3' }, variations: [
            [
                { moveNumber: 2, notation: { notation: 'f4' }, variations: [], turn: 'w' },
                { moveNumber: null, notation: { notation: 'exf4' }, variations: [], turn: 'b' },
            ]
        ], turn: 'w' },
        { moveNumber: null, notation: { notation: 'Nc6' }, variations: [], turn: 'b' },
    ],
};

describe('moveTreeFromPgn', () => {
    it('creates a MoveTree from a simple parsed PGN', () => {
        const tree = moveTreeFromPgn(parsedSimple as unknown as ParseTree);
        expect(tree.root.fen).toBeDefined();
        expect(tree.root.children.length).toBe(1);
        const e4 = tree.root.children[0];
        expect(e4.move.notation).toBe('e4');
        expect(e4.fen).toBe('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1');
        const e5 = e4.children[0];
        expect(e5.move.notation).toBe('e5');
        expect(e5.fen).toBe('rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2');
        const Nf3 = e5.children[0];
        expect(Nf3.move.notation).toBe('Nf3');
        expect(Nf3.fen).toBe('rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2');
        const Nc6 = Nf3.children[0];
        expect(Nc6.move.notation).toBe('Nc6');
        expect(Nc6.fen).toBe('r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3');
    });

    it('throws if no game is present', () => {
        const empty: TestParseTree = { moves: [] };
        expect(() => moveTreeFromPgn(empty as unknown as ParseTree)).toThrow();
        expect(() => moveTreeFromPgn(undefined as unknown as ParseTree)).toThrow();
    });

    it('handles variations as children', () => {
        const tree = moveTreeFromPgn(parsedWithVariation as unknown as ParseTree);
        const e4 = tree.root.children[0];
        expect(e4.move.notation).toBe('e4');
        const e5 = e4.children[0];
        expect(e5.move.notation).toBe('e5');
        expect(e5.children.length).toBe(2);
        const Nf3 = e5.children[0];
        const f4 = e5.children[1];
        expect(Nf3.move.notation).toBe('Nf3');
        const Nc6 = Nf3.children[0];
        expect(Nc6.move.notation).toBe('Nc6');
        expect(f4.move.notation).toBe('f4');
        const exf4 = f4.children[0];
        expect(exf4.move.notation).toBe('exf4');
    });

    it('populates all move fields (annotations, nag, turn) if present', () => {
        const parsed = {
            moves: [
                {
                    moveNumber: 1,
                    notation: { notation: 'e4' },
                    commentDiag: 'Good move',
                    nag: '$1',
                    turn: 'w',
                    variations: []
                },
                {
                    moveNumber: 1,
                    notation: { notation: 'e5' },
                    nag: '$2',
                    turn: 'b',
                    variations: []
                }
            ]
        };
        const tree = moveTreeFromPgn(parsed as unknown as ParseTree);
        const e4 = tree.root.children[0];
        expect(e4.move.notation).toBe('e4');
        expect(e4.move.annotations).toBe('Good move');
        expect(e4.move.nag).toBe('$1');
        expect(e4.move.turn).toBe('w');
        const e5 = e4.children[0];
        expect(e5.move.notation).toBe('e5');
        expect(e5.move.nag).toBe('$2');
        expect(e5.move.turn).toBe('b');
    });

    it('ensures children arrays are always present', () => {
        const parsed = {
            moves: [
                {
                    moveNumber: 1,
                    notation: { notation: 'e4' },
                    variations: []
                }
            ]
        };  
        const tree = moveTreeFromPgn(parsed as unknown as ParseTree);
        const e4 = tree.root.children[0];
        expect(Array.isArray(e4.children)).toBe(true);
        expect(e4.children.length).toBe(0);
    });

    it('handles nodes with and without variations correctly', () => {
        const parsed = {
            moves: [
                {
                    moveNumber: 1,
                    notation: { notation: 'e4' },
                    variations: [
                        [
                            {
                                moveNumber: 1,
                                notation: { notation: 'c4' },
                                variations: []
                            }
                        ]
                    ]
                },
                {
                    moveNumber: 1,
                    notation: { notation: 'e5' },
                    variations: []
                }
            ]
        };
        const tree = moveTreeFromPgn(parsed as unknown as ParseTree);
        const e4 = tree.root.children[0];
        expect(e4.move.notation).toBe('e4');
        // Mainline child
        expect(e4.children.length).toBe(1);
        expect(e4.children[0].move.notation).toBe('e5');
        // Variation sibling
        const c4 = tree.root.children[1];
        expect(c4.move.notation).toBe('c4');
    });
}); 