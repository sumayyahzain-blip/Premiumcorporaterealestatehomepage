/**
 * GRADE A REALTY - Property Form Component
 * Create/Edit property listing form
 * Phase 1 Implementation
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    DollarSign,
    Ruler,
    BedDouble,
    Bath,
    Car,
    Calendar,
    Save,
    X,
    ArrowLeft,
    Loader2,
    Check,
    AlertCircle,
    Home,
    Building,
    Trees,
    Store,
    Mountain,
} from 'lucide-react';
import ImageUpload, { UploadedImage } from './ImageUpload';
import { showSuccessToast, showErrorToast } from '../../store';
import {
    PROPERTY_TYPES,
    LISTING_TYPES,
    RENT_PERIODS,
    AMENITIES,
    US_STATES,
} from '../../utils/constants';
import { formatCurrency } from '../../utils';

// =============================================================================
// TYPES
// =============================================================================

export interface PropertyFormData {
    // Basic Info
    title: string;
    description: string;
    propertyType: string;
    listingType: string;

    // Pricing
    salePrice: string;
    rentPrice: string;
    rentPeriod: string;

    // Location
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    postalCode: string;
    latitude: string;
    longitude: string;

    // Details
    bedrooms: string;
    bathrooms: string;
    squareFeet: string;
    lotSize: string;
    yearBuilt: string;
    parkingSpaces: string;

    // Features
    amenities: string[];

    // Images
    images: UploadedImage[];

    // Availability
    availableFrom: string;
}

interface PropertyFormProps {
    mode: 'create' | 'edit';
    initialData?: Partial<PropertyFormData>;
    propertyId?: string;
    onSubmit?: (data: PropertyFormData) => Promise<void>;
    onCancel?: () => void;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const INITIAL_FORM_DATA: PropertyFormData = {
    title: '',
    description: '',
    propertyType: 'house',
    listingType: 'sale',
    salePrice: '',
    rentPrice: '',
    rentPeriod: 'monthly',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    latitude: '',
    longitude: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    lotSize: '',
    yearBuilt: '',
    parkingSpaces: '',
    amenities: [],
    images: [],
    availableFrom: '',
};

const PROPERTY_TYPE_ICONS: Record<string, React.ReactNode> = {
    house: <Home className="w-5 h-5" />,
    apartment: <Building className="w-5 h-5" />,
    condo: <Building2 className="w-5 h-5" />,
    townhouse: <Building className="w-5 h-5" />,
    commercial: <Store className="w-5 h-5" />,
    land: <Mountain className="w-5 h-5" />,
};

// =============================================================================
// COMPONENT
// =============================================================================

export default function PropertyForm({
    mode,
    initialData,
    propertyId,
    onSubmit,
    onCancel,
}: PropertyFormProps) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<PropertyFormData>({
        ...INITIAL_FORM_DATA,
        ...initialData,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof PropertyFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const totalSteps = 4;

    // Form field handlers
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (errors[name as keyof PropertyFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    const handleImagesChange = (images: UploadedImage[]) => {
        setFormData((prev) => ({ ...prev, images }));
    };

    // Validation
    const validateStep = (step: number): boolean => {
        const newErrors: Partial<Record<keyof PropertyFormData, string>> = {};

        switch (step) {
            case 1: // Basic Info
                if (!formData.title.trim()) {
                    newErrors.title = 'Title is required';
                }
                if (!formData.description.trim()) {
                    newErrors.description = 'Description is required';
                } else if (formData.description.length < 50) {
                    newErrors.description = 'Description must be at least 50 characters';
                }
                break;

            case 2: // Location & Pricing
                if (!formData.addressLine1.trim()) {
                    newErrors.addressLine1 = 'Address is required';
                }
                if (!formData.city.trim()) {
                    newErrors.city = 'City is required';
                }
                if (!formData.state) {
                    newErrors.state = 'State is required';
                }
                if (!formData.postalCode.trim()) {
                    newErrors.postalCode = 'Postal code is required';
                }
                if (formData.listingType === 'sale' || formData.listingType === 'both') {
                    if (!formData.salePrice) {
                        newErrors.salePrice = 'Sale price is required';
                    }
                }
                if (formData.listingType === 'rent' || formData.listingType === 'both') {
                    if (!formData.rentPrice) {
                        newErrors.rentPrice = 'Rent price is required';
                    }
                }
                break;

            case 3: // Details
                if (!formData.bedrooms) {
                    newErrors.bedrooms = 'Bedrooms is required';
                }
                if (!formData.bathrooms) {
                    newErrors.bathrooms = 'Bathrooms is required';
                }
                if (!formData.squareFeet) {
                    newErrors.squareFeet = 'Square feet is required';
                }
                break;

            case 4: // Images
                if (formData.images.length === 0) {
                    newErrors.images = 'At least one image is required';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrev = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all steps
        let isValid = true;
        for (let step = 1; step <= totalSteps; step++) {
            if (!validateStep(step)) {
                setCurrentStep(step);
                isValid = false;
                break;
            }
        }

        if (!isValid) return;

        setIsSubmitting(true);

        try {
            if (onSubmit) {
                await onSubmit(formData);
            } else {
                // Default mock submit
                await new Promise((resolve) => setTimeout(resolve, 2000));
                showSuccessToast(
                    mode === 'create' ? 'Property Created!' : 'Property Updated!',
                    mode === 'create'
                        ? 'Your listing has been submitted for approval.'
                        : 'Changes have been saved.'
                );
                navigate('/dashboard');
            }
        } catch (error) {
            showErrorToast('Error', 'Failed to save property. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            navigate(-1);
        }
    };

    // Render step indicators
    const renderStepIndicators = () => (
        <div className="flex items-center justify-center gap-2 mb-8">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <React.Fragment key={step}>
                    <button
                        onClick={() => step < currentStep && setCurrentStep(step)}
                        disabled={step > currentStep}
                        className={`
              w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all
              ${step === currentStep
                                ? 'bg-amber-500 text-white'
                                : step < currentStep
                                    ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                            }
            `}
                    >
                        {step < currentStep ? <Check className="w-5 h-5" /> : step}
                    </button>
                    {step < totalSteps && (
                        <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-green-500' : 'bg-white/10'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );

    // Render steps
    const renderStep1 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Basic Information</h3>

            {/* Property Type */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                    Property Type
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {PROPERTY_TYPES.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, propertyType: type.value }))}
                            className={`
                p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all
                ${formData.propertyType === type.value
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                    : 'border-white/10 text-gray-400 hover:border-white/30'
                                }
              `}
                        >
                            {PROPERTY_TYPE_ICONS[type.value]}
                            <span className="text-xs font-medium">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Listing Type */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                    Listing Type
                </label>
                <div className="flex gap-3">
                    {LISTING_TYPES.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, listingType: type.value }))}
                            className={`
                flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all
                ${formData.listingType === type.value
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                                    : 'border-white/10 text-gray-400 hover:border-white/30'
                                }
              `}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Listing Title *
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Beautiful Modern Home with Ocean Views"
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.title ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                        }`}
                />
                {errors.title && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Describe the property, its features, nearby amenities, neighborhood..."
                    className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all resize-none ${errors.description ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                        }`}
                />
                <div className="flex justify-between mt-1">
                    {errors.description ? (
                        <p className="text-red-400 text-sm flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.description}
                        </p>
                    ) : (
                        <span />
                    )}
                    <span className={`text-xs ${formData.description.length < 50 ? 'text-gray-500' : 'text-green-400'}`}>
                        {formData.description.length}/50 min
                    </span>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Location & Pricing</h3>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Street Address *
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="addressLine1"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            placeholder="123 Main Street"
                            className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.addressLine1 ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                                }`}
                        />
                    </div>
                    {errors.addressLine1 && (
                        <p className="text-red-400 text-sm mt-1">{errors.addressLine1}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Address Line 2
                    </label>
                    <input
                        type="text"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        placeholder="Apt, Suite, Unit, etc."
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        City *
                    </label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="San Francisco"
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.city ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                            }`}
                    />
                    {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        State *
                    </label>
                    <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.state ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                            }`}
                    >
                        <option value="">Select State</option>
                        {US_STATES.map((state) => (
                            <option key={state.value} value={state.value}>
                                {state.label}
                            </option>
                        ))}
                    </select>
                    {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Postal Code *
                    </label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="94105"
                        className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.postalCode ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                            }`}
                    />
                    {errors.postalCode && <p className="text-red-400 text-sm mt-1">{errors.postalCode}</p>}
                </div>
            </div>

            {/* Pricing */}
            <div className="pt-4 border-t border-white/10">
                <h4 className="text-md font-medium text-white mb-4">Pricing</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData.listingType === 'sale' || formData.listingType === 'both') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Sale Price *
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    name="salePrice"
                                    value={formData.salePrice}
                                    onChange={handleChange}
                                    placeholder="500000"
                                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.salePrice ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                                        }`}
                                />
                            </div>
                            {formData.salePrice && (
                                <p className="text-amber-400 text-sm mt-1">
                                    {formatCurrency(Number(formData.salePrice))}
                                </p>
                            )}
                            {errors.salePrice && <p className="text-red-400 text-sm mt-1">{errors.salePrice}</p>}
                        </div>
                    )}

                    {(formData.listingType === 'rent' || formData.listingType === 'both') && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rent Price *
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="rentPrice"
                                        value={formData.rentPrice}
                                        onChange={handleChange}
                                        placeholder="2500"
                                        className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.rentPrice ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                                            }`}
                                    />
                                </div>
                                {formData.rentPrice && (
                                    <p className="text-amber-400 text-sm mt-1">
                                        {formatCurrency(Number(formData.rentPrice))}/{formData.rentPeriod}
                                    </p>
                                )}
                                {errors.rentPrice && <p className="text-red-400 text-sm mt-1">{errors.rentPrice}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Rent Period
                                </label>
                                <select
                                    name="rentPeriod"
                                    value={formData.rentPeriod}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                                >
                                    {RENT_PERIODS.map((period) => (
                                        <option key={period.value} value={period.value}>
                                            {period.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Property Details</h3>

            {/* Core Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bedrooms *
                    </label>
                    <div className="relative">
                        <BedDouble className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            name="bedrooms"
                            value={formData.bedrooms}
                            onChange={handleChange}
                            min="0"
                            placeholder="3"
                            className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.bedrooms ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                                }`}
                        />
                    </div>
                    {errors.bedrooms && <p className="text-red-400 text-sm mt-1">{errors.bedrooms}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bathrooms *
                    </label>
                    <div className="relative">
                        <Bath className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            name="bathrooms"
                            value={formData.bathrooms}
                            onChange={handleChange}
                            min="0"
                            step="0.5"
                            placeholder="2"
                            className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.bathrooms ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                                }`}
                        />
                    </div>
                    {errors.bathrooms && <p className="text-red-400 text-sm mt-1">{errors.bathrooms}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Square Feet *
                    </label>
                    <div className="relative">
                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            name="squareFeet"
                            value={formData.squareFeet}
                            onChange={handleChange}
                            min="0"
                            placeholder="1500"
                            className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${errors.squareFeet ? 'border-red-500' : 'border-white/10 focus:border-amber-500'
                                }`}
                        />
                    </div>
                    {errors.squareFeet && <p className="text-red-400 text-sm mt-1">{errors.squareFeet}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Parking Spaces
                    </label>
                    <div className="relative">
                        <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            name="parkingSpaces"
                            value={formData.parkingSpaces}
                            onChange={handleChange}
                            min="0"
                            placeholder="2"
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Year Built
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            name="yearBuilt"
                            value={formData.yearBuilt}
                            onChange={handleChange}
                            min="1800"
                            max={new Date().getFullYear()}
                            placeholder="2020"
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Lot Size (sqft)
                    </label>
                    <div className="relative">
                        <Trees className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            name="lotSize"
                            value={formData.lotSize}
                            onChange={handleChange}
                            min="0"
                            placeholder="5000"
                            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Amenities */}
            <div className="pt-4 border-t border-white/10">
                <h4 className="text-md font-medium text-white mb-4">Amenities & Features</h4>

                <div className="flex flex-wrap gap-2">
                    {AMENITIES.map((amenity) => (
                        <button
                            key={amenity}
                            type="button"
                            onClick={() => handleAmenityToggle(amenity)}
                            className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${formData.amenities.includes(amenity)
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                                }
              `}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>

                <p className="text-gray-500 text-sm mt-3">
                    {formData.amenities.length} amenities selected
                </p>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-white/10">
                <h4 className="text-md font-medium text-white mb-4">Availability</h4>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Available From
                    </label>
                    <input
                        type="date"
                        name="availableFrom"
                        value={formData.availableFrom}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full md:w-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Property Images</h3>
                <span className="text-sm text-gray-400">
                    First image will be the primary listing photo
                </span>
            </div>

            {errors.images && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.images}
                </div>
            )}

            <ImageUpload
                images={formData.images}
                onChange={handleImagesChange}
                maxImages={20}
                maxSizeMB={10}
            />
        </div>
    );

    // Main render
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={handleCancel}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-white" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {mode === 'create' ? 'List New Property' : 'Edit Property'}
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {mode === 'create'
                                ? 'Fill in the details to create your property listing'
                                : 'Update your property listing details'}
                        </p>
                    </div>
                </div>

                {/* Step Indicators */}
                {renderStepIndicators()}

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8">
                    <form onSubmit={handleSubmit}>
                        {/* Step Content */}
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                            <button
                                type="button"
                                onClick={currentStep === 1 ? handleCancel : handlePrev}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                            >
                                {currentStep === 1 ? (
                                    <>
                                        <X className="w-5 h-5" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <ArrowLeft className="w-5 h-5" />
                                        Previous
                                    </>
                                )}
                            </button>

                            {currentStep < totalSteps ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center gap-2"
                                >
                                    Next Step
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {mode === 'create' ? 'Creating...' : 'Saving...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {mode === 'create' ? 'Create Listing' : 'Save Changes'}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
