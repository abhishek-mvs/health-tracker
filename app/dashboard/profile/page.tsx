import { createClient } from "@/utils/supabase/server";
import ProfileForm from '@/app/components/ProfileForm';
import WeightLogsTable from '@/app/components/WeightLogsTable';
import Image from 'next/image';

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
    <div className="flex gap-6">
      <div className="bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm grow">
        <h2 className="text-xl font-bold mb-6 text-purple-900">Update Profile</h2>
        <ProfileForm profile={profile} />
      </div>
      <div className="bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm w-[350px]">
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
            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-2xl text-white">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
          )}

          <h2 className="text-xl mt-3 text-purple-900">{profile?.full_name}</h2>
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
        </div>
      </div>
    </div>
  );
} 