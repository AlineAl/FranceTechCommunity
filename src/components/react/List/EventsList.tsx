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

    const events = [
        {
            title: 'Meeting',
            start: new Date()
        }
    ]

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
            <div className="m-8 mt-0">
                <style>
                    {`
                        .fc-day-today {
                            background-color: #e9e8fd !important;
                        }
                        .fc-event {
                            border-radius: 8px !important;
                        }
                        .fc-event-title {
                            border-radius: 6px !important;
                            padding: 2px 6px !important;
                        }
                    `}
                </style>
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    locale={frLocale}
                    dayHeaderFormat={{ weekday: 'long' }}
                    firstDay={1}
                    events={events}
                    eventBackgroundColor="#e9e8fd"
                    eventTextColor="#6c62d9"
                    eventBorderColor="#6c62d9"
                />
            </div>
        </>
    );
};
