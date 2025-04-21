
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Trash, Clock, CalendarDays, User } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Pet, Schedule } from "@/types";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

interface ScheduleDetailProps {
  schedule: Schedule;
  pet: Pet;
}

const ScheduleDetail: React.FC<ScheduleDetailProps> = ({ schedule, pet }) => {
  const { deleteSchedule } = useApp();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteSchedule(schedule.id);
    navigate("/calendar");
  };

  const startDate = new Date(schedule.startDate);
  const endDate = new Date(schedule.endDate);

  const formatDate = (date: Date) => {
    return format(date, "yyyy年M月d日(E)", { locale: ja });
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm", { locale: ja });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const isPastEvent = new Date() > endDate;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/calendar">
          <Button variant="outline" size="sm">
            カレンダーに戻る
          </Button>
        </Link>
        <div className="flex space-x-3">
          <Link to={`/schedule/${schedule.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
          </Link>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash className="h-4 w-4 mr-2" />
                削除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
                <AlertDialogDescription>
                  この予定を削除します。この操作は元に戻せません。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  削除する
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className={cn(
        "bg-bokumono-card border-bokumono-muted/30",
        isPastEvent && "opacity-70"
      )}>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-bokumono-text mb-4">
            {schedule.title}
          </h1>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="flex items-start">
              <CalendarDays className="h-5 w-5 text-bokumono-primary mr-3 mt-0.5" />
              <div>
                <span className="text-bokumono-muted text-sm">日時：</span>
                <div className="text-bokumono-text">
                  {formatDate(startDate)}
                  <br />
                  {formatTime(startDate)} ~ {formatTime(endDate)}
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <User className="h-5 w-5 text-bokumono-primary mr-3 mt-0.5" />
              <div>
                <span className="text-bokumono-muted text-sm">ペット：</span>
                <div className="text-bokumono-text">
                  <Link to={`/pet/${pet.id}`} className="hover:underline">
                    {pet.name}
                  </Link>
                </div>
              </div>
            </div>

            {schedule.details && (
              <div className="mt-4">
                <span className="text-bokumono-muted text-sm">詳細：</span>
                <p className="text-bokumono-text mt-1 whitespace-pre-line">
                  {schedule.details}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <Link to={`/pet/${pet.id}`}>
              <Button variant="outline">
                <User className="h-4 w-4 mr-2" />
                {pet.name}の詳細を見る
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleDetail;
