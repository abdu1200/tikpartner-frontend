import { useState, useEffect } from "react";
import { ChevronLeft, MoreVertical, X } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import backendUrl from "../../../../utils/backendUrl";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Replace with your Stripe publishable key
const stripePromise = loadStripe("pk_test_51PPN5NRt8NVEmh7T5gwdm6cP4qAfXlKy8pwcMiEb4NtuBnGL8w9farKjO5t4SqBzFeT7O5e1j21KkCTrLjOFdhQA00LakRPJSZ");


const OfferDetailPage = () => {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentStep, setPaymentStep] = useState('confirm'); // 'confirm', 'checkout', 'success'
  

  useEffect(() => {
      const fetchAcceptedOfferDetail = async () => {
        try {
          const response = await backendUrl.get(`/api/accepted_offers/${id}/`);
          setOffer(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching accepted offer details:', error.response?.data);
          setError('Failed to load accepted offer details. Please try again later.');
          setLoading(false);
        }
      };
  
      fetchAcceptedOfferDetail();
   }, [id]);    
  

  // Format date helper function
  const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
  };
  
  // Handle contract activation
  const handleActivateContract = () => {
    setShowDepositModal(true);
  };

  // Handle deposit confirmation
  const handleDepositConfirm = async () => {
    try {
      setPaymentStep('checkout');
      
      // Initialize payment intent with backend
      const response = await backendUrl.post(`/api/payments/${offer.payment_id}/init_payment/`);
      
      // Set payment data(payment intent data returned from the backend) from response
      setPaymentData({
        clientSecret: response.data.client_secret,
        paymentIntentId: response.data.payment_intent_id,
        payment: response.data.payment
      });
      
    } catch (error) {
      console.error('Error initializing payment:', error.response?.data);
      setError('Failed to initialize payment. Please try again later.');
      setShowDepositModal(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    try {
      // You might want to update your backend about successful payment
      const response = await backendUrl.post(`/api/payments/${offer.payment_id}/deposit_to_escrow/`, {
        payment_intent_id: paymentData.paymentIntentId
      });

      console.log(response.data);
      
      // Show success state
      setPaymentStep('success');
      
      // Close modal after 5 seconds and navigate to active contracts
      setTimeout(() => {
        setShowDepositModal(false);
        navigate('/ActiveContractsList')
        
      }, 10000);
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      setError('Payment was processed but we encountered an error updating your contract. Please contact support.');
    }
  };

  // Handle deposit cancellation
  const handleDepositCancel = () => {
    setShowDepositModal(false);
    setPaymentStep('confirm');
    setPaymentData(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-pink-50">
        <p className="text-gray-600 text-sm">Loading an offer...</p>
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

  if (!offer) {
    return (
      <div className="h-full flex items-center justify-center bg-white bg-red-100 border border-red-400 px-4 py-3 rounded">
        <div>Offer not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-outfit bg-pink-50 md:pb-50 lg:pb-40">
      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div className="absolute inset-0 backdrop-blur-xs bg-opacity-30"></div>
          
          {/* Modal */}
          <div className="bg-white rounded-lg w-full max-w-md mx-4 z-10">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">
                {paymentStep === 'confirm' && 'Deposit funds into Escrow'}
                {paymentStep === 'checkout' && 'Enter payment details'}
                {paymentStep === 'success' && 'Payment successful!'}
              </h3>
              <button onClick={handleDepositCancel} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {paymentStep === 'confirm' && (
                <div className="text-center">
                  <p className="mb-6 text-gray-700">
                    To continue, you will be depositing <span className="font-semibold">${offer.payment_amount}</span> into Escrow today.
                  </p>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleDepositCancel}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md text-center font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button 
                      onClick={handleDepositConfirm}
                      className="flex-1 py-3 px-4 bg-pink-600 hover:bg-pink-700 transition duration-200 text-white rounded-md text-center font-medium cursor-pointer"
                    >
                      Yes, Deposit
                    </button>
                  </div>
                </div>
              )}
              
              {paymentStep === 'checkout' && paymentData && (
                <Elements stripe={stripePromise}>
                  <CheckoutForm 
                    clientSecret={paymentData.clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handleDepositCancel}
                  />
                </Elements>
              )}
              
              {paymentStep === 'success' && (
                <div className="text-center">
                  <div className="mb-4 text-green-500">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium mb-2">Payment successful!</p>
                  <p className="text-gray-600">Your contract has been activated and funds have been placed in escrow.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="w-full md:max-w-lg lg:max-w-xl md:my-10 md:shadow-lg md:rounded-lg md:overflow-hidden bg-pink-50">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-pink-100">
          <button 
           onClick={() => navigate('/AcceptedOffersList')} 
           className="flex items-center mr-2 cursor-pointer"
           disabled={isCancelling}
           >
            <ChevronLeft size={20} />
          </button>
          <span className="text-base ml-1">View offer</span>
          <div className="ml-auto text-xs text-gray-400">
            Sent on {formatDate(offer.brand_signed_at)}
          </div>
          <div className="ml-2">
            <MoreVertical size={20} />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="text-sm text-gray-500">Contract title</div>
            <div className="text-base mt-1">{offer.title}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">To influencer:</div>
            <div className="flex items-center mt-2">
              <span className="text-base">{offer.influencer_name}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">Payment Amount</div>
            <div className="text-base mt-1">${offer.payment_amount}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Deliverable title</div>
            <div className="text-base mt-1">{offer.deliverable_title}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">Deliverable deadline</div>
            <div className="text-base mt-1">{formatDate(offer.deliverable_deadline)}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">deliverable description</div>
            <div className="text-base mt-1">{offer.deliverable_description || "No description"} </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="p-4">
          <button 
           onClick={() => navigate('/AcceptedOffersList')} 
           className="w-full py-3 px-4 border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-200 rounded-md text-center font-medium mb-4 cursor-pointer"
           disabled={isCancelling}
           > 
            Go back
          </button>
          
          <button 
            onClick={handleActivateContract}
            className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 transition duration-200 text-white rounded-md text-center font-medium cursor-pointer"
            disabled={isCancelling}
          >
            {isCancelling ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Activating contract...
              </div>
            ) : (
              'Activate Contract'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferDetailPage;