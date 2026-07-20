"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CalendarEvent {
  date: number;
  title: string;
  color: string;
}

const mockEvents: CalendarEvent[] = [
  { date: 3, title: "Sprint Planning", color: "bg-blue-500" },
  { date: 7, title: "Design Review", color: "bg-purple-500" },
  { date: 10, title: "Team Standup", color: "bg-emerald-500" },
  { date: 14, title: "Client Call", color: "bg-amber-500" },
  { date: 18, title: "Release Day", color: "bg-red-500" },
  { date: 21, title: "Retrospective", color: "bg-blue-500" },
  { date: 25, title: "Maintenance Window", color: "bg-orange-500" },
  { date: 28, title: "Town Hall", color: "bg-purple-500" },
];

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isToday = (day: number) => {
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const getEventsForDay = (day: number) => {
    return mockEvents.filter((e) => e.date === day);
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`empty-${i}`} className="h-24 md:h-28 border-t border-[hsl(var(--border))]" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const events = getEventsForDay(day);
    cells.push(
      <div
        key={day}
        className={`h-24 md:h-28 border-t border-[hsl(var(--border))] p-1.5 relative ${isToday(day) ? "bg-[hsl(var(--accent))]" : ""}`}
      >
        <span className={`text-sm font-medium inline-flex items-center justify-center h-7 w-7 rounded-full ${isToday(day) ? "gradient-primary text-white" : ""}`}>
          {day}
        </span>
        <div className="mt-1 space-y-0.5">
          {events.slice(0, 2).map((event, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <span className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${event.color}`} />
              <span className="text-[10px] truncate text-[hsl(var(--muted-foreground))]">{event.title}</span>
            </div>
          ))}
          {events.length > 2 && (
            <span className="text-[10px] text-[hsl(var(--primary))]">+{events.length - 2} more</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-[hsl(var(--muted-foreground))]">View your schedule and upcoming events</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{MONTHS[currentMonth]} {currentYear}</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setCurrentMonth(today.getMonth()); setCurrentYear(today.getFullYear()); }}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7">
            {DAYS.map((day) => (
              <div key={day} className="text-center py-2 text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase">
                {day}
              </div>
            ))}
            {cells}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockEvents.slice(0, 5).map((event, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${event.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">
                    {MONTHS[currentMonth]} {event.date}, {currentYear}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {mockEvents.length === 0 && (
        <div className="text-center py-16">
          <CalendarIcon className="h-16 w-16 mx-auto text-[hsl(var(--muted-foreground))]" />
          <p className="mt-4 text-lg font-medium">No events</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Your calendar is clear</p>
        </div>
      )}
    </div>
  );
}
