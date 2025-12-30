import React from 'react';
import { X, Lock, TrendingUp, FileText, Bell } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'yield' | 'alerts' | 'export' | null;
}

export function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
  if (!isOpen || !feature) return null;

  const modalContent = {
    yield: {
      icon: <TrendingUp className="w-12 h-12 text-[var(--emerald-600)]" />,
      title: 'Unlock Advanced Yield Analytics',
      description: 'Get detailed ROI projections, cash flow analysis, and comparative yield metrics across your portfolio.',
      features: [
        'Cap rate calculations',
        'Cash-on-cash return analysis',
        'Market comparison data',
        'Historical performance trends'
      ],
      price: '$49/month',
      plan: 'Investor Pro'
    },
    alerts: {
      icon: <Bell className="w-12 h-12 text-[var(--emerald-600)]" />,
      title: 'Track Areas with Smart Alerts',
      description: 'Set up custom alerts for specific neighborhoods, price ranges, and property types to never miss an opportunity.',
      features: [
        'Price drop notifications',
        'New listing alerts',
        'Market trend updates',
        'Custom area monitoring'
      ],
      price: '$49/month',
      plan: 'Investor Pro'
    },
    export: {
      icon: <FileText className="w-12 h-12 text-[var(--emerald-600)]" />,
      title: 'Export Financial Data',
      description: 'Download comprehensive financial reports, property analytics, and portfolio summaries for tax planning and analysis.',
      features: [
        'CSV and Excel export',
        'Customizable date ranges',
        'Tax-ready reports',
        'Portfolio summaries'
      ],
      price: '$49/month',
      plan: 'Investor Pro'
    }
  };

  const content = modalContent[feature];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-[var(--gray-400)] hover:text-[var(--gray-600)] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="mb-4 p-4 bg-[var(--emerald-50)] rounded-full">
              {content.icon}
            </div>
            <h3 className="mb-3 text-[var(--gray-900)]">{content.title}</h3>
            <p className="text-[var(--gray-600)] max-w-md">
              {content.description}
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-3 mb-6">
            {content.features.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[var(--emerald-100)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--emerald-600)]" />
                </div>
                <span className="text-sm text-[var(--gray-700)]">{item}</span>
              </div>
            ))}
          </div>
          
          {/* Pricing */}
          <div className="bg-[var(--gray-50)] rounded-xl p-4 mb-6">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-sm text-[var(--gray-600)]">{content.plan}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-[var(--gray-900)]">
                  {content.price.split('/')[0]}
                </span>
                <span className="text-sm text-[var(--gray-500)]">
                  /{content.price.split('/')[1]}
                </span>
              </div>
            </div>
            <p className="text-xs text-[var(--gray-500)]">Cancel anytime. No long-term commitment.</p>
          </div>
          
          {/* CTAs */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-[var(--gray-100)] hover:bg-[var(--gray-200)] text-[var(--gray-700)] rounded-xl transition-colors"
            >
              Not Now
            </button>
            <button
              className="flex-1 px-6 py-3 bg-[var(--gold-500)] hover:bg-[var(--gold-600)] text-white rounded-xl transition-colors"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
