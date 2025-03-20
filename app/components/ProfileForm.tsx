'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

type ProfileFormProps = {
  profile: {
    id: string;
    full_name: string;
    height: number;
    weight: number;
    avatar_url: string | null;
  } | null;
};

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const updates = {
        id: userData.user.id,
        full_name: fullName,
        height: parseFloat(height),
        weight: parseFloat(weight),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from('profile').upsert(updates);

      if (error) throw error;
      
      setMessage('Profile updated successfully!');
      router.refresh();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-600"
        />
      </div>
      
      <div>
        <label className="block mb-2">Height (cm)</label>
        <input
          type="number"
          step="0.1"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
          className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-600"
        />
      </div>
      
      <div>
        <label className="block mb-2">Weight (kg)</label>
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-600"
        />
      </div>
      
      <div>
        <label className="block mb-2">Avatar URL (optional)</label>
        <input
          type="url"
          value={avatarUrl || ''}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-600"
        />
      </div>
      
      {message && (
        <p className={message.includes('Error') ? 'text-red-400' : 'text-green-400'}>
          {message}
        </p>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
} 