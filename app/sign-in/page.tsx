import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "@/components/submit-button";

export default async function SignIn(props: any) {
  const message = props.searchParams?.message;
  
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return redirect("/sign-in?message=Could not authenticate user");
    }

    return redirect("/dashboard/groups");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = (await headers()).get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/sign-in?message=Could not authenticate user");
    }

    return redirect("/sign-in?message=Check email to continue sign in process");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-900 to-black">
      <div className="glass p-8 w-full max-w-md rounded-xl shadow-2xl backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        
        <form
          className="flex flex-col gap-4"
          action={signIn}
        >
          <div className="space-y-2">
            <label className="text-md font-medium" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-md px-4 py-3 bg-black bg-opacity-50 border border-gray-600 focus:border-green-500 focus:outline-none"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-md font-medium" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-md px-4 py-3 bg-black bg-opacity-50 border border-gray-600 focus:border-green-500 focus:outline-none"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          
          <div className="pt-4 space-y-3">
            <SubmitButton
              formAction={signIn}
              className="w-full bg-green-600 hover:bg-green-700 rounded-md px-4 py-3 text-white font-medium transition-colors"
              pendingText="Signing In..."
            >
              Sign In
            </SubmitButton>
            
            <SubmitButton
              formAction={signUp}
              className="w-full border border-gray-500 hover:border-gray-400 rounded-md px-4 py-3 text-white font-medium transition-colors"
              pendingText="Signing Up..."
            >
              Create Account
            </SubmitButton>
          </div>
          
          {message && (
            <div className="mt-4 p-4 bg-gray-800 rounded-md text-center">
              {message}
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 