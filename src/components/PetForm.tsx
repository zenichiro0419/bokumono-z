import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pet } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";

interface PetFormProps {
  pet?: Pet;
  isEditing?: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, "ペットの名前は必須です"),
  birthdate: z.string().nullable().optional(),
  status: z.enum(["active", "archived"]),
  memo: z.string().optional(),
  photoUrl: z.string().optional(),
  perceived_master_age: z.coerce.number().min(1, "設定年齢は1以上である必要があります"),
});

type FormValues = z.infer<typeof formSchema>;

const PetForm: React.FC<PetFormProps> = ({ pet, isEditing = false }) => {
  const { addPet, updatePet } = useApp();
  const navigate = useNavigate();
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    pet?.photoUrl || null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: pet?.name || "",
      birthdate: pet?.birthdate || "",
      status: pet?.status || "active",
      memo: pet?.memo || "",
      photoUrl: pet?.photoUrl || "/placeholder.svg",
      perceived_master_age: pet?.perceived_master_age || 25,
    },
  });

  const onSubmit = (values: FormValues) => {
    if (isEditing && pet) {
      updatePet(pet.id, values);
      navigate(`/pet/${pet.id}`);
    } else {
      const newPetData: Omit<Pet, "id" | "createdAt" | "updatedAt" | "age"> = {
        name: values.name,
        birthdate: values.birthdate,
        status: values.status,
        memo: values.memo || "",
        photoUrl: values.photoUrl || "/placeholder.svg",
        perceived_master_age: values.perceived_master_age,
      };
      
      const newPet = addPet(newPetData);
      navigate(`/pet/${newPet.id}`);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
      form.setValue("photoUrl", objectUrl);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditing ? "ペット情報を編集" : "新しいペットを追加"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-2 border-bokumono-muted/30">
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Pet"
                  className="w-full h-full object-cover"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute inset-0 bg-bokumono-background/50 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                >
                  <span className="text-white text-sm font-medium">
                    写真を変更
                  </span>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>名前</FormLabel>
                <FormControl>
                  <Input placeholder="ペットの名前" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>誕生日 (YYYY-MM-DD)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="2020-01-01"
                    pattern="\d{4}-\d{2}-\d{2}"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="perceived_master_age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>設定年齢</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="マスターの年齢（ペットが認識している）"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ステータス</FormLabel>
                <FormControl>
                  <Tabs
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="active">アクティブ</TabsTrigger>
                      <TabsTrigger value="archived">アーカイブ</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>メモ</FormLabel>
                <FormControl>
                  <Textarea placeholder="ペットについてのメモ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              キャンセル
            </Button>
            <Button type="submit" className="flex-1 bg-bokumono-primary">
              {isEditing ? "更新" : "追加"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PetForm;
