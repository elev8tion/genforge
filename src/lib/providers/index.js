/**
 * GenForge — Providers Index
 * Barrel export for the provider system.
 *
 * UI components should import from here or from router.js.
 */

export { BaseProvider } from './base.js';
export { KlingProvider } from './kling.js';
export { FalProvider } from './fal.js';
export { EachLabsProvider } from './eachlabs.js';

export {
    generateImage,
    generateVideo,
    generateI2I,
    generateI2V,
    processV2V,
    processLipSync,
    uploadFile,
    getProviderStatus,
    getConnectedProviders,
    hasAnyProvider,
    getProviderByName,
    getAllProviders,
    getDimensionsFromAR,
} from './router.js';
