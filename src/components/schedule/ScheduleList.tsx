
import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Schedule } from "@/types";

interface ScheduleListProps {
  schedules: Schedule[];
  isPast?: boolean;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, isPast = false }) => {
  const formatScheduleDate = (date: string) => {
    return format(new Date(date), "M月d日(E) HH:mm", { locale: ja });
  };

  return (
    <div className="space-y-3">
      {schedules.map((schedule) => (
        <Link
          key={schedule.id}
          to={`/schedule/${schedule.id}`}
          className="block"
        >
          <Card className={`bg-bokumono-card border-bokumono-muted/30 ${
            isPast ? "opacity-70 hover:opacity-100" : ""
          } hover:border-bokumono-primary/50 transition-all`}>
            <CardContent className="p-4">
              <div className="flex justify-between">
                <h4 className="font-medium text-bokumono-text">
                  {schedule.title}
                </h4>
                <Badge variant={isPast ? "outline" : "default"} className={isPast ? "" : "bg-bokumono-primary"}>
                  {isPast ? "過去" : "予定"}
                </Badge>
              </div>
              <p className="text-sm text-bokumono-muted mt-1">
                {formatScheduleDate(schedule.startDate)} ~{" "}
                {format(new Date(schedule.endDate), "HH:mm", {
                  locale: ja,
                })}
              </p>
              {schedule.details && (
                <p className="text-sm text-bokumono-text mt-2 line-clamp-2">
                  {schedule.details}
                </p>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
