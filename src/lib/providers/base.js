/**
 * GenForge — BaseProvider
 * Abstract base class for all API provider adapters.
 * Every provider (Kling, Fal, EachLabs) extends this and implements
 * submitJob(), pollJob(), and uploadFile().
 *
 * The UI never talks to providers directly — it goes through router.js,
 * which resolves the correct provider from the model registry.
 */

export class BaseProvider {
    constructor(name, displayName) {
        this.name = name;
        this.displayName = displayName || name;
    }

    // ── Key Management ──────────────────────────────────────────────────

    getKey() {
        const key = localStorage.getItem(`genforge_key_${this.name}`);
        if (!key) throw new Error(`${this.displayName} API key not set. Go to Settings.`);
        return key;
    }

    setKey(key) {
        localStorage.setItem(`genforge_key_${this.name}`, key);
    }

    clearKey() {
        localStorage.removeItem(`genforge_key_${this.name}`);
    }

    isConnected() {
        return !!localStorage.getItem(`genforge_key_${this.name}`);
    }

    // ── Abstract Methods (each provider MUST override) ──────────────────

    /**
     * Submit a generation job.
     * @param {Object} params - Model-specific parameters (prompt, image_url, etc.)
     * @returns {Promise<{jobId: string, meta?: Object}>}
     *   jobId: The provider's job/task/prediction ID
     *   meta: Any extra data needed for polling (e.g., Fal status URLs)
     */
    async submitJob(params) {
        throw new Error(`${this.name}.submitJob() not implemented`);
    }

    /**
     * Poll a job for completion.
     * @param {string} jobId - The ID returned by submitJob
     * @param {Object} meta - Extra routing data from submitJob (optional)
     * @returns {Promise<{status: string, url?: string, error?: string}>}
     *   status: 'completed' | 'processing' | 'failed'
     *   url: The output media URL (when completed)
     *   error: Error message (when failed)
     */
    async pollJob(jobId, meta) {
        throw new Error(`${this.name}.pollJob() not implemented`);
    }

    /**
     * Upload a file and return a hosted URL.
     * @param {File} file - The file to upload
     * @returns {Promise<string>} The hosted URL
     */
    async uploadFile(file) {
        throw new Error(`${this.name}.uploadFile() not implemented`);
    }

    // ── Shared: Generate (submit + poll loop) ───────────────────────────

    /**
     * Full generation: submit, notify caller of job ID, poll until done.
     * This is the main method the UI calls through the router.
     */
    async generate(params) {
        console.log(`[GenForge:${this.name}] Starting generation...`);
        const { jobId, meta } = await this.submitJob(params);
        console.log(`[GenForge:${this.name}] Job submitted: ${jobId}`);

        if (params.onRequestId) params.onRequestId(jobId);

        const result = await this.pollUntilDone(jobId, meta, params.onProgress);
        console.log(`[GenForge:${this.name}] Generation complete:`, result.url);
        return result;
    }

    /**
     * Poll loop with timeout and configurable interval.
     * @param {string} jobId
     * @param {Object} meta - Provider-specific routing data
     * @param {Function} onProgress - Optional progress callback
     * @param {number} maxAttempts - Default 450 (~15 min at 2s intervals)
     * @param {number} interval - Milliseconds between polls (default 2000)
     */
    async pollUntilDone(jobId, meta = {}, onProgress, maxAttempts = 450, interval = 2000) {
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            await new Promise(resolve => setTimeout(resolve, interval));

            if (attempt % 10 === 0) {
                console.log(`[GenForge:${this.name}] Poll attempt ${attempt}/${maxAttempts}...`);
            }

            try {
                const result = await this.pollJob(jobId, meta);

                if (onProgress) {
                    onProgress({ attempt, maxAttempts, status: result.status });
                }

                if (result.status === 'completed') {
                    return result;
                }

                if (result.status === 'failed') {
                    throw new Error(result.error || 'Generation failed');
                }

                // Otherwise (processing, starting, queued) keep polling
            } catch (error) {
                // On final attempt, throw; otherwise log and retry
                if (attempt === maxAttempts) throw error;
                if (error.message.includes('failed') || error.message.includes('cancelled')) {
                    throw error;
                }
                console.warn(`[GenForge:${this.name}] Poll attempt ${attempt} error:`, error.message);
            }
        }

        throw new Error(`Generation timed out after ${maxAttempts} poll attempts.`);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    /**
     * Normalize varied status strings to our three standard statuses.
     * Override in subclass if the provider uses unusual status values.
     */
    normalizeStatus(rawStatus) {
        const s = (rawStatus || '').toLowerCase();
        const completed = ['completed', 'succeeded', 'success', 'succeed', 'done'];
        const failed = ['failed', 'error', 'cancelled', 'canceled'];

        if (completed.includes(s)) return 'completed';
        if (failed.includes(s)) return 'failed';
        return 'processing';
    }
}
