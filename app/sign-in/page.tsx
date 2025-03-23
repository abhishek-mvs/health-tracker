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

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-8">
      <div className="bg-white/90 shadow-lg rounded-xl p-8 w-full max-w-md backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-900">Welcome Back</h1>

        <form
          className="flex flex-col gap-4"
          action={signIn}
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

          <div className="pt-4 space-y-3">
            <SubmitButton
              formAction={signIn}
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-3 text-white font-medium transition-colors shadow-md"
              pendingText="Signing In..."
            >
              Sign In
            </SubmitButton>

            <Link
              href="/sign-up"
              className="w-full bg-rose-400 hover:bg-rose-500 rounded-md px-4 py-3 text-white font-medium transition-colors shadow-md text-center block"
            >
              Create Account
            </Link>
          </div>

          {message && (
            <div className="mt-4 p-4 bg-yellow-100 text-purple-900 rounded-md text-center border border-yellow-200">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 