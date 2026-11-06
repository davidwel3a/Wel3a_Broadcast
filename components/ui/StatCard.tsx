import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: 'purple' | 'green' | 'red' | 'yellow';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  color = 'purple',
}) => {
  const colorStyles = {
    purple: 'text-accent border-accent/20 bg-accent/10',
    green: 'text-success border-success/20 bg-success/10',
    red: 'text-danger border-danger/20 bg-danger/10',
    yellow: 'text-warning border-warning/20 bg-warning/10',
  }[color];

  return (
    <div className="card-glass p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-text-muted mb-1">{label}</p>
        <h4 className="text-2xl font-bold text-text tracking-tight">{value}</h4>
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${colorStyles}`}>
        {icon}
      </div>
    </div>
  );
};
