/**
 * GenForge — EachLabs Provider
 * Integration with each::labs unified AI platform.
 *
 * Auth: `Authorization: Bearer <api_key>`
 * Base: https://api.eachlabs.ai
 * Pattern: POST /v1/prediction → get predictionID → GET /v1/prediction/{id} → poll until terminal
 *
 * EachLabs provides unified access to 600+ models (Kling, Flux, Nano Banana,
 * Seedance, Hailuo, etc.) behind one API key. Model is specified by slug
 * in the request body.
 *
 * Terminal statuses: success, failed, cancelled
 * In-flight statuses: starting, processing
 *
 * Docs: https://docs.eachlabs.ai/api/overview
 * OpenAPI: https://api.eachlabs.ai/v1/docs
 */

import { BaseProvider } from './base.js';

export class EachLabsProvider extends BaseProvider {
    constructor() {
        super('eachlabs', 'EachLabs');
        this.baseUrl = 'https://api.eachlabs.ai';
    }

    // ── Auth Header ─────────────────────────────────────────────────────

    getHeaders() {
        return {
            'Authorization': `Bearer ${this.getKey()}`,
            'Content-Type': 'application/json',
        };
    }

    // ── Submit Job ──────────────────────────────────────────────────────

    async submitJob(params) {
        // EachLabs uses model slugs like "kling-v3-text-to-video", "flux-1-1-pro", etc.
        const modelSlug = params.endpoint || params.model;
        const url = `${this.baseUrl}/v1/prediction`;

        const payload = {
            model: modelSlug,
            input: this.buildInput(params),
        };

        // Optional webhook for production use
        if (params.webhook_url) {
            payload.webhook_url = params.webhook_url;
            if (params.webhook_secret) {
                payload.webhook_secret = params.webhook_secret;
            }
        }

        console.log(`[GenForge:eachlabs] POST ${url}`);
        console.log(`[GenForge:eachlabs] Model: ${modelSlug}`);
        console.log(`[GenForge:eachlabs] Input:`, payload.input);

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`EachLabs API error ${response.status}: ${errText.slice(0, 200)}`);
        }

        const data = await response.json();
        const predictionId = data.predictionID || data.prediction_id || data.id;

        if (!predictionId) {
            console.warn('[GenForge:eachlabs] No predictionID in response:', data);
            throw new Error('EachLabs API did not return a prediction ID');
        }

        return {
            jobId: predictionId,
            meta: {
                cancelUrl: `${this.baseUrl}/v1/prediction/${predictionId}/cancel`,
            },
        };
    }

    // ── Poll Job ────────────────────────────────────────────────────────

    async pollJob(jobId, meta = {}) {
        const url = `${this.baseUrl}/v1/prediction/${jobId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            if (response.status >= 500) return { status: 'processing' };
            if (response.status === 404) {
                throw new Error('Prediction not found — it may have expired');
            }
            const errText = await response.text();
            throw new Error(`EachLabs poll error ${response.status}: ${errText.slice(0, 200)}`);
        }

        const data = await response.json();
        const status = this.normalizeStatus(data.status);

        // EachLabs returns the output directly in the prediction response
        let outputUrl = null;
        if (status === 'completed') {
            outputUrl = this.extractOutputUrl(data.output);
        }

        return {
            status,
            url: outputUrl,
            error: data.error || data.logs,
            metrics: data.metrics, // { predict_time, cost }
            raw: data,
        };
    }

    // ── Cancel Job ──────────────────────────────────────────────────────

    async cancelJob(jobId) {
        const url = `${this.baseUrl}/v1/prediction/${jobId}/cancel`;

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            console.warn(`[GenForge:eachlabs] Cancel failed: ${response.status}`);
        }

        return response.ok;
    }

    // ── Upload File ─────────────────────────────────────────────────────

    async uploadFile(file) {
        const key = this.getKey();

        // Step 1: Get a presigned upload URL
        const presignResp = await fetch(`${this.baseUrl}/v1/upload/presign`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                content_type: file.type,
                file_type: this.getFileType(file),
            }),
        });

        if (!presignResp.ok) {
            console.warn('[GenForge:eachlabs] Presign failed, falling back to base64');
            return this.fileToDataUrl(file);
        }

        const presignData = await presignResp.json();

        // Step 2: Upload file bytes to the presigned URL with required headers
        const uploadHeaders = {
            'Content-Type': file.type,
            ...(presignData.required_headers || {}),
        };

        const uploadResp = await fetch(presignData.presigned_url, {
            method: 'PUT',
            headers: uploadHeaders,
            body: file,
        });

        if (!uploadResp.ok) {
            console.warn('[GenForge:eachlabs] Upload failed, falling back to base64');
            return this.fileToDataUrl(file);
        }

        // Step 3: Return the public CDN URL
        console.log(`[GenForge:eachlabs] File uploaded: ${presignData.public_url}`);
        return presignData.public_url;
    }

    // ── Input Builder ───────────────────────────────────────────────────

    buildInput(params) {
        const input = {};

        if (params.prompt) input.prompt = params.prompt;
        if (params.negative_prompt) input.negative_prompt = params.negative_prompt;

        // Image inputs
        if (params.image_url) input.image_url = params.image_url;
        if (params.images_list?.length) {
            // Some EachLabs models use image_url, others use image or images_list
            input.image_url = params.images_list[0];
        }

        // Video params
        if (params.duration) input.duration = params.duration;
        if (params.aspect_ratio) input.aspect_ratio = params.aspect_ratio;
        if (params.resolution) input.resolution = params.resolution;
        if (params.mode) input.mode = params.mode;
        if (params.quality) input.quality = params.quality;
        if (params.cfg_scale !== undefined) input.cfg_scale = params.cfg_scale;

        // Audio inputs
        if (params.audio_url) input.audio_url = params.audio_url;

        // Seed
        if (params.seed && params.seed !== -1) input.seed = params.seed;

        // Strength (for img2img)
        if (params.strength !== undefined) input.strength = params.strength;

        // Pass through any extra model-specific params
        if (params.extra) {
            Object.assign(input, params.extra);
        }

        return input;
    }

    // ── Output URL Extraction ───────────────────────────────────────────

    extractOutputUrl(output) {
        if (!output) return null;

        // EachLabs output can be:
        // - A direct URL string: "https://cdn-us.eachlabs.ai/..."
        // - An object: { url: "..." }
        // - An array: ["https://...", ...]
        // - Nested: { video_url: "..." } or { images: ["..."] }

        if (typeof output === 'string') {
            return output;
        }

        if (Array.isArray(output)) {
            return output[0]?.url || output[0] || null;
        }

        return (
            output.url ||
            output.video_url ||
            output.image_url ||
            output.audio_url ||
            output.video?.url ||
            output.images?.[0]?.url ||
            output.images?.[0] ||
            null
        );
    }

    // ── Status Normalization (EachLabs-specific) ─────────────────────────

    normalizeStatus(rawStatus) {
        const s = (rawStatus || '').toLowerCase();
        const map = {
            'success': 'completed',
            'completed': 'completed',
            'failed': 'failed',
            'error': 'failed',
            'cancelled': 'failed',
            'canceled': 'failed',
            'starting': 'processing',
            'processing': 'processing',
            'queued': 'processing',
            'pending': 'processing',
        };
        return map[s] || 'processing';
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    getFileType(file) {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (file.type.startsWith('audio/')) return 'audio';
        return 'file';
    }

    fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsDataURL(file);
        });
    }
}
