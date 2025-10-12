import { useMemo, useState } from "react";
import { LuCalendar, LuSquareArrowOutUpRight } from "react-icons/lu";
import { EventCard } from "./Card/EventCard";

interface ICommunity {
  community: {
    id: string;
    image: string;
    name: string;
    description: string;
    link: string;
    cityName: string;
    platform: string;
    organizers: Array<{
      id: string;
      name: string;
      bio: string;
      image: string;
    }>;
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
  };
}

const convertDateToISO = (dateStr: string): string | null => {
  if (!dateStr) return null;

  if (dateStr.includes("T") || dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    return dateStr;
  }

  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return null;
};

export const Community = ({ community }: ICommunity) => {
  const [showAllPastEvents, setShowAllPastEvents] = useState(false);

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
      .sort(
        (a, b) =>
          new Date(a.isoDate!).getTime() - new Date(b.isoDate!).getTime(),
      );
  }, [community.events]);

  const { futureEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const future = sortedEvents.filter(
      (event) => new Date(event.isoDate!) > now,
    );
    const past = sortedEvents
      .filter((event) => new Date(event.isoDate!) <= now)
      .reverse();

    return { futureEvents: future, pastEvents: past };
  }, [sortedEvents]);

  const displayedPastEvents = showAllPastEvents
    ? pastEvents
    : pastEvents.slice(0, 3);

  return (
    <>
      <section
        role="contentinfo"
        className="md:mx-28 mx-4 my-8 md:flex justify-between"
      >
        <section className="md:w-[48%]" role="complementary">
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

          <p className="text-sm leading-5.5 mb-3">{community.description}</p>

          <button
            onClick={() => window.open(community.link, "_blank")}
            className="flex items-center mt-8 md:mt-0 justify-center cursor-pointer py-3.5 px-5.5 h-12 text-sm bg-[#4C40CF] text-white rounded-lg whitespace-nowrap hover:bg-[#3d32a8] transition-colors"
          >
            Rejoindre la communauté
            <LuSquareArrowOutUpRight size={15} className="ml-2" />
          </button>

          {community.organizers && community.organizers.length > 0 && (
            <section className="border-t mt-8 pt-7 border-[#F0F0F0]">
              <h3 className="uppercase text-sm">organisateurices</h3>
              {community.organizers.map((organizer) => (
                <aside key={organizer.id} className="flex items-center mt-4">
                  <img
                    src={organizer.image}
                    alt={`photo de ${organizer.name}`}
                    className="w-21.5 h-21.5 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="text-sm font-bold leading-5.5">
                      {organizer.name}
                    </h4>
                    <p className="text-sm leading-5.5">{organizer.bio}</p>
                  </div>
                </aside>
              ))}
            </section>
          )}
        </section>

        <section role="listitem" className="md:w-[48%] md:mt-0 mt-8">
          <div className="mb-8">
            <div className="md:flex items-center justify-between mb-4">
              <h3 className="uppercase text-sm">événements à venir</h3>
              <button
                type="button"
                className="flex items-center justify-center cursor-pointer py-3.5 px-5.5 mt-4 md:mt-0 text-sm bg-[#4C40CF] text-white rounded-lg whitespace-nowrap"
                onClick={() => window.location.href = "/events"}
              >
                <LuCalendar size={20} className="mr-2" />
                <span>Voir sur le calendrier</span>
              </button>
            </div>
            
            {futureEvents.length > 0 ? (
              <div className="space-y-4">
                {futureEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.isoDate!}
                    city={community.cityName}
                    link={event.link}
                    showLabel={false}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 border border-[#DEDEDE] rounded-[10px] bg-[#F9F9F9]">
                <p className="text-sm text-gray-500 text-center">
                  Aucun événement à venir.
                </p>
              </div>
            )}
          </div>

          {pastEvents.length > 0 && (
            <div>
              <h3 className="uppercase text-sm mb-4">événements passés</h3>
              <div className="space-y-4">
                {displayedPastEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.isoDate!}
                    city={community.cityName}
                    link={event.link}
                    showLabel={false}
                  />
                ))}
              </div>

              {pastEvents.length > 3 && (
                <button
                  onClick={() => setShowAllPastEvents(!showAllPastEvents)}
                  className="my-4 cursor-pointer border border-[#4C40CF] font-bold py-3.5 px-5.5 h-12 text-sm text-[#4C40CF] rounded-lg hover:bg-[#4C40CF] hover:text-white transition-colors"
                >
                  <span>
                    {showAllPastEvents
                      ? "Voir moins d'événements"
                      : "Voir tous les événements passés"}
                  </span>
                </button>
              )}
            </div>
          )}
        </section>
      </section>
    </>
  );
};
