import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Download, Calendar, FileText, Image, Video, Loader2, File } from 'lucide-react';
import backendUrl from '../../utils/backendUrl';
import { useNavigate, useParams } from 'react-router-dom';

const ViewPortfolio = () => {
  const { influencerId } = useParams(); // Get influencer ID from URL params
  const [portfolios, setPortfolios] = useState([]);
  const [groupedPortfolios, setGroupedPortfolios] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [influencerName, setInfluencerName] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    fetchPortfolios();
  }, [influencerId]);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      // Fetch specific influencer's portfolio
      const response = await backendUrl.get(`/api/influencer-portfolio/?influencer_id=${influencerId}`);
        
      // If we have portfolios, get the influencer name from the first portfolio
      if (response.data.length > 0) {
        setInfluencerName(response.data[0].influencer_name);
      }
    
      const portfolioData = response.data;
      setPortfolios(portfolioData);
    
      // Group portfolios by title
      const grouped = portfolioData.reduce((acc, portfolio) => {
        const title = portfolio.title;
        if (!acc[title]) {
          acc[title] = [];
        }
        acc[title].push(portfolio);
        return acc;
      }, {});
      
      setGroupedPortfolios(grouped);
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      setError('Failed to load portfolios. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
      

  const getFileType = (url) => {
    if (!url) return 'unknown';
    const extension = url.split('.').pop().toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'webm', 'mkv'];
    
    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';
    return 'file';
  };

  // Helper function to get proper Cloudinary URLs
  const getCloudinaryUrl = (publicId, options = {}) => {
    const baseUrl = 'https://res.cloudinary.com/dbahlieut';
    const transformations = options.transformations || '';
    return `${baseUrl}/${transformations ? transformations + '/' : ''}${publicId}`;
  };

  // Get file icon based on file type
  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return <File size={20} />;
    
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv'];
    
    if (imageExtensions.includes(extension)) {
      return <Image size={20} />;
    } else if (videoExtensions.includes(extension)) {
      return <Video size={20} />;
    } else if (['pdf', 'doc', 'docx', 'txt'].includes(extension)) {
      return <FileText size={20} />;
    }
    return <File size={20} />;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openMediaModal = (file) => {
    setSelectedMedia(file);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  const MediaPreview = ({ file, onPreview }) => {
    const fileType = getFileType(file.file);
    const cloudinaryUrl = getCloudinaryUrl(file.file);
    
    return (
      <div className="flex flex-col">
        <div 
          className="relative group cursor-pointer bg-black rounded-lg overflow-hidden aspect-square"
          onClick={() => onPreview(file)}
        >
          {fileType === 'image' ? (
            <img
              src={cloudinaryUrl}
              alt="Portfolio item"
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
              onError={(e) => {
                e.target.src = file.file; // Fallback to original URL
              }}
            />
          ) : fileType === 'video' ? (
            <div className="w-full h-full flex bg-gray-700 items-center justify-center relative">
              <Video className="w-12 h-12 text-gray-400 z-10" />
              <video
                src={cloudinaryUrl}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                onError={(e) => {
                  e.target.src = file.file; // Fallback to original URL
                }}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {getFileIcon(file.file)}
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
          
          {/* File type indicator */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-1">
            {fileType === 'image' ? (
              <Image className="w-4 h-4 text-white" />
            ) : fileType === 'video' ? (
              <Video className="w-4 h-4 text-white" />
            ) : (
              <FileText className="w-4 h-4 text-white" />
            )}
          </div>
        </div>
        
        {/* File name */}
        <div className="mt-2 text-center">
          <p className="text-sm text-gray-600 truncate" title={file.original_filename || 'Unknown file'}>
            {file.original_filename || 'Unknown file'}
          </p>
        </div>
      </div>
    );
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col">
        <header className="p-4 bg-white">
          <div className="container mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Get Back</span>
            </button>
          </div>
        </header>
        
        <main className="flex-grow flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            <span className="text-lg text-gray-600">Loading portfolios...</span>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col">
        <header className="p-4 bg-white">
          <div className="container mx-auto">
            <button
              onClick={()=> navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Get Back</span>
            </button>
          </div>
        </header>
        
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-red-500 mb-4">
                <FileText className="w-16 h-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Portfolios</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchPortfolios}
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-sans">
      {/* Header */}
      <header className="p-4 bg-white shadow-sm">
        <div className="container mx-auto">
          <button
            onClick={()=> navigate(-1) }
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Get Back</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {influencerName} Portfolio
            </h1>
            <p className="text-gray-600">
                Browse this influencer's portfolio collections
            </p>
          </div>

          {Object.keys(groupedPortfolios).length === 0 ? (
            // Empty State
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                 No Portfolios Available
              </h2>
              <p className="text-gray-600 mb-6">                
                  This influencer hasn't uploaded any portfolios yet
              </p>
            </div>
          ) : (
            // Portfolio Collections
            <div className="space-y-8">
              {Object.entries(groupedPortfolios).map(([title, portfolioFiles]) => (
                <div key={title} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {/* Collection Header */}
                  <div className="bg-gradient-to-r from-pink-400 to-pink-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-1">{title}</h2>
                        <div className="flex items-center text-pink-100 space-x-4">
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {portfolioFiles.length} {portfolioFiles.length === 1 ? 'file' : 'files'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(portfolioFiles[0].created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Files Grid */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {portfolioFiles.map((file, index) => (
                        <MediaPreview
                          key={file.id || index}
                          file={file}
                          onPreview={openMediaModal}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Media Modal */}
      {selectedMedia && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeMediaModal}
        >
          <div className="max-w-4xl max-h-full relative">
            <button
              onClick={closeMediaModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-xl font-bold z-10 cursor-pointer"
            >
              ✕
            </button>
            
            <div className="bg-white rounded-lg p-4 max-w-sm mx-auto mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-gray-500">
                    {getFileIcon(selectedMedia.file)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedMedia.original_filename || 'Portfolio File'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {getFileType(selectedMedia.file)} file
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(selectedMedia.file, selectedMedia.original_filename || `portfolio_${selectedMedia.id}`)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                  title="Download file"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
            
            {getFileType(selectedMedia.file) === 'image' ? (
              <img
                src={getCloudinaryUrl(selectedMedia.file)}
                alt="Portfolio preview"
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.target.src = selectedMedia.file; // Fallback to original URL
                }}
              />
            ) : getFileType(selectedMedia.file) === 'video' ? (
              <video
                src={getCloudinaryUrl(selectedMedia.file)}
                controls
                className="max-w-full max-h-full rounded-lg"
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.target.src = selectedMedia.file; // Fallback to original URL
                }}
              />
            ) : (
              <div className="bg-white p-8 rounded-lg text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Preview not available for this file type</p>
                <button
                  onClick={() => handleDownload(selectedMedia.file, selectedMedia.original_filename || `portfolio_${selectedMedia.id}`)}
                  className="inline-flex items-center mt-4 text-pink-500 hover:text-pink-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPortfolio;