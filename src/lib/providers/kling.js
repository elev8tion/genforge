/**
 * GenForge — Kling AI Provider
 * Direct integration with Kling's official API.
 *
 * Auth: Bearer token (new API Key format — simpler than legacy JWT)
 * Base: https://api.klingai.com
 * Pattern: POST to create task → GET to poll task → extract video/image URL
 *
 * Docs: https://app.klingai.com/global/dev/document-api
 *
 * NOTE: If you have legacy Access Key + Secret credentials, you'll need
 * to generate a JWT token. The new API Key format (sk-...) is recommended
 * and works with a simple Bearer header.
 */

import { BaseProvider } from './base.js';

export class KlingProvider extends BaseProvider {
    constructor() {
        super('kling', 'Kling AI');
        this.baseUrl = 'https://api.klingai.com';
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
        const jobType = this.resolveJobType(params);
        const url = `${this.baseUrl}${jobType.endpoint}`;
        const payload = jobType.buildPayload(params);

        console.log(`[GenForge:kling] POST ${url}`);
        console.log(`[GenForge:kling] Payload:`, payload);

        const response = await fetch(url, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Kling API error ${response.status}: ${errText.slice(0, 200)}`);
        }

        const data = await response.json();
        const taskData = data.data || data;
        const jobId = taskData.task_id || taskData.taskId || data.task_id;

        if (!jobId) {
            console.warn('[GenForge:kling] No task_id in response:', data);
            throw new Error('Kling API did not return a task ID');
        }

        return {
            jobId,
            meta: { pollEndpoint: jobType.pollEndpoint || jobType.endpoint },
        };
    }

    // ── Poll Job ────────────────────────────────────────────────────────

    async pollJob(jobId, meta = {}) {
        // Kling uses the same endpoint path with the task_id appended
        const pollBase = meta.pollEndpoint || '/v1/videos/text2video';
        const url = `${this.baseUrl}${pollBase}/${jobId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            const errText = await response.text();
            if (response.status >= 500) {
                return { status: 'processing' }; // Retry on server errors
            }
            throw new Error(`Kling poll error ${response.status}: ${errText.slice(0, 200)}`);
        }

        const data = await response.json();
        const task = data.data || data;

        const rawStatus = task.task_status || task.state || task.status;
        const status = this.normalizeStatus(rawStatus);

        // Extract output URL — Kling nests results in task_result
        let outputUrl = null;
        if (status === 'completed') {
            outputUrl =
                task.task_result?.videos?.[0]?.url ||
                task.task_result?.images?.[0]?.url ||
                task.video?.url ||
                task.output?.url ||
                task.url;
        }

        return {
            status,
            url: outputUrl,
            error: task.task_status_msg || task.failMsg || task.fail_msg,
            raw: task,
        };
    }

    // ── Upload File ─────────────────────────────────────────────────────

    async uploadFile(file) {
        // Kling accepts image URLs or base64 in the payload.
        // Convert file to base64 data URL for inline use.
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsDataURL(file);
        });
    }

    // ── Job Type Resolution ─────────────────────────────────────────────

    resolveJobType(params) {
        const hasImage = !!(params.image_url || params.images_list?.length);
        const isVideo = params._mediaType === 'video' || params.duration;
        const isImageGen = params._mediaType === 'image' && !isVideo;

        if (isVideo && hasImage) {
            return {
                endpoint: '/v1/videos/image2video',
                pollEndpoint: '/v1/videos/image2video',
                buildPayload: (p) => ({
                    model_name: p.model_name || 'kling-v3',
                    image: p.image_url || p.images_list?.[0],
                    prompt: p.prompt || '',
                    negative_prompt: p.negative_prompt || '',
                    duration: String(p.duration || 5),
                    aspect_ratio: p.aspect_ratio || '16:9',
                    mode: p.mode || 'standard',
                    cfg_scale: p.cfg_scale || 0.5,
                    ...(p.resolution && { resolution: p.resolution }),
                }),
            };
        }

        if (isVideo) {
            return {
                endpoint: '/v1/videos/text2video',
                pollEndpoint: '/v1/videos/text2video',
                buildPayload: (p) => ({
                    model_name: p.model_name || 'kling-v3',
                    prompt: p.prompt,
                    negative_prompt: p.negative_prompt || '',
                    duration: String(p.duration || 5),
                    aspect_ratio: p.aspect_ratio || '16:9',
                    mode: p.mode || 'standard',
                    cfg_scale: p.cfg_scale || 0.5,
                    ...(p.resolution && { resolution: p.resolution }),
                }),
            };
        }

        // Image generation
        return {
            endpoint: '/v1/images/generations',
            pollEndpoint: '/v1/images/generations',
            buildPayload: (p) => ({
                model_name: p.model_name || 'kolors-v1',
                prompt: p.prompt,
                negative_prompt: p.negative_prompt || '',
                image_count: p.image_count || 1,
                aspect_ratio: p.aspect_ratio || '1:1',
                ...(p.resolution && { resolution: p.resolution }),
                ...(p.image_url && { image: p.image_url }),
            }),
        };
    }

    // ── Status Normalization (Kling-specific) ────────────────────────────

    normalizeStatus(rawStatus) {
        const s = (rawStatus || '').toLowerCase();
        const map = {
            'succeed': 'completed',
            'completed': 'completed',
            'success': 'completed',
            'failed': 'failed',
            'error': 'failed',
            'cancelled': 'failed',
            'processing': 'processing',
            'submitted': 'processing',
            'queued': 'processing',
            'starting': 'processing',
            'pending': 'processing',
        };
        return map[s] || 'processing';
    }
}
