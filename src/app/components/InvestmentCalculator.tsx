
import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react';

interface InvestmentCalculatorProps {
    propertyPrice: number;
    className?: string;
}

export function InvestmentCalculator({ propertyPrice, className = '' }: InvestmentCalculatorProps) {
    // State for inputs
    const [downPaymentPercent, setDownPaymentPercent] = useState(20);
    const [interestRate, setInterestRate] = useState(7.5);
    const [loanTerm, setLoanTerm] = useState(30);

    // State for Results
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [downPaymentAmount, setDownPaymentAmount] = useState(0);
    const [loanAmount, setLoanAmount] = useState(0);

    // Calculation Logic
    useEffect(() => {
        // 1. Calculate Down Payment & Loan Principal
        const dpAmount = (propertyPrice * downPaymentPercent) / 100;
        const principal = propertyPrice - dpAmount;

        setDownPaymentAmount(dpAmount);
        setLoanAmount(principal);

        // 2. Calculate Monthly Mortgage: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
        if (principal > 0 && interestRate > 0) {
            const monthlyRate = interestRate / 100 / 12;
            const numberOfPayments = loanTerm * 12;

            const mortgage =
                principal *
                ((monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                    (Math.pow(1 + monthlyRate, numberOfPayments) - 1));

            setMonthlyPayment(isFinite(mortgage) ? mortgage : 0);
        } else {
            setMonthlyPayment(0);
        }
    }, [propertyPrice, downPaymentPercent, interestRate, loanTerm]);

    // Format Currency Helper
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8 ${className}`}>
            <div className="flex items-center gap-2 mb-6 text-gray-800">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-800">
                    <Calculator size={20} />
                </div>
                <h3 className="text-xl font-bold">Investment Calculator</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs Section */}
                <div className="space-y-6">
                    {/* Property Price (Read-only) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-500 mb-1">Property Price</label>
                        <div className="text-2xl font-bold text-gray-900">{formatCurrency(propertyPrice)}</div>
                    </div>

                    {/* Down Payment Slider */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">Down Payment</label>
                            <span className="text-sm font-bold text-blue-800 bg-blue-50 px-2 py-1 rounded">
                                {downPaymentPercent}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={downPaymentPercent}
                            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Amount: <span className="font-medium">{formatCurrency(downPaymentAmount)}</span>
                        </p>
                    </div>

                    {/* Interest Rate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                        <div className="relative">
                            <Percent size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="number"
                                min="0"
                                max="20"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Loan Term */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setLoanTerm(15)}
                                className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${loanTerm === 15
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                15 Years
                            </button>
                            <button
                                onClick={() => setLoanTerm(30)}
                                className={`py-2 px-4 rounded-lg text-sm font-medium border transition-all ${loanTerm === 30
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                30 Years
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-center border border-gray-100">
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-500 mb-1">Estimated Monthly Payment</p>
                        <p className="text-4xl font-extrabold text-gray-900 tracking-tight">
                            {formatCurrency(monthlyPayment)}
                            <span className="text-lg font-medium text-gray-400 ml-1">/mo</span>
                        </p>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Loan Amount</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(loanAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Payments ({loanTerm * 12})</span>
                            <span className="font-semibold text-gray-900">{formatCurrency(monthlyPayment * loanTerm * 12)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Interest</span>
                            <span className="font-semibold text-gray-900">
                                {formatCurrency((monthlyPayment * loanTerm * 12) - loanAmount)}
                            </span>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <p className="text-[10px] text-gray-400 italic leading-relaxed text-center">
                            * Legal Disclaimer: This calculator provides estimates for informational purposes only and does not constitute a loan offer or financial advice. Actual rates and payments may vary based on your credit history, market conditions, and lender requirements.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
