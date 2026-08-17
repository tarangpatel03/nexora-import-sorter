import * as ts from "typescript";
import { ImportGroup, ImportStatement } from "./types";

/**
 * Determines which import group an import belongs to.
 *
 * Side-effect imports have the highest priority because their purpose
 * is to execute the imported module rather than provide a local binding.
 *
 * Example:
 *   import 'react-native-gesture-handler';
 *   import '@/config/i18n';
 *
 * Priority:
 * 1. Side Effect
 * 2. Library
 * 3. Absolute
 * 4. Relative
 */
function classifyImport(source: string, isSideEffect: boolean): ImportGroup {
  //! Side-effect detection must happen BEFORE path classification.
  //! For example, `import '@/config/i18n'` is absolute by path,
  //! but it should still belong to the Side Effect group.
  if (isSideEffect) {
    return "sideEffect";
  }

  // Relative imports point to files using ./ or ../
  if (source.startsWith("./") || source.startsWith("../")) {
    return "relative";
  }

  // Absolute imports in our project use the @/ alias.
  if (source.startsWith("@/")) {
    return "absolute";
  }

  // Everything else is treated as a library import.
  // Examples: react, axios, @react-navigation/native
  return "library";
}

/**
 * Parses the source code and extracts all static import declarations.
 *
 * We use the TypeScript AST instead of regex so that imports such as
 * multiline imports and `import type` are handled correctly.
 */
export function parseImports(code: string): ImportStatement[] {
  // Parse the entire file using TypeScript's compiler API.
  const sourceFile = ts.createSourceFile(
    "file.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );

  const imports: ImportStatement[] = [];

  // Iterate through the top-level statements in the source file.
  for (const statement of sourceFile.statements) {
    // Ignore everything that isn't a static import declaration.
    if (!ts.isImportDeclaration(statement)) {
      continue;
    }

    const moduleSpecifier = statement.moduleSpecifier;

    // Ignore imports whose module source isn't a string literal.
    if (!ts.isStringLiteral(moduleSpecifier)) {
      continue;
    }

    const source = moduleSpecifier.text;

    /**
     * `importClause` is undefined for side-effect imports.
     *
     * Example:
     *   import 'react-native-gesture-handler';
     *
     * has no import clause, while:
     *
     *   import React from 'react';
     *
     * does.
     */
    const isSideEffect = statement.importClause === undefined;

    imports.push({
      text: code.slice(statement.getStart(sourceFile), statement.end),
      source,
      group: classifyImport(source, isSideEffect),
      start: statement.getStart(sourceFile),
      end: statement.end,
    });
  }

  return imports;
}
