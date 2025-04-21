
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ja } from "date-fns/locale";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Pet } from "@/types";

const CalendarView: React.FC = () => {
  const { schedules, activePets, isLoading, getPetById } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedPetId, setSelectedPetId] = useState<string>("all");

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Create a grid of weeks
  const dayOfWeekNames = ["日", "月", "火", "水", "木", "金", "土"];
  
  // Function to get all schedules for a day
  const getSchedulesForDay = (day: Date) => {
    return schedules.filter((schedule) => {
      const scheduleStart = new Date(schedule.startDate);
      return (
        isSameDay(scheduleStart, day) &&
        (selectedPetId === "all" || schedule.petId === selectedPetId)
      );
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bokumono-primary mb-4"></div>
        <p className="text-bokumono-text">読み込み中...</p>
      </div>
    );
  }

  // Function to get color for a pet
  const getPetColor = (petId: string) => {
    const pets = ["bg-bokumono-primary", "bg-green-500", "bg-orange-500", "bg-pink-500", "bg-purple-500", "bg-yellow-500", "bg-indigo-500"];
    // Generate a consistent index based on the pet ID
    const index = petId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % pets.length;
    return pets[index];
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-bokumono-text mr-3">
            <CalendarIcon className="h-6 w-6 inline-block mr-2" />
            カレンダー
          </h2>
          <Button variant="outline" size="sm" onClick={goToCurrentMonth}>
            今月
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedPetId}
            onValueChange={setSelectedPetId}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ペットを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全てのペット</SelectItem>
              {activePets.map((pet) => (
                <SelectItem key={pet.id} value={pet.id}>
                  {pet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Link to="/schedule/new">
            <Button className="bg-bokumono-primary text-white hover:bg-bokumono-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              予定を追加
            </Button>
          </Link>
        </div>
      </div>

      <Card className="bg-bokumono-card border-bokumono-muted/30 mb-8">
        <CardContent className="p-0">
          <div className="flex justify-between items-center p-4 border-b border-bokumono-muted/20">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h3 className="text-xl font-semibold text-bokumono-text">
              {format(currentMonth, "yyyy年M月", { locale: ja })}
            </h3>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-7 text-center border-b border-bokumono-muted/20">
            {dayOfWeekNames.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "py-2 text-sm font-medium",
                  i === 0 && "text-red-400",
                  i === 6 && "text-blue-400"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {daysInMonth.map((day, i) => {
              const daySchedules = getSchedulesForDay(day);
              const isDayToday = isToday(day);
              
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[100px] p-1 border-b border-r border-bokumono-muted/20 relative",
                    isDayToday && "bg-bokumono-muted/10"
                  )}
                >
                  <div
                    className={cn(
                      "text-right p-1 text-sm",
                      day.getDay() === 0 && "text-red-400",
                      day.getDay() === 6 && "text-blue-400"
                    )}
                  >
                    <span
                      className={cn(
                        isDayToday &&
                          "bg-bokumono-primary text-white rounded-full w-7 h-7 flex items-center justify-center ml-auto"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                  </div>
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px]">
                    {daySchedules.map((schedule) => {
                      const pet = getPetById(schedule.petId) as Pet;
                      return (
                        <Link
                          key={schedule.id}
                          to={`/schedule/${schedule.id}`}
                          className="block"
                        >
                          <div
                            className={cn(
                              "text-xs p-1 rounded text-white truncate",
                              getPetColor(schedule.petId)
                            )}
                          >
                            <span className="font-medium">
                              {format(new Date(schedule.startDate), "HH:mm")}
                            </span>{" "}
                            {schedule.title.length > 8
                              ? `${schedule.title.substring(0, 8)}...`
                              : schedule.title}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-bokumono-text mb-4">ペット一覧</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {activePets.map((pet) => (
            <div
              key={pet.id}
              className="flex items-center p-2 rounded bg-bokumono-card border border-bokumono-muted/30"
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full mr-2",
                  getPetColor(pet.id)
                )}
              ></div>
              <span className="text-sm truncate">{pet.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
