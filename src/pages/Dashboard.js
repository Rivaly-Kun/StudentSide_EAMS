import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./config/supabaseClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import Calendar from "../components/Calendar.js";
import ReactDOM from 'react-dom';
import {QRCodeSVG} from 'qrcode.react';
import {QRCodeCanvas} from 'qrcode.react';
import "../Dashboard.css";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("Home");
  const [firstName, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [Id, setId] = useState("");
  const [pastEvents, setPastEvents] = useState([]);
  const [futureEvents, setFutureEvents] = useState([]);
  const [imageUrls, setImageUrls] = useState([]); // Store image URLs
  const [nearestEvent, setNearestEvent] = useState(null); // State for the nearest event
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      const storedFirstName = localStorage.getItem("first_name");
      const storedLastName = localStorage.getItem("last_name");
      const storedId = localStorage.getItem("id");

      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedId) setId(storedId);

      console.log("Last Name:", storedLastName);
      console.log("ID:", storedId);
    };

    const fetchFutureEvents = async () => {
      try {
        // Get the current date and add 7 days to it
        const oneWeekFromNow = new Date();
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    
        // Format the date to ISO string
        const thresholdDate = oneWeekFromNow.toISOString();
    
        // Fetch events that are at least one week from the current date
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("time_starts", thresholdDate) // Use thresholdDate to filter events
          .order("time_starts", { ascending: true });
    
        if (error) throw error;
        setFutureEvents(data || []);
      } catch (error) {
        console.error("Error fetching future events:", error.message);
      }
    };
    

    const fetchPastEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .lt("time_starts", new Date().toISOString())
          .order("time_starts", { ascending: false });

        if (error) throw error;
        setPastEvents(data || []);
      } catch (error) {
        console.error("Error fetching past events:", error.message);
      }
    };

    const fetchNearestEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .gte("time_starts", new Date().toISOString())
          .order("time_starts", { ascending: true })
          .limit(1);

        if (error) throw error;
        setNearestEvent(data?.[0] || null);
      } catch (error) {
        console.error("Error fetching nearest event:", error.message);
      }
    };

    fetchUserData();
    fetchPastEvents();
    fetchFutureEvents();
    fetchNearestEvent();
  }, []); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const imageUrl = "http://localhost:8080/VAADIN/dynamic/resource/2/f5d6a388-c751-4995-b32f-0099007f7755/Screenshot%202024-11-09%20023959.png";

  const ImageComponent = () => (
      <img src={imageUrl} alt="Dynamic Resource" />
  );
  

  
  
  
  const showSection = (section) => {
    setActiveSection(section);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Logout error:", error.message);
    } else {
      localStorage.removeItem("first_name");
      navigate("/");
    }
  };

  const handleSVGClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${firstName}_${last_name}_QR.png`; // File name
      link.click();
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="logo">EAMS</div>
        <nav>
          <ul>
            <li className={activeSection === "Home" ? "active" : ""} onClick={() => showSection("Home")}>
              {/* Icon and Home label */}
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
	<defs>
		<path id="solarHomeBold0" fill="currentColor" d="M10.75 9.5a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0" />
	</defs>
	<path fill="currentColor" d="M18.5 3H16a.5.5 0 0 0-.5.5v.059l3.5 2.8V3.5a.5.5 0 0 0-.5-.5" />
	<use href="#solarHomeBold0" fill-rule="evenodd" clip-rule="evenodd" />
	<path fill="currentColor" fill-rule="evenodd" d="m20.75 10.96l.782.626a.75.75 0 0 0 .936-1.172l-8.125-6.5a3.75 3.75 0 0 0-4.686 0l-8.125 6.5a.75.75 0 0 0 .937 1.172l.781-.626v10.29H2a.75.75 0 0 0 0 1.5h20a.75.75 0 0 0 0-1.5h-1.25zM9.25 9.5a2.75 2.75 0 1 1 5.5 0a2.75 2.75 0 0 1-5.5 0m2.8 3.75c.664 0 1.237 0 1.696.062c.492.066.963.215 1.345.597s.531.853.597 1.345c.058.43.062.96.062 1.573v4.423h-1.5V17c0-.728-.002-1.2-.048-1.546c-.044-.325-.114-.427-.172-.484s-.159-.128-.484-.172c-.347-.046-.818-.048-1.546-.048s-1.2.002-1.546.048c-.325.044-.427.115-.484.172s-.128.159-.172.484c-.046.347-.048.818-.048 1.546v4.25h-1.5v-4.3c0-.664 0-1.237.062-1.696c.066-.492.215-.963.597-1.345s.854-.531 1.345-.597c.459-.062 1.032-.062 1.697-.062z" clip-rule="evenodd" />
	<use href="#solarHomeBold0" fill-rule="evenodd" clip-rule="evenodd" />
</svg>
              Home
            </li>
            <li className={activeSection === "Events" ? "active" : ""} onClick={() => showSection("Events")}>
              {/* Icon and Event label */}
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
	<path fill="currentColor" d="M21 17V8H7v9zm0-14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V1h2v2h8V1h2v2zm-3.47 8.06l-4.44 4.44l-2.68-2.68l1.06-1.06l1.62 1.62L16.47 10zM3 21h14v2H3a2 2 0 0 1-2-2V9h2z" />
</svg>
              Event
            </li>
            <li onClick={handleLogout} className="icon-logout-icon">
              {/* Icon and Logout label */}
              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
	<path fill="currentColor" fill-rule="evenodd" d="M16.125 12a.75.75 0 0 0-.75-.75H4.402l1.961-1.68a.75.75 0 1 0-.976-1.14l-3.5 3a.75.75 0 0 0 0 1.14l3.5 3a.75.75 0 1 0 .976-1.14l-1.96-1.68h10.972a.75.75 0 0 0 .75-.75" clip-rule="evenodd" />
	<path fill="currentColor" d="M9.375 8c0 .702 0 1.053.169 1.306a1 1 0 0 0 .275.275c.253.169.604.169 1.306.169h4.25a2.25 2.25 0 0 1 0 4.5h-4.25c-.702 0-1.053 0-1.306.168a1 1 0 0 0-.275.276c-.169.253-.169.604-.169 1.306c0 2.828 0 4.243.879 5.121c.878.879 2.292.879 5.12.879h1c2.83 0 4.243 0 5.122-.879c.879-.878.879-2.293.879-5.121V8c0-2.828 0-4.243-.879-5.121S19.203 2 16.375 2h-1c-2.829 0-4.243 0-5.121.879c-.879.878-.879 2.293-.879 5.121" />
</svg>
              Logout
            </li>
          </ul>
        </nav>
      </aside>
     {/*   <img src={imageUrl} alt="Dynamic Resource" />
     Main Content */}
      <main className={`main-content ${isSidebarOpen ? "with-sidebar" : ""}`}>
        <button className="burger-icon" onClick={toggleSidebar} aria-label="Toggle Sidebar">
          {/* Burger icon */}
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1m0 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 1 1-1-1m1 5a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2z" />
        </svg>
        </button>
        <div className="header">
          <h2>Hello, {firstName +" "+ last_name}</h2>
        </div>

        {activeSection === "Home" && (
  <section className="current-event">
    {nearestEvent ? (
      <div Id="CurEventBox">
        <h3>Nearest Event: {nearestEvent.name}</h3>
        <p>{new Date(nearestEvent.time_starts).toLocaleDateString()}</p>
        <p>{nearestEvent.description}</p>

        {/* Extract the full path from the event_image string */}
        {nearestEvent.event_image && (() => {
          const match = nearestEvent.event_image.match(
            /fs:\/\/(\d+\/\d+\/\d+\/.+\.(jpg|png|webp))/
          );

          const relativePath = match ? match[1] : null;

          // Construct the full image URL
          const imageUrl = relativePath
            ? `http://localhost:3001/images/${relativePath}`
            : '';

          return relativePath ? (
            <img Id="EventImageCurrent" src={imageUrl} alt={nearestEvent.name} />
          ) : (
            <p>Image not available</p>
          );
        })()}
      </div>
    ) : (
      <p>No upcoming events</p>
    )}

    {/* Future Events */}
    <section className="future-events">
      <h3>Future Events</h3>
      <div className="future-events-row">
        {futureEvents.length > 0 ? (
          futureEvents.map((event) => {
            const match = event.event_image.match(
              /fs:\/\/(\d+\/\d+\/\d+\/.+\.(jpg|png|webp))/
            );
            const relativePath = match ? match[1] : null;
            const imageUrl = relativePath
              ? `http://localhost:3001/images/${relativePath}`
              : '';

            return (
              <div key={event.id} className="future-event">
                <h4>{event.name}</h4>
                <p>{new Date(event.time_starts).toLocaleDateString()}</p>
                <p>{event.description}</p>

                {/* Render the image */}
                {relativePath ? (
                  <img Id="EventImage" src={imageUrl} alt={event.name} />
                ) : (
                  <p>Image not available</p>
                )}
              </div>
            );
          })
        ) : (
          <p>No future events</p>
        )}
      </div>
    </section>

    {/* Past Events */}
    <section className="past-events">
      <h3>Past Events</h3>
      <div className="past-events-row">
        {pastEvents.length > 0 ? (
          pastEvents.map((event) => {
            const match = event.event_image.match(
              /fs:\/\/(\d+\/\d+\/\d+\/.+\.(jpg|png|webp))/
            );
            const relativePath = match ? match[1] : null;
            const imageUrl = relativePath
              ? `http://localhost:3001/images/${relativePath}`
              : '';

            return (
              <div key={event.id} className="past-event">
                <h4>{event.name}</h4>
                <p>{new Date(event.time_starts).toLocaleDateString()}</p>
                <p>{event.description}</p>

                {/* Render the image */}
                {relativePath ? (
                  <img Id="EventImage" src={imageUrl} alt={event.name} />
                ) : (
                  <p>Image not available</p>
                )}
              </div>
            );
          })
        ) : (
          <p>No past events</p>
        )}
      </div>
    </section>
  </section>
)}



        {activeSection === "Events" && (
          <section className="upcoming-events">
            <h3>Upcoming Events</h3>
            <div className="event-list">
              <p>Foundation Day</p>
              <p>Intramurals</p>
              <p>Graduation Ceremony</p>
            </div>
          </section>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="right-sidebar">
        
        <div className="user-info">
        <span class="view-qr-text">view qr code &rarr;</span>


   

<svg
            id="QROPENER"
            xmlns="http://www.w3.org/2000/svg"
            width="3em"
            height="3em"
            viewBox="0 0 512 512"
            onClick={handleSVGClick}
            style={{ cursor: "pointer" }}
          >
         <rect width="5em" height="5em" x="336" y="336" fill="currentColor" rx="8" ry="8" />
	<rect width="64" height="64" x="272" y="272" fill="currentColor" rx="8" ry="8" />
	<rect width="64" height="64" x="416" y="416" fill="currentColor" rx="8" ry="8" />
	<rect width="48" height="48" x="432" y="272" fill="currentColor" rx="8" ry="8" />
	<rect width="48" height="48" x="272" y="432" fill="currentColor" rx="8" ry="8" />
	<path fill="currentColor" d="M448 32H304a32 32 0 0 0-32 32v144a32 32 0 0 0 32 32h144a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32m-32 136a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8ZM208 32H64a32 32 0 0 0-32 32v144a32 32 0 0 0 32 32h144a32 32 0 0 0 32-32V64a32 32 0 0 0-32-32m-32 136a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8Zm32 104H64a32 32 0 0 0-32 32v144a32 32 0 0 0 32 32h144a32 32 0 0 0 32-32V304a32 32 0 0 0-32-32m-32 136a8 8 0 0 1-8 8h-64a8 8 0 0 1-8-8v-64a8 8 0 0 1 8-8h64a8 8 0 0 1 8 8Z" />
          </svg>

        </div>

        <div className="App">
          <Calendar />
        </div>

        <div className="event-highlight">
          <h4>Event</h4>
          <p>Event Highlight: To be announced</p>
        </div>
      </aside>
    </div>
  );
};

     
  

export default Dashboard;
