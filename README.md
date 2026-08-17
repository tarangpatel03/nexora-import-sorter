# Nexora Import Sorter

A VS Code extension that sorts TypeScript and TSX imports into organized
groups.

## Import Order

Imports are arranged in this order:

1.  Side Effect Imports
2.  Library Imports
3.  Absolute Imports
4.  Relative Imports

Example:

```typescript
// Side Effect Imports
import "react-native-gesture-handler";

// Library Imports
import React from "react";
import axios from "axios";

// Absolute Imports
import AppText from "@/components/AppText";

// Relative Imports
import { styles } from "./styles";
```

## Features

- Sorts TypeScript and TSX imports
- Supports `@/` absolute imports
- Supports side-effect imports
- Preserves multiline imports
- Supports:
  - default imports
  - named imports
  - namespace imports
  - `import type`

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
