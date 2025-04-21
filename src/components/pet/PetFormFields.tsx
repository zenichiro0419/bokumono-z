
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UseFormReturn } from "react-hook-form";

interface PetFormFieldsProps {
  form: UseFormReturn<any>;
  photoPreview: string | null;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PetFormFields: React.FC<PetFormFieldsProps> = ({ 
  form, 
  photoPreview,
  onPhotoChange,
}) => {
  return (
    <>
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
                onChange={onPhotoChange}
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
    </>
  );
};
