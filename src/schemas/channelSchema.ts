import * as z from 'zod';

export const channelSchema = z.object({
    name: z.string().min(1, 'Channel name is required').max(50, 'Channel name must be less than 50 characters'),
    slug: z.string()
        .min(3, 'Slug must be at least 3 characters')
        .max(30, 'Slug must be less than 30 characters')
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
}); 