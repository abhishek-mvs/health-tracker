import { createClient } from "@/utils/supabase/server";
import Link from 'next/link';
import WeightEntryForm from '@/app/components/WeightEntryForm';
import GroupCard from '@/app/components/GroupCard';

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Get groups the user is a member of
  const { data: memberGroups } = await supabase
    .from('groupMembers')
    .select('group_id')
    .eq('user_id', user?.id);
  
  const groupIds = memberGroups?.map(member => member.group_id) || [];
  
  // Get group details
  const { data: groups } = await supabase
    .from('groups')
    .select('*, groupMembers(count)')
    .in('id', groupIds);

  return (
    <div className="space-y-8">
      <section className="glass p-6">
        <h2 className="text-xl font-bold mb-4">Log Your Weight</h2>
        <WeightEntryForm userId={user?.id} />
      </section>
      
      <section className="glass p-6">
        <h2 className="text-xl font-bold mb-4">Groups</h2>
        <div className="flex space-x-4 mb-6">
          <Link 
            href="/dashboard/groups/create" 
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Create Group
          </Link>
          <Link 
            href="/dashboard/groups/join" 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Join Group
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups && groups.length > 0 ? (
            groups.map(group => (
              <GroupCard key={group.id} group={group} />
            ))
          ) : (
            <p>You are not a member of any groups yet.</p>
          )}
        </div>
      </section>
    </div>
  );
} 