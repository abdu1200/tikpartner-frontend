import React from 'react';

export default function Step3ServiceDetails({ 
  formData, 
  handleChange, 
  updateFormData, 
  handleSubmit, 
  prevStep, 
  isSubmitting, 
  error
}) {
  const companySizes = [
    { id: 'size1', label: '1 - 10' },
    { id: 'size2', label: '11 - 25' },
    { id: 'size3', label: '26 - 50' },
    { id: 'size4', label: '50+' }
  ];

  const handleCompanySizeSelect = (size) => {
    updateFormData({ companySize: size });
  };


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
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-pink-600 bg-pink-600 flex items-center justify-center">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <span className="mt-2 text-sm md:text-base">Step 2</span>
        </div>
        
        <div className="flex-1 h-px bg-pink-600 mx-2"></div>
        
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-pink-600 bg-white flex items-center justify-center">
          </div>
          <span className="mt-2 text-sm md:text-base">Step 3</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="mb-10">
        <h1 className="text-2xl text-gray-800 md:text-3xl lg:text-4xl font-normal mb-[12px] md:text-center">Update company details</h1>
        <p className="text-black text-sm mb-[56px] md:text-center font-light md:text-lg">Update your company information and size.</p>

        {/* Error Message if any */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-medium mb-1">Update error</p>
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }} className="md:max-w-lg md:mx-auto">
          
          <div className="mb-[40px] md:mb-8">
            <label className="block text-sm text-gray-800 mb-[4px] md:text-lg">Company Size</label>
            <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-4">
              {companySizes.map((size) => (
                <div 
                  key={size.id}
                  onClick={() => handleCompanySizeSelect(size.label)}
                  className={`p-4 md:p-5 border rounded-lg text-center cursor-pointer transition-colors duration-200 
                  ${formData.companySize === size.label ? 'bg-pink-50 border-pink-200' : 'border-gray-200 hover:border-pink-200'}`}
                >
                  <p className="text-sm md:text-base">{size.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-[40px] md:mb-8">
            <label htmlFor="companyBio" className="block text-sm text-gray-800 mb-[4px] md:text-lg">Company bio (optional)</label>
            <textarea
              id="companyBio"
              name="companyBio"
              placeholder="Tell us about your company in detail"
              value={formData.companyBio}
              onChange={handleChange}
              rows={5}
              className="w-full p-3 h-auto md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="w-full bg-gray-100 text-gray-700 py-3 md:py-4 rounded md:rounded-lg font-medium hover:bg-gray-200 transition duration-200 md:text-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-pink-600 text-white py-3 md:py-4 rounded md:rounded-lg font-medium hover:bg-pink-700 transition duration-200 md:text-lg cursor-pointer ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}