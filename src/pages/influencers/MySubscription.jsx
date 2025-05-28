import { useState, useEffect } from 'react';
import { Crown, Check, ArrowLeft, X } from 'lucide-react';
import backendUrl from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';

const SubscriptionsPage = () => {
  const [loading, setLoading] = useState({});
  const [userSubscription, setUserSubscription] = useState(null);
  const [loadingSubscriptionStatus, setLoadingSubscriptionStatus] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const navigate = useNavigate();

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '$9.99',
      priceId: 'price_1RTgh8Rt8NVEmh7TSprcxTFh',   // Replace with your Stripe price ID for Basic Plan
      features: ["Access to basic features", "Be in the Brand's 'Featured Influencers' list page"],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19.99',
      priceId: 'price_1RThTKRt8NVEmh7TwDnzxEmL',  // Replace with your Stripe price ID for Pro Plan
      features: ["All basic features", "Be in the Brand's 'Featured Influencers' page", "Be able to 'first' message any brand" ],
      popular: true
    }
  ];

  // Fetch user subscription status on component mount
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await backendUrl.get('auth/influencer-register/me/');
        setUserSubscription(response.data);
      } catch (error) {
        console.error('Error fetching influencer info & subscription status:', error);
      } finally {
        setLoadingSubscriptionStatus(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  const handleSubscribe = async (priceId, planId) => {
    // Check if user is already subscribed
    if (userSubscription?.is_subscribed) {
      if (userSubscription.subscription_plan === planId) {
        alert(`You are already subscribed to the ${planId} plan.`);
        return;
      } else {
        // User wants to upgrade/downgrade
        const confirmChange = window.confirm(
          `You are currently subscribed to the ${userSubscription.subscription_plan} plan. Do you want to change to the ${planId} plan?`
        );
        if (!confirmChange) return;
      }
    }

    setLoading({ ...loading, [planId]: true });
    
    try {
      const response = await backendUrl.post('api/subscriptions/create-checkout-session/', {
        price_id: priceId
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;     // 'checkout_session url' is returned for shooting stripe checkout form(to provide card info and pay for the subscription)
      }
    } catch (error) {
      console.error('Error creating subscription:', error.response?.data);
      alert('Failed to create subscription. Please try again.');
    } finally {
      setLoading({ ...loading, [planId]: false });
    }
  };

  const handleCancelSubscription = async () => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel your subscription? You will lose access to premium features immediately.'
    );
    
    if (!confirmCancel) return;

    setCancelLoading(true);
    
    try {
      // Update influencer profile to cancel subscription
      const response = await backendUrl.patch(`auth/influencer-register/${userSubscription.id}`, {
        is_subscribed: false,
        subscription_plan: null,
        subscription_start_date: null
      });
      
      if (response.status === 200) {
        alert('Your subscription has been cancelled successfully.');
        
        // Update local state immediately
        setUserSubscription({
          ...userSubscription,
          is_subscribed: false,
          subscription_plan: null,
          subscription_start_date: null
        });
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error.response?.data);
      alert('Failed to cancel subscription. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  const getButtonText = (planId) => {
    if (loading[planId]) return 'Processing...';
    
    if (userSubscription?.is_subscribed) {
      if (userSubscription.subscription_plan === planId) {
        return 'Current Plan';
      } else {
        return `Switch to ${planId}`;
      }
    }
    
    return 'Subscribe Now';
  };

  const isButtonDisabled = (planId) => {
    return loading[planId] || (userSubscription?.is_subscribed && userSubscription.subscription_plan === planId);
  };

  if (loadingSubscriptionStatus) {
    return (
      <div className="min-h-screen bg-pink-50 font-outfit p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 font-outfit p-4">
      <header className="p-4">
        <div className="container mx-auto">
          <button
            onClick={() => navigate('/WelcomePage')}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Go Back</span>
          </button>
        </div>
      </header>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Crown className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Plan</h1>
          <p className="text-gray-600">
            {userSubscription?.is_subscribed 
              ? `Currently subscribed to: ${userSubscription.subscription_plan} plan`
              : "Upgrade your account to unlock premium features"
            }
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-sm border-2 p-6 relative ${
                plan.popular ? 'border-pink-500' : 'border-gray-200'
              } ${
                userSubscription?.subscription_plan === plan.id ? 'ring-2 ring-green-500' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {userSubscription?.subscription_plan === plan.id && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-pink-500 mb-1">
                  {plan.price}
                  <span className='text-gray-500 text-sm font-normal'>/month</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.priceId, plan.id)}
                disabled={isButtonDisabled(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  userSubscription?.subscription_plan === plan.id
                    ? 'bg-green-500 text-white cursor-not-allowed'
                    : plan.popular
                      ? 'bg-pink-500 hover:bg-pink-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
              >
                {getButtonText(plan.id)}
              </button>

              {/* Cancel Subscription Button - Only show for the active plan */}
              {userSubscription?.is_subscribed && userSubscription.subscription_plan === plan.id && (
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelLoading}
                  className="w-full mt-3 py-2 px-4 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {cancelLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-2 inline-block" />
                      Cancel Subscription
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;