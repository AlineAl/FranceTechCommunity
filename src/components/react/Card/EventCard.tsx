import { LuCalendar, LuMapPin, LuSquareArrowOutUpRight } from "react-icons/lu";

interface IEventCard {
  title: string;
  description: string;
  date: string;
  city: string;
  link: string;
  label?: string;
  showLabel?: boolean;
}

const formatDate = (dateString: string) => {
  return Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
};

export const EventCard = ({
  title,
  description,
  date,
  city,
  link,
  label = "Prochain événement",
  showLabel = true,
}: IEventCard) => {
  return (
    <div>
      {showLabel && (
        <span className="uppercase text-sm text-[#6D6D6D] font-medium">
          {label}
        </span>
      )}
      <div className="p-6 mt-2 border border-[#DEDEDE] rounded-[10px] shadow-sm bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm leading-5 mb-2">{title}</h4>

            <p className="text-xs text-[#6D6D6D] mb-3 leading-relaxed">
              {description}
            </p>

            <div className="flex text-sm text-[#4B4B4B] mb-2">
              <LuCalendar size={15} color="#4C40CF" />
              <div className="flex items-center gap-2 ml-2">
                <span className="leading-5">{formatDate(date)}</span>
              </div>
            </div>

            <div className="flex text-[#4B4B4B] text-sm">
              <LuMapPin size={15} color="#4C40CF" />
              <span className="ml-2">{city}</span>
            </div>
          </div>
        </div>

        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 text-sm underline flex justify-end items-center text-[#4C40CF] hover:text-[#3A2FA7]"
        >
          <span>Voir l'événement</span>
          <LuSquareArrowOutUpRight size={15} className="ml-2" />
        </a>
      </div>
    </div>
  );
};
