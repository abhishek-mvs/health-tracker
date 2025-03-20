import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/submit-button";

export default async function SignUp(props: any) {
  const message = props.searchParams?.message;

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
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-8">
      <div className="bg-white/90 shadow-lg rounded-xl p-8 w-full max-w-md backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-900">Create Account</h1>
        <p className="text-center text-purple-700 mb-8">Join the weight loss community</p>

        <form
          className="flex flex-col gap-4"
          action={signUp}
        >
          <div className="space-y-2">
            <label className="text-md font-medium text-purple-800" htmlFor="email">
              Email
            </label>
            <input
              className="w-full rounded-md px-4 py-3 bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900"
              name="email"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-md font-medium text-purple-800" htmlFor="password">
              Password
            </label>
            <input
              className="w-full rounded-md px-4 py-3 bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-md font-medium text-purple-800" htmlFor="fullName">
              Full Name
            </label>
            <input
              className="w-full rounded-md px-4 py-3 bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900"
              name="fullName"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-md font-medium text-purple-800" htmlFor="height">
                Height (cm)
              </label>
              <input
                className="w-full rounded-md px-4 py-3 bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900"
                type="number"
                step="0.1"
                name="height"
                placeholder="175"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-md font-medium text-purple-800" htmlFor="weight">
                Weight (kg)
              </label>
              <input
                className="w-full rounded-md px-4 py-3 bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900"
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
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-3 text-white font-medium transition-colors shadow-md"
              pendingText="Creating Account..."
            >
              Sign Up
            </SubmitButton>
          </div>

          {message && (
            <div className="mt-4 p-4 bg-yellow-100 text-purple-900 rounded-md text-center border border-yellow-200">
              {message}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-purple-700">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-rose-500 hover:text-rose-600">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 