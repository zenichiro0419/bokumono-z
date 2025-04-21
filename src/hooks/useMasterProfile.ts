
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface MasterProfile {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  birthdate?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useMasterProfile() {
  const [profile, setProfile] = useState<MasterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 現在の認証ユーザーIDの取得
  const getUserId = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) return null;
    return session?.user?.id ?? null;
  };

  // プロフィール取得
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    const userId = await getUserId();
    if (!userId) {
      setError("ログインが必要です");
      setLoading(false);
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      setError("プロフィール取得に失敗しました");
      setProfile(null);
    } else {
      setProfile(data ?? null);
    }
    setLoading(false);
  }, []);

  // プロフィール保存/更新
  const saveProfile = async (
    updates: Omit<MasterProfile, "created_at" | "updated_at">
  ) => {
    setError(null);
    const toSave = {
      ...updates,
      updated_at: new Date().toISOString(),
    };
    const { error } =
      profile
        ? await supabase.from("profiles").update(toSave).eq("id", updates.id)
        : await supabase.from("profiles").insert({ ...toSave, created_at: new Date().toISOString() });
    if (error) {
      setError("保存に失敗しました");
      return false;
    }
    fetchProfile();
    return true;
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, fetchProfile, saveProfile, setProfile };
}
