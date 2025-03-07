import React, { useState, useEffect } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  getTodosByRange,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todo";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaBell, FaCalendarAlt } from "react-icons/fa";

import enUS from "date-fns/locale/en-US";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(),
    type: "assignment",
    course: "",
    reminderSet: true,
  });

  // Fetch events for the visible date range
  const fetchEvents = async (start, end) => {
    try {
      const todos = await getTodosByRange(start, end);
      const formattedEvents = todos.map((todo) => ({
        id: todo._id,
        title: todo.title,
        start: new Date(todo.due),
        end: new Date(todo.due),
        description: todo.description,
        type: todo.type,
        course: todo.course,
        completed: todo.completed,
        reminderSet: todo.reminderSet,
        allDay: true,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    const end = new Date();
    end.setMonth(end.getMonth() + 2);
    fetchEvents(start, end);
  }, []);

  const handleSelectSlot = ({ start }) => {
    setNewEvent((prev) => ({
      ...prev,
      start,
      end: start,
    }));
    setShowEventForm(true);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description || "",
      start: event.start,
      end: event.end,
      type: event.type,
      course: event.course || "",
      reminderSet: event.reminderSet,
    });
    setShowEventForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedEvent) {
        await updateTodo(selectedEvent.id, {
          title: newEvent.title,
          description: newEvent.description,
          due: newEvent.start,
          type: newEvent.type,
          course: newEvent.course,
          reminderSet: newEvent.reminderSet,
        });
        toast.success("Event updated successfully");
      } else {
        await createTodo({
          title: newEvent.title,
          description: newEvent.description,
          due: newEvent.start,
          type: newEvent.type,
          course: newEvent.course,
          reminderSet: newEvent.reminderSet,
        });
        toast.success("Event created successfully");
      }

      // Refresh events
      fetchEvents(new Date(), new Date());
      setShowEventForm(false);
      setNewEvent({
        title: "",
        description: "",
        start: new Date(),
        end: new Date(),
        type: "assignment",
        course: "",
        reminderSet: true,
      });
      setSelectedEvent(null);
    } catch (error) {
      toast.error(
        selectedEvent ? "Failed to update event" : "Failed to create event"
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      await deleteTodo(selectedEvent.id);
      toast.success("Event deleted successfully");
      fetchEvents(new Date(), new Date());
      setShowEventForm(false);
      setSelectedEvent(null);
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3182ce";
    let textColor = "#ffffff";

    switch (event.type) {
      case "exam":
        backgroundColor = "#e53e3e";
        break;
      case "project":
        backgroundColor = "#805ad5";
        break;
      case "reading":
        backgroundColor = "#38a169";
        break;
      default:
        backgroundColor = "#3182ce";
    }

    return {
      style: {
        backgroundColor,
        color: textColor,
        borderRadius: "5px",
        opacity: event.completed ? 0.6 : 1,
        border: "none",
        display: "block",
      },
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FaCalendarAlt />
            Calendar & Reminders
          </h1>
          <button
            onClick={() => {
              setSelectedEvent(null);
              setNewEvent({
                title: "",
                description: "",
                start: new Date(),
                end: new Date(),
                type: "assignment",
                course: "",
                reminderSet: true,
              });
              setShowEventForm(true);
            }}
            className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Event
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                eventPropGetter={eventStyleGetter}
                views={["month", "week", "day"]}
                className="rounded-lg overflow-hidden"
              />
            </div>
          </div>

          {showEventForm && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {selectedEvent ? "Edit Event" : "Add New Event"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="datetime-local"
                      value={format(newEvent.start, "yyyy-MM-dd'T'HH:mm")}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          start: new Date(e.target.value),
                          end: new Date(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select
                      value={newEvent.type}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="assignment">Assignment</option>
                      <option value="exam">Exam</option>
                      <option value="project">Project</option>
                      <option value="reading">Reading</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course (Optional)
                    </label>
                    <input
                      type="text"
                      value={newEvent.course}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, course: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="reminder"
                      checked={newEvent.reminderSet}
                      onChange={(e) =>
                        setNewEvent({
                          ...newEvent,
                          reminderSet: e.target.checked,
                        })
                      }
                      className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="reminder"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Set Reminder
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3">
                    {selectedEvent && (
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowEventForm(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors flex items-center"
                    >
                      {selectedEvent ? (
                        <FaEdit className="mr-2" />
                      ) : (
                        <FaPlus className="mr-2" />
                      )}
                      {selectedEvent ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
