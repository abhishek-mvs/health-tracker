import { createClient } from "@/utils/supabase/server";
import ProfileForm from '@/app/components/ProfileForm';
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
  
  // Get weight logs
  const { data: weightLogs } = await supabase
    .from('userWeightLog')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="glass p-6">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
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
            <div className="w-24 h-24 rounded-full bg-green-700 flex items-center justify-center text-2xl">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
            </div>
          )}
          
          <h2 className="text-xl mt-3">{profile?.full_name}</h2>
          <p className="flex items-center">
            {user?.email}
            {user?.email_confirmed_at && (
              <span className="ml-2 text-green-400">✓</span>
            )}
          </p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Height:</span>
            <span>{profile?.height} cm</span>
          </div>
          <div className="flex justify-between">
            <span>Current Weight:</span>
            <span>{profile?.weight} kg</span>
          </div>
        </div>
      </div>
      
      <div className="glass p-6">
        <h2 className="text-xl font-bold mb-6">Update Profile</h2>
        <ProfileForm profile={profile} />
      </div>
      
      <div className="md:col-span-2 glass p-6">
        <h2 className="text-xl font-bold mb-4">Recent Weight Logs</h2>
        
        {weightLogs && weightLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2">Date</th>
                  <th className="text-right py-2">Weight (kg)</th>
                </tr>
              </thead>
              <tbody>
                {weightLogs.map(log => (
                  <tr key={log.id} className="border-b border-gray-800">
                    <td className="py-2">
                      {new Date(log.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-right py-2">{log.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No weight logs found. Start tracking your weight!</p>
        )}
      </div>
    </div>
  );
} 