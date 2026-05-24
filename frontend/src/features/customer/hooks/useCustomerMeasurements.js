import { useState, useEffect, useCallback } from 'react';
import { customerApi } from '../services/customerApi';

export function useCustomerMeasurements() {
    // 📁 The actual text box values
    const [formData, setFormData] = useState({
        id: null,
        label: 'Default Profile',
        height_cm: '', weight_kg: '', neck_cm: '', shoulder_cm: '',
        chest_cm: '', bust_cm: '', waist_cm: '', hip_cm: '',
        arm_length_cm: '', sleeve_length_cm: '', bicep_cm: '', wrist_cm: '',
        thigh_cm: '', knee_cm: '', calf_cm: '', inseam_cm: '',
        outseam_cm: '', ankle_cm: '', notes: ''
    });

    // 🌟 THE BACKPACK: Holds all saved cards for the button row
    const [allProfiles, setAllProfiles] = useState([]);
    
    // 🌟 THE FLAG: Tells the UI if we are editing an old card or making a new one
    const [isExistingProfile, setIsExistingProfile] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

    // 🔄 HELPER: Fills the form fields instantly
    const setFormDataFields = useCallback((profileCard) => {
        setFormData({
            id: profileCard.id || null,
            label: profileCard.label || 'Default Profile',
            height_cm: profileCard.height_cm || '', weight_kg: profileCard.weight_kg || '',
            neck_cm: profileCard.neck_cm || '', shoulder_cm: profileCard.shoulder_cm || '',
            chest_cm: profileCard.chest_cm || '', bust_cm: profileCard.bust_cm || '',
            waist_cm: profileCard.waist_cm || '', hip_cm: profileCard.hip_cm || '',
            arm_length_cm: profileCard.arm_length_cm || '', sleeve_length_cm: profileCard.sleeve_length_cm || '',
            bicep_cm: profileCard.bicep_cm || '', wrist_cm: profileCard.wrist_cm || '',
            thigh_cm: profileCard.thigh_cm || '', knee_cm: profileCard.knee_cm || '',
            calf_cm: profileCard.calf_cm || '', inseam_cm: profileCard.inseam_cm || '',
            outseam_cm: profileCard.outseam_cm || '', ankle_cm: profileCard.ankle_cm || '',
            notes: profileCard.notes || ''
        });
    }, []);

    // 📥 FETCH: Grabs data on page load
    const loadAllCustomerMeasurements = useCallback(async () => {
        try {
            const result = await customerApi.getMeasurements();
            if (result.success && result.data) {
                const measurementList = result.data;

                if (Array.isArray(measurementList) && measurementList.length > 0) {
                    setAllProfiles(measurementList); // Build the buttons
                    setFormDataFields(measurementList[0]); // Fill form with the first card
                    setIsExistingProfile(true); 
                }
            }
        } catch (err) {
            console.error("No measurement cards created yet:", err);
        } finally {
            setIsLoading(false);
        }
    }, [setFormDataFields]);

    useEffect(() => {
        loadAllCustomerMeasurements();
    }, [loadAllCustomerMeasurements]);

    // 🚦 SWITCHER: When a button is clicked!
    const handleProfileSwitch = (profileId) => {
        const chosenCard = allProfiles.find(p => p.id === profileId);
        if (chosenCard) {
            setFormDataFields(chosenCard);
            setIsExistingProfile(true);
        }
    };

    // ➕ CLEAR: When "Add New Card" is clicked
    const handleCreateFreshCard = () => {
        setFormData({
            label: 'New Sizing Profile',
            height_cm: '', weight_kg: '', neck_cm: '', shoulder_cm: '',
            chest_cm: '', bust_cm: '', waist_cm: '', hip_cm: '',
            arm_length_cm: '', sleeve_length_cm: '', bicep_cm: '', wrist_cm: '',
            thigh_cm: '', knee_cm: '', calf_cm: '', inseam_cm: '',
            outseam_cm: '', ankle_cm: '', notes: ''
        });
        setIsExistingProfile(false); // Flags it as a brand new card!
    };

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

            let result;
            if (isExistingProfile) {
                result = await customerApi.updateMeasurements(formData.id, standardPayload);
            } else {
                result = await customerApi.uploadmeasure(standardPayload);
            }

            if (result.success) {
                setModal({ isOpen: true, title: 'Vaulted Successfully! 📏', message: 'Sizing parameters locked in.', type: 'success' });
                await loadAllCustomerMeasurements(); // Refresh the button row!
            }
        } catch (err) {
            const backendError = err.response?.data?.detail || 'Failed to submit metrics profile parameters.';
            setModal({ isOpen: true, title: 'Save Failure', message: backendError, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    // 🌟 EXPORT EVERYTHING
    return {
        formData, allProfiles, isExistingProfile, isLoading, isSaving, modal,
        setModal, handleChange, handleProfileSwitch, handleCreateFreshCard, saveMeasurements
    };
}