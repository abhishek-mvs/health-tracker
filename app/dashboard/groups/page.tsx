import { createClient } from "@/utils/supabase/server";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import WeightEntryForm from '@/app/components/WeightEntryForm';
import GroupCard from '@/app/components/GroupCard';
import WeightLogsTable from "@/app/components/WeightLogsTable";

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect to login if user is not signed in
  if (!user) {
    return redirect('/sign-in?message=Please sign in to access your groups');
  }

  // Get groups the user is a member of
  const { data: memberGroups } = await supabase
    .from('groupMembers')
    .select('group_id')
    .eq('user_id', user.id);
  const groupIds = memberGroups?.map(member => member.group_id) || [];
  // Get group details
  const { data: groups } = await supabase
    .from('groups')
    .select('*, groupMembers(count)')
    .in('id', groupIds);

  // Get weight logs
  const { data: weightLogs } = await supabase
    .from('userWeightLog')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })
    .limit(10);


  return (
    <div className="flex gap-4 h-full">
      <div className="flex flex-col gap-4 w-[350px]">
        <section className="bg-white/90 shadow-lg rounded-xl backdrop-blur-sm p-6">
          <h2 className="text-xl font-bold mb-4 text-purple-900">Log Your Weight</h2>
          <WeightEntryForm userId={user.id} />
        </section>
        <div className="md:col-span-2 bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4 text-purple-900">Recent Weight Logs</h2>
          <WeightLogsTable weightLogs={weightLogs || []} />
        </div>
      </div>

      <section className="bg-white/90 shadow-lg rounded-xl backdrop-blur-sm p-6">
        <div className="flex justify-between gap-4">
          <h2 className="text-xl font-bold text-purple-900">Groups</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href="/dashboard/groups/join"
              className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-lg shadow-md transition-all hover:shadow-lg"
            >
              Join Group
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Group Card */}
          <a href="/dashboard/groups/create" className="bg-transparent backdrop-blur-sm h-full flex flex-col items-center justify-center text-center border-2 border-dashed border-purple-400 hover:border-purple-600 transition-all group rounded-xl p-6 shadow-sm hover:shadow-md">
            <div className="w-20 h-20 rounded-full bg-purple-200 flex items-center justify-center mb-4 group-hover:bg-purple-300 transition-all shadow-inner">
              <span className="text-4xl text-purple-700 font-light">+</span>
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Create New Group</h3>
            <p className="text-purple-700">Start tracking your progress together with friends</p>
          </a>

          {groups && groups.length > 0 ? (
            groups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))
          ) : (
            <p className="text-purple-800 bg-purple-50 p-4 rounded-lg border border-purple-100">You are not a member of any groups yet.</p>
          )}
        </div>
      </section>
    </div>
  );
} 