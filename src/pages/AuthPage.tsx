
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AuthPage: React.FC = () => {
  const { loading, session } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    try {
      const isLogin = !isSignUp;
      let response;
      if (isSignUp) {
        response = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
        response = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }
      if (response.error) {
        setError(response.error.message);
      } else if (response.data.session) {
        // サインイン直後
        navigate("/");
      } else if (isSignUp && !response.data.session) {
        setError("確認メールをチェックしてください。");
      }
    } catch (err: any) {
      setError("エラーが発生しました");
    }
    setFormLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bokumono-background px-4">
      <div className="bg-bokumono-card w-full max-w-sm p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isSignUp ? "新規登録" : "ログイン"}
        </h2>
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="メールアドレス"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={formLoading}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="パスワード"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={formLoading}
              required
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <Button type="submit" className="w-full" disabled={formLoading}>
            {formLoading
              ? "処理中..."
              : isSignUp
                ? "サインアップ"
                : "ログイン"}
          </Button>
        </form>
        <div className="mt-4 text-sm text-center">
          {isSignUp ? (
            <>
              アカウントをお持ちですか？{" "}
              <button
                className="text-primary underline"
                onClick={() => setIsSignUp(false)}
                disabled={formLoading}
              >
                ログインへ
              </button>
            </>
          ) : (
            <>
              アカウントをお持ちでないですか？{" "}
              <button
                className="text-primary underline"
                onClick={() => setIsSignUp(true)}
                disabled={formLoading}
              >
                新規登録へ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
