import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/submit-button";

export default function SignUp({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signUp = async (formData: FormData) => {
    "use server";

    const origin = (await headers()).get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const height = formData.get("height") as string;
    const weight = formData.get("weight") as string;
    
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/sign-up?message=Could not authenticate user");
    }

    // Create user profile if sign up was successful
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profile')
        .insert({
          id: data.user.id,
          full_name: fullName,
          height: parseFloat(height),
          weight: parseFloat(weight),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    return redirect("/sign-in?message=Check email to continue sign in process");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-900 to-black">
      <div className="glass p-8 w-full max-w-md rounded-xl shadow-2xl backdrop-blur-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Create Account</h1>
        <p className="text-center text-gray-300 mb-8">Join the weight loss community</p>
        
        <form
          className="flex flex-col gap-4"
          action={signUp}
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
          
          <div className="space-y-2">
            <label className="text-md font-medium" htmlFor="fullName">
              Full Name
            </label>
            <input
              className="w-full rounded-md px-4 py-3 bg-black bg-opacity-50 border border-gray-600 focus:border-green-500 focus:outline-none"
              name="fullName"
              placeholder="John Doe"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-md font-medium" htmlFor="height">
                Height (cm)
              </label>
              <input
                className="w-full rounded-md px-4 py-3 bg-black bg-opacity-50 border border-gray-600 focus:border-green-500 focus:outline-none"
                type="number"
                step="0.1"
                name="height"
                placeholder="175"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-md font-medium" htmlFor="weight">
                Weight (kg)
              </label>
              <input
                className="w-full rounded-md px-4 py-3 bg-black bg-opacity-50 border border-gray-600 focus:border-green-500 focus:outline-none"
                type="number"
                step="0.1"
                name="weight"
                placeholder="70"
                required
              />
            </div>
          </div>
          
          <div className="pt-4">
            <SubmitButton
              formAction={signUp}
              className="w-full bg-green-600 hover:bg-green-700 rounded-md px-4 py-3 text-white font-medium transition-colors"
              pendingText="Creating Account..."
            >
              Sign Up
            </SubmitButton>
          </div>
          
          {searchParams?.message && (
            <div className="mt-4 p-4 bg-gray-800 rounded-md text-center">
              {searchParams.message}
            </div>
          )}
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 mb-2">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-green-400 hover:text-green-300">
              Sign In
            </Link>
          </p>
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