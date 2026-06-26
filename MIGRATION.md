# GenForge — Migration Guide

## Quick-wiring the existing UI components

After dropping the `providers/` directory and the new `models.js` + `SettingsModal.js`
into the cloned Open-Generative-AI repo, here are the exact import swaps
needed in each UI component.

---

## 1. Global find-and-replace across all component files

### Replace muapi import
```
// FIND (appears in every studio component):
import { muapi } from '../lib/muapi.js';

// REPLACE WITH:
import * as router from '../lib/providers/router.js';
```

### Replace muapi method calls
```
// FIND → REPLACE

muapi.generateImage(   →   router.generateImage(
muapi.generateVideo(   →   router.generateVideo(
muapi.generateI2I(     →   router.generateI2I(
muapi.generateI2V(     →   router.generateI2V(
muapi.processV2V(      →   router.processV2V(
muapi.processLipSync(  →   router.processLipSync(
muapi.uploadFile(      →   router.uploadFile(
muapi.getDimensionsFromAR( → router.getDimensionsFromAR(
```

### Replace model imports
```
// FIND (in each component file):
import { getModelById, ... } from '../lib/models.js';
// or
import { ... } from 'studio/src/models.js';

// REPLACE WITH:
import { getModelById, getVideoModelById, ... } from '../lib/models.js';
```

---

## 2. Files to change (with line hints)

### `src/components/ImageStudio.js`
- Line ~1-5: Swap muapi import → router import
- Line ~1-5: Swap models import path
- Search for `muapi.` → replace with `router.`

### `src/components/VideoStudio.js`
- Same pattern as ImageStudio
- Also uses `muapi.generateVideo()` and `muapi.generateI2V()`

### `src/components/CinemaStudio.js`
- Same pattern
- Uses `muapi.generateImage()` and `muapi.generateVideo()`

### `src/components/LipSyncStudio.js`
- Same pattern
- Uses `muapi.processLipSync()` and `muapi.uploadFile()`

### `src/components/Header.js`
- Change app title from "Open Generative AI" → "GenForge"
- Optional: add provider status badges

### `src/components/Sidebar.js`
- Optional: add connection status indicators per provider

### `src/main.js`
- Swap `SettingsModal` import to the new one
- Change any `muapi_key` localStorage references

### `index.html`
- `<title>GenForge</title>`
- Update any branding text

### `package.json`
- `"name": "genforge"`
- `"description": "Multi-provider AI generation studio"`

### `vite.config.mjs`
- Remove or update the Muapi proxy:
```javascript
// BEFORE:
server: {
    proxy: {
        '/api': {
            target: 'https://api.muapi.ai',
            changeOrigin: true,
            secure: false
        }
    }
}

// AFTER (remove proxy — all calls go direct to provider URLs):
server: {
    // No proxy needed — providers are called directly via full URLs
}
```

---

## 3. Files to delete (optional cleanup)

These are no longer needed after the migration:

```
src/lib/muapi.js              # Replaced by providers/router.js
packages/studio/src/muapi.js   # Duplicate muapi client
src/lib/localInferenceClient.js # Local model support (keep if wanted)
src/lib/localModels.js          # Local model registry (keep if wanted)
src/components/LocalModelManager.js # Local model UI (keep if wanted)
src/components/McpCliStudio.js  # Muapi CLI integration
```

---

## 4. The model registry swap

The big one: `packages/studio/src/models.js` (10,601 lines) gets replaced
by the trimmed `src/lib/models.js` (~350 lines).

Since the existing `src/lib/models.js` just re-exports from the studio package:
```javascript
// OLD: src/lib/models.js
export * from "studio/src/models.js";
```

Replace its contents with the new GenForge models.js. The studio package's
models.js can stay (it won't be imported anymore) or be deleted.

---

## 5. Claude Code one-liner

If you're using Claude Code to do the migration, here's the prompt:

```
Read MIGRATION.md in the project root. Execute the migration:
1. Copy all files from genforge/src/lib/providers/ into src/lib/providers/
2. Replace src/lib/models.js with genforge/src/lib/models.js
3. Replace src/components/SettingsModal.js with genforge/src/components/SettingsModal.js
4. Copy genforge/src/lib/providerKeys.js into src/lib/
5. In every file under src/components/, replace `muapi` imports with router imports
6. Update package.json name to "genforge"
7. Update index.html title to "GenForge"
8. Remove the proxy from vite.config.mjs
9. Delete src/lib/muapi.js
```

---

## 6. Testing checklist

After migration:

- [ ] `npm run vite:dev` starts without errors
- [ ] Settings modal shows three provider key fields
- [ ] Entering a Kling API key marks it as Connected
- [ ] Entering a Fal.ai API key marks it as Connected
- [ ] Entering an EachLabs API key marks it as Connected
- [ ] Model picker shows only models for connected providers
- [ ] Text-to-video generation works through Kling direct
- [ ] Image-to-video generation works through Fal.ai
- [ ] Text-to-image generation works through EachLabs
- [ ] File upload works for image-to-video workflows
- [ ] Generation history still persists across sessions
