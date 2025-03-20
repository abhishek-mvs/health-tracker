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
        <label className="block mb-2 text-purple-800">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full p-2 rounded-lg bg-white/80 border border-purple-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 text-purple-900"
        />
      </div>

      <div>
        <label className="block mb-2 text-purple-800">Height (cm)</label>
        <input
          type="number"
          step="0.1"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
          className="w-full p-2 rounded-lg bg-white/80 border border-purple-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 text-purple-900"
        />
      </div>

      <div>
        <label className="block mb-2 text-purple-800">Weight (kg)</label>
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          className="w-full p-2 rounded-lg bg-white/80 border border-purple-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 text-purple-900"
        />
      </div>

      <div>
        <label className="block mb-2 text-purple-800">Avatar URL (optional)</label>
        <input
          type="url"
          value={avatarUrl || ''}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="w-full p-2 rounded-lg bg-white/80 border border-purple-200 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-200 text-purple-900"
        />
      </div>

      {message && (
        <p className={message.includes('Error') ? 'text-rose-500 bg-rose-100 p-2 rounded-lg' : 'text-green-600 bg-green-100 p-2 rounded-lg'}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-white shadow-md transition-all hover:shadow-lg"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
} 