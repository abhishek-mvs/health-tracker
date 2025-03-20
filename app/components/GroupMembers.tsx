'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type MemberProfile = {
  id: string;
  full_name: string;
  avatar_url: string | null;
};

type GroupMembersProps = {
  members: MemberProfile[];
  isOwner: boolean;
  groupId: string;
};

export default function GroupMembers({ members, isOwner, groupId }: GroupMembersProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();
  
  const membersPerPage = 10;
  const totalPages = Math.ceil(members.length / membersPerPage);
  
  const currentMembers = members.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  );

  const handleRemoveMember = async (memberId: string) => {
    if (!isOwner) return;
    
    setLoading(memberId);
    setError('');

    try {
      const { error: removeError } = await supabase
        .from('groupMembers')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', memberId);

      if (removeError) throw removeError;
      
      router.refresh();
    } catch (err: any) {
      console.error('Error removing member:', err);
      setError(err.message || 'Failed to remove member');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-2">Member</th>
              {isOwner && <th className="text-right py-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentMembers.map(member => (
              <tr key={member.id} className="border-b border-gray-800">
                <td className="py-3">
                  <div className="flex items-center">
                    {member.avatar_url ? (
                      <Image 
                        src={member.avatar_url} 
                        alt={member.full_name} 
                        width={40} 
                        height={40}
                        className="rounded-full mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center mr-3">
                        {member.full_name.charAt(0)}
                      </div>
                    )}
                    <span>{member.full_name}</span>
                  </div>
                </td>
                {isOwner && (
                  <td className="text-right py-3">
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={loading === member.id}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      {loading === member.id ? 'Removing...' : 'Remove'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-3 py-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 