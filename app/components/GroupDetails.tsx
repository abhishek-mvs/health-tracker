'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

type GroupDetailsProps = {
  group: {
    id: string;
    title: string;
    description: string | null;
    created_by: string;
  };
  isOwner: boolean;
  memberCount: number;
};

export default function GroupDetails({ group, isOwner, memberCount }: GroupDetailsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLeaveGroup = async () => {
    setLoading(true);
    setError('');

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error: leaveError } = await supabase
        .from('groupMembers')
        .delete()
        .eq('group_id', group.id)
        .eq('user_id', userData.user.id);

      if (leaveError) throw leaveError;

      router.push('/dashboard/groups');
    } catch (err: any) {
      console.error('Error leaving group:', err);
      setError(err.message || 'Failed to leave group');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (memberCount > 1) {
      setError('Cannot delete group with active members');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Delete group members first
      console.log("deleting group members", group.id);
      const { data: members } = await supabase
        .from('groupMembers')
        .select('*')
        .eq('group_id', group.id);
      console.log("members", members);


      const { error: membersError } = await supabase
        .from('groupMembers')
        .delete()
        .eq('group_id', group.id);
      console.log("membersError", membersError);
      if (membersError) throw membersError;

      // Then delete the group
      console.log("deleting group", group.id);
      const { error: groupError } = await supabase
        .from('groups')
        .delete()
        .eq('id', group.id);

      if (groupError) throw groupError;

      router.push('/dashboard/groups');
    } catch (err: any) {
      console.error('Error deleting group:', err);
      setError(err.message || 'Failed to delete group');
    } finally {
      setLoading(false);
    }
  };

  const copyGroupId = () => {
    navigator.clipboard.writeText(group.id);
    alert('Group ID copied to clipboard!');
  };

  const copyJoinLink = () => {
    // Create a magic link that includes the group ID and autoFill parameter
    const joinLink = `${window.location.origin}/dashboard/groups/join?groupId=${group.id}&autoFill=true`;
    navigator.clipboard.writeText(joinLink);
    alert('Invite link copied to clipboard! Share this with others to join your group.');
  };

  return (
    <div className="bg-white/90 shadow-lg rounded-xl p-6 backdrop-blur-sm h-full">
      <h1 className="text-2xl font-bold mb-2 text-purple-900">{group.title}</h1>
      <p className="text-purple-800 mb-6">{group.description || 'No description'}</p>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1 text-purple-900">Invite Link</h3>
          <button
            onClick={copyJoinLink}
            className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-white shadow-md transition-all hover:shadow-lg flex items-center justify-center"
          >
            <span className="mr-2">Copy Invite Link</span> 🔗
          </button>
          <p className="text-sm mt-1 text-purple-700">Share this link for one-click joining</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1 text-purple-900">Members</h3>
          <p className="text-purple-800">{memberCount} member{memberCount !== 1 ? 's' : ''}</p>
        </div>

        {error && <p className="text-rose-500 bg-rose-100 p-2 rounded-lg">{error}</p>}

        <div className="pt-4 border-t border-purple-200">
          {isOwner ? (
            <>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-rose-400 hover:bg-rose-500 py-2 rounded-lg text-white shadow-md transition-all hover:shadow-lg"
                  disabled={loading}
                >
                  Delete Group
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-rose-500 bg-rose-100 p-2 rounded-lg">
                    {memberCount > 1
                      ? 'Cannot delete group with active members'
                      : 'Are you sure you want to delete this group? This action cannot be undone.'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDeleteGroup}
                      className="flex-1 bg-rose-400 hover:bg-rose-500 py-2 rounded-lg text-white shadow-md transition-all hover:shadow-lg"
                      disabled={loading || memberCount > 1}
                    >
                      {loading ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-purple-200 hover:bg-purple-300 py-2 rounded-lg text-purple-800 shadow-md transition-all hover:shadow-lg"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={handleLeaveGroup}
              className="w-full bg-rose-400 hover:bg-rose-500 py-2 rounded-lg text-white shadow-md transition-all hover:shadow-lg"
              disabled={loading}
            >
              {loading ? 'Leaving...' : 'Leave Group'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 