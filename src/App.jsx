import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Plus, 
  MoreVertical, 
  Trash2,
  X
} from 'lucide-react';

// --- Constants & Helper Functions ---

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate a unique ID for events
const generateId = () => Math.random().toString(36).substr(2, 9);

// Native JS Date helpers to keep it dependency-free
const getDaysInMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isToday = (date) => {
  const today = new Date();
  return isSameDay(date, today);
};

// --- Mock Data ---
const INITIAL_EVENTS = [
  {
    id: '1',
    title: 'Team Standup',
    date: new Date(), // Today
    time: '10:00 AM',
    location: 'Conference Room A',
    type: 'work'
  },
  {
    id: '2',
    title: 'Lunch with Sarah',
    date: new Date(), // Today
    time: '12:30 PM',
    location: 'Italian Bistro',
    type: 'personal'
  },
  {
    id: '3',
    title: 'Project Review',
    date: new Date(new Date().setDate(new Date().getDate() + 2)), // 2 days from now
    time: '02:00 PM',
    location: 'Zoom',
    type: 'work'
  }
];

// --- Components ---

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '', location: '', type: 'work' });

  // Navigation Logic
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Event Logic
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;

    const event = {
      id: generateId(),
      ...newEvent,
      date: selectedDate,
    };

    setEvents([...events, event]);
    setIsModalOpen(false);
    setNewEvent({ title: '', time: '', location: '', type: 'work' });
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(ev => ev.id !== id));
  };

  const selectedEvents = events.filter(ev => isSameDay(new Date(ev.date), selectedDate));

  // Calendar Grid Generation
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Padding days for previous month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 md:h-24" />);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const isSelected = isSameDay(dateToCheck, selectedDate);
    const isCurrentDate = isToday(dateToCheck);
    const dayEvents = events.filter(ev => isSameDay(new Date(ev.date), dateToCheck));

    days.push(
      <button
        key={day}
        onClick={() => handleDateClick(day)}
        className={`
          relative group flex flex-col items-center justify-start py-2 h-10 md:h-24 rounded-xl transition-all duration-200 border border-transparent
          ${isSelected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'hover:bg-gray-50 text-gray-700'}
          ${isCurrentDate && !isSelected ? 'text-indigo-600 font-bold bg-indigo-50' : ''}
        `}
      >
        <span className={`text-sm md:text-base ${isCurrentDate && !isSelected ? 'bg-indigo-100 w-7 h-7 flex items-center justify-center rounded-full' : ''}`}>
          {day}
        </span>
        
        {/* Event Dots (Desktop) */}
        <div className="hidden md:flex gap-1 mt-2">
          {dayEvents.slice(0, 3).map((ev, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : (ev.type === 'work' ? 'bg-indigo-400' : 'bg-pink-400')}`} 
            />
          ))}
        </div>
        
        {/* Event Dot (Mobile) */}
        {dayEvents.length > 0 && (
          <div className={`md:hidden absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-500'}`} />
        )}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 md:p-8 font-sans text-slate-800 flex items-center justify-center">
      <div className="max-w-7xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row h-[850px] lg:h-[700px]">
        
        {/* --- Left Side: Main Calendar --- */}
        <div className="flex-1 p-6 md:p-10 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              <p className="text-slate-500 mt-1 text-sm font-medium">
                Plan your schedule effortlessly.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={goToToday}
                className="hidden md:block px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors mr-2"
              >
                Today
              </button>
              <div className="flex bg-gray-100 rounded-full p-1">
                <button 
                  onClick={prevMonth}
                  className="p-2 hover:bg-white rounded-full shadow-sm transition-all text-slate-600 hover:text-slate-900"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextMonth}
                  className="p-2 hover:bg-white rounded-full shadow-sm transition-all text-slate-600 hover:text-slate-900"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-4">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 md:gap-4 flex-1 overflow-y-auto">
            {days}
          </div>
        </div>

        {/* --- Right Side: Sidebar / Schedule --- */}
        <div className="w-full lg:w-[400px] bg-slate-50 border-l border-slate-100 p-6 md:p-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-500" />
              {isToday(selectedDate) ? 'Today' : `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}`}
            </h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Events List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <div 
                  key={event.id} 
                  className="group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:border-indigo-100 relative"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide
                      ${event.type === 'work' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}
                    `}>
                      {event.type}
                    </span>
                    <button 
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{event.title}</h3>
                  <div className="flex flex-col gap-1.5 text-xs text-slate-500 mt-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-medium">No events scheduled</p>
                <p className="text-xs mt-1">Take a break or plan ahead!</p>
              </div>
            )}
          </div>
          
          {/* Quick Stats or Decoration at bottom of sidebar */}
          <div className="mt-6 pt-6 border-t border-slate-200">
             <div className="flex items-center justify-between text-xs text-slate-500">
               <span>Tasks remaining</span>
               <span className="font-bold text-slate-800">{selectedEvents.length}</span>
             </div>
             <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
               <div 
                 className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                 style={{ width: `${Math.min(selectedEvents.length * 20, 100)}%` }}
               />
             </div>
          </div>
        </div>
      </div>

      {/* --- Add Event Modal --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Add New Event</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Event Title</label>
                  <input 
                    type="text" 
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    placeholder="e.g. Design Review"
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Time</label>
                    <input 
                      type="time" 
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                    <select 
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                      className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium text-slate-800"
                    >
                      <option value="work">Work</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                  <input 
                    type="text" 
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    placeholder="e.g. Office / Online"
                    className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all"
                >
                  Create Event
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}