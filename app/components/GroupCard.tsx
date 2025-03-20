'use client';

import Link from 'next/link';

type GroupCardProps = {
  group: {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    groupMembers: { count: number } | null;
  };
};

export default function GroupCard({ group }: GroupCardProps) {
  const memberCount = group.groupMembers?.count || 0;
  const createdDate = new Date(group.created_at).toLocaleDateString();
  
  return (
    <Link href={`/dashboard/groups/${group.id}`}>
      <div className="glass p-5 rounded-lg transition-transform hover:scale-105 h-full flex flex-col">
        <h3 className="text-xl font-semibold mb-2">{group.title}</h3>
        <p className="text-gray-300 mb-4 flex-grow">
          {group.description || 'No description'}
        </p>
        <div className="flex justify-between text-sm text-gray-400">
          <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
          <span>Created: {createdDate}</span>
        </div>
      </div>
    </Link>
  );
} 