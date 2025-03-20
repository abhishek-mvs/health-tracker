'use client';

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from 'react';

export default function WeightEntryForm({ userId }: { userId: string }) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const supabase = createClient();

  // Add custom styles for the DatePicker
  useEffect(() => {
    // Add custom CSS to style the datepicker
    const style = document.createElement('style');
    style.innerHTML = `
      .react-datepicker {
        font-family: Inter, system-ui, sans-serif;
        border-color: #e9d5ff !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        z-index: 50 !important;
      }
      .react-datepicker-wrapper {
        width: 100%;
      }
      .react-datepicker__header {
        background-color: #f3e8ff !important;
        border-bottom-color: #e9d5ff !important;
      }
      .react-datepicker__current-month {
        color: #6b21a8 !important;
        font-weight: 600;
      }
      .react-datepicker__day-name {
        color: #7e22ce !important;
      }
      .react-datepicker__day--selected {
        background-color: #9333ea !important;
      }
      .react-datepicker__day:hover {
        background-color: #e9d5ff !important;
      }
      .react-datepicker__day--keyboard-selected {
        background-color: #d8b4fe !important;
      }
      .react-datepicker__navigation {
        top: 10px;
      }
      .react-datepicker__triangle {
        display: none;
      }
      .react-datepicker-popper {
        z-index: 100 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          log_date: date.toISOString(),
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
        <label className="block mb-2 text-purple-800">Weight (kg)</label>
        <input
          type="number"
          step="0.1"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          className="w-full p-2 rounded-md bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900"
        />
      </div>

      <div className="relative">
        <label className="block mb-2 text-purple-800">Date</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date || new Date())}
          className="w-full p-2 rounded-md bg-purple-50 border border-purple-200 focus:border-purple-500 focus:outline-none text-purple-900"
          maxDate={new Date()}
          popperClassName="react-datepicker-popper"
          popperPlacement="bottom-start"
          portalId="datepicker-portal"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-white transition-all shadow-md hover:shadow-lg"
      >
        {loading ? 'Logging...' : 'Log Weight'}
      </button>

      {message && (
        <p className={`p-2 rounded-md ${message.includes('Failed') ? 'bg-rose-100 text-rose-600' : 'bg-purple-100 text-purple-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
} 