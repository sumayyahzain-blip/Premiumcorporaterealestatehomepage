import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyForm, { PropertyFormData } from '../../components/PropertyForm';
import { api } from '../../../services/api';
import { showSuccessToast, showErrorToast } from '../../components/ToastContainer';

export default function CreatePropertyPage() {
    const navigate = useNavigate();

    const handleSubmit = async (data: PropertyFormData) => {
        try {
            // Note: API wrapper handles auth token automatically
            const response = await api.properties.create(data);

            if (response.success) {
                showSuccessToast('Success', 'Property listed successfully!');
                navigate('/properties');
            } else {
                showErrorToast('Error', response.error?.message || 'Failed to list property');
            }
        } catch (err) {
            console.error(err);
            showErrorToast('Error', 'An unexpected error occurred');
        }
    };

    return (
        <PropertyForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={() => navigate('/properties')}
        />
    );
}