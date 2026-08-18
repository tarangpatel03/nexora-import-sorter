# Nexora Import Sorter

A VS Code extension that sorts and organizes TypeScript and TSX imports into structured groups.

## Import Order

Imports are arranged in this order:

1. Side Effect Imports
2. Library Imports
3. Absolute Imports
4. Relative Imports
5. Type Imports

Example:

```typescript
// Side Effect Imports
import "react-native-gesture-handler";

// Library Imports
import axios from "axios";
import React from "react";

// Absolute Imports
import AppText from "@/components/AppText";

// Relative Imports
import { styles } from "./styles";

// Type Imports
import type { User } from "@/types";
```

## Features

- Sorts TypeScript and TSX imports
- Supports custom absolute import aliases
- Supports side-effect imports
- Supports type imports
- Automatically sorts imports on save
- Detects and merges duplicate imports
- Sorts named imports alphabetically
- Safely handles aliased imports by preserving them during duplicate merging
- Supports:
  - default imports
  - named imports
  - namespace imports
  - `import type`

## Configuration

### Absolute Import Aliases

Configure your project's absolute import paths:

```json
{
  "importSorter.absoluteAliases": ["@/", "~/"]
}
```

Default:

```json
["@/"]
```

### Sort On Save

Enable automatic import sorting when saving files:

```json
{
  "importSorter.sortOnSave": true
}
```

## Usage

Run:

```text
Cmd + Shift + I
```

or:

```text
Command Palette → Import Sorter: Sort Imports
```

## Supported Files

- `.ts`
- `.tsx`

## Publisher

Nexora
