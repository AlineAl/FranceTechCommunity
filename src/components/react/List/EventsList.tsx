import type { CollectionEntry } from "astro:content";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { useMemo, useState } from "react";
import {SearchBar} from "../SearchBar/SearchBar.tsx";

interface IEventsListCalendar {
    communities: CollectionEntry<"communities">[];
}

export const EventsList = ({ communities }: IEventsListCalendar) => {
    const [selectedCity, setSelectedCity] = useState("Toutes les villes");
    const [searchValue, setSearchValue] = useState("");

    const allCities = useMemo(() => {
        return communities.map(cityData => cityData.data?.city).filter(Boolean) || [];
    }, [communities]);

    const filteredCities = useMemo(() => {
        return selectedCity === "Toutes les villes"
            ? communities
            : communities.filter(cityData => cityData.data?.city === selectedCity);
    }, [communities, selectedCity]);

    const handleCityChange = (newCity: string) => {
        setSelectedCity(newCity);
    };

    const handleSearchChange = (newSearch: string) => {
        setSearchValue(newSearch);
    };

    const handleBackToCommunities = () => {
        window.location.href = "/";
    };

    return (
        <>
            <SearchBar
                cities={allCities}
                selectedCity={selectedCity}
                onCityChange={handleCityChange}
                searchValue={searchValue}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Rechercher un événement"
                showEventsButton={true}
                onEventsClick={handleBackToCommunities}
                eventsButtonText="Voir les communautés"
            />
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                locale={frLocale}
                dayHeaderFormat={{ weekday: 'long' }}
                firstDay={1}
            />
        </>
    );
};
