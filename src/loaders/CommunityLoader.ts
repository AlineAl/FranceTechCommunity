import { readFileSync } from 'fs';
import { join } from 'path';
import type { Loader } from 'astro/loaders';

interface RawCommunity {
    id: string;
    image: string;
    name: string;
    description: string;
    link: string;
    city: string;
    platform: string;
    tags: string[];
    events: Array<{
        date: string | null;
        title: string;
        link: string;
        id: string;
        organizationName: string;
    }>;
}

interface TransformedTag {
    id: string;
    name: string;
}

interface TransformedEvent {
    id: string;
    title: string;
    date: string;
    dateTime: string;
    description: string;
    link: string;
}

interface TransformedCommunity {
    id: string;
    image: string;
    name: string;
    description: string;
    link: string;
    tags: TransformedTag[];
    events: TransformedEvent[];
}

interface CityData {
    id: string;
    city: string;
    communities: TransformedCommunity[];
}

export function communityLoader(): Loader {
    return {
        name: 'community-loader',
        load: async ({ store, logger }) => {
            try {
                const filePath = join(process.cwd(), 'public/communities-events.json');
                const rawData = readFileSync(filePath, 'utf-8');
                const communities: RawCommunity[] = JSON.parse(rawData);

                const citiesMap = new Map<string, CityData>();

                communities.forEach(community => {
                    const cityName = community.city;

                    if (!citiesMap.has(cityName)) {
                        citiesMap.set(cityName, {
                            id: cityName.toLowerCase().replace(/\s+/g, '-'),
                            city: cityName,
                            communities: []
                        });
                    }

                    const transformedCommunity: TransformedCommunity = {
                        id: community.id,
                        image: community.image,
                        name: community.name,
                        description: community.description || '',
                        link: community.link,
                        tags: community.tags.map(tag => ({
                            id: tag.toLowerCase().replace(/\s+/g, '-'),
                            name: tag
                        })),
                        events: community.events.map(event => ({
                            id: event.id,
                            title: event.title,
                            date: event.date,
                            dateTime: event.date,
                            description: '',
                            link: event.link
                        }))
                    };

                    citiesMap.get(cityName)!.communities.push(transformedCommunity);
                });

                const cities = Array.from(citiesMap.values());

                for (const city of cities) {
                    store.set({
                        id: city.id,
                        data: city
                    });
                }
            } catch (error) {
                throw error;
            }
        }
    };
}
