import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import supabase from "../pages/config/supabaseClient"; 

const Calendar = () => {
  const [calendarView, setCalendarView] = useState("dayGridMonth");
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]); // State to hold events

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase.from("events").select("*");
      if (error) {
        console.error("Error fetching events:", error);
      } else {
        const formattedEvents = data.map((event) => ({
          title: event.name,
          start: event.time_starts,
          end: event.time_starts,
        }));
        setEvents(formattedEvents);
      }
    };

    fetchEvents();
  }, []);

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setCalendarView("timeGridDay");
  };

  const handleBack = () => {
    setCalendarView("dayGridMonth");
    setSelectedDate(null);
  };

  return (
    <div className="calendar">
      <h4>Calendar</h4>
      {calendarView === "timeGridDay" && (
        <button onClick={handleBack}>Back to Calendar</button>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView={calendarView}
        dateClick={handleDateClick}
        initialDate={selectedDate}
        events={events} // Display events from state
        eventContent={(arg) => (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "blue",
                borderRadius: "50%",
                marginRight: "5px",
              }}
            ></div>
            <div
              style={{
                fontSize: "small",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {arg.event.title}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Calendar;
