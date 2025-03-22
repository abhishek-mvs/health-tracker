'use client';

import { useState } from 'react';
import WeightGraph from './WeightGraph';
import StepsGraph from './StepsGraph';

type GraphToggleProps = {
  weightLogs: any[];
  profiles: any[];
};

export default function Graphs({ weightLogs, profiles }: GraphToggleProps) {
  const [activeGraph, setActiveGraph] = useState<'weight' | 'steps'>('weight');

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-900">
          {activeGraph === 'weight' ? 'Weight Progress' : 'Steps Progress'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveGraph('weight')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeGraph === 'weight'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            Weight
          </button>
          <button
            onClick={() => setActiveGraph('steps')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeGraph === 'steps'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
            }`}
          >
            Steps
          </button>
        </div>
      </div>

      {activeGraph === 'weight' ? (
        <WeightGraph weightLogs={weightLogs} profiles={profiles} />
      ) : (
        <StepsGraph logs={weightLogs} profiles={profiles} />
      )}
    </div>
  );
} 