import { useState, useEffect } from "react";
import { ChevronLeft, MoreVertical, X, ExternalLink, Download, FileText, Image as ImageIcon, Video, File } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import backendUrl from "../../../../utils/backendUrl";

const ContractDetailPage = () => {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isCancelling, setIsCancelling] = useState(false);
    
    // Deliverable modal states
    const [showDeliverableModal, setShowDeliverableModal] = useState(false);
    const [deliverable, setDeliverable] = useState(null);
    const [deliverableLoading, setDeliverableLoading] = useState(false);
    const [deliverableError, setDeliverableError] = useState(null);
  
    
    useEffect(() => {
        const fetchApproveContractDetail = async () => {
          try {
            const response = await backendUrl.get(`/api/approve_works/${id}/`);
            setContract(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching contract details:', error.response?.data);
            setError('Failed to load contract details. Please try again later.');
            setLoading(false);
          }
        };
    
        fetchApproveContractDetail();
     }, [id]);    
    

    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    };

    // Get file icon based on file type
    const getFileIcon = (fileUrl) => {
        if (!fileUrl) return <File size={20} />;
        
        const extension = fileUrl.split('.').pop()?.toLowerCase();
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv'];
        
        if (imageExtensions.includes(extension)) {
            return <ImageIcon size={20} />;
        } else if (videoExtensions.includes(extension)) {
            return <Video size={20} />;
        } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
            return <FileText size={20} />;
        }
        return <File size={20} />;
    };

    // Get file name from URL
    const getFileName = (fileUrl) => {
        if (!fileUrl) return 'Unknown file';
        const urlParts = fileUrl.split('/');
        return urlParts[urlParts.length - 1] || 'File';
    };

    const handleViewDeliverables = async () => {
        setShowDeliverableModal(true);
        setDeliverableLoading(true);
        setDeliverableError(null);

        try {
            const response = await backendUrl.get(`/api/deliverables/${contract.deliverable_id}/`);
            setDeliverable(response.data);
        } catch (error) {
            console.error('Error fetching deliverable details:', error.response?.data);
            setDeliverableError('Failed to load deliverable details. Please try again later.');
        } finally {
            setDeliverableLoading(false);
        }
    };

    const closeDeliverableModal = () => {
        setShowDeliverableModal(false);
        setDeliverable(null);
        setDeliverableError(null);
    };

    const handleReview = () => {
        // Implement review logic here
        console.log('Review deliverable:', deliverable);
        alert('Review functionality to be implemented');
    };

    // Helper function to get proper Cloudinary URLs
    const getCloudinaryUrl = (publicId, options = {}) => {
      const baseUrl = 'https://res.cloudinary.com/dbahlieut';
      const transformations = options.transformations || '';
      return `${baseUrl}/${transformations ? transformations + '/' : ''}${publicId}`;
    };

    const handleDownload = async (publicId, originalFileName) => {
      try {
        const url = getCloudinaryUrl(publicId);
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = originalFileName || publicId;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to opening in new tab
        window.open(getCloudinaryUrl(publicId), '_blank');
      }
    };

    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-pink-50">
          <p className="text-gray-600 text-sm">Loading a contract...</p>
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
           onClick={() => navigate('/ApproveWorksList')} 
           className="flex items-center mr-2 cursor-pointer"
           disabled={isCancelling}
           >
            <ChevronLeft size={20} />
          </button>
          <span className="text-base ml-1">View contract</span>
          <div className="ml-auto text-xs text-gray-400">
            Submitted at {formatDate(contract.deliverable_submitted_at)}
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
            <div className="text-sm text-gray-500">To influencer:</div>
            <div className="flex items-center mt-2">
              <span className="text-base">{contract.influencer_name}</span>
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
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">deliverable submitted at</div>
            <div className="text-base mt-1">{formatDate(contract.deliverable_submitted_at)} </div>
          </div>
          
        </div>
        
        {/* Buttons */}
        <div className="p-4">
          <button onClick={handleViewDeliverables} className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 transition duration-200 text-white rounded-md text-center font-medium cursor-pointer">
            View Deliverables
          </button>

          <button 
           onClick={() => navigate('/ApproveWorksList')} 
           className="w-full py-3 px-4 border border-gray-300 bg-green-100 text-gray-700 hover:bg-gray-300 transition duration-200 rounded-md text-center font-medium mt-3 cursor-pointer"
           > 
            Release Fund
          </button>
        </div>

        {/* Deliverable Modal */}
        {showDeliverableModal && (
          <div className="fixed absolute inset-0 backdrop-blur-xs bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Deliverable Details</h2>
                <button 
                  onClick={closeDeliverableModal}
                  className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {deliverableLoading ? (
                  <div className="flex flex-col justify-center items-center h-40 space-y-4">
                    <p className="text-gray-600 text-sm">Loading deliverable...</p>
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
                  </div>
                ) : deliverableError ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                    {deliverableError}
                  </div>
                ) : deliverable ? (
                  <div className="space-y-6">
                    {/* Basic Info
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">Brand</div>
                        <div className="text-base mt-1">{deliverable.brand_name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Influencer</div>
                        <div className="text-base mt-1">{deliverable.influencer_name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Status</div>
                        <div className="text-base mt-1 capitalize">{deliverable.status}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Submitted At</div>
                        <div className="text-base mt-1">
                          {deliverable.submitted_at ? formatDate(deliverable.submitted_at) : 'Not submitted'}
                        </div>
                      </div>
                    </div> */}

                    {/* Attachments */}
                    {deliverable.attachments && deliverable.attachments.length > 0 ? (
                      <div>
                        <h3 className="text-base font-medium mb-3">Attachments ({deliverable.attachments.length})</h3>
                        <div className="space-y-3">
                          {deliverable.attachments.map((attachment) => (
                            <div key={attachment.id} className="border border-gray-200 rounded-lg p-4">
                              {attachment.file && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="text-gray-500">
                                      {getFileIcon(attachment.file)}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {attachment.original_filename} {/* it was {getFileName(attachment.file)} */}
                                      </div>
                                      <div className="text-xs text-gray-500">File attachment</div>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <a
                                      href={`https://res.cloudinary.com/dbahlieut/${attachment.file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                      title="View file"
                                    >
                                      <ExternalLink size={16} />
                                    </a>
                                    <button
                                      onClick={() => handleDownload(attachment.file, attachment.original_filename)}
                                      className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors cursor-pointer"
                                      title="Download file"
                                    >
                                      <Download size={16} />
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              {attachment.url && (
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="text-gray-500">
                                      <ExternalLink size={20} />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-gray-900">
                                        {attachment.url}
                                      </div>
                                      <div className="text-xs text-gray-500">URL attachment</div>
                                    </div>
                                  </div>
                                  <a
                                    href={`${attachment.url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                    title="Visit URL"
                                  >
                                    <ExternalLink size={16} /> 
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText size={48} className="mx-auto mb-2 opacity-50" />
                        <p>No attachments found</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

              {/* Modal Buttons */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={closeDeliverableModal}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 cursor-pointer"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleReview}
                    className="flex-1 py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition duration-200 cursor-pointer"
                    disabled={deliverableLoading || deliverableError}
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
     </div>
    );
  };
  
  export default ContractDetailPage;