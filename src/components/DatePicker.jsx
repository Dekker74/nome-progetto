import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

export default function DatePicker({ value, onChange, label, required }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date()); // For navigation
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const containerRef = useRef(null);

    // Sync external value
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            setSelectedDate(date);
            setCurrentDate(date);
        }
    }, [value]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const months = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    const daysShort = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust for Monday start
    };

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        // Adjust for timezone offset to ensure the string is correct YYYY-MM-DD
        const offset = newDate.getTimezoneOffset();
        const adjustedDate = new Date(newDate.getTime() - (offset * 60 * 1000));

        onChange({ target: { value: adjustedDate.toISOString().split('T')[0] } });
        setSelectedDate(newDate);
        setIsOpen(false);
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
        }

        // Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateToCheck = new Date(year, month, day);
            const isSelected = selectedDate &&
                dateToCheck.getDate() === selectedDate.getDate() &&
                dateToCheck.getMonth() === selectedDate.getMonth() &&
                dateToCheck.getFullYear() === selectedDate.getFullYear();

            const isToday = new Date().toDateString() === dateToCheck.toDateString();

            days.push(
                <button
                    key={day}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all duration-200
                        ${isSelected
                            ? 'bg-emerald-500 text-white shadow-md font-bold'
                            : isToday
                                ? 'bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    {day}
                </button>
            );
        }
        return days;
    };

    const formatDateDisplay = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    return (
        <div className="relative" ref={containerRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {label}
                </label>
            )}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer flex items-center transition-all ${isOpen ? 'ring-2 ring-emerald-500 border-transparent' : 'hover:border-emerald-400'}`}
            >
                <div className="flex items-center gap-3 w-full">
                    <CalendarIcon className={`w-5 h-5 ${value ? 'text-emerald-500' : 'text-gray-400'}`} />
                    <span className={`block truncate ${value ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-400'}`}>
                        {value ? formatDateDisplay(value) : 'Seleziona data...'}
                    </span>
                </div>
                <ChevronDown className={`absolute right-3 w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Calendar */}
            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[300px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in origin-top">
                    {/* Header */}
                    <div className="bg-emerald-50 dark:bg-gray-700/50 p-3 flex justify-between items-center border-b border-emerald-100 dark:border-gray-600">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors text-emerald-700 dark:text-emerald-400">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="font-bold text-gray-800 dark:text-white text-sm capitalize">
                            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors text-emerald-700 dark:text-emerald-400">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="p-4">
                        {/* Week Days */}
                        <div className="grid grid-cols-7 mb-2">
                            {daysShort.map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    {d}
                                </div>
                            ))}
                        </div>
                        {/* Days */}
                        <div className="grid grid-cols-7 gap-1 place-items-center">
                            {renderCalendarDays()}
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden Input for Form Submission compatibility if needed */}
            <input
                type="date"
                required={required}
                value={value}
                onChange={() => { }}
                className="sr-only"
                tabIndex={-1}
            />
        </div>
    );
}
