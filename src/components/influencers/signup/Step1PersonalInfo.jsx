import React, {useState} from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Step1PersonalInfo({ formData, handleChange, nextStep }) {

  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='font-outfit'>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-[62px] md:max-w-lg md:mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-pink-600 bg-white flex items-center justify-center">
            {/* Current step */}
          </div>
          <span className="mt-2 text-sm md:text-base">Step 1</span>
        </div>
        
        <div className="flex-1 h-px bg-gray-300 mx-2"></div>
        
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
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
        <h1 className="text-2xl text-gray-800 md:text-3xl lg:text-4xl font-noramal mb-[12px] md:text-center">Lets get started</h1>
        <p className="text-black text-sm mb-[56px] md:text-center font-light md:text-lg">First, Tell us some details about you.</p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }} className="md:max-w-lg md:mx-auto">

          <div className="mb-[20px] md:mb-6">
            <label htmlFor="username" className="block text-sm text-gray-800 mb-[4px] md:text-lg">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg  placeholder:text-sm  placeholder:font-light md:placeholder:text-lg"
            />
          </div>

          <div className="mb-[20px] md:mb-6">
            <label htmlFor="firstName" className="block text-sm text-gray-800 mb-[4px] md:text-lg">First name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg  placeholder:text-sm  placeholder:font-light md:placeholder:text-lg"
            />
          </div>
          
          <div className="mb-[20px] md:mb-6">
            <label htmlFor="lastName" className="block text-sm text-gray-700 mb-[4px] md:text-lg">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
            />
          </div>
          
          <div className="mb-[20px] md:mb-6">
            <label htmlFor="email" className="block text-sm text-gray-700 mb-[4px] md:text-lg">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
            />
          </div>

          <div className="mb-[20px] md:mb-6">
            <label htmlFor="gender" className="block text-sm text-gray-700 mb-[4px] md:text-lg">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 h-[44px] border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg font-light text-gray-700"
            >
              <option className="font-light" value="" disabled>Select your gender</option>
              <option className="font-light" value="male">Male</option>
              <option className="font-light" value="female">Female</option>
            </select>
          </div>

          
          <div className="mb-[40px] md:mb-8">
            <label htmlFor="password" className="block text-sm text-gray-700 mb-[4px] md:text-lg">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Choose a strong password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-3 md:py-4 rounded md:rounded-lg font-medium hover:bg-pink-700 transition duration-200 md:text-lg cursor-pointer"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}