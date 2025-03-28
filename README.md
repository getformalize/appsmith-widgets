# Appsmith Widgets

A collection of custom TypeScript widgets for Appsmith, built to be imported as ES modules.

## Available Widgets

- **KV Widget** - Display data in key-value format with support for various data types
- **Checklist Widget** - Interactive checklist with grouping and verification status

## Usage in Appsmith

Create a custom JS widget in Appsmith and add:

```js
import { KVWidget, initializeWidget } from 'https://yourusername.github.io/appsmith-widgets/appsmith-widgets.js';
initializeWidget(KVWidget);
```

## Development

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development with auto-reload
npm run dev

# Start local server (serves from dist)
npm run serve
```
