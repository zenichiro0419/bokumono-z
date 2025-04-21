import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PetCard from "@/components/PetCard";
import { Search, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Pet } from "@/types";
import { useNavigate } from "react-router-dom";

const PetList: React.FC = () => {
  const { activePets, archivedPets, isLoading } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filterPets = (pets: Pet[], query: string) => {
    if (!query.trim()) return pets;
    const lowerQuery = query.toLowerCase();
    return pets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(lowerQuery) ||
        pet.memo.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredActivePets = filterPets(activePets, searchQuery);
  const filteredArchivedPets = filterPets(archivedPets, searchQuery);

  const handleAddPet = () => {
    navigate("/pet/new");
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-bokumono-primary mb-4"></div>
        <p className="text-bokumono-text">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-xl">
          <Search className="pl-10 absolute left-3 top-1/2 transform -translate-y-1/2 text-bokumono-muted h-5 w-5" />
          <Input
            type="text"
            placeholder="ペットを検索..."
            className="pl-1 bg-bokumono-card text-bokumono-text border-bokumono-muted/30 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleAddPet}
          className="bg-bokumono-primary text-white hover:bg-bokumono-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          新規登録
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="active" className="text-base">
            アクティブ ({activePets.length})
          </TabsTrigger>
          <TabsTrigger value="archived" className="text-base">
            アーカイブ ({archivedPets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {filteredActivePets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-bokumono-muted">
                {searchQuery
                  ? "検索結果が見つかりません"
                  : "アクティブなペットが登録されていません"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivePets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived">
          {filteredArchivedPets.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-bokumono-muted">
                {searchQuery
                  ? "検索結果が見つかりません"
                  : "アーカイブされたペットがありません"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArchivedPets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PetList;
