
import { useState, useCallback } from "react";
import { Schedule } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const { toast } = useToast();
  const { session } = useAuth();

  const loadSchedules = useCallback(async () => {
    try {
      const { data: schedulesData, error: schedulesError } = await supabase
        .from('schedules')
        .select('*')
        .order('start_date', { ascending: true });

      if (schedulesError) throw schedulesError;

      const mappedSchedules: Schedule[] = (schedulesData || []).map(schedule => ({
        id: schedule.id,
        petId: schedule.pet_id,
        title: schedule.title,
        details: schedule.details || "",
        startDate: schedule.start_date,
        endDate: schedule.end_date,
        createdAt: schedule.created_at,
        updatedAt: schedule.updated_at
      }));

      setSchedules(mappedSchedules);
    } catch (error) {
      console.error('Error loading schedules:', error);
      toast({
        title: "エラー",
        description: "予定の読み込みに失敗しました",
        variant: "destructive"
      });
    }
  }, [toast]);

  const addSchedule = async (schedule: Omit<Schedule, "id" | "createdAt" | "updatedAt">) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .insert([{
          pet_id: schedule.petId,
          title: schedule.title,
          details: schedule.details,
          start_date: schedule.startDate,
          end_date: schedule.endDate
        }])
        .select()
        .single();

      if (error) throw error;

      const newSchedule: Schedule = {
        id: data.id,
        petId: data.pet_id,
        title: data.title,
        details: data.details || "",
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setSchedules([...schedules, newSchedule]);
      toast({
        title: "予定を追加しました",
        description: `${newSchedule.title}を追加しました`,
      });
      return newSchedule;
    } catch (error) {
      console.error('Error adding schedule:', error);
      toast({
        title: "エラー",
        description: "予定の追加に失敗しました",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<Omit<Schedule, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const { data, error } = await supabase
        .from('schedules')
        .update({
          pet_id: updates.petId,
          title: updates.title,
          details: updates.details,
          start_date: updates.startDate,
          end_date: updates.endDate
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedSchedule: Schedule = {
        id: data.id,
        petId: data.pet_id,
        title: data.title,
        details: data.details || "",
        startDate: data.start_date,
        endDate: data.end_date,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };

      setSchedules(schedules.map(schedule => schedule.id === id ? updatedSchedule : schedule));
      toast({
        title: "予定を更新しました",
        description: `${updatedSchedule.title}を更新しました`,
      });
      return updatedSchedule;
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast({
        title: "エラー",
        description: "予定の更新に失敗しました",
        variant: "destructive"
      });
      return null;
    }
  };

  const deleteSchedule = async (id: string) => {
    const scheduleToDelete = schedules.find(schedule => schedule.id === id);
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSchedules(schedules.filter(schedule => schedule.id !== id));
      toast({
        title: "予定を削除しました",
        description: scheduleToDelete ? `${scheduleToDelete.title}を削除しました` : undefined,
      });
      return true;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "エラー",
        description: "予定の削除に失敗しました",
        variant: "destructive"
      });
      return false;
    }
  };

  const checkScheduleConflict = (petId: string, startDate: string, endDate: string, excludeId?: string): boolean => {
    const petSchedules = schedules.filter(s => s.petId === petId && (!excludeId || s.id !== excludeId));
    const newStart = new Date(startDate).getTime();
    const newEnd = new Date(endDate).getTime();

    return petSchedules.some(schedule => {
      const existingStart = new Date(schedule.startDate).getTime();
      const existingEnd = new Date(schedule.endDate).getTime();

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };

  return {
    schedules,
    loadSchedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    checkScheduleConflict,
    getScheduleById: (id: string) => schedules.find(schedule => schedule.id === id),
    getSchedulesByPetId: (petId: string) => schedules.filter(schedule => schedule.petId === petId)
  };
};
