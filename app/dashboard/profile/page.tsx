import { createClient } from "@/utils/supabase/server";
import ProfileForm from '@/app/components/ProfileForm';
import WeightLogsTable from '@/app/components/WeightLogsTable';
import Image from 'next/image';

function calculateBMI(weight: number | null, height: number | null) {
  if (!weight || !height) return null;
  return weight / Math.pow(height / 100, 2);
}

function getBMICategory(bmi: number) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get user profile
  const { data: profile } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user?.id)
    .single();


  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm w-full lg:w-[350px]">
        <h1 className="text-2xl font-bold mb-6 text-purple-900">Your Profile</h1>

        <div className="flex flex-col items-center mb-6">
          {profile?.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name}
              width={100}
              height={100}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 sm:w-24 sm:h-24 rounded-full bg-purple-600 flex items-center justify-center text-2xl text-white">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
          )}

          <h2 className="text-lg sm:text-xl mt-3 text-purple-900">{profile?.full_name}</h2>
          <p className="flex items-center text-purple-800">
            {user?.email}
            {user?.email_confirmed_at && (
              <span className="ml-2 text-green-500">✓</span>
            )}
          </p>
        </div>

        <div className="space-y-2 text-purple-800">
          <div className="flex justify-between border-b border-purple-100 pb-2">
            <span>Height:</span>
            <span>{profile?.height} cm</span>
          </div>
          <div className="flex justify-between border-b border-purple-100 pb-2">
            <span>Current Weight:</span>
            <span>{profile?.weight} kg</span>
          </div>
          <div className="flex justify-between border-purple-100">
            <span>BMI:</span>
            <div className="text-right">
              <span className="font-medium">
                {(() => {
                  const bmi = calculateBMI(profile?.weight, profile?.height);
                  return bmi ? bmi.toFixed(1) : '-';
                })()}
              </span>
              {profile?.weight && profile?.height && (
                <div className="text-sm text-purple-600">
                  {getBMICategory(calculateBMI(profile.weight, profile.height)!)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm grow">
        <h2 className="text-xl font-bold mb-6 text-purple-900">Update Profile</h2>
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
} 