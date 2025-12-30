import React from 'react';
import { Building2, Users, DollarSign, TrendingUp } from 'lucide-react';

interface TrustStripProps {
  className?: string;
}

export function TrustStrip({ className = '' }: TrustStripProps) {
  const metrics = [
    { icon: <Building2 size={32} />, value: '50K+', label: 'Properties Listed' },
    { icon: <Users size={32} />, value: '100K+', label: 'Active Users' },
    { icon: <DollarSign size={32} />, value: '$2.5B+', label: 'Transaction Volume' },
    { icon: <TrendingUp size={32} />, value: '98%', label: 'Client Satisfaction' }
  ];

  return (
    <div className={`bg-white border-t border-b border-[var(--gray-200)] py-12 ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-3 text-[var(--emerald-700)]">
                {metric.icon}
              </div>
              <div className="text-3xl font-semibold text-[var(--gray-900)] mb-1">
                {metric.value}
              </div>
              <div className="text-sm text-[var(--gray-600)]">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
