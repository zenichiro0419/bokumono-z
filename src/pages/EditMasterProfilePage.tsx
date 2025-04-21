
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMasterProfile } from "@/hooks/useMasterProfile";
import { useToast } from "@/hooks/use-toast";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorMessage } from "@/components/ErrorMessage";
import Layout from "@/components/Layout";

const PLACEHOLDER_AVATAR = "/placeholder.svg";

const EditMasterProfilePage: React.FC = () => {
  const { profile, loading, error, saveProfile, setProfile } = useMasterProfile();
  const [avatarPreview, setAvatarPreview] = useState<string>(PLACEHOLDER_AVATAR);
  const [saving, setSaving] = useState(false);
  const [birthdate, setBirthdate] = useState<string>("");
  const [name, setName] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setAvatarPreview(profile.avatar_url || PLACEHOLDER_AVATAR);
      setBirthdate(profile.birthdate || "");
      setName(profile.name || "");
    }
  }, [profile]);

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (error) return <Layout><ErrorMessage message={error} /></Layout>;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (profile) {
      setProfile({
        ...profile,
        name: value,
      });
    }
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBirthdate(value);
    if (profile) {
      setProfile({
        ...profile,
        birthdate: value || null,
      });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && profile) {
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setProfile({
        ...profile,
        avatar_url: objectUrl,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const profileToSave = profile || { id: "", name: "", avatar_url: PLACEHOLDER_AVATAR, birthdate: null };
      
      const ok = await saveProfile({
        id: profileToSave.id,
        name: name || "No name",
        avatar_url: avatarPreview || PLACEHOLDER_AVATAR,
        birthdate: birthdate || null,
      });
      
      if (ok) {
        toast({
          title: "成功",
          description: "プロフィールを保存しました",
        });
        navigate("/master");
      }
    } catch (err) {
      toast({
        title: "エラー",
        description: "保存中にエラーが発生しました",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center pt-8">
        <ProfileForm
          name={name}
          birthdate={birthdate}
          avatarUrl={avatarPreview}
          onNameChange={handleNameChange}
          onBirthdateChange={handleBirthdateChange}
          onAvatarChange={handleAvatarChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/master")}
          isSaving={saving}
        />
      </div>
    </Layout>
  );
};

export default EditMasterProfilePage;
