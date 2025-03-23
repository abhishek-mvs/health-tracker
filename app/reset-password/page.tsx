import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SubmitButton } from "@/components/submit-button";

export default function ResetPassword({ searchParams }: { searchParams: { message?: string } }) {
  const message = searchParams?.message;

  const updatePassword = async (formData: FormData) => {
    "use server";

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return redirect("/reset-password?message=Passwords do not match");
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return redirect("/reset-password?message=Error updating password");
    }

    return redirect("/sign-in?message=Password updated successfully");
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center py-8">
      <div className="bg-white/90 shadow-lg rounded-xl p-8 w-full max-w-md backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-900">Set New Password</h1>

        <form className="flex flex-col gap-4" action={updatePassword}>
          <div className="space-y-2">
            <label className="text-md font-medium text-purple-800" htmlFor="password">
              New Password
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
            <label className="text-md font-medium text-purple-800" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="w-full rounded-md px-4 py-3 bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-4 space-y-3">
            <SubmitButton
              formAction={updatePassword}
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-md px-4 py-3 text-white font-medium transition-colors shadow-md"
              pendingText="Updating Password..."
            >
              Update Password
            </SubmitButton>
          </div>

          {message && (
            <div className={`mt-4 p-4 rounded-md text-center border ${
              message.includes("Error") || message.includes("not match")
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