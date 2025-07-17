import React from "react";
import { LuCalendar } from "react-icons/lu";

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
                              className = ""
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
            <form className="m-8 flex items-center flex-wrap md:flex-nowrap w-full md:w-auto">
                <select
                    id="city_select"
                    className="border border-[#DEDEDE] text-[#6D6D6D] rounded-lg text-sm h-12 md:mr-4 p-2.5 outline-none w-full md:w-56 mb-2 md:mb-0"
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
                    className="border border-[#DEDEDE] placeholder-[#6D6D6D] rounded-lg h-12 p-2.5 text-sm outline-none w-full md:w-56"
                    onChange={handleSearchChange}
                    value={searchValue}
                />
            </form>

            {showEventsButton && (
                <button
                    type="button"
                    className="flex items-center justify-center cursor-pointer mt-0 md:mt-8 m-8 p-2.5 h-12 text-sm bg-[#4C40CF] text-white rounded-lg whitespace-nowrap"
                    onClick={handleEventsClick}
                >
                    <LuCalendar size={20} className="mr-2" />
                    <span className="mt-1">{eventsButtonText}</span>
                </button>
            )}
        </section>
    );
};
