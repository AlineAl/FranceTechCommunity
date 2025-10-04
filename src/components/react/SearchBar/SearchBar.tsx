import React from "react";
import { LuCalendar, LuList } from "react-icons/lu";

interface ISearchBar {
  cities: string[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showEventsButton?: boolean;
  onEventsClick?: () => void;
  eventsButtonText?: string;
  className?: string;
}

export const SearchBar = ({
  cities,
  selectedCity,
  onCityChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Rechercher...",
  showEventsButton = true,
  onEventsClick,
  eventsButtonText = "Voir les événements",
  className = "",
}: ISearchBar) => {
  const handleSelectCity = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCityChange(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleEventsClick = () => {
    if (onEventsClick) {
      onEventsClick();
    } else {
      window.location.href = "/events";
    }
  };

  return (
    <section
      role="form"
      className={`flex justify-between items-center flex-wrap md:flex-nowrap ${className}`}
    >
      <form className="flex items-center flex-wrap md:flex-nowrap w-full md:w-auto">
        <select
          id="city_select"
          className="border border-[#DEDEDE] text-[#6D6D6D] rounded-lg text-sm h-12 md:mr-4 p-2.5 pr-12 outline-none w-full md:w-56 mb-2 md:mb-0"
          style={{
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 10px center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1rem",
          }}
          onChange={handleSelectCity}
          value={selectedCity}
        >
          <option value="Toutes les villes">Toutes les villes</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder={searchPlaceholder}
          className="border border-[#DEDEDE] placeholder-[#6D6D6D] italic rounded-lg h-12 p-2.5 text-sm outline-none w-full md:w-56"
          onChange={handleSearchChange}
          value={searchValue}
        />
      </form>

      {showEventsButton && (
        <button
          type="button"
          className="flex items-center justify-center cursor-pointer py-3.5 px-5.5 h-12 text-sm bg-[#4C40CF] text-white rounded-lg whitespace-nowrap"
          onClick={handleEventsClick}
        >
          {eventsButtonText === "Voir les événements" ? (
            <LuCalendar size={20} className="mr-2" />
          ) : (
            <LuList size={20} className="mr-2" />
          )}
          <span>{eventsButtonText}</span>
        </button>
      )}
    </section>
  );
};
