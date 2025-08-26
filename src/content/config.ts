import { defineCollection, z } from "astro:content";
import { communityLoader } from "../loaders/CommunityLoader.ts";

const tagSchema = z.object({
    id: z.string(),
    name: z.string()
});

const eventSchema = z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    dateTime: z.string(),
    description: z.string(),
    link: z.string().url()
});

const communitySchema = z.object({
    id: z.string(),
    image: z.string().url(),
    name: z.string(),
    description: z.string(),
    link: z.string().url(),
    tags: z.array(tagSchema),
    events: z.array(eventSchema)
});

const citySchema = z.object({
    id: z.string(),
    city: z.string(),
    communities: z.array(communitySchema)
});

const communities = defineCollection({
    loader: communityLoader(),
    schema: citySchema
});

export const collections = { communities };
