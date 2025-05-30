import { useState } from 'react';
import { Eye, EyeOff, Upload, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function Step1PersonalInfo({ 
  formData, 
  handleChange, 
  profileImage,
  profileImagePreview,
  handleImageChange,
  removeImage,
  nextStep 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

   // Simple helper function to display image URL correctly
   const getImageDisplayUrl = (imageSource) => {
    // If no image source, return null
    if (!imageSource) return null;
    
    // If it's a data URL (file preview), return as is
    if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
      return imageSource;
    }
    
    // If it's already a complete URL, return as is
    if (typeof imageSource === 'string' && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
      return imageSource;
    }
    
    // If it's something else, try to use it directly
    return imageSource;
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
        <h1 className="text-2xl text-gray-800 md:text-3xl lg:text-4xl font-normal mb-[12px] md:text-center">Update your profile</h1>
        <p className="text-black text-sm mb-[56px] md:text-center font-light md:text-lg">Update your personal details.</p>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          nextStep();
        }} className="md:max-w-lg md:mx-auto">

          {/* Profile Picture Upload */}
          <div className="mb-[20px] md:mb-6">
            <label className="block text-sm text-gray-800 mb-[4px] md:text-lg">Profile Picture</label>
            <div className="flex items-center space-x-4">
              {profileImagePreview ? (
                <div className="relative">
                  <img 
                    src={getImageDisplayUrl(profileImagePreview)}
                    alt="Profile preview" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <Upload size={20} className="text-gray-400" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="profilePicture"
                  className="cursor-pointer bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition duration-200"
                >
                  Choose Image
                </label>
              </div>
            </div>
          </div>

          <div className="mb-[20px] md:mb-6">
            <label htmlFor="username" className="block text-sm text-gray-800 mb-[4px] md:text-lg">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
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
              className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
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
              className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
            />
          </div>

          <div className="mb-[20px] md:mb-6">
            <label htmlFor="phoneNumber" className="block text-sm text-gray-700 mb-[4px] md:text-lg">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
            />
          </div>

          <div className="mb-[20px] md:mb-6">
            <label htmlFor="location" className="block text-sm text-gray-700 mb-[4px] md:text-lg">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter your location"
              value={formData.location}
              onChange={handleChange}
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
              className="w-full p-2 h-[44px] border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg font-light text-gray-700"
            >
              <option className="font-light" value="" disabled>Select your gender</option>
              <option className="font-light" value="male">Male</option>
              <option className="font-light" value="female">Female</option>
            </select>
          </div>
          
          <div className="mb-[40px] md:mb-8">
            <label htmlFor="password" className="block text-sm text-gray-700 mb-[4px] md:text-lg">Password (leave blank to keep current)</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter new password or leave blank"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 h-[44px] md:p-4 border border-gray-300 rounded md:rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-600 md:text-lg placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button
                className="w-full bg-gray-100 text-gray-700 py-3 md:py-4 rounded md:rounded-lg font-medium hover:bg-gray-200 transition duration-200 md:text-lg cursor-pointer"
                onClick={() => navigate('/InfMyProfilePage')}
            >
                Go Back
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