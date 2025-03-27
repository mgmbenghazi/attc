import React, { useState, useEffect } from 'react';
import { clientBriefService } from '../../services/api';

const ClientBriefs = () => {
  const [briefs, setBriefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status options for briefs
  const statusOptions = [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ];

  // Fetch client briefs
  useEffect(() => {
    const fetchBriefs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await clientBriefService.getBriefs();
        setBriefs(data);
      } catch (err) {
        console.error('Error fetching client briefs:', err);
        setError('Failed to load client briefs. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBriefs();
  }, []);

  // Handle status change
  const handleStatusChange = async (briefId, newStatus) => {
    try {
      await clientBriefService.updateBriefStatus(briefId, newStatus);
      
      // Update local state
      setBriefs(prevBriefs => 
        prevBriefs.map(brief => 
          brief.id === briefId ? { ...brief, status: newStatus } : brief
        )
      );
    } catch (err) {
      console.error('Error updating brief status:', err);
      setError('Failed to update status. Please try again.');
    }
  };

  // Handle brief deletion
  const handleDelete = async (briefId) => {
    if (window.confirm('Are you sure you want to delete this brief?')) {
      try {
        await clientBriefService.deleteBrief(briefId);
        
        // Update local state
        setBriefs(prevBriefs => prevBriefs.filter(brief => brief.id !== briefId));
      } catch (err) {
        console.error('Error deleting brief:', err);
        setError('Failed to delete brief. Please try again.');
      }
    }
  };

  // Open modal with selected brief
  const openBriefDetails = (brief) => {
    setSelectedBrief(brief);
    setIsModalOpen(true);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusOption?.color || 'bg-gray-100 text-gray-800'}`}>
        {statusOption?.label || 'Unknown'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Client Project Briefs</h1>
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            onClick={() => {
              setIsLoading(true);
              clientBriefService.getBriefs()
                .then(data => {
                  setBriefs(data);
                  setError(null);
                })
                .catch(err => {
                  console.error('Error refreshing briefs:', err);
                  setError('Failed to refresh data. Please try again.');
                })
                .finally(() => setIsLoading(false));
            }}
            disabled={isLoading}
          >
            <span className="flex items-center">
              {isLoading ? (
                <svg className="animate-spin w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              )}
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </span>
          </button>
        </div>
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

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && !briefs.length ? (
                // Loading skeleton
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 bg-gray-200 rounded w-1/2 ml-auto"></div>
                    </td>
                  </tr>
                ))
              ) : briefs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No client briefs found.
                  </td>
                </tr>
              ) : (
                briefs.map((brief) => (
                  <tr key={brief.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{brief.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{brief.contactName}</div>
                      <div className="text-xs text-gray-500">{brief.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{brief.projectType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={brief.status}
                        onChange={(e) => handleStatusChange(brief.id, e.target.value)}
                        className="text-sm border-gray-300 rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(brief.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openBriefDetails(brief)}
                        className="text-primary-600 hover:text-primary-900 mr-4"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(brief.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Brief Details Modal */}
      {isModalOpen && selectedBrief && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Brief Details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Company Information</h4>
                  <p className="text-base font-medium text-gray-900 mb-4">{selectedBrief.companyName}</p>
                  
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Person</h4>
                  <p className="text-base font-medium text-gray-900">{selectedBrief.contactName}</p>
                  <p className="text-sm text-gray-600 mb-4">{selectedBrief.email} | {selectedBrief.phone}</p>
                  
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Project Type</h4>
                  <p className="text-base font-medium text-gray-900 mb-4">{selectedBrief.projectType}</p>
                  
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <div className="mb-4">{getStatusBadge(selectedBrief.status)}</div>
                  
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Submitted</h4>
                  <p className="text-base font-medium text-gray-900 mb-4">{formatDate(selectedBrief.submittedAt)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Project Description</h4>
                  <p className="text-base text-gray-900 mb-4 whitespace-pre-line">{selectedBrief.description}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
                <select
                  value={selectedBrief.status}
                  onChange={(e) => {
                    handleStatusChange(selectedBrief.id, e.target.value);
                    setSelectedBrief({...selectedBrief, status: e.target.value});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBriefs;