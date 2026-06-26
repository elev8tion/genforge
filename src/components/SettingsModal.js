/**
 * GenForge — Settings Modal
 * Multi-provider API key management.
 * Replaces the single Muapi key field with per-provider sections.
 *
 * Supports: Kling AI, Fal.ai, EachLabs
 * Keys stored in localStorage as genforge_key_{provider}
 */

import { PROVIDERS, getKey, setKey, maskKey, getAllConnectionStatus } from '../lib/providerKeys.js';

export function SettingsModal(onClose) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed; inset: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex; align-items: center; justify-content: center;
        z-index: 100;
        backdrop-filter: blur(4px);
    `;

    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #111;
        border-radius: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        width: min(92vw, 28rem);
        max-height: 85vh;
        display: flex; flex-direction: column;
        overflow: hidden;
        box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);
    `;

    // ── Header ──────────────────────────────────────────────────────────

    const header = document.createElement('div');
    header.style.cssText = `
        display: flex; align-items: center; justify-content: space-between;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        flex-shrink: 0;
    `;
    header.innerHTML = `
        <div>
            <h2 style="font-size:1rem;font-weight:800;color:#fff;margin:0;">GenForge Settings</h2>
            <p style="font-size:0.65rem;color:rgba(255,255,255,0.35);margin:0.25rem 0 0;">API Keys — Bring Your Own</p>
        </div>
        <button id="settings-close-btn" style="color:rgba(255,255,255,0.4);background:none;border:none;cursor:pointer;padding:4px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
    `;
    modal.appendChild(header);

    // ── Body ────────────────────────────────────────────────────────────

    const body = document.createElement('div');
    body.style.cssText = 'flex:1;overflow-y:auto;padding:1.25rem 1.5rem;';

    const providerEntries = Object.values(PROVIDERS);
    const inputs = {};

    providerEntries.forEach((prov, idx) => {
        const currentKey = getKey(prov.name);
        const isConnected = !!currentKey;

        const section = document.createElement('div');
        section.style.cssText = `
            ${idx > 0 ? 'margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.06);' : ''}
        `;

        // Provider header with status badge
        const statusColor = isConnected ? '#22c55e' : 'rgba(255,255,255,0.2)';
        const statusText = isConnected ? 'Connected' : 'No key set';

        section.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
                <label style="font-size:0.8rem;color:#fff;font-weight:700;">${prov.displayName}</label>
                <span style="font-size:0.6rem;color:${statusColor};font-weight:600;display:flex;align-items:center;gap:4px;">
                    <span style="width:6px;height:6px;border-radius:50%;background:${statusColor};display:inline-block;"></span>
                    ${statusText}
                </span>
            </div>
            <input
                id="genforge-key-${prov.name}"
                type="password"
                style="
                    width:100%; box-sizing:border-box;
                    background:rgba(255,255,255,0.04);
                    border:1px solid rgba(255,255,255,0.1);
                    border-radius:0.6rem;
                    padding:0.55rem 0.75rem;
                    color:#fff; font-size:0.8rem; font-family:monospace;
                    outline:none;
                    transition: border-color 0.15s;
                "
                placeholder="${prov.placeholder}"
                value="${currentKey}"
            >
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:0.35rem;">
                <a href="${prov.helpUrl}" target="_blank" rel="noopener"
                   style="font-size:0.6rem;color:rgba(255,255,255,0.3);text-decoration:none;">
                    ${prov.helpText} ↗
                </a>
                ${currentKey ? `
                    <button class="genforge-clear-key" data-provider="${prov.name}"
                        style="font-size:0.6rem;color:#ef4444;background:none;border:none;cursor:pointer;padding:0;">
                        Clear
                    </button>
                ` : ''}
            </div>
        `;

        body.appendChild(section);

        // Store input reference
        inputs[prov.name] = section.querySelector(`#genforge-key-${prov.name}`);

        // Focus styling
        const input = inputs[prov.name];
        input.addEventListener('focus', () => { input.style.borderColor = 'rgba(34,211,238,0.5)'; });
        input.addEventListener('blur', () => { input.style.borderColor = 'rgba(255,255,255,0.1)'; });
    });

    modal.appendChild(body);

    // ── Footer ──────────────────────────────────────────────────────────

    const footer = document.createElement('div');
    footer.style.cssText = `
        padding: 1rem 1.5rem;
        border-top: 1px solid rgba(255,255,255,0.06);
        display: flex; justify-content: flex-end; gap: 0.5rem;
        flex-shrink: 0;
    `;
    footer.innerHTML = `
        <button id="settings-cancel-btn" style="
            padding:0.5rem 1rem; border-radius:0.5rem;
            background:none; border:1px solid rgba(255,255,255,0.1);
            color:rgba(255,255,255,0.6); font-size:0.75rem; font-weight:700;
            cursor:pointer;
        ">Cancel</button>
        <button id="settings-save-btn" style="
            padding:0.5rem 1.25rem; border-radius:0.5rem;
            background:var(--color-primary, #22d3ee); color:#000;
            font-size:0.75rem; font-weight:700;
            cursor:pointer; border:none;
        ">Save All</button>
    `;
    modal.appendChild(footer);

    // ── Event Handlers ──────────────────────────────────────────────────

    const close = () => {
        if (document.body.contains(overlay)) document.body.removeChild(overlay);
        if (onClose) onClose();
    };

    // Save all keys
    footer.querySelector('#settings-save-btn').onclick = () => {
        let saved = 0;
        Object.entries(inputs).forEach(([provName, input]) => {
            const val = input.value.trim();
            setKey(provName, val);
            if (val) saved++;
        });

        if (saved > 0) {
            close();
        } else {
            // Show a gentle warning but still close
            close();
        }
    };

    footer.querySelector('#settings-cancel-btn').onclick = close;
    header.querySelector('#settings-close-btn').onclick = close;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

    // Clear key buttons
    body.querySelectorAll('.genforge-clear-key').forEach(btn => {
        btn.onclick = (e) => {
            const provName = e.target.dataset.provider;
            if (inputs[provName]) {
                inputs[provName].value = '';
            }
        };
    });

    overlay.appendChild(modal);
    return overlay;
}
