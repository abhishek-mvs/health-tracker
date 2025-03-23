import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/submit-button";
import { headers } from "next/headers";

export default async function ForgotPassword(props: any) {
  const message = props.searchParams?.message;

  const resetPassword = async (formData: FormData) => {
    "use server";

    const origin = (await headers()).get("origin");
    const email = formData.get("email") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/reset-password`,
    });

    if (error) {
      return redirect("/forgot-password?message=Error sending reset email");
    }

    return redirect("/forgot-password?message=Check your email for a password reset link");
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-8">
      <div className="bg-white/90 shadow-lg rounded-xl p-8 w-full max-w-md backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-900">Reset Password</h1>

        <form className="flex flex-col gap-4" action={resetPassword}>
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

          <div className="pt-4 space-y-3">
            <SubmitButton
              formAction={resetPassword}
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-3 text-white font-medium transition-colors shadow-md"
              pendingText="Sending Reset Link..."
            >
              Send Reset Link
            </SubmitButton>

            <Link
              href="/sign-in"
              className="w-full bg-gray-200 hover:bg-gray-300 rounded-md px-4 py-3 text-purple-900 font-medium transition-colors shadow-md text-center block"
            >
              Back to Sign In
            </Link>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-md text-center border ${
              message.includes("Error") 
                ? "bg-red-100 text-red-800 border-red-200" 
                : "bg-green-100 text-green-800 border-green-200"
            }`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 