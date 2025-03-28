import React, { useState, useEffect } from 'react';
import { clientBriefService } from '../../services/api';

const ClientBriefsEditor = () => {
  const [briefs, setBriefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Open modal to view brief details
  const handleViewBrief = (brief) => {
    setSelectedBrief(brief);
    setIsModalOpen(true);
  };

  // Handle status change
  const handleStatusChange = async (briefId, newStatus) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await clientBriefService.updateBriefStatus(briefId, newStatus);
      setBriefs(prev => prev.map(b => 
        b.id === briefId ? { ...b, status: newStatus } : b
      ));
      setSuccessMessage('Brief status updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error updating brief status:', err);
      setError('Failed to update brief status. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle brief deletion
  const handleDeleteBrief = async (briefId) => {
    if (!window.confirm('Are you sure you want to delete this client brief?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await clientBriefService.deleteBrief(briefId);
      setBriefs(prev => prev.filter(b => b.id !== briefId));
      setSuccessMessage('Brief deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting brief:', err);
      setError('Failed to delete brief. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Client Briefs</h1>
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

      {/* Client Briefs List */}
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
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                  </td>
                </tr>
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
                      <div className="text-sm text-gray-500">{brief.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{brief.projectType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(brief.submittedAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(brief.status)}`}>
                        {brief.status === 'new' ? 'New' : 
                         brief.status === 'in-progress' ? 'In Progress' : 
                         brief.status === 'completed' ? 'Completed' : 
                         brief.status === 'rejected' ? 'Rejected' : brief.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewBrief(brief)}
                        className="text-primary-600 hover:text-primary-900 mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteBrief(brief.id)}
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
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Client Brief Details
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
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Company</h4>
                  <p className="text-base text-gray-900">{selectedBrief.companyName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Contact Name</h4>
                  <p className="text-base text-gray-900">{selectedBrief.contactName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="text-base text-gray-900">{selectedBrief.email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                  <p className="text-base text-gray-900">{selectedBrief.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Project Type</h4>
                  <p className="text-base text-gray-900">{selectedBrief.projectType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Submitted At</h4>
                  <p className="text-base text-gray-900">{formatDate(selectedBrief.submittedAt)}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-base text-gray-900 whitespace-pre-line">{selectedBrief.description}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedBrief.id, 'new')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBrief.status === 'new' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      New
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedBrief.id, 'in-progress')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBrief.status === 'in-progress' 
                          ? 'bg-yellow-600 text-white' 
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedBrief.id, 'completed')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBrief.status === 'completed' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedBrief.id, 'rejected')}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedBrief.status === 'rejected' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      Rejected
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBriefsEditor;