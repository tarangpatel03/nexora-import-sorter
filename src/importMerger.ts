import { ImportStatement } from "./types";

export function mergeDuplicateImports(
  imports: ImportStatement[],
): ImportStatement[] {
  const merged = new Map<string, ImportStatement>();

  for (const current of imports) {
    const key = `${current.source}::${current.kind}`;

    const existing = merged.get(key);

    if (!existing) {
      merged.set(key, current);
      continue;
    }

    // Cannot merge side effects
    if (current.group === "sideEffect" || existing.group === "sideEffect") {
      continue;
    }

    // Cannot merge namespace imports
    if (current.namespaceImport || existing.namespaceImport) {
      continue;
    }

    const hasConflictingDefaultImport =
      existing.defaultImport &&
      current.defaultImport &&
      existing.defaultImport !== current.defaultImport;

    if (hasConflictingDefaultImport) {
      merged.set(`${key}::${current.start}`, current);
      continue;
    }

    existing.defaultImport = existing.defaultImport ?? current.defaultImport;

    if (existing.hasNamedImportAlias || current.hasNamedImportAlias) {
      merged.set(`${key}::${current.start}`, current);

      continue;
    }

    existing.namedImports = [
      ...(existing.namedImports ?? []),
      ...(current.namedImports ?? []),
    ];
  }

  return Array.from(merged.values());
}
