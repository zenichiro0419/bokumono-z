
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useApp } from "@/context/AppContext";

interface PetFormProps {
  pet?: Pet;
  isEditing?: boolean;
}

const formSchema = z.object({
  name: z.string().min(1, "ペットの名前は必須です"),
  age: z.coerce.number().min(0, "年齢は0以上である必要があります"),
  status: z.enum(["active", "archived"]),
  memo: z.string().optional(),
  photoUrl: z.string().optional(),
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
      age: pet?.age || 0,
      status: pet?.status || "active",
      memo: pet?.memo || "",
      photoUrl: pet?.photoUrl || "/placeholder.svg",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (isEditing && pet) {
      updatePet(pet.id, values);
      navigate(`/pet/${pet.id}`);
    } else {
      // Make sure all required fields are explicitly set before passing to addPet
      const newPetData: Omit<Pet, "id" | "createdAt" | "updatedAt"> = {
        name: values.name,
        age: values.age,
        status: values.status,
        memo: values.memo || "",
        photoUrl: values.photoUrl || "/placeholder.svg",
      };
      
      const newPet = addPet(newPetData);
      navigate(`/pet/${newPet.id}`);
    }
  };

  // Handle file upload preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload this to a server
      // For now, we'll just create a local URL for preview
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
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>年齢</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="年齢"
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="ステータスを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">アクティブ</SelectItem>
                    <SelectItem value="archived">アーカイブ</SelectItem>
                  </SelectContent>
                </Select>
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
