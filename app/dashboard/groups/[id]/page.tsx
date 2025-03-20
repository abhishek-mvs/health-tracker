import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';
import GroupDetails from '@/app/components/GroupDetails';
import GroupMembers from '@/app/components/GroupMembers';
import WeightGraph from '@/app/components/WeightGraph';

// Use a simpler approach without type annotations
export default async function GroupDetailsPage(props: any) {
  const { id } = await props.params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get group details
  const { data: group } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single();

  if (!group) {
    notFound();
  }

  // Check if user is a member
  const { data: membership } = await supabase
    .from('groupMembers')
    .select('*')
    .eq('group_id', id)
    .eq('user_id', user?.id)
    .single();

  if (!membership) {
    // User is not a member of this group but can join
    return (
      <div className="bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm text-center">
        <h1 className="text-2xl font-bold mb-4 text-purple-900">Join This Group</h1>
        <p className="mb-4 text-purple-800">You are not currently a member of this group.</p>
        <a
          href={`/dashboard/groups/join?groupId=${id}&autoFill=true`}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold inline-block shadow-md transition-all hover:shadow-lg"
        >
          Join Group
        </a>
      </div>
    );
  }

  // Get group members
  const { data: members } = await supabase
    .from('groupMembers')
    .select('user_id')
    .eq('group_id', id);

  const memberIds = members?.map(member => member.user_id) || [];

  // Get weight logs for all members
  const { data: weightLogs } = await supabase
    .from('userWeightLog')
    .select('*')
    .in('user_id', memberIds)
    .order('log_date', { ascending: true });
  console.log("weightLogs", weightLogs);
  // Get member profiles
  const { data: profiles } = await supabase
    .from('profile')
    .select('*')
    .in('id', memberIds);
  console.log("profiles", profiles);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <GroupDetails
          group={group}
          isOwner={group.created_by === user?.id}
          memberCount={memberIds.length}
        />
      </div>

      <div className="md:col-span-2 bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-4 text-purple-900">Weight Progress</h2>
        <WeightGraph weightLogs={weightLogs || []} profiles={profiles || []} />
      </div>

      <div className="md:col-span-3 bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-4 text-purple-900">Group Members</h2>
        <GroupMembers
          members={profiles || []}
          isOwner={group.created_by === user?.id}
          groupId={id}
        />
      </div>
    </div>
  );
} 