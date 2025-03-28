import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/api';

const StatsEditor = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedStat, setSelectedStat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'

  // Initial empty stat form
  const emptyStat = {
    value: 0,
    label: {
      en: '',
      ar: ''
    },
    icon: 'chart-line',
    prefix: '',
    suffix: '',
    animation: 'count'
  };

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await statsService.getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  // Open modal for creating a new stat
  const handleCreateStat = () => {
    setSelectedStat({ ...emptyStat });
    setFormMode('create');
    setIsModalOpen(true);
  };

  // Open modal for editing an existing stat
  const handleEditStat = (stat) => {
    setSelectedStat({ ...stat });
    setFormMode('edit');
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'value') {
      setSelectedStat(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value, 10) || 0 : value
      }));
    } else if (name === 'label_en' || name === 'label_ar') {
      const language = name.split('_')[1];
      setSelectedStat(prev => ({
        ...prev,
        label: {
          ...prev.label,
          [language]: value
        }
      }));
    } else {
      setSelectedStat(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      let result;
      
      if (formMode === 'create') {
        // Create new stat
        result = await statsService.createStat(selectedStat);
        setStats(prev => [...prev, result]);
        setSuccessMessage('Statistic created successfully!');
      } else {
        // Update existing stat
        result = await statsService.updateStat(selectedStat.id, selectedStat);
        setStats(prev => prev.map(s => s.id === selectedStat.id ? result : s));
        setSuccessMessage('Statistic updated successfully!');
      }
      
      // Close modal after successful save
      setIsModalOpen(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving statistic:', err);
      setError('Failed to save statistic. Please try again later.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle stat deletion
  const handleDeleteStat = async (statId) => {
    if (!window.confirm('Are you sure you want to delete this statistic?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await statsService.deleteStat(statId);
      setStats(prev => prev.filter(s => s.id !== statId));
      setSuccessMessage('Statistic deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting statistic:', err);
      setError('Failed to delete statistic. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Available icons
  const icons = [
    { value: 'calendar-alt', label: 'Calendar' },
    { value: 'check-circle', label: 'Check Circle' },
    { value: 'users', label: 'Users' },
    { value: 'user-tie', label: 'User Tie' },
    { value: 'building', label: 'Building' },
    { value: 'globe', label: 'Globe' },
    { value: 'chart-line', label: 'Chart Line' },
    { value: 'trophy', label: 'Trophy' },
    { value: 'star', label: 'Star' },
    { value: 'thumbs-up', label: 'Thumbs Up' }
  ];

  // Animation types
  const animations = [
    { value: 'count', label: 'Count Up' },
    { value: 'fade', label: 'Fade In' },
    { value: 'pulse', label: 'Pulse' },
    { value: 'bounce', label: 'Bounce' },
    { value: 'none', label: 'No Animation' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Statistics Management</h1>
        <button 
          onClick={handleCreateStat}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Add New Statistic
        </button>
      </div>

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

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : stats.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No statistics found. Click "Add New Statistic" to create one.
          </div>
        ) : (
          stats.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stat.prefix}{stat.value}{stat.suffix}
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600">{stat.label.en}</p>
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => handleEditStat(stat)}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteStat(stat.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stat Form Modal */}
      {isModalOpen && selectedStat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {formMode === 'create' ? 'Add New Statistic' : 'Edit Statistic'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prefix
                    </label>
                    <input
                      type="text"
                      name="prefix"
                      value={selectedStat.prefix}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. $, +, >"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="number"
                      name="value"
                      value={selectedStat.value}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suffix
                    </label>
                    <input
                      type="text"
                      name="suffix"
                      value={selectedStat.suffix}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g. %, +, k"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label (English)
                    </label>
                    <input
                      type="text"
                      name="label_en"
                      value={selectedStat.label.en}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Label (Arabic)
                    </label>
                    <input
                      type="text"
                      name="label_ar"
                      value={selectedStat.label.ar}
                      onChange={handleInputChange}
                      className="form-input text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Icon
                    </label>
                    <select
                      name="icon"
                      value={selectedStat.icon}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {icons.map(icon => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Animation
                    </label>
                    <select
                      name="animation"
                      value={selectedStat.animation}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      {animations.map(animation => (
                        <option key={animation.value} value={animation.value}>
                          {animation.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : formMode === 'create' ? 'Create Statistic' : 'Update Statistic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsEditor;