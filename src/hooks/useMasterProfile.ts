
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MasterProfile {
  id: string;
  name: string;
  avatar_url?: string;
  birthdate?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useMasterProfile() {
  const [profile, setProfile] = useState<MasterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
      console.error("Profile fetch error:", error);
      setProfile(null);
    } else {
      // データがnullでも初期プロフィールを作成
      if (!data) {
        // ユーザーIDのみの初期プロフィールを設定
        setProfile({
          id: userId,
          name: "No name",
        });
      } else {
        setProfile(data);
      }
    }
    setLoading(false);
  }, []);

  // プロフィール保存/更新
  const saveProfile = async (
    updates: Omit<MasterProfile, "created_at" | "updated_at">
  ) => {
    setError(null);
    
    // ユーザーIDが存在するか確認
    const userId = await getUserId();
    if (!userId) {
      setError("ログインが必要です");
      toast({
        title: "エラー",
        description: "ログインが必要です",
        variant: "destructive",
      });
      return false;
    }
    
    // 更新データを準備
    const toSave = {
      ...updates,
      id: userId, // 常にuserIdを使用する
      updated_at: new Date().toISOString(),
    };
    
    try {
      // プロフィールが存在するかチェック
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();
      
      let result;
      if (existingProfile) {
        // 既存プロフィールを更新
        console.log("Updating profile:", toSave);
        result = await supabase
          .from("profiles")
          .update(toSave)
          .eq("id", userId);
      } else {
        // 新規プロフィールを作成
        console.log("Creating new profile:", toSave);
        result = await supabase
          .from("profiles")
          .insert({ ...toSave, created_at: new Date().toISOString() });
      }
      
      if (result.error) {
        console.error("Profile save error:", result.error);
        setError("保存に失敗しました");
        toast({
          title: "エラー",
          description: "プロフィールの保存に失敗しました",
          variant: "destructive",
        });
        return false;
      }
      
      // 成功後、再度プロフィールをフェッチ
      await fetchProfile();
      return true;
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("予期せぬエラーが発生しました");
      toast({
        title: "エラー",
        description: "予期せぬエラーが発生しました",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, error, fetchProfile, saveProfile, setProfile };
}
