'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/contexts/SupabaseContext';
import { toast } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function WeightEntryForm({ userId, onWeightLogged }: { 
  userId: string;
  onWeightLogged?: () => void;
}) {
  const [weight, setWeight] = useState<number | ''>('');
  const [steps, setSteps] = useState<number | ''>('');
  const [date, setDate] = useState(() => {
    // Set to current date at 00:00 GMT
    const today = new Date();
    return new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { supabase, session } = useSupabase();

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
    
    if (weight === '') {
      toast.error('Please enter your weight');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.from('userHealthLog').insert({
        user_id: session?.user.id || userId,
        weight: weight as number,
        steps: steps === '' ? null : steps as number,
        log_date: date.toISOString(),
      });
      
      if (error) throw error;
      
      toast.success('Weight and steps logged successfully!');
      setWeight('');
      setSteps('');
      onWeightLogged?.();
      router.refresh();
    } catch (error) {
      console.error('Error logging weight:', error);
      toast.error('Failed to log weight and steps');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (selectedDate: Date | null) => {
    if (selectedDate) {
      // Ensure the date is set to 00:00 GMT
      const normalizedDate = new Date(Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0, 0, 0
      ));
      setDate(normalizedDate);
    } else {
      // If null is passed, set to today at 00:00 GMT
      const today = new Date();
      setDate(new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Log Health Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <DatePicker
            selected={date}
            onChange={handleDateChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            maxDate={new Date()}
            dateFormat="MMMM d, yyyy"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <input
            id="weight"
            type="number"
            min="1"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value ? parseFloat(e.target.value) : '')}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your weight"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
            Steps (optional)
          </label>
          <input
            id="steps"
            type="number"
            min="0"
            value={steps}
            onChange={(e) => setSteps(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your steps"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || weight === ''}
          className={`w-full p-2 rounded-md text-white ${
            loading || weight === '' ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging...' : 'Log Health Data'}
        </button>
      </form>
    </div>
  );
} 