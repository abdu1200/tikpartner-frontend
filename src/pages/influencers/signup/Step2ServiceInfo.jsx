import React, {useState, useEffect} from 'react';
import {
  Cpu,
  Shirt,
  HeartPulse,
  Utensils,
  Clapperboard,
  BookOpen,
  ChevronDown
} from "lucide-react";
import backendUrl from '../../../utils/backendUrl';

export default function Step2ServiceInfo({ formData, handleChange, updateFormData, nextStep, prevStep }) {

  const [showLanguages, setShowLanguages] = useState(false);
  const [isConnectingTikTok, setIsConnectingTikTok] = useState(false);

  const isTiktokConnected = !!formData.tiktokUsername;   //this is false if tiktokUsername is empty string like ''

  const contentTypes = [
    { id: 'tech', label: 'Tech', icon: <Cpu className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    { id: 'fashion', label: 'Fashion', icon: <Shirt className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    { id: 'health', label: 'Health', icon: <HeartPulse className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    { id: 'food', label: 'Food', icon: <Utensils className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    // { id: 'entertainment', label: 'Entertainment', icon: <Clapperboard className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    // { id: 'education', label: 'Education', icon: <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> }
  ];

  const handleContentTypeSelect = (type) => {
    updateFormData({ contentType: type });
  };

  const languages = [
    'Amharic', 'Oromiffa', 'English' 
  ];

  const toggleLanguage = (language) => {
    const currentLanguages = formData.languages || [];
    
    if (currentLanguages.includes(language)) {
      updateFormData({ 
        languages: currentLanguages.filter(lang => lang !== language) 
      });
    } else {
      updateFormData({ 
        languages: [...currentLanguages, language] 
      });
    }
  };



  // Function to handle TikTok connection
  const connectTikTok = () => {
    setIsConnectingTikTok(true);

    console.log("Saving form data before TikTok redirect:", formData);

    try {
      localStorage.setItem('formDataBeforeTikTok', JSON.stringify(formData));
      localStorage.setItem('currentStepBeforeTikTok', '2');
      
      // Verify the data was saved correctly
      console.log("Verification - Saved data:", localStorage.getItem('formDataBeforeTikTok'));
      console.log("Verification - Saved step:", localStorage.getItem('currentStepBeforeTikTok'));
    } catch (err) {
      console.error("Error saving form data to localStorage:", err);
    }

    // // Save current input form info and current step(like step 2) to localStorage
    // localStorage.setItem('formDataBeforeTikTok', JSON.stringify(formData));
    // localStorage.setItem('currentStepBeforeTikTok', '2'); // We know it's step 2

    
    // Replace these values with your TikTok Developer App credentials
    const clientKey = "sbaweuralgopknrhuo";
    const baseRedirectUri = "https://tikfrontend-latest.onrender.com/InfluencerSignup";
    const redirectUri = encodeURIComponent(baseRedirectUri); // this is a redirect uri where after a user authenticates(logs) with tiktok and authorizes its tiktok data to be used by the app, TikTok will then return the user to this page   # window.location.href refers to the same page(the current url of the page) that initiates the call(the OAuth process) w/h is 'InfluencerSignup'
    const scope = encodeURIComponent("user.info.basic,user.info.stats,user.info.profile,video.list");  // video.list scope allows my app to request access to the list of videos uploaded by the authenticated TikTok user. With this permission, you can fetch the user's videos and their metadata, such as the number of likes, comments, views, and more.
    const state = generateRandomState(); // Generate a random state for security
    
    // Store state in localStorage for verification when the user returns
    localStorage.setItem('tiktokAuthState', state);
    
    // Construct the TikTok OAuth URL
    const tiktokAuthUrl = `https://www.tiktok.com/v2/auth/authorize/` +
      `?client_key=${clientKey}` +
      `&scope=${scope}` +
      `&response_type=code` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}`;
    
    // Open the TikTok authorization page
    window.location.href = tiktokAuthUrl;      // 'window.location.href' refers to the current url of the page w/h in this case is the Tiktok authorization page
  };


  // Function to generate a random state string for OAuth security
  const generateRandomState = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };


  ////The useEffect handles the authorization code (access code) that TikTok sends back to your app through the redirect URI after the user successfully authenticates and authorizes access.
  ////then, sends the code to the Django backend('/api/auth/tiktok/').
  ////The backend uses the code to request an access token from TikTok.
  //// and then using the access token, you can retrieve the user's data from Tiktok's API. 

  useEffect(() => {
    
    // Define an async function for axios await
    const handleTikTokAuth = async () => {
      // Parse URL parameters
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      const storedState = localStorage.getItem('tiktokAuthState');
      
      // If code and state are present, and state matches, process the auth
      if (code && state && state === storedState) {  
        setIsConnectingTikTok(true);

        console.log("auth code", code);
        
        // Clear the stored state
        localStorage.removeItem('tiktokAuthState');
        
        try {
          // Send the code to your Django backend using axios

          const response = await backendUrl.post('/api/auth/tiktok/', { code });
          const data = response.data;

          console.log("coming user data", data);

          if (data.success && data.tiktok_info) {
            // Update the form data with the users tiktok infos
            updateFormData({
              tiktokUsername: data.tiktok_info.tiktok_username,
              tiktokDisplayName: data.tiktok_info.tiktok_display_name,
              tiktokAvatarUrl: data.tiktok_info.tiktok_avatar_url,
              tiktokFollowerCount: data.tiktok_info.tiktok_follower_count,
              tiktokVideoCount: data.tiktok_info.tiktok_video_count,
              tiktokLikesCount: data.tiktok_info.tiktok_likes_count,
            });


            localStorage.removeItem('formDataBeforeTikTok');
            localStorage.removeItem('currentStepBeforeTikTok');

          } else {
            // Handle errors
            console.log('TikTok authentication failed:', data.error);
            alert('Failed to connect TikTok account. Please try again.');
          }
        } catch (error) {
          console.log('Error connecting to TikTok:', error.response.data);
          alert('Error connecting to TikTok. Please try again.');

          localStorage.removeItem('formDataBeforeTikTok');
          localStorage.removeItem('currentStepBeforeTikTok');

        } finally {
          setIsConnectingTikTok(false);
          
          // Remove the code and state from URL for cleanliness
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };
    
    // Call the async function
    handleTikTokAuth();
  }, [updateFormData, setIsConnectingTikTok]);
  
  return (
    <div className='font-outfit'>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-[60px] md:max-w-lg md:mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-pink-600 bg-pink-600 flex items-center justify-center">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="mt-2 text-sm md:text-base">Step 1</span>
        </div>
        
        <div className="flex-1 h-px bg-pink-600 mx-2"></div>
        
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-pink-600 bg-white flex items-center justify-center">
          </div>
          <span className="mt-2 text-sm md:text-base">Step 2</span>
        </div>
        
        <div className="flex-1 h-px bg-gray-300 mx-2"></div>
        
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
          </div>
          <span className="mt-2 text-sm md:text-base">Step 3</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="mb-10">
        <h1 className="text-2xl text-gray-800 md:text-3xl lg:text-4xl font-normal mb-[12px] md:text-center">About your service</h1>
        <p className="text-gray-700 text-sm mb-[48px] md:text-center md:text-lg">Tell us a little bit about your account and service.</p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          if (!formData.languages?.length) {
            // Add this line to show required message
            document.getElementById('languagesError').classList.remove('hidden');
          } else if(!formData.tiktokUsername) {
            document.getElementById('tiktokError').classList.remove('hidden');
          } 
          else {
            nextStep();
          }

        }} className="md:max-w-lg md:mx-auto">
          {/* <div className="mb-[20px] md:mb-8">
            <label htmlFor="companyName" className="block text-gray-700 text-sm mb-[4px] md:text-lg">Company name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full p-3 md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
            />
          </div> */}
          
          <div className="mb-[50px] md:mb-12">
            <label className="block text-gray-700 text-sm mb-[4px] md:text-lg">What is your content about?</label>
            <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {contentTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => handleContentTypeSelect(type.id)}
                  className={`p-4 md:p-6 border rounded-lg text-center cursor-pointer transition-colors duration-200 
                  ${formData.contentType === type.id ? 'bg-pink-50 border-pink-200' : 'border-gray-200 hover:border-pink-200'}`}
                >
                  {type.icon}
                  <p className="text-sm md:text-base">{type.label}</p>
                </div>
              ))}
            </div>
          </div>


          
          {/* Languages Dropdown */}
          <div className="mb-[40px] md:mb-12">
            <label className="block text-gray-700 text-sm mb-[4px] md:text-lg">What languages can you speak?</label>
            
            <div className="relative">
              <button
                type="button"
                required
                onClick={() => setShowLanguages(!showLanguages)}
                className="w-full h-[44px] px-4 py-2 text-left flex items-center justify-between border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600"
              >
                <span className={formData.languages?.length ? "" : "text-gray-400 font-light"}>
                  {formData.languages?.length 
                    ? `${formData.languages.length} language${formData.languages.length !== 1 ? 's' : ''} selected` 
                    : "Select languages"}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>
              
              {showLanguages && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto">
                  {languages.map(language => (
                    <div 
                      key={language}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => toggleLanguage(language)}
                    >
                      <input
                        type="checkbox"
                        checked={formData.languages?.includes(language) || false}
                        onChange={() => {}}
                        className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500"
                      />
                      <span>{language}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Selected languages tags */}
            {formData.languages?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages.map(lang => (
                  <span 
                    key={lang}
                    className="bg-pink-50 text-pink-600 text-sm px-2 py-1 rounded-md flex items-center"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className="ml-1 text-pink-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {!formData.languages?.length && 
            <p id="languagesError" className="text-red-500 text-sm mt-[-35px] hidden">Please select at least one language</p>
          }


          
          {/* TikTok Connect Button */}
          <div className="mb-[40px] md:mb-12">
            <label className="block text-gray-700 text-sm mb-[4px] md:text-lg">Connect your TikTok account</label>
            
            {!isTiktokConnected ? (
              <div>
                <button
                  type="button"
                  onClick={connectTikTok}
                  disabled={isConnectingTikTok}
                  className={`w-full h-[50px] px-4 py-2 flex items-center justify-center border rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 cursor-pointer 
                  ${isConnectingTikTok ? 'bg-gray-100 text-gray-500' : 'bg-pink-600 text-white hover:bg-gray-800'} transition duration-200`}
                >
                  {isConnectingTikTok ? (
                    <span>Connecting...</span>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.9 2.9 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      Connect with TikTok
                    </>
                  )}
                </button>
                {!formData.tiktokUsername && 
                  <p id="tiktokError" className="text-red-500 text-sm mt-2 hidden">Please connect your TikTok account</p>
                }
              </div>
            ) : (
              <div className="flex items-center justify-between border border-green-200 bg-green-50 p-3 rounded md:rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.9 2.9 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                  <div>
                    <p className="text-gray-700 text-sm font-medium">Connected: @{formData.tiktokUsername}</p>
                    <p className="text-gray-500 text-xs">TikTok account connected successfully</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    updateFormData({ tiktokUsername: '' });
                  }}
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>


          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              className="w-full bg-gray-100 text-gray-700 py-3 md:py-4 rounded md:rounded-lg font-medium hover:bg-gray-200 transition duration-200 md:text-lg cursor-pointer"
            >
              Previous
            </button>
            <button
              type="submit"
              className="w-full bg-pink-600 text-white py-3 md:py-4 rounded md:rounded-lg font-medium hover:bg-pink-700 transition duration-200 md:text-lg cursor-pointer"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}