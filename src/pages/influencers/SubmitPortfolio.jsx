import { useState } from 'react';
import { ArrowLeft, Upload, Trash2, FileText, CheckCircle } from 'lucide-react';
import backendUrl from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';


const SubmitPortfolio = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!portfolioTitle.trim()) {
      setError("Portfolio title is required.");
      setIsSubmitting(false);
      return;
    }

    if (selectedFiles.length === 0) {
      setError("At least one file must be uploaded.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', portfolioTitle.trim());
      
      // Add files to form data
      for (const file of selectedFiles) {
        formData.append('files', file);
      }

      const response = await backendUrl.post('/api/influencer-portfolio/', formData, 
        {
            headers: { 
                "Content-Type": "multipart/form-data" 
            }
        });
      
      console.log('Portfolio submitted successfully:', response.data);
      // setSuccess(true);
      alert("Portfolio submitted successfully");
      navigate('/MyPortfolioPage');
      
      // Reset form
      setPortfolioTitle('');
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Error submitting portfolio:', error.response?.data);
      setError(
        error.response?.data?.error || 
        'Failed to submit portfolio. Please try again later.'
      );
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
      <div className="min-h-screen bg-pink-50 flex flex-col">
        {/* Header */}
        <header className="p-4 bg-white">
          <div className="container mx-auto">
            <button
              onClick={() => navigate('/WelcomePage')} 
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Home Page</span>
            </button>
          </div>
        </header>

        {/* Success Content */}
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Portfolio Submitted!
              </h2>
              <p className="text-gray-600 mb-6">
                Your portfolio has been successfully submitted. Brands can now view your work when considering you for partnerships.
              </p>
              <button
                onClick={() => navigate('/WelcomePage')} 
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:sbg-pink-600 transition-colors cursor-pointer"
              >
                Back to Home Page
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
      <header className="p-4 bg-white">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/WelcomePage')} 
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Home Page</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-5 md:p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Page Header */}
            <div className="bg-pink-400 p-6 text-white">
              <div className="flex items-center">
                <Upload className="w-8 h-8 mr-3" />
                <div>
                  <h1 className="text-2xl font-bold">Submit Portfolio</h1>
                  <p className="text-pink-100 mt-1">
                    Upload your best work to attract brand partnerships
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Portfolio Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Title *
                </label>
                <input
                  type="text"
                  value={portfolioTitle}
                  onChange={(e) => setPortfolioTitle(e.target.value)}
                  placeholder="Enter a title for your portfolio (e.g., 'Fashion Content Portfolio 2024')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Portfolio Files *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-400 transition-colors">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Support for images & videos
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="portfolio-files"
                    accept="image/*, video/*"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="portfolio-files"
                    className="inline-block bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors cursor-pointer"
                  >
                    Choose Files
                  </label>
                </div>
              </div>

              {/* Selected Files Display */}
              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="ml-3 p-1 text-red-600 hover:text-red-700 flex-shrink-0"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4 cursor-pointer" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/WelcomePage')} 
                  className="flex-1 py-2 px-2  md:py-3 md:px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-2 md:py-3 md:px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  disabled={isSubmitting || selectedFiles.length === 0 || !portfolioTitle.trim()}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Portfolio...
                    </div>
                  ) : (
                    'Submit Portfolio'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines */}
          <div className="mt-6 bg-pink-50 border border-pink-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-pink-800 mb-2">Portfolio Guidelines</h3>
            <ul className="text-sm text-pink-700 space-y-1">
              <li>• Upload your best and most recent content(photos, videos, etc.)</li>
              <li>• Ensure files are high quality and properly formatted</li>
              <li>• Choose a descriptive title that represents your work</li>
              <li>• Maximum file size: 10MB per file</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitPortfolio;