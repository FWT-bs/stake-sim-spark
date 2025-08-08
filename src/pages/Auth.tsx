import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function AuthPage() {
  const { session, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      // Already logged in -> go home
      window.location.href = "/";
    }
  }, [session]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: any) {
      toast({ title: "Sign in failed", description: err?.message || "Please try again." });
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
    } catch (err: any) {
      toast({ title: "Sign up failed", description: err?.message || "Please try again." });
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center py-10">
      <SEO title="Login or Sign Up - FunStake" description="Access FunStake instantly. Create an account or sign in without email verification." />
      <Card className="w-full max-w-md bg-card/60 backdrop-blur border-border/40">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Welcome to FunStake</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in or create an account</p>
          </div>
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-si">Email</Label>
                  <Input id="email-si" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-si">Password</Label>
                  <Input id="password-si" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Please wait..." : "Sign In"}</Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-su">Email</Label>
                  <Input id="email-su" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-su">Password</Label>
                  <Input id="password-su" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>{loading ? "Please wait..." : "Create Account"}</Button>
              </form>
              <p className="text-xs text-muted-foreground mt-3">Tip: To skip email verification, disable "Confirm email" in Supabase Auth settings.</p>
            </TabsContent>
          </Tabs>
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-primary underline">Back to home</Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
