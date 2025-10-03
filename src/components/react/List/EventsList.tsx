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
            backgroundColor: 'transparent',
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
            <div className="text-xs leading-tight w-full">
                <div className="font-medium truncate text-center">
                    {eventInfo.event.extendedProps.communityName}
                </div>
            </div>
        );
    };

    return (
        <section role="list" className="mx-28 mt-8">
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

            <span className="text-sm text-[#6D6D6D] italic mt-8 block">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
            </span>

            <div className="my-8">
                <style>
                    {`
                        .fc-day-today {
                            background-color: #E9E8FD !important;
                        }
                        .fc-day-today .fc-daygrid-day-number {
                            color: #4C40CF !important;
                            font-weight: 600 !important;
                        }
                        .fc-event {
                            border-radius: 10px !important;
                            cursor: pointer !important;
                            font-size: 12px !important;
                            padding: 0px 12px !important;
                            height: 24px !important;
                            transition: all 0.2s ease !important;
                            background-color: #E9E8FD !important;
                            color: #4C40CF !important;
                            overflow: hidden !important;
                        }
                        .fc-event:hover {
                            transform: translateY(-1px) !important;
                            background-color: #4C40CF !important;
                            color: #ffffff !important;
                            box-shadow: 0 2px 4px rgba(76, 64, 207, 0.2) !important;
                        }
                        .fc-event:active {
                            background-color: #E9E8FD !important;
                            color: #4C40CF !important;
                            transform: translateY(0px) !important;
                        }
                        .fc-event-title {
                            padding: 1px 2px !important;
                            font-weight: 500 !important;
                            white-space: nowrap !important;
                            overflow: hidden !important;
                            text-overflow: ellipsis !important;
                            text-align: center !important;
                        }
                        .fc-event-main {
                            overflow: hidden !important;
                        }
                        .fc-toolbar-title {
                            color: #1f2937 !important;
                            font-size: 1.25rem !important;
                            font-weight: 600 !important;
                            text-transform: capitalize !important;
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
                        .fc-daygrid-day-top {
                            display: block !important;
                            padding: 4px !important;
                        }
                        .fc-daygrid-event {
                            margin: 2px 4px !important;
                            border-radius: 8px !important;
                        }
                        .fc-daygrid-day-number {
                            color: #374151 !important;
                            font-weight: 500 !important;
                        }
                        .fc-col-header-cell {
                            background-color: transparent !important;
                            border: none !important;
                            border-bottom: 1px solid #e5e7eb !important;
                        }
                        .fc-col-header-cell-cushion {
                            text-transform: capitalize !important;
                            font-weight: 600 !important;
                            font-size: 14px !important;
                            text-align: left !important;
                            padding-left: 8px !important;
                        }
                        .fc-scrollgrid-sync-inner {
                            text-align: left !important;
                        }
                        .fc-daygrid-day {
                            border-color: #e5e7eb !important;
                        }
                        .fc-scrollgrid {
                            border-color: #e5e7eb !important;
                        }
                        .fc-daygrid-more-link {
                            color: #4C40CF !important;
                            background-color: #E9E8FD !important;
                            font-size: 12px !important;
                            padding: 0px 12px !important;
                            height: 24px !important;
                            display: flex !important;
                            align-items: center !important;
                            justify-content: center !important;
                            text-align: center !important;
                            border-radius: 10px !important;
                            cursor: pointer !important;
                        }
                        .fc-daygrid-day-frame {
                            min-height: 100px !important;
                        }
                        .fc-daygrid-event-harness {
                            margin: 1px 0 !important;
                        }
                    `}
                </style>

                {filteredEvents.length > 0 ? (
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        locale={frLocale}
                        titleFormat={{ month: 'long' }}
                        dayHeaderFormat={{ weekday: 'long' }}
                        firstDay={1}
                        events={events}
                        eventContent={renderEventContent}
                        height="auto"
                        dayMaxEvents={2}
                        moreLinkClick="popover"
                        moreLinkText={(num) => `+ ${num} événement${num > 1 ? 's' : ''}`}
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
        </section>
    );
};
