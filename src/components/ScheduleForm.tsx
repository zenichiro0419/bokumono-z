
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pet, Schedule } from "@/types";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { format, addHours, setHours, setMinutes } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScheduleFormProps {
  schedule?: Schedule;
  isEditing?: boolean;
  defaultPetId?: string;
}

const formSchema = z.object({
  petId: z.string().min(1, "ペットを選択してください"),
  title: z.string().min(1, "タイトルは必須です"),
  details: z.string().optional(),
  startDate: z.date({
    required_error: "開始日時を選択してください",
  }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "正しい時間形式で入力してください"),
  duration: z.coerce.number().min(1, "所要時間は1時間以上である必要があります").max(24, "所要時間は24時間以下である必要があります"),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleForm: React.FC<ScheduleFormProps> = ({
  schedule,
  isEditing = false,
  defaultPetId,
}) => {
  const { addSchedule, updateSchedule, pets, activePets, getPetById } = useApp();
  const navigate = useNavigate();
  
  // Prepare default values
  const now = new Date();
  const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
  const roundedTime = new Date(now);
  roundedTime.setMinutes(roundedMinutes % 60);
  roundedTime.setHours(now.getHours() + Math.floor(roundedMinutes / 60));
  
  let defaultStartDate = roundedTime;
  let defaultStartTime = format(roundedTime, "HH:mm");
  let defaultDuration = 1;
  
  if (schedule) {
    const startDate = new Date(schedule.startDate);
    const endDate = new Date(schedule.endDate);
    const durationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    
    defaultStartDate = startDate;
    defaultStartTime = format(startDate, "HH:mm");
    defaultDuration = Math.max(1, Math.round(durationHours));
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      petId: schedule?.petId || defaultPetId || "",
      title: schedule?.title || "",
      details: schedule?.details || "",
      startDate: defaultStartDate,
      startTime: defaultStartTime,
      duration: defaultDuration,
    },
  });

  const onSubmit = (values: FormValues) => {
    // Parse the time string to get hours and minutes
    const [hours, minutes] = values.startTime.split(":").map(Number);
    
    // Create a new date object from the selected date and set the time
    const startDateTime = new Date(values.startDate);
    startDateTime.setHours(hours, minutes, 0, 0);
    
    // Calculate the end time by adding the duration
    const endDateTime = addHours(startDateTime, values.duration);
    
    if (isEditing && schedule) {
      const updatedSchedule = updateSchedule(schedule.id, {
        petId: values.petId,
        title: values.title,
        details: values.details,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      });
      
      if (updatedSchedule) {
        navigate(`/schedule/${schedule.id}`);
      }
    } else {
      const newSchedule = addSchedule({
        petId: values.petId,
        title: values.title,
        details: values.details,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
      });
      
      if (newSchedule) {
        navigate(`/schedule/${newSchedule.id}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditing ? "予定を編集" : "新しい予定を追加"}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="petId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ペット</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="ペットを選択" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {activePets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>タイトル</FormLabel>
                <FormControl>
                  <Input placeholder="予定のタイトル" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>詳細 (任意)</FormLabel>
                <FormControl>
                  <Textarea placeholder="予定の詳細" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>日付</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy年M月d日(E)", {
                              locale: ja,
                            })
                          ) : (
                            <span>日付を選択</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ja}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>開始時間</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        placeholder="HH:MM"
                        {...field}
                        type="time"
                        className="pl-10"
                      />
                    </FormControl>
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>所要時間 (時間)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    step="1"
                    placeholder="所要時間"
                    {...field}
                  />
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

export default ScheduleForm;
