
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Edit, Calendar, Plus } from "lucide-react";
import { Pet, Schedule } from "@/types";
import { useApp } from "@/context/AppContext";
import { PageHeader } from "@/components/common/PageHeader";
import { DeleteDialog } from "@/components/common/DeleteDialog";
import { PetInfo } from "@/components/pet/PetInfo";
import { ScheduleList } from "@/components/schedule/ScheduleList";

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

  const headerActions = (
    <>
      <Link to={`/pet/${pet.id}/edit`}>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          編集
        </Button>
      </Link>
      <DeleteDialog
        title="本当に削除しますか？"
        description={`${pet.name}の情報とすべての予定が削除されます。この操作は元に戻せません。`}
        onDelete={handleDelete}
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );

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
      <PageHeader backTo="/" actions={headerActions} />
      <PetInfo pet={pet} age={age} />

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
              <ScheduleList schedules={upcomingSchedules} />
            </div>
          )}

          {pastSchedules.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-bokumono-text mb-3">
                過去の予定
              </h3>
              <ScheduleList schedules={pastSchedules} isPast />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PetDetail;
