/**
 * GenForge — Provider Key Management
 * Centralized API key storage, validation, and migration utilities.
 *
 * Keys are stored in localStorage under `genforge_key_{provider}`.
 * This module provides helpers for the Settings UI and boot-time checks.
 */

// ── Key Storage ─────────────────────────────────────────────────────────

const KEY_PREFIX = 'genforge_key_';

export const PROVIDERS = {
    kling: {
        name: 'kling',
        displayName: 'Kling AI',
        placeholder: 'sk-kling-...',
        helpUrl: 'https://app.klingai.com/global/dev',
        helpText: 'Get your API key from the Kling developer console',
        validatePrefix: null, // Kling keys vary in format
    },
    fal: {
        name: 'fal',
        displayName: 'Fal.ai',
        placeholder: 'fal-...',
        helpUrl: 'https://fal.ai/dashboard/keys',
        helpText: 'Get your API key from the Fal.ai dashboard',
        validatePrefix: null,
    },
    eachlabs: {
        name: 'eachlabs',
        displayName: 'EachLabs',
        placeholder: 'each-...',
        helpUrl: 'https://console.eachlabs.ai',
        helpText: 'Get your API key from the EachLabs console',
        validatePrefix: null,
    },
};

/**
 * Get a provider's API key.
 */
export function getKey(providerName) {
    return localStorage.getItem(`${KEY_PREFIX}${providerName}`) || '';
}

/**
 * Set a provider's API key.
 */
export function setKey(providerName, key) {
    const trimmed = (key || '').trim();
    if (trimmed) {
        localStorage.setItem(`${KEY_PREFIX}${providerName}`, trimmed);
    } else {
        localStorage.removeItem(`${KEY_PREFIX}${providerName}`);
    }
}

/**
 * Remove a provider's API key.
 */
export function clearKey(providerName) {
    localStorage.removeItem(`${KEY_PREFIX}${providerName}`);
}

/**
 * Check if a provider has a key set.
 */
export function isConnected(providerName) {
    return !!localStorage.getItem(`${KEY_PREFIX}${providerName}`);
}

/**
 * Get connection status for all providers.
 */
export function getAllConnectionStatus() {
    return Object.keys(PROVIDERS).map(name => ({
        ...PROVIDERS[name],
        connected: isConnected(name),
        hasKey: !!getKey(name),
    }));
}

/**
 * Get count of connected providers.
 */
export function connectedCount() {
    return Object.keys(PROVIDERS).filter(isConnected).length;
}

/**
 * Check if any provider is connected.
 */
export function hasAnyConnection() {
    return connectedCount() > 0;
}

// ── Migration from Muapi ────────────────────────────────────────────────

/**
 * If the user had a Muapi key saved, offer to migrate it.
 * Call this once on app boot.
 */
export function checkMuapiMigration() {
    const muapiKey = localStorage.getItem('muapi_key');
    if (!muapiKey) return null;

    return {
        hasMuapiKey: true,
        key: muapiKey,
        migrate: (targetProvider) => {
            setKey(targetProvider, muapiKey);
            // Don't delete the old key yet — let the user confirm
        },
        clearOld: () => {
            localStorage.removeItem('muapi_key');
        },
    };
}

// ── Key Masking (for UI display) ────────────────────────────────────────

/**
 * Mask an API key for display: show first 8 and last 4 chars.
 */
export function maskKey(key) {
    if (!key || key.length < 16) return key ? '••••••••' : '';
    return `${key.slice(0, 8)}${'•'.repeat(key.length - 12)}${key.slice(-4)}`;
}
