
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useApp } from "@/context/AppContext";
import { addHours } from "date-fns";
import { Schedule } from "@/types";
import { FormFields } from "@/components/schedule/FormFields";

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
  const { addSchedule, updateSchedule, activePets } = useApp();
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
          <FormFields form={form} activePets={activePets} />

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
