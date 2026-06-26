# GenForge — Cleanup Checklist

Everything beyond the adapter layer drop-in that needs attention.
Organized by priority: break-things-if-skipped first, cosmetic last.

---

## 🔴 MUST FIX (will break or confuse)

### 1. AuthModal.js — Still gates on Muapi key
The app shows this modal on first launch if no `muapi_key` is in localStorage.
After migration, this blocks users from reaching the actual app.

**Fix:** Either delete `AuthModal.js` entirely and remove where it's invoked
(likely in `main.js`), or rewrite it to check `hasAnyConnection()` from
`providerKeys.js` instead. The new SettingsModal handles key entry.

```javascript
// In main.js or wherever AuthModal is triggered, FIND:
if (!localStorage.getItem('muapi_key')) {
    document.body.appendChild(AuthModal(...));
}

// REPLACE WITH:
import { hasAnyConnection } from './lib/providerKeys.js';
if (!hasAnyConnection()) {
    document.body.appendChild(SettingsModal(...));
}
```

### 2. UploadPicker.js — imports muapi directly
File uploads go through `muapi.uploadFile()`. Must swap to router.

```javascript
// FIND:
import { muapi } from '../lib/muapi.js';
// ... later:
const url = await muapi.uploadFile(file);

// REPLACE:
import { uploadFile } from '../lib/providers/router.js';
// ... later:
const url = await uploadFile(file);
```

### 3. pendingJobs.js — localStorage key collision
Uses `muapi_pending_jobs` as storage key. Jobs from the old system will
linger and could cause confusion.

```javascript
// FIND (line 1):
const PENDING_KEY = 'muapi_pending_jobs';

// REPLACE:
const PENDING_KEY = 'genforge_pending_jobs';
```

### 4. uploadHistory.js — localStorage key collision
Same issue.

```javascript
// FIND (line 1):
const STORAGE_KEY = 'muapi_uploads';

// REPLACE:
const STORAGE_KEY = 'genforge_uploads';
```

### 5. vite.config.mjs — Remove Muapi proxy
The proxy to `api.muapi.ai` is no longer needed. All providers use
direct HTTPS calls to their own domains.

```javascript
// REPLACE entire file with:
import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    server: {
        // No proxy needed — providers are called directly
    }
});
```

### 6. packages/studio/src/index.js — re-exports old muapi
Line 16 exports the old muapi client. Remove or replace.

```javascript
// FIND (line 16):
export * from './muapi';

// DELETE this line (or replace with):
export * from '../../src/lib/providers/index.js';
```

---

## 🟡 SHOULD FIX (functional but messy)

### 7. i18n.js — Muapi branding in UI strings
All English AND Chinese translations reference "Muapi" in settings and auth labels.

**Lines to update (English block):**
```
Line 55: 'settings.muapiKeyLabel' → 'settings.apiKeyLabel': 'API Keys'
Line 56: 'settings.keyPlaceholder' → 'Enter your API key...'
Line 57: 'settings.keyNote' → 'Your keys are stored locally and sent only to their respective providers.'
Line 61-67: auth.* strings → Update to reference GenForge / multi-provider setup
```

**Lines to update (Chinese block):**
```
Lines 245-257: Same translations in Chinese
```

Or just remove the auth.* strings entirely since AuthModal is being removed.

### 8. McpCliStudio.js — Muapi CLI integration
This component is specifically for the Muapi CLI tool. Not useful in GenForge.

**Fix:** Delete `src/components/McpCliStudio.js` and remove its import/tab
from wherever it's registered (likely `main.js` or `Sidebar.js`).

### 9. models.js in studio package — 10,601 lines of dead weight
`packages/studio/src/models.js` (336KB) is no longer imported after
the migration since `src/lib/models.js` has been replaced.

**Fix:** Delete it, or keep it as reference for adding more models later.
If keeping, rename to `models.REFERENCE.js` so it's clearly not active.

### 10. models_dump.json — source data for old registry
68KB JSON dump used to auto-generate the old models.js. No longer needed.

**Fix:** Delete `models_dump.json`

### 11. Next.js app directory — dual framework confusion
The repo has BOTH a Vite build (what you want) AND a Next.js `app/` directory.
The Next.js app has its own `app/api/`, `app/studio/`, `app/workflow/` routes.

For a clean GenForge setup using Vite + Electron:

**Fix:** Either delete the entire `app/` directory (if using Vite only),
or keep it if you plan to deploy as a Next.js app later. Having both is
just confusing.

### 12. Generation history localStorage key
Check if `ImageStudio.js` / `VideoStudio.js` use `muapi_history` as the
storage key for generation history.

```bash
grep -rn "muapi_history\|muapi_generation" src/components/
```

If found, rename to `genforge_history`.

---

## 🟢 NICE TO HAVE (cosmetic / optimization)

### 13. Branding sweep
```bash
# Find all remaining old branding
grep -rn "Open Generative\|open-generative\|Higgsfield\|higgsfield\|Muapi\|muapi" \
  --include="*.js" --include="*.html" --include="*.json" --include="*.css" \
  src/ index.html package.json
```

Update:
- `index.html` — title, meta tags, any hero text
- `package.json` — name, description, homepage
- `Header.js` — app title
- `README.md` — rewrite for GenForge (or delete the 36KB original)
- `Dockerfile` / `docker-compose.yml` — container names if deploying

### 14. Electron config branding
In `package.json` build config:
```json
"appId": "ai.generative.open"    → "app.genforge.studio"
"productName": "Open Generative AI" → "GenForge"
"copyright": "Copyright © 2025"    → "Copyright © 2026"
```

In `electron/main.js` — window title if set there.

### 15. Remove docs/ assets (14MB)
The `docs/` folder contains screenshots and assets from the original project.
All 14MB of it. Delete unless you want the reference images.

### 16. Remove unused public assets (3MB)
`public/assets/` has the original project's banner images and icons.
Replace with your own GenForge branding or delete.

### 17. Local inference cleanup (optional)
If you don't plan to run local models:
```
DELETE: src/lib/localInferenceClient.js
DELETE: src/lib/localModels.js
DELETE: src/components/LocalModelManager.js
DELETE: build/local-ai/
```

Also remove the local models tab from the new SettingsModal if present.

### 18. Test files
```
DELETE: tests/localInferenceAssets.test.js
DELETE: tests/localInferencePaths.test.js
DELETE: tests/localInferenceProgress.test.js
DELETE: tests/wan2gpModelAvailability.test.js
```

These test the old local inference system and will fail.

### 19. Workspace submodules
`packages/` contains git submodules:
```
packages/Open-AI-Design-Agent
packages/Open-Poe-AI
packages/Vibe-Workflow
```

These are separate repos pulled in as workspaces. If you don't need the
workflow builder or agent features, remove them from `package.json` workspaces
and delete the directories to simplify `npm install`.

### 20. scripts/ directory
```
scripts/package-linux-deb.js      — Linux packaging (keep if needed)
scripts/stage-local-ai-binary.js  — Local AI setup (delete if not using)
scripts/test_minimax_provider.js  — Muapi test script (delete)
```

---

## Claude Code cleanup prompt

Paste this into Claude Code after the migration to do all cleanup in one pass:

```
Read CLEANUP.md. Execute the following cleanup:

MUST FIX:
1. Delete src/components/AuthModal.js
2. In main.js, replace any AuthModal gate with a check using hasAnyConnection() from providerKeys.js, showing SettingsModal instead
3. In UploadPicker.js, swap muapi import to router import
4. In pendingJobs.js, rename storage key from muapi_pending_jobs to genforge_pending_jobs
5. In uploadHistory.js, rename storage key from muapi_uploads to genforge_uploads
6. In vite.config.mjs, remove the proxy config
7. In packages/studio/src/index.js, remove the muapi re-export line

SHOULD FIX:
8. In i18n.js, replace all "Muapi" references with "GenForge" in both English and Chinese blocks
9. Delete src/components/McpCliStudio.js and remove its references
10. Delete models_dump.json
11. Rename packages/studio/src/models.js to models.REFERENCE.js

BRANDING:
12. In index.html, set title to "GenForge"
13. In package.json, set name to "genforge", appId to "app.genforge.studio", productName to "GenForge"
14. In Header.js, update the app title

Then run: grep -rn "muapi\|Muapi\|MUAPI" src/ --include="*.js"
Fix any remaining references found.
```

---

## Post-cleanup verification

```bash
# Should return ZERO results:
grep -rn "muapi" src/ --include="*.js" --include="*.json"

# Should start clean:
npm run vite:dev

# Should show GenForge branding:
open http://localhost:5173
```
