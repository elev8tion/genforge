/**
 * GenForge — Model Registry
 * Trimmed from the original 10,601-line models.js to only include models
 * available on your three providers: Kling (direct), Fal.ai, and EachLabs.
 *
 * Each model entry now has a `provider` field used by the router
 * to dispatch to the correct API adapter.
 *
 * TO ADD A NEW MODEL:
 * 1. Add an entry to the appropriate array below
 * 2. Set `provider` to 'kling', 'fal', or 'eachlabs'
 * 3. Set `endpoint` to the provider's endpoint/slug for that model
 * 4. Define `inputs` for the UI controls
 *
 * The UI auto-generates controls from the `inputs` schema.
 */

// ═══════════════════════════════════════════════════════════════════════
// TEXT-TO-IMAGE MODELS
// ═══════════════════════════════════════════════════════════════════════

export const t2iModels = [
    {
        id: 'kling-image-v3',
        name: 'Kling Image 3.0 (Direct)',
        provider: 'kling',
        model_name: 'kling-image-v3',
        endpoint: 'v1/images/generations',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9'],
                default: '1:1',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['1k', '2k'],
                default: '1k',
            },
        },
    },
    {
        id: 'kling-image-v3-omni',
        name: 'Kling Image 3.0 Omni (Direct)',
        provider: 'kling',
        model_name: 'kling-image-v3-omni',
        endpoint: 'v1/images/generations',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9'],
                default: '1:1',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['1k', '2k', '4k'],
                default: '2k',
            },
        },
    },
    {
        id: 'kling-image-o1',
        name: 'Kling Image O1 (Direct)',
        provider: 'kling',
        model_name: 'kling-image-o1',
        endpoint: 'v1/images/generations',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9'],
                default: '1:1',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['1k', '2k'],
                default: '1k',
            },
        },
    },
    {
        id: 'kling-image-v2-1',
        name: 'Kling Image 2.1 (Direct)',
        provider: 'kling',
        model_name: 'kling-image-v2-1',
        endpoint: 'v1/images/generations',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4', '3:2', '2:3', '21:9'],
                default: '1:1',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['1k', '2k'],
                default: '1k',
            },
        },
    },
    {
        id: 'kling-kolors',
        name: 'Kolors (Kling Direct)',
        provider: 'kling',
        model_name: 'kolors-v1',
        endpoint: 'v1/images/generations',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['1:1', '3:4', '4:3', '9:16', '16:9'],
                default: '1:1',
            },
        },
    },
    {
        id: 'flux-dev-fal',
        name: 'Flux Dev (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/flux/dev',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['1:1', '3:4', '4:3', '9:16', '16:9', '21:9'],
                default: '1:1',
            },
        },
    },
    {
        id: 'flux-schnell-fal',
        name: 'Flux Schnell (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/flux/schnell',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['1:1', '3:4', '4:3', '9:16', '16:9'],
                default: '1:1',
            },
        },
    },
    {
        id: 'nano-banana-fal',
        name: 'Nano Banana (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/nano-banana',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['21:9', '16:9', '3:2', '4:3', '1:1', '4:5', '3:4', '9:16'],
                default: '1:1',
            },
        },
    },
    {
        id: 'nano-banana-2-fal',
        name: 'Nano Banana 2 (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/nano-banana-2',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['21:9', '16:9', '3:2', '4:3', '1:1', '4:5', '3:4', '9:16'],
                default: '1:1',
            },
        },
    },
    {
        id: 'ideogram-v2-fal',
        name: 'Ideogram v2 (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/ideogram/v2',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '4:3', '3:4', '1:1', '3:2', '2:3'],
                default: '1:1',
            },
            style: {
                type: 'string', title: 'Style',
                enum: ['auto', 'general', 'realistic', 'design', 'render_3D', 'anime'],
                default: 'auto',
            },
        },
    },
    {
        id: 'flux-2-pro-fal',
        name: 'Flux 2 Pro (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/flux-2-pro',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            image_size: {
                type: 'string', title: 'Image Size',
                enum: ['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9'],
                default: 'landscape_16_9',
            },
        },
    },
    {
        id: 'flux-lora-fal',
        name: 'Flux LoRA (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/flux-lora',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            image_size: {
                type: 'string', title: 'Image Size',
                enum: ['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9'],
                default: 'landscape_16_9',
            },
        },
    },
    {
        id: 'seedream-v4-fal',
        name: 'Seedream v4 (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/bytedance/seedream/v4/text-to-image',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            image_size: {
                type: 'string', title: 'Image Size',
                enum: ['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9'],
                default: 'landscape_16_9',
            },
        },
    },
    {
        id: 'seedream-v45-fal',
        name: 'Seedream v4.5 (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/bytedance/seedream/v4.5/text-to-image',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            image_size: {
                type: 'string', title: 'Image Size',
                enum: ['square_hd', 'square', 'portrait_4_3', 'portrait_16_9', 'landscape_4_3', 'landscape_16_9'],
                default: 'landscape_16_9',
            },
        },
    },
    {
        id: 'nano-banana-eachlabs',
        name: 'Nano Banana Pro (EachLabs)',
        provider: 'eachlabs',
        endpoint: 'nano-banana-pro',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['1:1', '3:4', '4:3', '9:16', '16:9', '3:2', '2:3'],
                default: '1:1',
            },
        },
    },
    {
        id: 'flux-pro-eachlabs',
        name: 'Flux 1.1 Pro (EachLabs)',
        provider: 'eachlabs',
        endpoint: 'flux-1-1-pro',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['1:1', '16:9', '9:16', '4:3', '3:4'],
                default: '1:1',
            },
        },
    },
];

// ═══════════════════════════════════════════════════════════════════════
// TEXT-TO-VIDEO MODELS
// ═══════════════════════════════════════════════════════════════════════

export const t2vModels = [
    {
        id: 'kling-v3-t2v',
        name: 'Kling 3.0 T2V (Direct)',
        provider: 'kling',
        model_name: 'kling-v3',
        endpoint: 'v1/videos/text2video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10', '15'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4'],
                default: '16:9',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p', '4k'],
                default: '1080p',
            },
            mode: {
                type: 'string', title: 'Mode',
                enum: ['standard', 'pro'],
                default: 'standard',
            },
        },
    },
    {
        id: 'kling-3.0-turbo-t2v',
        name: 'Kling 3.0 Turbo T2V (Direct)',
        provider: 'kling',
        model_name: 'kling-3.0-turbo',
        endpoint: 'v1/videos/text2video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10', '15'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4'],
                default: '16:9',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-v3-omni-t2v',
        name: 'Kling 3.0 Omni T2V (Direct)',
        provider: 'kling',
        model_name: 'kling-v3-omni',
        endpoint: 'v1/videos/text2video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10', '15'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4'],
                default: '16:9',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p', '4k'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-video-o1-t2v',
        name: 'Kling O1 T2V (Direct)',
        provider: 'kling',
        model_name: 'kling-video-o1',
        endpoint: 'v1/videos/text2video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4'],
                default: '16:9',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-v2-6-t2v',
        name: 'Kling 2.6 T2V (Direct)',
        provider: 'kling',
        model_name: 'kling-v2-6',
        endpoint: 'v1/videos/text2video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4'],
                default: '16:9',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-v2-5-turbo-t2v',
        name: 'Kling 2.5 Turbo T2V (Direct)',
        provider: 'kling',
        model_name: 'kling-v2-5-turbo',
        endpoint: 'v1/videos/text2video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4'],
                default: '16:9',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-v3-t2v-fal',
        name: 'Kling 3.0 T2V Pro (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/v3/pro/text-to-video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1'],
                default: '16:9',
            },
        },
    },
    {
        id: 'kling-o3-t2v-fal',
        name: 'Kling O3 T2V (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/o3/standard/text-to-video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1'],
                default: '16:9',
            },
        },
    },
    {
        id: 'kling-v3-t2v-eachlabs',
        name: 'Kling 3.0 T2V (EachLabs)',
        provider: 'eachlabs',
        endpoint: 'kling-v3-text-to-video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1'],
                default: '16:9',
            },
        },
    },
    {
        id: 'wan-t2v-fal',
        name: 'Wan 2.1 T2V (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/wan/v2.1/text-to-video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5'],
                default: '5',
            },
        },
    },
    {
        id: 'kling-o3-pro-t2v-fal',
        name: 'Kling O3 Pro T2V (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/o3/pro/text-to-video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10', '15'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1'],
                default: '16:9',
            },
        },
    },
    {
        id: 'kling-v2-master-t2v-fal',
        name: 'Kling V2 Master T2V (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/v2/master/text-to-video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1'],
                default: '16:9',
            },
        },
    },
    {
        id: 'seedance-2-t2v-fal',
        name: 'Seedance 2.0 T2V (Fal)',
        provider: 'fal',
        endpoint: 'bytedance/seedance-2.0/text-to-video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10', '15'],
                default: '5',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'],
                default: '16:9',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['480p', '720p'],
                default: '720p',
            },
        },
    },
    {
        id: 'sora-2-t2v-fal',
        name: 'Sora 2 T2V (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/sora-2/text-to-video',
        inputs: {
            prompt: { type: 'string', title: 'Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['4', '8', '12', '16', '20'],
                default: '8',
            },
            aspect_ratio: {
                type: 'string', title: 'Aspect Ratio',
                enum: ['16:9', '9:16'],
                default: '16:9',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
];

// ═══════════════════════════════════════════════════════════════════════
// IMAGE-TO-VIDEO MODELS
// ═══════════════════════════════════════════════════════════════════════

export const i2vModels = [
    {
        id: 'kling-v3-i2v',
        name: 'Kling 3.0 I2V (Direct)',
        provider: 'kling',
        model_name: 'kling-v3',
        endpoint: 'v1/videos/image2video',
        imageField: 'image',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10', '15'],
                default: '5',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p', '4k'],
                default: '1080p',
            },
            mode: {
                type: 'string', title: 'Mode',
                enum: ['standard', 'pro'],
                default: 'standard',
            },
        },
    },
    {
        id: 'kling-3.0-turbo-i2v',
        name: 'Kling 3.0 Turbo I2V (Direct)',
        provider: 'kling',
        model_name: 'kling-3.0-turbo',
        endpoint: 'v1/videos/image2video',
        imageField: 'image',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10', '15'],
                default: '5',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-v3-omni-i2v',
        name: 'Kling 3.0 Omni I2V (Direct)',
        provider: 'kling',
        model_name: 'kling-v3-omni',
        endpoint: 'v1/videos/image2video',
        imageField: 'image',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10', '15'],
                default: '5',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p', '4k'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-video-o1-i2v',
        name: 'Kling O1 I2V (Direct)',
        provider: 'kling',
        model_name: 'kling-video-o1',
        endpoint: 'v1/videos/image2video',
        imageField: 'image',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10'],
                default: '5',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-v2-6-i2v',
        name: 'Kling 2.6 I2V (Direct)',
        provider: 'kling',
        model_name: 'kling-v2-6',
        endpoint: 'v1/videos/image2video',
        imageField: 'image',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10'],
                default: '5',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-v2-5-turbo-i2v',
        name: 'Kling 2.5 Turbo I2V (Direct)',
        provider: 'kling',
        model_name: 'kling-v2-5-turbo',
        endpoint: 'v1/videos/image2video',
        imageField: 'image',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['720p', '1080p'],
                default: '1080p',
            },
        },
    },
    {
        id: 'kling-v3-i2v-fal',
        name: 'Kling 3.0 I2V Pro (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/v3/pro/image-to-video',
        imageField: 'image_url',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
        },
    },
    {
        id: 'kling-o3-i2v-fal',
        name: 'Kling O3 I2V (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/o3/standard/image-to-video',
        imageField: 'image_url',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
        },
    },
    {
        id: 'kling-o3-pro-i2v-fal',
        name: 'Kling O3 Pro I2V (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/o3/pro/image-to-video',
        imageField: 'image_url',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['3', '5', '10', '15'],
                default: '5',
            },
        },
    },
    {
        id: 'kling-v2-master-i2v-fal',
        name: 'Kling V2 Master I2V (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/v2/master/image-to-video',
        imageField: 'image_url',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
        },
    },
    {
        id: 'seedance-2-i2v-fal',
        name: 'Seedance 2.0 I2V (Fal)',
        provider: 'fal',
        endpoint: 'bytedance/seedance-2.0/image-to-video',
        imageField: 'image_url',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10', '15'],
                default: '5',
            },
            resolution: {
                type: 'string', title: 'Resolution',
                enum: ['480p', '720p'],
                default: '720p',
            },
        },
    },
    {
        id: 'kling-v3-i2v-eachlabs',
        name: 'Kling 3.0 I2V (EachLabs)',
        provider: 'eachlabs',
        endpoint: 'kling-v3-image-to-video',
        imageField: 'image_url',
        inputs: {
            prompt: { type: 'string', title: 'Motion Prompt' },
            duration: {
                type: 'string', title: 'Duration',
                enum: ['5', '10'],
                default: '5',
            },
        },
    },
];

// ═══════════════════════════════════════════════════════════════════════
// IMAGE-TO-IMAGE MODELS
// ═══════════════════════════════════════════════════════════════════════

export const i2iModels = [
    {
        id: 'nano-banana-edit-eachlabs',
        name: 'Nano Banana Pro Edit (EachLabs)',
        provider: 'eachlabs',
        endpoint: 'nano-banana-pro-edit',
        imageField: 'image_url',
        inputs: {
            prompt: { type: 'string', title: 'Edit Prompt' },
            strength: {
                type: 'number', title: 'Strength',
                default: 0.6, minValue: 0, maxValue: 1, step: 0.05,
            },
        },
    },
];

// ═══════════════════════════════════════════════════════════════════════
// VIDEO-TO-VIDEO MODELS
// ═══════════════════════════════════════════════════════════════════════

export const v2vModels = [
    // Add V2V models here as needed (motion transfer, style transfer, etc.)
];

// ═══════════════════════════════════════════════════════════════════════
// LIP SYNC MODELS
// ═══════════════════════════════════════════════════════════════════════

export const lipsyncModels = [
    {
        id: 'kling-avatar-v2-fal',
        name: 'Kling Avatar v2 (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/ai-avatar/v2/pro',
        inputs: {
            prompt: { type: 'string', title: 'Speech Prompt' },
        },
    },
    {
        id: 'kling-lipsync-audio-fal',
        name: 'Kling LipSync (Fal)',
        provider: 'fal',
        endpoint: 'fal-ai/kling-video/lipsync/audio-to-video',
        videoField: 'video_url',
        audioField: 'audio_url',
        inputs: {
            prompt: { type: 'string', title: 'Optional Context' },
        },
    },
];

// ═══════════════════════════════════════════════════════════════════════
// LOOKUP FUNCTIONS (used by the router)
// ═══════════════════════════════════════════════════════════════════════

export function getModelById(id) {
    return t2iModels.find(m => m.id === id) || null;
}

export function getVideoModelById(id) {
    return t2vModels.find(m => m.id === id) || null;
}

export function getI2IModelById(id) {
    return i2iModels.find(m => m.id === id) || null;
}

export function getI2VModelById(id) {
    return i2vModels.find(m => m.id === id) || null;
}

export function getV2VModelById(id) {
    return v2vModels.find(m => m.id === id) || null;
}

export function getLipSyncModelById(id) {
    return lipsyncModels.find(m => m.id === id) || null;
}

/**
 * Universal lookup across all model types.
 */
export function findModel(id) {
    return getModelById(id)
        || getVideoModelById(id)
        || getI2IModelById(id)
        || getI2VModelById(id)
        || getV2VModelById(id)
        || getLipSyncModelById(id)
        || null;
}

/**
 * Get all models for a specific provider.
 */
export function getModelsByProvider(providerName) {
    const all = [...t2iModels, ...t2vModels, ...i2vModels, ...i2iModels, ...v2vModels, ...lipsyncModels];
    return all.filter(m => m.provider === providerName);
}

// ═══════════════════════════════════════════════════════════════════════
// COMPATIBILITY SHIMS — derive UI control options from model inputs schema
// ═══════════════════════════════════════════════════════════════════════

export function getAspectRatiosForModel(id) {
    return getModelById(id)?.inputs?.aspect_ratio?.enum || [];
}
export function getImageSizesForModel(id) {
    return getModelById(id)?.inputs?.image_size?.enum || [];
}
export function getResolutionsForModel(id) {
    return getModelById(id)?.inputs?.resolution?.enum || [];
}
export function getQualityFieldForModel(id) {
    return getModelById(id)?.inputs?.quality?.enum || [];
}
export function getAspectRatiosForI2IModel(id) {
    return getI2IModelById(id)?.inputs?.aspect_ratio?.enum || [];
}
export function getResolutionsForI2IModel(id) {
    return getI2IModelById(id)?.inputs?.resolution?.enum || [];
}
export function getQualityFieldForI2IModel(id) {
    return getI2IModelById(id)?.inputs?.quality?.enum || [];
}
export function getMaxImagesForI2IModel(id) {
    return getI2IModelById(id)?.maxImages || 1;
}
export function getAspectRatiosForVideoModel(id) {
    return getVideoModelById(id)?.inputs?.aspect_ratio?.enum || [];
}
export function getDurationsForModel(id) {
    return (getVideoModelById(id) || getI2VModelById(id))?.inputs?.duration?.enum || [];
}
export function getResolutionsForVideoModel(id) {
    return getVideoModelById(id)?.inputs?.resolution?.enum || [];
}
export function getAspectRatiosForI2VModel(id) {
    return getI2VModelById(id)?.inputs?.aspect_ratio?.enum || [];
}
export function getDurationsForI2VModel(id) {
    return getI2VModelById(id)?.inputs?.duration?.enum || [];
}
export function getResolutionsForI2VModel(id) {
    return getI2VModelById(id)?.inputs?.resolution?.enum || [];
}
export function getModesForModel(id) {
    return (getVideoModelById(id) || getI2VModelById(id))?.inputs?.mode?.enum || [];
}
export function getResolutionsForLipSyncModel(id) {
    return getLipSyncModelById(id)?.inputs?.resolution?.enum || [];
}

// LipSync UI expects separate image vs video model lists
export const imageLipSyncModels = lipsyncModels.filter(m => m.imageField === 'image_url' || !m.videoField);
export const videoLipSyncModels = lipsyncModels.filter(m => m.videoField || m.audioField);

/**
 * Get all models, optionally filtered to only connected providers.
 */
export function getAllModels(connectedOnly = false) {
    const all = [...t2iModels, ...t2vModels, ...i2vModels, ...i2iModels, ...v2vModels, ...lipsyncModels];
    if (!connectedOnly) return all;

    // Only return models whose provider has a key set
    return all.filter(m => {
        const key = localStorage.getItem(`genforge_key_${m.provider}`);
        return !!key;
    });
}
