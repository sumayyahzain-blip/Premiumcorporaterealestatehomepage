import React from 'react';
import { ArrowRight } from 'lucide-react';

interface IntentCardProps {
  icon: React.ReactNode;
  title: string;
  action: string;
  onClick?: () => void;
}

export function IntentCard({ icon, title, action, onClick }: IntentCardProps) {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-[var(--gray-200)] hover:border-[var(--emerald-600)] hover:-translate-y-1"
    >
      <div className="flex flex-col h-full">
        <div className="text-[var(--emerald-700)] mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-[var(--gray-900)] mb-2 text-xl">{title}</h3>
        <div className="flex items-center text-[var(--emerald-700)] mt-auto pt-4 group-hover:translate-x-1 transition-transform">
          <span className="mr-2">{action}</span>
          <ArrowRight size={18} />
        </div>
      </div>
    </button>
  );
}
