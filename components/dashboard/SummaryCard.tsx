import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <div className="text-lg font-semibold mb-2">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
};

export default SummaryCard; 