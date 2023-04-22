import { z, defineCollection } from 'astro:content';

const recipesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    type: z.string(),
    ingredients: z.array(z.object({
      step: z.string().optional(),
      list: z.string().array(),
    })),
    directions: z.array(z.object({
      step: z.string().optional(),
      list: z.string().array()
    })),
  }),
});

export const collections = {
  'recipes': recipesCollection,
};