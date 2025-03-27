import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ClientBriefForm = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    contactName: '',
    email: '',
    phone: '',
    projectType: '',
    description: '',
    currentChallenges: '',
    goals: '',
    timeline: '',
    budget: '',
    additionalInfo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In development, just log the data
      if (process.env.NODE_ENV === 'development') {
        console.log('Submitting client brief:', formData);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        setSuccess(true);
        
        // Reset form
        setFormData({
          companyName: '',
          industry: '',
          contactName: '',
          email: '',
          phone: '',
          projectType: '',
          description: '',
          currentChallenges: '',
          goals: '',
          timeline: '',
          budget: '',
          additionalInfo: ''
        });
      } else {
        // In production, send to API
        await axios.post('/api/client-briefs', formData);
        setSuccess(true);
        
        // Reset form
        setFormData({
          companyName: '',
          industry: '',
          contactName: '',
          email: '',
          phone: '',
          projectType: '',
          description: '',
          currentChallenges: '',
          goals: '',
          timeline: '',
          budget: '',
          additionalInfo: ''
        });
      }
    } catch (err) {
      console.error('Error submitting client brief:', err);
      setError(t('clientBrief.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Project type options
  const projectTypes = [
    { value: '', label: t('clientBrief.form.selectProjectType') },
    { value: 'it-infrastructure', label: t('services.itInfrastructure.title') },
    { value: 'telecommunications', label: t('services.telecommunications.title') },
    { value: 'networking', label: t('services.networking.title') },
    { value: 'security-systems', label: t('services.securitySystems.title') },
    { value: 'software-development', label: t('services.softwareDevelopment.title') },
    { value: 'consulting', label: t('services.consulting.title') },
    { value: 'other', label: t('clientBrief.form.other') }
  ];

  // Timeline options
  const timelineOptions = [
    { value: '', label: t('clientBrief.form.selectTimeline') },
    { value: 'urgent', label: t('clientBrief.form.urgent') },
    { value: '1-3-months', label: t('clientBrief.form.1-3-months') },
    { value: '3-6-months', label: t('clientBrief.form.3-6-months') },
    { value: '6-12-months', label: t('clientBrief.form.6-12-months') },
    { value: 'flexible', label: t('clientBrief.form.flexible') }
  ];

  // Budget range options
  const budgetOptions = [
    { value: '', label: t('clientBrief.form.selectBudget') },
    { value: 'under-5k', label: t('clientBrief.form.under-5k') },
    { value: '5k-10k', label: t('clientBrief.form.5k-10k') },
    { value: '10k-25k', label: t('clientBrief.form.10k-25k') },
    { value: '25k-50k', label: t('clientBrief.form.25k-50k') },
    { value: '50k-plus', label: t('clientBrief.form.50k-plus') },
    { value: 'not-sure', label: t('clientBrief.form.not-sure') }
  ];

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-green-800">{t('clientBrief.form.success')}</h3>
        <p className="mt-2 text-sm text-green-700">
          {t('clientBrief.form.successMessage')}
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="btn btn-primary"
          >
            {t('clientBrief.form.submitAnother')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Company Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('clientBrief.form.companyInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.companyName')} *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.industry')}
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('clientBrief.form.contactInfo')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.contactName')} *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              required
              value={formData.contactName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.email')} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.phone')}
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('clientBrief.form.projectInfo')}</h3>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.projectType')} *
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              value={formData.projectType}
              onChange={handleChange}
              className="form-select"
            >
              {projectTypes.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.projectDescription')} *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder={t('clientBrief.form.projectDescriptionPlaceholder')}
            ></textarea>
          </div>
          <div>
            <label htmlFor="currentChallenges" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.currentChallenges')}
            </label>
            <textarea
              id="currentChallenges"
              name="currentChallenges"
              rows="3"
              value={formData.currentChallenges}
              onChange={handleChange}
              className="form-textarea"
              placeholder={t('clientBrief.form.currentChallengesPlaceholder')}
            ></textarea>
          </div>
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.goals')} *
            </label>
            <textarea
              id="goals"
              name="goals"
              required
              rows="3"
              value={formData.goals}
              onChange={handleChange}
              className="form-textarea"
              placeholder={t('clientBrief.form.goalsPlaceholder')}
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-1">
                {t('clientBrief.form.timeline')}
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="form-select"
              >
                {timelineOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                {t('clientBrief.form.budget')}
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="form-select"
              >
                {budgetOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700 mb-1">
              {t('clientBrief.form.additionalInfo')}
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              rows="3"
              value={formData.additionalInfo}
              onChange={handleChange}
              className="form-textarea"
              placeholder={t('clientBrief.form.additionalInfoPlaceholder')}
            ></textarea>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full btn btn-primary py-3 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('clientBrief.form.submitting')}
            </span>
          ) : t('clientBrief.form.submit')}
        </button>
      </div>
      <p className="text-sm text-gray-500 text-center mt-4">
        {t('clientBrief.form.requiredFields')}
      </p>
    </form>
  );
};

export default ClientBriefForm;