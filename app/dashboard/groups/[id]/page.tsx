import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';
import GroupDetails from '@/app/components/GroupDetails';
import GroupMembers from '@/app/components/GroupMembers';
import WeightGraph from '@/app/components/WeightGraph';

// Use a simpler approach without type annotations
export default async function GroupDetailsPage(props: any) {
  const { id } = props.params;
  
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
    // User is not a member of this group
    return (
      <div className="glass p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You are not a member of this group.</p>
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
    .order('created_at', { ascending: true });
  
  // Get member profiles
  const { data: profiles } = await supabase
    .from('profile')
    .select('*')
    .in('id', memberIds);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <GroupDetails 
          group={group} 
          isOwner={group.created_by === user?.id} 
          memberCount={memberIds.length}
        />
      </div>
      
      <div className="md:col-span-2 glass p-6">
        <h2 className="text-xl font-bold mb-4">Weight Progress</h2>
        <WeightGraph weightLogs={weightLogs || []} profiles={profiles || []} />
      </div>
      
      <div className="md:col-span-3 glass p-6">
        <h2 className="text-xl font-bold mb-4">Group Members</h2>
        <GroupMembers 
          members={profiles || []} 
          isOwner={group.created_by === user?.id}
          groupId={id}
        />
      </div>
    </div>
  );
} 