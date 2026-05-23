import { useState, useEffect } from 'react';
import { customerApi } from '../services/customerApi';

export function useCustomerMeasurements() {
    const [formData, setFormData] = useState({
        label: 'Default Profile',
        height_cm: '', weight_kg: '', neck_cm: '', shoulder_cm: '',
        chest_cm: '', bust_cm: '', waist_cm: '', hip_cm: '',
        arm_length_cm: '', sleeve_length_cm: '', bicep_cm: '', wrist_cm: '',
        thigh_cm: '', knee_cm: '', calf_cm: '', inseam_cm: '',
        outseam_cm: '', ankle_cm: '', notes: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

    useEffect(() => {
        const loadCustomerMeasurement = async () => {
            try {
                const result = await customerApi.getMeasurements();

                if (result.success && result.data) {
                    const measurementlist = result.data;

                    if (Array.isArray(measurementlist) && measurementlist.length > 0) {
                        const latestMeasurement = measurementlist[measurementlist.length - 1];
                        setFormData({
                            label: latestMeasurement.label || 'Default Profile',
                            height_cm: latestMeasurement.height_cm || '',
                            weight_kg: latestMeasurement.weight_kg || '',
                            neck_cm: latestMeasurement.neck_cm || '',
                            shoulder_cm: latestMeasurement.shoulder_cm || '',
                            chest_cm: latestMeasurement.chest_cm || '',
                            bust_cm: latestMeasurement.bust_cm || '',
                            waist_cm: latestMeasurement.waist_cm || '',
                            hip_cm: latestMeasurement.hip_cm || '',
                            arm_length_cm: latestMeasurement.arm_length_cm || '',
                            sleeve_length_cm: latestMeasurement.sleeve_length_cm || '',
                            bicep_cm: latestMeasurement.bicep_cm || '',
                            wrist_cm: latestMeasurement.wrist_cm || '',
                            thigh_cm: latestMeasurement.thigh_cm || '',
                            knee_cm: latestMeasurement.knee_cm || '',
                            calf_cm: latestMeasurement.calf_cm || '',
                            inseam_cm: latestMeasurement.inseam_cm || '',
                            outseam_cm: latestMeasurement.outseam_cm || '',
                            ankle_cm: latestMeasurement.ankle_cm || '',
                            notes: latestMeasurement.notes || ''
                        });
                    }
                }
            } catch (err) {
                console.error("No measurement card logged yet:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadCustomerMeasurement();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveMeasurements = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const standardPayload = {};
            Object.keys(formData).forEach(key => {
                if (key === 'label' || key === 'notes') {
                    standardPayload[key] = formData[key];
                } else {
                    standardPayload[key] = formData[key] === '' ? null : parseFloat(formData[key]);
                }
            });

            const result = await customerApi.uploadmeasure(standardPayload);
            if (result.success) {
                setModal({ isOpen: true, title: 'Dimensions Vaulted! 📏', message: 'Sizing parameters locked into StitchVerse grids.', type: 'success' });
            }
        } catch (err) {
            const backendError = err.response?.data?.detail || 'Failed to register specifications.';
            setModal({ isOpen: true, title: 'Save Failure', message: backendError, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    // 🌟 Expose everything the UI page needs to look good and act right!
    return {
        formData,
        isLoading,
        isSaving,
        modal,
        setModal,
        handleChange,
        saveMeasurements
    };
}