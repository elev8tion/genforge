/**
 * GenForge — Fal.ai Provider
 * Integration with Fal's serverless AI inference platform.
 *
 * Auth: `Authorization: Key <api_key>`
 * Base: https://queue.fal.run (queue/async) or https://fal.run (sync)
 * Pattern: POST to queue endpoint → get request_id + status/result URLs → poll status → fetch result
 *
 * Fal hosts Kling, Veo, Wan, Seedance, Flux, and 600+ other models.
 * Each model has an endpoint ID like "fal-ai/kling-video/v3/pro/text-to-video".
 *
 * Docs: https://fal.ai/docs
 */

import { BaseProvider } from './base.js';

export class FalProvider extends BaseProvider {
    constructor() {
        super('fal', 'Fal.ai');
        this.queueUrl = 'https://queue.fal.run';
        this.runUrl = 'https://fal.run';
    }

    // ── Auth Header ─────────────────────────────────────────────────────

    getHeaders() {
        return {
            'Authorization': `Key ${this.getKey()}`,
            'Content-Type': 'application/json',
        };
    }

    // ── Submit Job ──────────────────────────────────────────────────────

    async submitJob(params) {
        // The model's `endpoint` field should contain the full fal endpoint ID
        // e.g., "fal-ai/kling-video/v3/pro/text-to-video"
        const endpointId = params.endpoint || params.model;
        const url = `${this.queueUrl}/${endpointId}`;

        const payload = this.buildPayload(params);

        console.log(`[GenForge:fal] POST ${url}`);
        console.log(`[GenForge:fal] Payload:`, payload);

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Fal API error ${response.status}: ${errText.slice(0, 200)}`);
        }

        const data = await response.json();
        const requestId = data.request_id;

        if (!requestId) {
            console.warn('[GenForge:fal] No request_id in response:', data);
            throw new Error('Fal API did not return a request_id');
        }

        return {
            jobId: requestId,
            meta: {
                endpointId,
                statusUrl: data.status_url || `${this.queueUrl}/${endpointId}/requests/${requestId}/status`,
                resultUrl: data.response_url || `${this.queueUrl}/${endpointId}/requests/${requestId}`,
                cancelUrl: data.cancel_url || `${this.queueUrl}/${endpointId}/requests/${requestId}/cancel`,
            },
        };
    }

    // ── Poll Job ────────────────────────────────────────────────────────

    async pollJob(jobId, meta = {}) {
        // Use the status URL from submitJob meta
        const statusUrl = meta.statusUrl;
        if (!statusUrl) {
            throw new Error('Fal polling requires statusUrl from submitJob meta');
        }

        const response = await fetch(statusUrl, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            if (response.status >= 500) return { status: 'processing' };
            const errText = await response.text();
            throw new Error(`Fal poll error ${response.status}: ${errText.slice(0, 200)}`);
        }

        const data = await response.json();
        const status = this.normalizeStatus(data.status);

        // If completed, fetch the full result from the result URL
        if (status === 'completed' && meta.resultUrl) {
            try {
                const resultResp = await fetch(meta.resultUrl, {
                    headers: this.getHeaders(),
                });

                if (resultResp.ok) {
                    const result = await resultResp.json();
                    const outputUrl = this.extractOutputUrl(result);
                    return {
                        status: 'completed',
                        url: outputUrl,
                        raw: result,
                    };
                }
            } catch (err) {
                console.warn('[GenForge:fal] Result fetch failed, using status data:', err.message);
            }
        }

        return {
            status,
            url: null,
            error: data.error,
        };
    }

    // ── Upload File ─────────────────────────────────────────────────────

    async uploadFile(file) {
        const key = this.getKey();

        // Fal supports direct file uploads via their upload endpoint
        const initiateResp = await fetch('https://fal.run/fal-ai/file-upload/initiate', {
            method: 'POST',
            headers: {
                'Authorization': `Key ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content_type: file.type,
                file_name: file.name,
            }),
        });

        if (!initiateResp.ok) {
            // Fallback: convert to base64 data URL
            console.warn('[GenForge:fal] File upload initiation failed, falling back to base64');
            return this.fileToDataUrl(file);
        }

        const { upload_url, file_url } = await initiateResp.json();

        // Upload the actual file
        const uploadResp = await fetch(upload_url, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
        });

        if (!uploadResp.ok) {
            return this.fileToDataUrl(file);
        }

        return file_url;
    }

    // ── Payload Builder ─────────────────────────────────────────────────

    buildPayload(params) {
        const payload = {};

        if (params.prompt) payload.prompt = params.prompt;
        if (params.negative_prompt) payload.negative_prompt = params.negative_prompt;

        // Image inputs — Fal uses image_url (not start_image_url for most endpoints)
        if (params.image_url) payload.image_url = params.image_url;
        if (params.images_list?.length) {
            payload.image_url = params.images_list[0];
            if (params.images_list[1]) {
                payload.end_image_url = params.images_list[1];
            }
        }

        // Video params
        if (params.duration) payload.duration = String(params.duration);
        if (params.aspect_ratio) payload.aspect_ratio = params.aspect_ratio;
        if (params.resolution) payload.resolution = params.resolution;

        // Image size presets (used by Flux Pro, Seedream, and other image models)
        if (params.image_size) payload.image_size = params.image_size;

        // Style (Ideogram and similar)
        if (params.style) payload.style = params.style;

        // Audio generation toggle
        if (params.generate_audio !== undefined) {
            payload.generate_audio = params.generate_audio;
        }

        // Mode/quality
        if (params.mode) payload.mode = params.mode;
        if (params.quality) payload.quality = params.quality;

        // Audio inputs (for lipsync/avatar)
        if (params.audio_url) payload.audio_url = params.audio_url;

        // Video input (for lipsync models that take video_url)
        if (params.video_url) payload.video_url = params.video_url;

        // Seed
        if (params.seed && params.seed !== -1) payload.seed = params.seed;

        return payload;
    }

    // ── Output URL Extraction ───────────────────────────────────────────

    extractOutputUrl(result) {
        // Fal nests output differently per model type
        return (
            result.video?.url ||
            result.images?.[0]?.url ||
            result.image?.url ||
            result.audio?.url ||
            result.output?.url ||
            result.url ||
            null
        );
    }

    // ── Status Normalization (Fal-specific) ──────────────────────────────

    normalizeStatus(rawStatus) {
        const s = (rawStatus || '').toUpperCase();
        const map = {
            'COMPLETED': 'completed',
            'OK': 'completed',
            'FAILED': 'failed',
            'IN_PROGRESS': 'processing',
            'IN_QUEUE': 'processing',
            'QUEUED': 'processing',
            'PENDING': 'processing',
        };
        return map[s] || 'processing';
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsDataURL(file);
        });
    }
}
