
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pet } from "@/types";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useApp } from "@/context/AppContext";
import { PetFormFields } from "@/components/pet/PetFormFields";

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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
      form.setValue("photoUrl", objectUrl);
    }
  };

  const onSubmit = async (values: FormValues) => {
    // Clean up the birthdate value - if it's empty, make it null
    const cleanedValues = {
      ...values,
      birthdate: values.birthdate && values.birthdate.trim() !== "" ? values.birthdate : null
    };

    if (isEditing && pet) {
      const updatedPet = await updatePet(pet.id, cleanedValues);
      if (updatedPet) {
        navigate(`/pet/${pet.id}`);
      }
    } else {
      const newPetData: Omit<Pet, "id" | "createdAt" | "updatedAt"> = {
        name: cleanedValues.name,
        birthdate: cleanedValues.birthdate,
        status: cleanedValues.status,
        memo: cleanedValues.memo || "",
        photoUrl: cleanedValues.photoUrl || "/placeholder.svg",
        perceived_master_age: cleanedValues.perceived_master_age,
      };
      
      const newPet = await addPet(newPetData);
      if (newPet) {
        navigate(`/pet/${newPet.id}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditing ? "ペット情報を編集" : "新しいペットを追加"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <PetFormFields
            form={form}
            photoPreview={photoPreview}
            onPhotoChange={handlePhotoChange}
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
