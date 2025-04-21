
import React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pet } from "@/types";

interface PetInfoProps {
  pet: Pet;
  age?: number;
}

export const PetInfo: React.FC<PetInfoProps> = ({ pet, age }) => {
  return (
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
  );
};
