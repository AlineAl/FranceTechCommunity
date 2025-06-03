import type { CollectionEntry } from "astro:content";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import frLocale from '@fullcalendar/core/locales/fr';

interface IEventsListCalendar {
    communities: CollectionEntry<"communities">[];
}

export const EventsList = ({ communities }: IEventsListCalendar) => {

    return (
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale={frLocale}
            dayHeaderFormat={{ weekday: 'long' }}
            firstDay={1}
        />
    );
};
