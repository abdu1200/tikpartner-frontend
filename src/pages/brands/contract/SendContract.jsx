import { useState, useEffect} from 'react';
import { Calendar, ChevronLeft, Check } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import backendUrl from '../../../utils/backendUrl';

export default function SendContract() {
  const [formData, setFormData] = useState({
    contractTitle: '',
    deliverableTitle: '',
    paymentAmount: '20000',
    deliverableDeadline: '',
    deliverableDescription: '',
    agreedToTerms: false
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [editingAmount, setEditingAmount] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  const [influencer, setInfluencer] = useState(location.state?.influencer || null);
  const [loading, setLoading] = useState(!location.state?.influencer); // skip loading if we already have the influencer
  const [error, setError] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);  // here currentProfile is the current brand
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentProfile(JSON.parse(localStorage.getItem('profile')));
  }, []);
  

  useEffect(() => {
    // Only fetch if influencer not passed via location state (e.g., on page refresh)
    if (!influencer) {
      const fetchInfluencerDetail = async () => {
        try {
          const response = await backendUrl.get(`/auth/influencer-register/${id}/`);
          setInfluencer(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching influencer details:', error.response.data);
          setError('Failed to load influencer details. Please try again later.');
          setLoading(false);
        }
      };

      fetchInfluencerDetail();
    }
  }, [id, influencer]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);

    const payload = {
      brand: Number(currentProfile.id),
      influencer: Number(influencer.id),
      title: formData.contractTitle,
      is_signed_by_brand: true,
      brand_signed_at: new Date().toISOString(),
      payment_amount: Number(formData.paymentAmount),
      deliverable_title: formData.deliverableTitle,
      deliverable_description: formData.deliverableDescription,
      deliverable_deadline: new Date(formData.deliverableDeadline).toISOString(), // 👈 make sure it's ISO
    };

    try {
      const response = await backendUrl.post('/api/contracts/', payload);
      console.log('Contract created:', response.data);
      //alert('Contract submitted successfully!');
      navigate(`/RequestedOffer/${response.data.id}`);  //navigate to RequestedOfferDetail page
    } catch (error) {
      setError('Failed to create a contract. Please try again later.');
      console.error('Error submitting contract:', error.response?.data);
      //alert('Failed to submit contract. Please try again later.');
      
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCheckboxChange = () => {
    setFormData({
      ...formData,
      agreedToTerms: !formData.agreedToTerms
    });
  };
  
  
  // Generate dates for the simple date picker
  const getDates = () => {
    const dates = [];
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let currentMonth = '';
    
    // Generate dates for the next 60 days (approx 2 months)
    for (let i = 0; i < 60; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i + 1); // Start from tomorrow
      
      const month = months[date.getMonth()];
      const monthYear = `${month} ${date.getFullYear()}`;
      const isNewMonth = monthYear !== currentMonth;
      
      if (isNewMonth) {
        currentMonth = monthYear;
      }
      
      dates.push({
        date: date,
        formatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        monthHeader: isNewMonth ? monthYear : null
      });
    }
    
    return dates;
  };
  
  const selectDate = (formattedDate) => {
    setFormData({
      ...formData,
      deliverableDeadline: formattedDate
    });
    setShowDatePicker(false);
  };




  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-pink-50">
        <p className="text-gray-600 text-sm">Loading conversations...</p>
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
  
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-outfit bg-pink-50 md:pb-50 lg:pb-0">
      <div className="w-full md:max-w-lg lg:max-w-xl md:my-10 md:shadow-lg md:rounded-lg md:overflow-hidden bg-pink-50">
        {/* Header with avatar and name */}
        <div className="p-4 border-b border-pink-400 mb-5 bg-pink-100">
          <div className="flex items-center">
            <button 
              onClick={() => navigate(-1)} 
              className="mr-4 cursor-pointer"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
      
            <div className="flex items-center ml-4">
              <div className="relative">
                <img 
                  src={influencer.avatar_url} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              <h2 className="ml-2 text-lg text-gray-700 font-medium">{influencer.display_name}</h2>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-4 pt-4">
            <div className="mb-6">
              <label className="block mb-2 text-gray-700">Contract title</label>
              <input 
                type="text" 
                name="contractTitle"
                value={formData.contractTitle}
                onChange={handleInputChange}
                placeholder="Enter contract title" 
                className="w-full h-[44px] md:h-[50px] p-4 border border-gray-600 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>

            <div className="border-t border-gray-300 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <label className="block text-gray-700">Payment amount</label>
                  {editingAmount ? (
                    <div className="flex items-center mt-1">
                      <div className="relative">
                        <input
                          type="number"
                          name="paymentAmount"
                          value={formData.paymentAmount}
                          onChange={handleInputChange}
                          className="w-32 p-2 border rounded text-gray-700 pr-8"
                          min="1"
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-gray-500">$</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-800">${formData.paymentAmount}</p>
                  )}
                </div>
                <button 
                  type="button"
                  className="px-6 py-2 border rounded-lg text-gray-800 cursor-pointer hover:bg-pink-300 focus:bg-pink-300"
                  onClick={() => setEditingAmount(!editingAmount)}
                >
                  {editingAmount ? 'Save' : 'Edit'}
                </button>
              </div>
            </div>
            

            <div className="border-t border-gray-300 py-4">
              <label className="block text-gray-700 mb-2">Deliverable title</label>
              <input 
                type="text" 
                name="deliverableTitle"
                value={formData.deliverableTitle}
                onChange={handleInputChange}
                placeholder="Enter deliverable title" 
                className="w-full h-[44px] md:h-[50px] p-4 border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Deliverable deadline</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="deliverableDeadline"
                  value={formData.deliverableDeadline}
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  readOnly
                  placeholder="Choose deliverable deadline" 
                  className="w-full h-[44px] md:h-[50px] p-4 border rounded-lg text-gray-700 placeholder-gray-400 cursor-pointer focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                  required
                />
                <Calendar className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
                
                {/* Simple date picker */}
                {showDatePicker && (
                  <div className="absolute z-10 mt-1 bg-white border rounded-lg shadow-lg p-2 w-full max-h-72 overflow-y-auto">
                    <div className="text-center font-medium py-1 border-b mb-1">Select Due Date</div>
                    {getDates().map((dateObj, index) => (
                      <div key={index}>
                        {dateObj.monthHeader && (
                          <div className="sticky top-0 bg-gray-100 py-1 px-2 font-medium text-gray-700 mt-2 mb-1 rounded">
                            {dateObj.monthHeader}
                          </div>
                        )}
                        <div 
                          className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                          onClick={() => selectDate(dateObj.formatted)}
                        >
                          {dateObj.formatted}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            

            <div className="py-4">
              <label className="block text-gray-700 mb-2">Deliverable description</label>
              <textarea 
                name="deliverableDescription"
                value={formData.deliverableDescription}
                onChange={handleInputChange}
                placeholder="Write about the deliverable in detail." 
                className="w-full p-4 border rounded-lg text-gray-700 placeholder-gray-400 min-h-32 focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            
            
            
            <div className="pb-8 flex items-center md:mb-6 lg:mb-0">
              <div 
                className={`w-6 h-6 border rounded flex items-center justify-center mr-2 cursor-pointer ${formData.agreedToTerms ? 'bg-pink-600 border-pink-600' : 'border-gray-300'}`}
                onClick={handleCheckboxChange}
              >
                {formData.agreedToTerms && <Check className="h-4 w-4 text-white" />}
              </div>
              <p className="text-gray-800">Yes, I understand and agree to Tikpartner's Terms.</p>
            </div>
            
            <div className="flex space-x-4 mb-6">
              <button 
                type="button" 
                className="w-full bg-gray-200 text-gray-700 py-3 md:py-4 rounded md:rounded-lg font-medium hover:bg-gray-300 transition duration-200 md:text-lg cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="w-full bg-pink-600 text-white py-3 md:py-4 rounded md:rounded-lg font-medium hover:bg-pink-700 transition duration-200 md:text-lg cursor-pointer"
                disabled={!formData.agreedToTerms || isSubmitting}
                
              >
                {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Contract...
                </div>
              ) : (
                'Send Contract'
              )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}