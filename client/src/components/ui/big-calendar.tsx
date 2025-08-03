import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "./button";

interface BigCalendarProps {
  onDateSelect?: (date: Date) => void;
  onTimeSelect?: (time: string) => void;
  selectedDate?: Date;
  selectedTime?: string;
}

export const BigCalendar: React.FC<BigCalendarProps> = ({
  onDateSelect,
  onTimeSelect,
  selectedDate,
  selectedTime,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"month" | "week" | "day">("month");

  // Get current month's dates
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <div className='bg-gray-900 rounded-2xl border border-gray-800 p-6'>
      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          <h3 className='text-lg font-semibold text-white'>Schedule Post</h3>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setView("month")}
              className={`px-3 py-1 text-sm ${
                view === "month"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
              neon={false}
            >
              Month
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setView("week")}
              className={`px-3 py-1 text-sm ${
                view === "week"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
              neon={false}
            >
              Week
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setView("day")}
              className={`px-3 py-1 text-sm ${
                view === "day"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
              neon={false}
            >
              Day
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigateMonth("prev")}
            className='text-gray-400 hover:text-white'
            neon={false}
          >
            <ChevronLeft size={20} />
          </Button>

          <h2 className='text-xl font-semibold text-white min-w-[200px] text-center'>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigateMonth("next")}
            className='text-gray-400 hover:text-white'
            neon={false}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className='grid grid-cols-7 gap-1'>
        {/* Week day headers */}
        {weekDays.map((day) => (
          <div
            key={day}
            className='p-3 text-center text-sm font-medium text-gray-400 border-b border-gray-800'
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date, index) => (
          <div
            key={index}
            onClick={() => handleDateClick(date)}
            className={`min-h-[80px] p-2 border border-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-800/50 ${
              isToday(date) ? "bg-blue-500/10 border-blue-500/30" : ""
            } ${isSelected(date) ? "bg-blue-500/20 border-blue-500" : ""} ${
              !isCurrentMonth(date) ? "opacity-40" : ""
            }`}
          >
            <div className='flex items-center justify-between mb-1'>
              <span
                className={`text-sm font-medium ${
                  isToday(date)
                    ? "text-blue-400"
                    : isSelected(date)
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                {date.getDate()}
              </span>
              {isToday(date) && (
                <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
              )}
            </div>

            {/* Event indicators */}
            <div className='space-y-1'>
              {/* Sample scheduled posts - you can make this dynamic */}
              {date.getDate() === 15 && (
                <div className='flex items-center gap-1 p-1 bg-green-500/20 rounded text-xs text-green-400'>
                  <Clock size={10} />
                  <span>Post at 2:30 PM</span>
                </div>
              )}
              {date.getDate() === 22 && (
                <div className='flex items-center gap-1 p-1 bg-blue-500/20 rounded text-xs text-blue-400'>
                  <Clock size={10} />
                  <span>Post at 9:00 AM</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className='mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700'>
          <h4 className='text-sm font-medium text-white mb-3'>
            Schedule for {selectedDate.toLocaleDateString()}
          </h4>
          <div className='grid grid-cols-4 gap-2'>
            {["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"].map(
              (time) => (
                <Button
                  key={time}
                  variant='ghost'
                  size='sm'
                  onClick={() => onTimeSelect?.(time)}
                  className={`text-sm ${
                    selectedTime === time
                      ? "bg-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                  neon={false}
                >
                  {time}
                </Button>
              )
            )}
          </div>
          <div className='mt-3'>
            <Button
              className='w-full bg-blue-600 hover:bg-blue-700 text-white'
              neon={false}
            >
              <CalendarIcon size={16} className='mr-2' />
              Schedule Post
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
