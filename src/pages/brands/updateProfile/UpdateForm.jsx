import { useState, useEffect } from 'react';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2ServiceInfo from './Step2ServiceInfo';
import Step3ServiceDetails from './Step3ServiceDetails';
import backendUrl from '../../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';

export default function UpdateProfileForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Step 1 data
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    profilePicture: '',
    location: '',

    // Step 2 data
    companyName: '',
    website: '',
    businessType: 'tech',
    
    // Step 3 data
    companySize: '1 - 10',
    companyBio: ''
  });

  // Map category names to IDs (reverse mapping from signup)
  const categoryNameMap = {
    2: 'tech',
    3: 'fashion',
    4: 'health',
    5: 'food',
    1: 'entertainment',
    6: 'education'
  };

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await backendUrl.get('/auth/brand-register/me/');
        const userData = response.data;
        console.log('Fetched user data:', userData);

        // Map the backend data to form data structure
        const mappedData = {
          // User fields
          username: userData.user?.username || '',
          firstName: userData.user?.first_name || '',
          lastName: userData.user?.last_name || '',
          email: userData.user?.email || '',
          password: '', // Don't pre-fill password for security
          phoneNumber: userData.user?.phone_number || '',
          profilePicture: userData.user?.profile_picture || '',
          location: userData.user?.location || '',
          
          // Profile fields
          companyName: userData.company_name || '',
          website: userData.website || '',
          businessType: categoryNameMap[userData.category] || 'tech',
          companySize: userData.company_size || '1 - 10',
          companyBio: userData.user?.bio || ''
        };

        setFormData(mappedData);
        
        // Set profile image preview - directly use the URL from backend
        if (userData.user?.profile_picture) {
          setProfileImagePreview(userData.user.profile_picture);
        }

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const updateFormData = (newData) => {
    setFormData(prevData => ({
      ...prevData,
      ...newData
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      setProfileImage(file);
      
      // Create preview URL for the new file
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    setFormData(prevData => ({
      ...prevData,
      profilePicture: ''
    }));
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Map content type to the corresponding ID/PK in the db
      const categoryIdMap = {
        'tech': 2,
        'fashion': 3,
        'health': 4,
        'food': 5,
        'entertainment': 1,
        'education': 6
      };
  
      const categoryId = categoryIdMap[formData.businessType];
  
      // Create FormData for file upload
      const requestData = new FormData();
      
      // User data - only include non-empty fields
      if (formData.username) requestData.append('user[username]', formData.username);
      if (formData.email) requestData.append('user[email]', formData.email);
      if (formData.firstName) requestData.append('user[first_name]', formData.firstName);
      if (formData.lastName) requestData.append('user[last_name]', formData.lastName);
      if (formData.phoneNumber) requestData.append('user[phone_number]', formData.phoneNumber);
      if (formData.location) requestData.append('user[location]', formData.location);
      if (formData.companyBio) requestData.append('user[bio]', formData.companyBio);
      
      // Only append password if it's provided
      if (formData.password && formData.password.trim() !== '') {
        requestData.append('user[password]', formData.password);
      }
      
      // Handle profile image - only append if a new file was selected
      if (profileImage && profileImage instanceof File) {
        requestData.append('user[profile_picture]', profileImage);
      }
  
      // Profile data
      if (formData.companyName) requestData.append('company_name', formData.companyName);
      if (formData.website) requestData.append('website', formData.website);
      if (categoryId) requestData.append('category', categoryId);
      if (formData.companySize) requestData.append('company_size', formData.companySize);
  
      // Debug logging
      console.log('FormData contents:');
      for (let [key, value] of requestData.entries()) {
        console.log(key, value);
      }
  
      // Use PATCH instead of PUT and target the me endpoint
      const response = await backendUrl.patch('/auth/brand-register/me/', requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Update successful:', response.data);
      alert('Profile updated successfully!');
      navigate('/BrowseInfluencersPage')
      
      // Optionally redirect or refresh data
      // window.location.reload(); // or navigate to profile page
      
    } catch (err) {
      console.error('Update error:', err);
      console.error('Error response:', err.response?.data);
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else {
          // Handle validation errors
          const errors = [];
          Object.keys(err.response.data).forEach(key => {
            if (Array.isArray(err.response.data[key])) {
              errors.push(`${key}: ${err.response.data[key].join(', ')}`);
            } else {
              errors.push(`${key}: ${err.response.data[key]}`);
            }
          });
          if (errors.length > 0) {
            errorMessage = errors.join('\n');
          }
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 font-outfit p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo 
            formData={formData}
            handleChange={handleChange}
            profileImage={profileImage}
            profileImagePreview={profileImagePreview}
            handleImageChange={handleImageChange}
            removeImage={removeImage}
            nextStep={nextStep}
          />
        );
      case 2:
        return (
          <Step2ServiceInfo 
            formData={formData}
            handleChange={handleChange}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Step3ServiceDetails 
            formData={formData}
            handleChange={handleChange}
            updateFormData={updateFormData}
            handleSubmit={handleSubmit}
            prevStep={prevStep}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <div className="w-full min-h-screen py-[25px] px-[5px] md:bg-gray-50 md:flex md:flex-col md:items-center md:justify-center md:py-6 font-outfit">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto p-4 md:p-8 bg-white md:shadow-lg md:rounded-xl">
        {renderStep()}
      </div>
    </div>
  );
}