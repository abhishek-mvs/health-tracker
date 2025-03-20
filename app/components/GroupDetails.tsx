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
      const { error: membersError } = await supabase
        .from('groupMembers')
        .delete()
        .eq('group_id', group.id);

      if (membersError) throw membersError;

      // Then delete the group
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

  return (
    <div className="glass p-6 h-full">
      <h1 className="text-2xl font-bold mb-2">{group.title}</h1>
      <p className="text-gray-300 mb-6">{group.description || 'No description'}</p>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Group ID</h3>
          <div className="flex items-center">
            <code className="bg-black bg-opacity-50 p-2 rounded flex-1 overflow-x-auto">
              {group.id}
            </code>
            <button 
              onClick={copyGroupId}
              className="ml-2 p-2 bg-blue-600 hover:bg-blue-700 rounded"
              title="Copy Group ID"
            >
              📋
            </button>
          </div>
          <p className="text-sm mt-1">Share this ID with others to join your group</p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-1">Members</h3>
          <p>{memberCount} member{memberCount !== 1 ? 's' : ''}</p>
        </div>
        
        {error && <p className="text-red-400">{error}</p>}
        
        <div className="pt-4 border-t border-gray-700">
          {isOwner ? (
            <>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
                  disabled={loading}
                >
                  Delete Group
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-red-400">
                    {memberCount > 1 
                      ? 'Cannot delete group with active members' 
                      : 'Are you sure you want to delete this group? This action cannot be undone.'}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleDeleteGroup}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded"
                      disabled={loading || memberCount > 1}
                    >
                      {loading ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded"
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
              className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
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