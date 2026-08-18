import * as ts from "typescript";

import {
  ImportGroup,
  ImportKind,
  ImportSorterConfig,
  ImportStatement,
} from "./types";

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
function classifyImport(
  source: string,
  isSideEffect: boolean,
  config: ImportSorterConfig,
): ImportGroup {
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
  const isAbsoluteImport = config.absoluteAliases.some((alias) =>
    source.startsWith(alias),
  );

  if (isAbsoluteImport) {
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
export function parseImports(
  code: string,
  config: ImportSorterConfig,
): ImportStatement[] {
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

    // Side Effect
    const isSideEffect = statement.importClause === undefined;

    // Kind: Type or Default
    const kind: ImportKind =
      statement.importClause?.isTypeOnly === true ? "type" : "runtime";

    const hasNamedImportAlias =
      statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings)
        ? statement.importClause.namedBindings.elements.some(
            (element) => element.propertyName !== undefined,
          )
        : false;

    // All import names like Button, Text etc...
    const namedImports =
      statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings)
        ? statement.importClause.namedBindings.elements.map(
            (element) => element.name.text,
          )
        : undefined;

    // Find Default imports name
    const defaultImport = statement.importClause?.name?.text;

    // Find `* as` import name
    const namespaceImport =
      statement.importClause?.namedBindings &&
      ts.isNamespaceImport(statement.importClause.namedBindings)
        ? statement.importClause.namedBindings.name.text
        : undefined;

    // Check for multiline import
    const text = code.slice(statement.getStart(sourceFile), statement.end);
    const isMultiline = text.includes("\n");

    imports.push({
      text,
      source,
      group: classifyImport(source, isSideEffect, config),
      kind,

      defaultImport,
      namespaceImport,
      namedImports,
      hasNamedImportAlias,

      isMultiline,

      start: statement.getStart(sourceFile),
      end: statement.end,
    });
  }

  return imports;
}
