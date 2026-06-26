/**
 * GenForge — Provider Router
 * Central dispatcher that routes generation requests to the correct provider
 * based on the model's `provider` field in the model registry.
 *
 * The UI components call these functions instead of muapi methods.
 * This is the only file the UI needs to import for generation.
 *
 * Drop-in replacement mapping:
 *   muapi.generateImage()   → router.generateImage()
 *   muapi.generateVideo()   → router.generateVideo()
 *   muapi.generateI2I()     → router.generateI2I()
 *   muapi.generateI2V()     → router.generateI2V()
 *   muapi.processV2V()      → router.processV2V()
 *   muapi.processLipSync()  → router.processLipSync()
 *   muapi.uploadFile()      → router.uploadFile()
 */

import { KlingProvider } from './kling.js';
import { FalProvider } from './fal.js';
import { EachLabsProvider } from './eachlabs.js';

// ── Provider Registry ───────────────────────────────────────────────────

const providers = {
    kling: new KlingProvider(),
    fal: new FalProvider(),
    eachlabs: new EachLabsProvider(),
};

// ── Model → Provider Resolution ─────────────────────────────────────────

// Import model lookup functions from the model registry.
// These will be updated in the trimmed models.js to include a `provider` field.
import {
    getModelById,
    getVideoModelById,
    getI2IModelById,
    getI2VModelById,
    getV2VModelById,
    getLipSyncModelById,
} from '../models.js';

/**
 * Resolve which provider handles a given model.
 * Looks up the model in the registry and returns the matching provider instance.
 * Falls back to EachLabs if no provider is specified (widest model coverage).
 */
function getProvider(modelId, lookupFn) {
    const fns = [lookupFn, getModelById, getVideoModelById, getI2IModelById, getI2VModelById, getV2VModelById, getLipSyncModelById];

    for (const fn of fns) {
        if (!fn) continue;
        const info = fn(modelId);
        if (info?.provider && providers[info.provider]) {
            return { provider: providers[info.provider], modelInfo: info };
        }
    }

    // Default fallback
    console.warn(`[GenForge:router] No provider found for model "${modelId}", defaulting to EachLabs`);
    return { provider: providers.eachlabs, modelInfo: null };
}

// ── Public API (drop-in replacements for muapi methods) ──────────────────

/**
 * Generate an image (text-to-image).
 */
export async function generateImage(params) {
    const { provider, modelInfo } = getProvider(params.model, getModelById);
    return provider.generate({
        ...params,
        endpoint: modelInfo?.endpoint,
        model_name: modelInfo?.model_name,
        _mediaType: 'image',
    });
}

/**
 * Generate a video (text-to-video).
 */
export async function generateVideo(params) {
    const { provider, modelInfo } = getProvider(params.model, getVideoModelById);
    return provider.generate({
        ...params,
        endpoint: modelInfo?.endpoint,
        model_name: modelInfo?.model_name,
        _mediaType: 'video',
    });
}

/**
 * Generate an image from another image (image-to-image).
 */
export async function generateI2I(params) {
    const { provider, modelInfo } = getProvider(params.model, getI2IModelById);
    return provider.generate({
        ...params,
        endpoint: modelInfo?.endpoint,
        model_name: modelInfo?.model_name,
        _mediaType: 'image',
    });
}

/**
 * Generate a video from an image (image-to-video).
 */
export async function generateI2V(params) {
    const { provider, modelInfo } = getProvider(params.model, getI2VModelById);
    return provider.generate({
        ...params,
        endpoint: modelInfo?.endpoint,
        model_name: modelInfo?.model_name,
        _mediaType: 'video',
    });
}

/**
 * Process video-to-video transformation.
 */
export async function processV2V(params) {
    const { provider, modelInfo } = getProvider(params.model, getV2VModelById);
    return provider.generate({
        ...params,
        endpoint: modelInfo?.endpoint,
        model_name: modelInfo?.model_name,
        _mediaType: 'video',
    });
}

/**
 * Process lip sync generation.
 */
export async function processLipSync(params) {
    const { provider, modelInfo } = getProvider(params.model, getLipSyncModelById);
    return provider.generate({
        ...params,
        endpoint: modelInfo?.endpoint,
        model_name: modelInfo?.model_name,
        _mediaType: 'video',
    });
}

/**
 * Upload a file using the provider that matches the current context.
 * If providerName is specified, use that provider; otherwise use the first connected one.
 */
export async function uploadFile(file, providerName) {
    if (providerName && providers[providerName]) {
        return providers[providerName].uploadFile(file);
    }

    // Try connected providers in order of preference
    for (const name of ['eachlabs', 'fal', 'kling']) {
        if (providers[name].isConnected()) {
            return providers[name].uploadFile(file);
        }
    }

    throw new Error('No provider connected. Set at least one API key in Settings.');
}

// ── Provider Status / Management ─────────────────────────────────────────

/**
 * Get all providers and their connection status.
 */
export function getProviderStatus() {
    return Object.entries(providers).map(([name, provider]) => ({
        name,
        displayName: provider.displayName,
        connected: provider.isConnected(),
    }));
}

/**
 * Get only connected providers.
 */
export function getConnectedProviders() {
    return Object.entries(providers)
        .filter(([, p]) => p.isConnected())
        .map(([name, p]) => ({ name, displayName: p.displayName, provider: p }));
}

/**
 * Check if any provider is connected.
 */
export function hasAnyProvider() {
    return Object.values(providers).some(p => p.isConnected());
}

/**
 * Get a specific provider instance by name.
 */
export function getProviderByName(name) {
    return providers[name] || null;
}

/**
 * Get the full provider registry (for settings UI).
 */
export function getAllProviders() {
    return providers;
}

// ── Dimension Helper (preserved from muapi) ──────────────────────────────

export function getDimensionsFromAR(ar) {
    switch (ar) {
        case '1:1': return [1024, 1024];
        case '16:9': return [1280, 720];
        case '9:16': return [720, 1280];
        case '4:3': return [1152, 864];
        case '3:2': return [1216, 832];
        case '21:9': return [1536, 640];
        default: return [1024, 1024];
    }
}
