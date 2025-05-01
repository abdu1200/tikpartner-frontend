import React from 'react';
import {
  Cpu,
  Shirt,
  HeartPulse,
  Utensils,
  Clapperboard,
  BookOpen
} from "lucide-react";

export default function Step2CompanyInfo({ formData, handleChange, updateFormData, nextStep, prevStep }) {
  const businessTypes = [
    { id: 'tech', label: 'Tech', icon: <Cpu className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    { id: 'fashion', label: 'Fashion', icon: <Shirt className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    { id: 'health', label: 'Health', icon: <HeartPulse className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    { id: 'food', label: 'Food', icon: <Utensils className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Clapperboard className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> },
    { id: 'education', label: 'Education', icon: <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-pink-600 mx-auto mb-2" /> }
  ];

  const handleBusinessTypeSelect = (type) => {
    updateFormData({ businessType: type });
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
        <h1 className="text-2xl text-gray-800 md:text-3xl lg:text-4xl font-normal mb-[12px] md:text-center">About your company</h1>
        <p className="text-gray-700 text-sm mb-[48px] md:text-center md:text-lg">Tell us a little bit about your company.</p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }} className="md:max-w-lg md:mx-auto">
          <div className="mb-[20px] md:mb-8">
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
          </div>
          
          <div className="mb-[50px] md:mb-12">
            <label className="block text-gray-700 text-sm mb-[4px] md:text-lg">I represent</label>
            <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {businessTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => handleBusinessTypeSelect(type.id)}
                  className={`p-4 md:p-6 border rounded-lg text-center cursor-pointer transition-colors duration-200 
                  ${formData.businessType === type.id ? 'bg-pink-50 border-pink-200' : 'border-gray-200 hover:border-pink-200'}`}
                >
                  {type.icon}
                  <p className="text-sm md:text-base">{type.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* <div className="mb-[40px] md:mb-12">
            <label htmlFor="jobPosition" className="block text-gray-700 text-sm mb-[4px] md:text-lg">Job position</label>
            <input
              type="text"
              id="jobPosition"
              name="jobPosition"
              placeholder="Enter your job position"
              value={formData.jobPosition}
              onChange={handleChange}
              className="w-full p-3 md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
            />
          </div> */}
          
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