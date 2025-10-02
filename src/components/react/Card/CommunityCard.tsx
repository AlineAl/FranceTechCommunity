import { useMemo } from "react";
import { LuCalendar, LuMapPin, LuSquareArrowOutUpRight, LuExternalLink } from "react-icons/lu";

interface ICardCommunity {
    community: {
        id: string;
        image: string;
        name: string;
        description: string;
        link: string;
        tags: Array<{
            id: string;
            name: string;
        }>;
        events: Array<{
            id: string;
            title: string;
            date: string;
            dateTime: string;
            description: string;
            link: string;
        }>;
        city: string;
    };
}

export const CommunityCard = ({ community }: ICardCommunity) => {
    const sortedEvents = useMemo(() => {
        return [...community.events].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    }, [community.events]);

    const futureEvents = useMemo(() => {
        return sortedEvents.filter(event => new Date(event.dateTime) > new Date());
    }, [sortedEvents]);

    const firstFutureEvent = futureEvents[0];

    const formatDate = (dateString: string) => {
        return Intl.DateTimeFormat("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(dateString));
    };

    return (
        <li
            role="listitem"
            className="md:flex justify-between items-start border-b border-b-[#F0F0F0] py-6 gap-6"
        >
            <div className="mb-6 md:mb-0 flex-1">
                <div className="flex items-start gap-4 mb-4">
                    <img
                        src={community.image}
                        alt={`Logo de ${community.name}`}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                        <h3 className="font-bold text-2xl mb-2">{community.name}</h3>
                        <p className="text-sm text-[#6D6D6D] leading-relaxed mb-3">
                            {community.description}
                        </p>

                        {community.tags.length > 0 &&
                            <div className="flex flex-wrap gap-2 mb-3">
                                {community.tags.map(tag => (
                                    <span
                                        key={tag.id}
                                        className="px-2 py-1 bg-[#4C40CF]/10 text-[#4C40CF] text-xs rounded-full"
                                    >
                                        # {tag.name}
                                    </span>
                                ))}
                            </div>
                        }

                        <a
                            href={community.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center text-sm text-[#4C40CF] underline"
                        >
                            <span>En savoir plus sur la communauté</span>
                            <LuExternalLink size={14} className="ml-1" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="md:w-96 flex-shrink-0">
                {firstFutureEvent ? (
                    <div>
                        <span className="uppercase text-sm text-[#6D6D6D] font-medium">Prochain événement</span>
                        <div className="p-6 mt-2 border border-[#DEDEDE] rounded-[10px] shadow-sm bg-white">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm leading-5 mb-2">{firstFutureEvent.title}</h4>

                                    <p className="text-xs text-[#6D6D6D] mb-3 leading-relaxed">
                                        {firstFutureEvent.description}
                                    </p>

                                    <div className="flex text-sm text-[#4B4B4B] mb-2">
                                        <LuCalendar size={15} color="#4C40CF" />
                                        <div className="flex items-center gap-2 ml-2">
                                            <span className="leading-5">
                                                {formatDate(firstFutureEvent.dateTime)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex text-[#4B4B4B] text-sm">
                                        <LuMapPin size={15} color="#4C40CF" />
                                        <span className="ml-2">{community.city}</span>
                                    </div>
                                </div>
                            </div>

                            <a
                                href={firstFutureEvent.link}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-4 text-sm underline flex justify-end items-center text-[#4C40CF] hover:text-[#3A2FA7]"
                            >
                                <span>Voir l'événement</span>
                                <LuSquareArrowOutUpRight size={15} className="ml-2" />
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 border border-[#DEDEDE] rounded-[10px] bg-[#F9F9F9]">
                        <p className="text-sm text-gray-500 text-center">Aucun événement à venir.</p>
                    </div>
                )}
            </div>
        </li>
    );
};
