import { useState, useEffect } from "react";
import { ChevronLeft, MoreVertical, X, Plus, Trash2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import backendUrl from "../../../../utils/backendUrl";

const ContractDetailPage = () => {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isCancelling, setIsCancelling] = useState(false);

    
    // Submission modal states
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [contentUrls, setContentUrls] = useState(['']);
    const [submissionError, setSubmissionError] = useState(null);
    
    useEffect(() => {
        const fetchRevisionContractDetail = async () => {
          try {
            const response = await backendUrl.get(`/api/contracts_on_revision/${id}/`);
            setContract(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching contract details:', error.response?.data);
            setError('Failed to load contract details. Please try again later.');
            setLoading(false);
          }
        };
    
        fetchRevisionContractDetail();
     }, [id]);    
    

    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const handleCancel = async (id) => {
      setIsCancelling(true);
      setError(null)

      try {
        const response = await backendUrl.delete(`/api/contracts_on_revision/${id}/`);
        console.log('Contract cancelled successfully:', response.data);
        
        alert("Contract cancelled successfully");
        navigate('/InfRevisionContractsList');

      } catch (error) {
        console.error('Error cancelling contract:', error.response?.data || error.message);
        setError('Failed to cancel active contract. Please try again later.');

      } finally {
        setIsCancelling(false);
      }
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const handleUrlChange = (index, value) => {
        const newUrls = [...contentUrls];
        newUrls[index] = value;
        setContentUrls(newUrls);
    };

    const addUrlField = () => {
        setContentUrls([...contentUrls, '']);
    };

    const removeUrlField = (index) => {
        if (contentUrls.length > 1) {
            const newUrls = contentUrls.filter((_, i) => i !== index);
            setContentUrls(newUrls);
        }
    };

    const handleSubmitDeliverable = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmissionError(null);

        try {
          const formData = new FormData();
          
          // Add files to form data
          for (const file of selectedFiles) {
              formData.append("content_files", file);
          }
          
          // Add URLs to form data (filter out empty URLs)
          const validUrls = contentUrls.filter(url => url.trim() !== '');
          for (const url of validUrls) {
              formData.append("content_urls", url);
          }

          // Check if at least one file or URL is provided
          if (selectedFiles.length === 0 && validUrls.length === 0) {
              setSubmissionError("At least one file or URL must be provided.");
              setIsSubmitting(false);
              return;
          }

          const response = await backendUrl.put(
              `/api/deliverables/${contract.deliverable_id}/update_attachments/`, 
              formData, 
              {
                  headers: { 
                      "Content-Type": "multipart/form-data" 
                  }
              }
          );
          console.log('Deliverable updated successfully:', response.data);
          alert("Deliverable updated successfully!");

          //also updating resubmitted at
          const responsePatch = await backendUrl.patch(
            `/api/deliverables/${contract.deliverable_id}/`,
            { 
              revised_at: new Date().toISOString(),  // Send current timestamp in ISO format
            }
          );
          console.log("deliverable revised_at updated successfully", responsePatch.data);
          alert("Deliverable revised_at updated successfully")

          
          setShowSubmissionModal(false);
          // Reset form
          setSelectedFiles([]);
          setContentUrls(['']);
              

        } catch (error) {
            console.error('Error updating deliverable:', error.response?.data || error.message);
            setSubmissionError(
                error.response?.data?.error || 
                'Failed to update deliverable. Please try again later.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const openSubmissionModal = () => {
        setShowSubmissionModal(true);
        setSubmissionError(null);
        setSelectedFiles([]);
        setContentUrls(['']);
    };

    const closeSubmissionModal = () => {
        setShowSubmissionModal(false);
        setSubmissionError(null);
        setSelectedFiles([]);
        setContentUrls(['']);
    };
    
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-pink-50">
          <p className="text-gray-600 text-sm">Loading an contract...</p>
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      );
    }
  
    if (!contract) {
      return (
        <div className="h-full flex items-center justify-center bg-white bg-red-100 border border-red-400 px-4 py-3 rounded">
          <div>Contract not found</div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center font-outfit bg-pink-50 md:pb-50 lg:pb-40">
       <div className="w-full md:max-w-lg lg:max-w-xl md:my-10 md:shadow-lg md:rounded-lg md:overflow-hidden bg-pink-50">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-pink-100">
          <button 
           onClick={() => navigate('/InfRevisionContractsList')} 
           className="flex items-center mr-2 cursor-pointer"
           disabled={isCancelling}
           >
            <ChevronLeft size={20} />
          </button>
          <span className="text-base ml-1">View contract to be revised</span>
          <div className="ml-auto text-xs text-gray-400">
            last Revised at: {contract.deliverable_revised_at ? formatDate(contract.deliverable_revised_at) : 'not revised yet!'}
          </div>
          <div className="ml-2">
            <MoreVertical size={20} />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="text-sm text-gray-500">Contract title</div>
            <div className="text-base mt-1">{contract.title}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">From brand:</div>
            <div className="flex items-center mt-2">
              <span className="text-base">{contract.brand_name}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">Payment Amount</div>
            <div className="text-base mt-1">$ {contract.payment_amount}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Deliverable title</div>
            <div className="text-base mt-1">{contract.deliverable_title}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">Deliverable deadline</div>
            <div className="text-base mt-1">{formatDate(contract.deliverable_deadline)}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">deliverable description</div>
            <div className="text-base mt-1">{contract.deliverable_description || "No description"} </div>
          </div>
          
        </div>
        
        {/* Buttons */}
        <div className="p-4">
          <button 
           onClick={() => handleCancel(id)} 
           className="w-full py-3 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200 rounded-md text-center font-medium cursor-pointer mb-2"
           >
            {isCancelling ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cancelling contract...
                  </div>
                ) : (
                  'Cancel Contract'
                )}
          </button>

          <button 
           onClick={openSubmissionModal}
           className="w-full py-3 px-4 border border-gray-300 bg-pink-600 hover:bg-pink-700 text-white transition duration-200 rounded-md text-center font-medium mb-4 cursor-pointer"
           disabled={isCancelling}
           > 
            Update Deliverable(s)
          </button>
        </div>

        {/* Submission Modal */}
        {showSubmissionModal && (
          <div className="fixed absolute inset-0 backdrop-blur-xs bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Update Deliverable(s)</h2>
                <button 
                  onClick={closeSubmissionModal}
                  className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                  disabled={isSubmitting}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmitDeliverable} encType="multipart/form-data" className="p-4">
                {submissionError && (
                  <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                    {submissionError}
                  </div>
                )}

                {/* File Upload Section */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Files (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 cursor-pointer"
                    disabled={isSubmitting}
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {selectedFiles.length} file(s) selected
                    </div>
                  )}
                </div>

                {/* URL Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Add Content URLs (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={addUrlField}
                      className="flex items-center text-sm text-pink-600 hover:text-pink-700 cursor-pointer"
                      disabled={isSubmitting}
                    >
                      <Plus size={16} className="mr-1" />
                      Add URL
                    </button>
                  </div>
                  
                  {contentUrls.map((url, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUrlChange(index, e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                        disabled={isSubmitting}
                      />
                      {contentUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUrlField(index)}
                          className="ml-2 p-1 text-red-600 hover:text-red-700"
                          disabled={isSubmitting}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Modal Buttons */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={closeSubmissionModal}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition duration-200 disabled:opacity-50 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating
                      </div>
                    ) : (
                      'Update deliverable(s)'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
     </div>
    );
  };
  
  export default ContractDetailPage;