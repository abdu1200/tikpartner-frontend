import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  
  const goToInfluencers = () => {
    navigate('/InfluencerHomePage');
  };
  
  const goToBrands = () => {
    navigate('/BrandHomePage');
  };
  
  useEffect(() => {
    // Add a subtle gradient background
    document.body.style.backgroundColor = '#fff5f8';
    
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);
  
  // Mobile layout (default)
  const mobileLayout = (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-white to-pink-50 pt-[200px] px-[20px] lg:hidden">
      {/* Logo and Header */}
      <div className="text-center mb-20 w-full max-w-lg">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-pink-600">Tik</span>
            <span className="text-gray-800">partner</span>
          </h1>
          <div className="w-48 h-2 bg-pink-500 rounded-full mt-1 mb-6" style={{ 
            background: 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)',
            height: '4px'
          }}></div>
        </div>
        <p className="text-sm md:text-lg text-gray-600 mt-4 px-6">
          Connect influencers and brands for powerful TikTok marketing
        </p>
      </div>

      {/* Selection Buttons */}
      <div className="w-full max-w-sm md:max-w-md space-y-4 mb-10 md:mb-14">
        <div className="text-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">I am a...</h2>
        </div>

        <button
          onClick={goToBrands}
          className="w-full flex items-center justify-between bg-white border-2 border-pink-600 text-gray-800 px-4 py-3 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base">Brand</h3>
              <p className="text-xs text-gray-600">Find influencers for your campaigns</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>

        <button
          onClick={goToInfluencers}
          className="w-full flex items-center justify-between bg-pink-600 text-white px-4 py-3 rounded-xl hover:bg-pink-700 transition-colors cursor-pointer"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-pink-400 bg-opacity-30 rounded-full flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-bold text-base">Influencer</h3>
              <p className="text-xs text-pink-100">Get paid for creating content</p>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Footer Info */}
      <div className="mt-12 text-center text-gray-500 text-xs md:text-sm">
        <p>Join the 1000+ brands and influencers already on TikPartner</p>
      </div>
    </div>
  );
  
  // Desktop layout (side-by-side)
  const desktopLayout = (
    <div className="hidden lg:flex lg:flex-row min-h-screen bg-gradient-to-b from-white to-pink-50">
      {/* Left Side - Logo and Description */}
      <div className="w-1/2 flex flex-col items-center justify-center p-12">
        <div className="max-w-md">
          <div className="flex flex-col items-start">
            <h1 className="text-5xl font-bold mb-2 text-left">
              <span className="text-pink-600">Tik</span>
              <span className="text-gray-800">partner</span>
            </h1>
            <div className="w-48 h-2 bg-pink-500 rounded-full mt-1 mb-6" style={{ 
              background: 'linear-gradient(90deg, #ec4899 0%, #f472b6 100%)',
              height: '4px'
            }}></div>
          </div>
          
          <p className="text-xl text-gray-600 mt-4 mb-8 text-left">
            Connect influencers and brands for powerful TikTok marketing
          </p>
          
          <p className="text-gray-500 text-sm mb-0 text-left">
            Join the 1000+ brands and influencers already on TikPartner
          </p>
        </div>
      </div>
      
      {/* Right Side - User Selection */}
      <div className="w-1/2 flex flex-col items-center justify-center p-12 bg-white bg-opacity-60">
        <div className="w-full max-w-md">
          <div className="text-left mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">I am a...</h2>
          </div>

          <div className="space-y-4">
            <button
              onClick={goToBrands}
              className="w-full flex items-center justify-between bg-white border-2 border-pink-600 text-gray-800 px-6 py-4 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">Brand</h3>
                  <p className="text-sm text-gray-600">Find influencers for your campaigns</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              onClick={goToInfluencers}
              className="w-full flex items-center justify-between bg-pink-600 text-white px-6 py-4 rounded-xl hover:bg-pink-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-400 bg-opacity-30 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">Influencer</h3>
                  <p className="text-sm text-pink-100">Get paid for creating content</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className='font-outfit'>
      {mobileLayout}
      {desktopLayout}
    </div>
  );
};

export default LandingPage;