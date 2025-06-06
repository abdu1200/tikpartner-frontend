import { useState } from 'react';
import { ChevronLeft, Upload, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import backendUrl from '../utils/backendUrl';

const DisputeManagement = () => {
  
  const [disputeDescription, setDisputeDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();


  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Add new files to existing selection, avoiding duplicates
    setSelectedFiles(prevFiles => {
      const existingFileNames = prevFiles.map(file => file.name);
      const uniqueNewFiles = newFiles.filter(file => !existingFileNames.includes(file.name));
      return [...prevFiles, ...uniqueNewFiles];
    });
    
    // Reset the input value so the same file can be selected again if needed
    // e.target.value = '';
   };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(selectedFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmitDispute = async () => {
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!disputeDescription.trim()) {
      setError('Dispute description is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Add description to form data
      formData.append('description', disputeDescription.trim());
      
      // Add files to form data
      for (const file of selectedFiles) {
        formData.append('file_proofs', file);
      }

      const response = await backendUrl.post('/api/disputes/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("created", response.data );

    //   console.log('Dispute submitted successfully:', {
    //     description: disputeDescription,
    //     files: selectedFiles.map(f => f.name)
    //   });
      setSuccess(true);
      
      // Reset form after successful submission
      setDisputeDescription('');
      setSelectedFiles([]);
      
      // Show success message for 2 seconds then navigate back
      setTimeout(() => {
        navigate(-1);
      }, 10000);

    } catch (error) {
      console.error('Error submitting dispute:', error);
      setError('Failed to submit dispute. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (success) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center font-outfit">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Dispute Submitted Successfully!</h2>
          <p className="text-gray-600 mb-4">Your dispute has been submitted and will be reviewed by our team.</p>
          <p className="text-sm text-gray-500">Redirecting you back...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex justify-center font-outfit">
      <div className="w-full md:max-w-lg lg:max-w-xl md:my-10 md:shadow-lg md:rounded-lg md:overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-pink-100">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center mr-2 cursor-pointer"
            disabled={isSubmitting}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-base ml-1 font-medium">Dispute Management</span>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Submit a Dispute</h2>
            <p className="text-sm text-gray-600">
              Describe your dispute and provide any supporting evidence to help us resolve the issue.
            </p>
          </div>

          <div onSubmit={handleSubmitDispute}>
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            {/* Dispute Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispute Description *
              </label>
              <textarea
                value={disputeDescription}
                onChange={(e) => setDisputeDescription(e.target.value)}
                placeholder="Please describe your dispute in detail. Include relevant contract information, timeline, and specific issues you're experiencing..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 resize-vertical"
                disabled={isSubmitting}
                required
              />
              <div className="mt-1 text-xs text-gray-500">
                {disputeDescription.length}/1000 characters
              </div>
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dispute Proof Files
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Upload screenshots, emails, contracts, or other evidence that supports your dispute.
              </p>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                <div className="cursor-pointer flex flex-col items-center" onClick={() => document.getElementById('dispute-files').click()}>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Click to upload files</span>
                    <span className="text-xs text-gray-400 mt-1">
                    Supports: Images, PDF, DOC, DOCX, TXT (Multiple files allowed)
                    </span>
                </div>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="dispute-files"
                    disabled={isSubmitting}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-3 p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          disabled={isSubmitting}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmitDispute}
                className="w-full py-3 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                disabled={isSubmitting || !disputeDescription.trim()}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Dispute...
                  </div>
                ) : (
                  'Submit Dispute'
                )}
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-1">What happens next?</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Our team will review your dispute within 24-48 hours</li>
              <li>• We may contact you for additional information if needed</li>
              <li>• You'll be notified of the resolution via email</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeManagement;