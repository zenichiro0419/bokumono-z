
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Edit, Trash, Plus } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Pet, Schedule } from "@/types";
import { useApp } from "@/context/AppContext";

interface PetDetailProps {
  pet: Pet;
  schedules: Schedule[];
}

const PetDetail: React.FC<PetDetailProps> = ({ pet, schedules }) => {
  const { deletePet, calculatePetAge } = useApp();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const age = calculatePetAge(pet.birthdate);

  const handleDelete = () => {
    deletePet(pet.id);
    navigate("/");
  };

  const formatScheduleDate = (date: string) => {
    return format(new Date(date), "M月d日(E) HH:mm", { locale: ja });
  };

  // Sort schedules by start date (most recent first)
  const sortedSchedules = [...schedules].sort((a, b) => {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  const upcomingSchedules = sortedSchedules.filter(
    (schedule) => new Date(schedule.startDate) >= new Date()
  );

  const pastSchedules = sortedSchedules.filter(
    (schedule) => new Date(schedule.startDate) < new Date()
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/">
          <Button variant="outline" size="sm">
            戻る
          </Button>
        </Link>
        <div className="flex space-x-3">
          <Link to={`/pet/${pet.id}/edit`}>
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
                  {pet.name}
                  の情報とすべての予定が削除されます。この操作は元に戻せません。
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

      <Card className="bg-bokumono-card border-bokumono-muted/30 mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="rounded-lg overflow-hidden h-48 md:h-auto bg-gray-800">
                <img
                  src={pet.photoUrl}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-bokumono-text">
                  {pet.name}
                </h1>
                <Badge
                  variant={pet.status === "active" ? "default" : "secondary"}
                  className={
                    pet.status === "active"
                      ? "bg-bokumono-primary"
                      : "bg-bokumono-muted"
                  }
                >
                  {pet.status === "active" ? "アクティブ" : "アーカイブ"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {age !== undefined && (
                  <div>
                    <span className="text-bokumono-muted text-sm">年齢：</span>
                    <span className="text-bokumono-text">{age}歳</span>
                    {pet.birthdate && (
                      <span className="text-bokumono-muted text-sm ml-2">
                        （{format(new Date(pet.birthdate), 'yyyy年MM月dd日', { locale: ja })}生まれ）
                      </span>
                    )}
                  </div>
                )}
                <div>
                  <span className="text-bokumono-muted text-sm">設定年齢：</span>
                  <span className="text-bokumono-text">{pet.perceived_master_age}歳</span>
                  <span className="text-bokumono-muted text-sm ml-2">
                    （ペットが認識しているマスターの年齢）
                  </span>
                </div>
                <div>
                  <span className="text-bokumono-muted text-sm">メモ：</span>
                  <p className="text-bokumono-text mt-1">{pet.memo || "メモはありません"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-bokumono-text">
          <Calendar className="h-5 w-5 inline-block mr-2" />
          予定一覧
        </h2>
        <Link to={`/schedule/new?petId=${pet.id}`}>
          <Button size="sm" className="bg-bokumono-primary">
            <Plus className="h-4 w-4 mr-2" />
            予定を追加
          </Button>
        </Link>
      </div>

      {schedules.length === 0 ? (
        <div className="text-center py-8 bg-bokumono-card rounded-lg border border-bokumono-muted/30">
          <p className="text-bokumono-muted">登録された予定はありません</p>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingSchedules.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-bokumono-text mb-3">
                今後の予定
              </h3>
              <div className="space-y-3">
                {upcomingSchedules.map((schedule) => (
                  <Link
                    key={schedule.id}
                    to={`/schedule/${schedule.id}`}
                    className="block"
                  >
                    <Card className="bg-bokumono-card border-bokumono-muted/30 hover:border-bokumono-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-bokumono-text">
                            {schedule.title}
                          </h4>
                          <Badge className="bg-bokumono-primary">予定</Badge>
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
            </div>
          )}

          {pastSchedules.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-bokumono-text mb-3">
                過去の予定
              </h3>
              <div className="space-y-3">
                {pastSchedules.map((schedule) => (
                  <Link
                    key={schedule.id}
                    to={`/schedule/${schedule.id}`}
                    className="block"
                  >
                    <Card className="bg-bokumono-card border-bokumono-muted/30 opacity-70 hover:opacity-100 hover:border-bokumono-primary/50 transition-all">
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-bokumono-text">
                            {schedule.title}
                          </h4>
                          <Badge variant="outline">過去</Badge>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetDetail;
