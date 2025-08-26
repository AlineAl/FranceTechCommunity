import type { CollectionEntry } from "astro:content";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';
import { useMemo, useState } from "react";
import { SearchBar } from "../SearchBar/SearchBar.tsx";

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

    const allEvents = useMemo(() => {
        return filteredCities.flatMap(cityData => {
            if (!cityData.data || !cityData.data.communities) {
                return [];
            }

            return cityData.data.communities.flatMap(community => {
                if (!community.events || community.events.length === 0) {
                    return [];
                }

                return community.events
                    .filter(event => event.dateTime && event.dateTime !== null && event.dateTime !== '')
                    .map(event => ({
                        ...event,
                        city: cityData.data.city,
                        communityName: community.name,
                        communityId: community.id
                    }));
            });
        });
    }, [filteredCities]);

    const filteredEvents = useMemo(() => {
        if (!searchValue) return allEvents;

        return allEvents.filter(event =>
            event.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            event.communityName.toLowerCase().includes(searchValue.toLowerCase()) ||
            event.city.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [allEvents, searchValue]);

    const events = useMemo(() => {
        return filteredEvents.map(event => ({
            id: event.id,
            title: event.communityName,
            start: event.dateTime,
            url: event.link,
            backgroundColor: '#E9E8FD',
            textColor: '#4C40CF',
            borderColor: '#4C40CF',
            extendedProps: {
                communityName: event.communityName,
                communityId: event.communityId,
                city: event.city,
                dateFormatted: event.date,
                eventTitle: event.title
            }
        }));
    }, [filteredEvents]);

    const handleCityChange = (newCity: string) => {
        setSelectedCity(newCity);
    };

    const handleSearchChange = (newSearch: string) => {
        setSearchValue(newSearch);
    };

    const handleBackToCommunities = () => {
        window.location.href = "/";
    };

    const renderEventContent = (eventInfo: any) => {
        return (
            <div className="text-xs p-1 leading-tight">
                <div className="font-medium truncate">
                    {eventInfo.event.extendedProps.communityName}
                </div>
            </div>
        );
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
                eventsButtonText="Passer à une vue liste"
            />

            <div className="mx-8 mb-4">
                <span className="text-sm text-[#6D6D6D] italic">
                    {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
                </span>
            </div>

            <div className="m-8 mt-0">
                <style>
                    {`
                        .fc-day-today {
                            background-color: #f8fafc !important;
                        }
                        .fc-event {
                            border-radius: 50px !important;
                            cursor: pointer !important;
                            border: none !important;
                            font-size: 11px !important;
                            margin-bottom: 1px !important;
                            transition: all 0.2s ease !important;
                            background-color: #E9E8FD !important;
                            color: #4C40CF !important;
                        }
                        .fc-event:hover {
                            transform: translateY(-1px) !important;
                            background-color: #4C40CF !important;
                            color: #E9E8FD !important;
                        }
                        .fc-event:active {
                            background-color: #E9E8FD !important;
                            color: #4C40CF !important;
                            transform: translateY(0px) !important;
                        }
                        .fc-event-title {
                            padding: 1px 4px !important;
                            font-weight: 500 !important;
                        }
                        .fc-toolbar-title {
                            color: #1f2937 !important;
                            font-size: 1.25rem !important;
                            font-weight: 600 !important;
                        }
                        .fc-button-primary {
                            background-color: #6366f1 !important;
                            border-color: #6366f1 !important;
                            font-size: 14px !important;
                        }
                        .fc-button-primary:hover {
                            background-color: #4f46e5 !important;
                            border-color: #4f46e5 !important;
                        }
                        .fc-daygrid-event {
                            margin: 0 1px 1px 1px !important;
                            border-radius: 3px !important;
                        }
                        .fc-daygrid-day-number {
                            color: #374151 !important;
                            font-weight: 500 !important;
                            padding: 4px !important;
                        }
                        .fc-col-header-cell {
                            background-color: #f9fafb !important;
                            border-color: #e5e7eb !important;
                        }
                        .fc-daygrid-day {
                            border-color: #e5e7eb !important;
                        }
                        .fc-scrollgrid {
                            border-color: #e5e7eb !important;
                        }
                        .fc-daygrid-more-link {
                            color: #6366f1 !important;
                            font-size: 11px !important;
                        }
                    `}
                </style>

                {filteredEvents.length > 0 ? (
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        locale={frLocale}
                        dayHeaderFormat={{ weekday: 'long' }}
                        firstDay={1}
                        events={events}
                        eventContent={renderEventContent}
                        height="auto"
                        dayMaxEvents={3}
                        moreLinkClick="popover"
                        eventClick={(info) => {
                            if (info.event.url) {
                                window.open(info.event.url, '_blank');
                                info.jsEvent.preventDefault();
                            }
                        }}
                        eventDidMount={(info) => {
                            info.el.title = `${info.event.extendedProps.eventTitle}\n${info.event.extendedProps.communityName}\n${info.event.extendedProps.city}\n${info.event.extendedProps.dateFormatted}`;
                        }}
                    />
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-500 text-lg">
                            Aucun événement trouvé
                        </div>
                        <div className="text-gray-400 text-sm mt-2">
                            {selectedCity !== "Toutes les villes" && `pour ${selectedCity}`}
                            {searchValue && ` avec la recherche "${searchValue}"`}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
