
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Calendar, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pet } from "@/types";
import { useApp } from "@/context/AppContext";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const { updatePet, getSchedulesByPetId } = useApp();
  const schedules = getSchedulesByPetId(pet.id);

  const handleStatusToggle = () => {
    updatePet(pet.id, {
      status: pet.status === "active" ? "archived" : "active",
    });
  };

  const lastUpdated = formatDistanceToNow(new Date(pet.updatedAt), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <Card className="overflow-hidden h-full flex flex-col bg-bokumono-card border-bokumono-primary/20 hover:border-bokumono-primary/50 transition-all">
      <div className="relative h-48 overflow-hidden bg-gray-800">
        <img
          src={pet.photoUrl}
          alt={pet.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div className="absolute top-2 right-2">
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
      </div>
      <CardContent className="pt-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-bokumono-text">
            {pet.name}
          </h3>
          <span className="text-sm text-bokumono-muted">{pet.age}歳</span>
        </div>
        <p className="text-sm text-bokumono-muted line-clamp-2 mb-2">
          {pet.memo || "メモはありません"}
        </p>
        <div className="flex items-center text-xs text-bokumono-muted">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{schedules.length} 件の予定</span>
        </div>
        <div className="text-xs text-bokumono-muted mt-1">
          更新: {lastUpdated}
        </div>
      </CardContent>
      <CardFooter className="border-t border-bokumono-muted/20 pt-3 space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={handleStatusToggle}
        >
          <Archive className="h-4 w-4 mr-1" />
          {pet.status === "active" ? "アーカイブ" : "アクティブ化"}
        </Button>
        <Link to={`/pet/${pet.id}`} className="flex-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
          >
            <Edit className="h-4 w-4 mr-1" />
            編集
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PetCard;
