import * as z from 'zod';

export const storySchema = z.object({
    content: z.string()
        .min(1, 'Story content is required')
        .max(280, 'Story content cannot exceed 280 characters'),
});

export type StoryFormValues = z.infer<typeof storySchema>; 