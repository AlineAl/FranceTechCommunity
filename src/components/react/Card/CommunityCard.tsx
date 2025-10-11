import { useMemo } from "react";
import {
  LuCalendar,
  LuMapPin,
  LuSquareArrowOutUpRight,
  LuExternalLink,
} from "react-icons/lu";

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

const convertDateToISO = (dateStr: string): string | null => {
  if (!dateStr) return null;
  
  if (dateStr.includes('T') || dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    return dateStr;
  }
  
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  return null;
};

export const CommunityCard = ({ community }: ICardCommunity) => {
  const defaultImage = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop";

  const communityImage = community.image && community.image.trim() !== "" 
    ? community.image 
    : defaultImage;

  const sortedEvents = useMemo(() => {
    return [...community.events]
      .filter((event) => {
        const dateValue = event.dateTime || event.date;
        return dateValue && dateValue !== null && dateValue !== "";
      })
      .map((event) => {
        const dateValue = event.dateTime || event.date;
        const isoDate = convertDateToISO(dateValue);
        return {
          ...event,
          isoDate,
        };
      })
      .filter((event) => event.isoDate !== null)
      .sort((a, b) => new Date(a.isoDate!).getTime() - new Date(b.isoDate!).getTime());
  }, [community.events]);

  const futureEvents = useMemo(() => {
    return sortedEvents.filter(
      (event) => new Date(event.isoDate!) > new Date(),
    );
  }, [sortedEvents]);

  const firstFutureEvent = futureEvents[0];

  const formatDate = (dateString: string) => {
    return Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  return (
    <li
      role="listitem"
      className="md:flex justify-between items-start border-b border-b-[#F0F0F0] py-6 gap-6"
    >
      <div className="mb-6 md:mb-0 flex-1">
        <div className="md:flex items-start gap-4 mb-4">
          <img
            src={communityImage}
            alt={`Logo de ${community.name}`}
            className="w-[100px] h-[100px] object-cover rounded-md flex-shrink-0"
            loading="lazy"
          />

          <div className="flex-1 mt-4 md:mt-0">
            <h3 className="font-bold text-2xl mb-2">{community.name}</h3>

            {community.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2 mb-3">
                {community.tags.map((tag) => (
                  <li
                    key={tag.id}
                    className="px-2 py-1 bg-[#4C40CF]/10 text-[#4C40CF] text-xs rounded-full"
                  >
                    # {tag.name}
                  </li>
                ))}
              </ul>
            )}

            <p className="text-sm text-[#6D6D6D] leading-relaxed mb-3">
              {community.description}
            </p>

            <a
              href={`/communities/${community.id}`}
              aria-label={`Voir les détails de la communauté ${community.name}`}
              role="link"
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
            <span className="uppercase text-sm text-[#6D6D6D] font-medium">
              Prochain événement
            </span>
            <div className="p-6 mt-2 border border-[#DEDEDE] rounded-[10px] shadow-sm bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm leading-5 mb-2">
                    {firstFutureEvent.title}
                  </h4>

                  <p className="text-xs text-[#6D6D6D] mb-3 leading-relaxed">
                    {firstFutureEvent.description}
                  </p>

                  <div className="flex text-sm text-[#4B4B4B] mb-2">
                    <LuCalendar size={15} color="#4C40CF" />
                    <div className="flex items-center gap-2 ml-2">
                      <span className="leading-5">
                        {formatDate(firstFutureEvent.isoDate!)}
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
            <p className="text-sm text-gray-500 text-center">
              Aucun événement à venir.
            </p>
          </div>
        )}
      </div>
    </li>
  );
};
