import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Property } from '../../types';

interface ComparisonContextType {
    selectedProperties: Property[];
    addToCompare: (property: Property) => void;
    removeFromCompare: (id: number | string) => void;
    clearComparison: () => void;
    isInComparison: (id: number | string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function ComparisonProvider({ children }: { children: ReactNode }) {
    const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);

    const addToCompare = (property: Property) => {
        if (selectedProperties.length >= 3) {
            // Optional: You could show a toast notification here
            console.warn("Comparison limit reached (Max 3)");
            return;
        }
        if (!selectedProperties.find(p => p.id === property.id)) {
            setSelectedProperties(prev => [...prev, property]);
        }
    };

    const removeFromCompare = (id: number | string) => {
        setSelectedProperties(prev => prev.filter(p => p.id !== id));
    };

    const clearComparison = () => {
        setSelectedProperties([]);
    };

    const isInComparison = (id: number | string) => {
        return selectedProperties.some(p => p.id === id);
    };

    return (
        <ComparisonContext.Provider value={{
            selectedProperties,
            addToCompare,
            removeFromCompare,
            clearComparison,
            isInComparison
        }}>
            {children}
        </ComparisonContext.Provider>
    );
}

export function useComparison() {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
}
