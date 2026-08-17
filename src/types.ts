/**
 * Defines the four import categories supported by the sorter.
 *
 * Priority:
 * 1. sideEffect
 * 2. library
 * 3. absolute
 * 4. relative
 */
export type ImportGroup = "sideEffect" | "library" | "absolute" | "relative";

// It will break down import to sort them
export interface ImportStatement {
  text: string; // import React from 'react';
  source: string; // react
  group: ImportGroup; // library
  start: number; // position where import starts
  end: number; // position where import ends
}
