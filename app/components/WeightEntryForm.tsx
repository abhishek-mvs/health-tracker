'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function WeightEntryForm({ userId }: { userId: string }) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('userWeightLog')
        .insert({
          user_id: userId,
          status: parseFloat(weight),
          created_at: date.toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setMessage('Weight logged successfully!');
      setWeight('');
    } catch (error) {
      console.error('Error logging weight:', error);
      setMessage('Failed to log weight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <label className="block mb-2">Date</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date || new Date())}
          className="w-full p-2 rounded bg-black bg-opacity-50 border border-gray-600"
          maxDate={new Date()}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded"
      >
        {loading ? 'Logging...' : 'Log Weight'}
      </button>
      
      {message && (
        <p className={message.includes('Failed') ? 'text-red-400' : 'text-green-400'}>
          {message}
        </p>
      )}
    </form>
  );
} 