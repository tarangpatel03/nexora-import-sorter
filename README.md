# Nexora Import Sorter

> VS Code extension for automatically organizing TypeScript and TSX imports.

Nexora Import Sorter helps keep imports consistent and readable by automatically grouping, sorting, and cleaning TypeScript and TSX imports.

It is designed around predictable import ordering while supporting modern TypeScript project structures and custom path aliases.

## ✨ Features

* Sorts imports in `.ts` and `.tsx` files
* Automatically sorts imports on save
* Supports custom absolute import aliases
* Handles side-effect imports
* Separates type imports
* Detects and merges duplicate imports
* Sorts named imports alphabetically
* Safely handles aliased imports during duplicate merging
* Supports:

  * Default imports
  * Named imports
  * Namespace imports
  * `import type`

## 📐 Import Order

Imports are organized into the following groups:

```text
1. Side Effect Imports
2. Library Imports
3. Absolute Imports
4. Relative Imports
5. Type Imports
```

### Example

Before:

```typescript
import styles from "./styles";
import React from "react";
import type { User } from "@/types/user";
import axios from "axios";
import "@/config/setup";
import AppText from "@/components/AppText";
import { View } from "react-native";
```

After:

```typescript
import "@/config/setup";

import React from "react";
import axios from "axios";
import { View } from "react-native";

import AppText from "@/components/AppText";

import styles from "./styles";

import type { User } from "@/types/user";
```

The result is a predictable structure that makes larger TypeScript codebases easier to scan and maintain.

## ⚙️ Configuration

Nexora Import Sorter provides configuration through VS Code settings.

### Absolute Import Aliases

By default:

```json
{
  "importSorter.absoluteAliases": ["@/"]
}
```

Multiple aliases can be configured:

```json
{
  "importSorter.absoluteAliases": ["@/", "~/"]
}
```

### Sort Imports on Save

Enable automatic sorting whenever a supported file is saved:

```json
{
  "importSorter.sortOnSave": true
}
```

## 🚀 Usage

### Command Palette

Open the VS Code Command Palette and run:

```text
Import Sorter: Sort Imports
```

### Keyboard Shortcut

```text
Cmd + Shift + I
```

## 📂 Supported Files

Nexora Import Sorter currently supports:

```text
.ts
.tsx
```

## 🧠 How It Works

The extension parses TypeScript imports and categorizes them according to their source and import type.

```text
Source File
    │
    ▼
Find Imports
    │
    ▼
Classify Imports
    │
    ├── Side Effect
    ├── Library
    ├── Absolute
    ├── Relative
    └── Type
    │
    ▼
Merge Duplicates
    │
    ▼
Sort Named Imports
    │
    ▼
Generate Organized Imports
```

This approach keeps the transformation deterministic while preserving supported import semantics.

## 🛠️ Tech Stack

* **TypeScript**
* **VS Code Extension API**
* TypeScript / TSX parsing and import transformation
* VS Code configuration API

## 🎯 Why Nexora Import Sorter?

Large TypeScript projects often develop inconsistent import structures as files and dependencies grow.

Nexora Import Sorter provides an opinionated but configurable way to maintain a consistent import structure without requiring developers to manually reorganize imports.

## 📌 Project Goals

* Keep imports predictable
* Reduce repetitive formatting work
* Support common TypeScript project structures
* Handle duplicate imports safely
* Make import organization automatic during development

## 📄 License

This project is available for educational and portfolio purposes.
