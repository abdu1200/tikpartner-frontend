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
    gender: '',
    phoneNumber: '',
    profilePicture: '',
    location: '',

    // Step 2 data
    contentType: 'tech',
    tiktokUsername: '',
    tiktokDisplayName: '',
    tiktokAvatarUrl: '',
    tiktokFollowerCount: 0,
    tiktokVideoCount: 0,
    tiktokLikesCount: 0,
    languages: [],

    // Step 3 data
    budgetAmount: '1k - 5k',
    serviceBio: ''
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

  // Map language names to IDs (reverse mapping from signup)
  const languageNameMap = {
    1: 'English',
    2: 'Amharic',
    3: 'Oromiffa'
  };

  // Fetch current user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await backendUrl.get('/auth/influencer-register/me/');
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
          gender: userData.gender || '',
          contentType: categoryNameMap[userData.category] || 'tech',
          tiktokUsername: userData.tiktok_username || '',
          tiktokDisplayName: userData.display_name || '',
          tiktokAvatarUrl: userData.avatar_url || '',
          tiktokFollowerCount: userData.follower_count || 0,
          tiktokVideoCount: userData.video_count || 0,
          tiktokLikesCount: userData.likes_count || 0,
          languages: userData.languages?.map(langId => languageNameMap[langId]).filter(Boolean) || [],
          budgetAmount: userData.budget || '1k - 5k',
          serviceBio: userData.user?.bio || ''
        };

        setFormData(mappedData);
        
        // Set profile image preview if exists
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
      setProfileImage(file);
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

      const categoryId = categoryIdMap[formData.contentType];

      const languageIdMap = {
        'English': 1,
        'Amharic': 2,
        'Oromiffa': 3
      };
      
      const languageIds = formData.languages.map(lang => languageIdMap[lang]);

      // Create FormData for file upload
      const requestData = new FormData();
      
      // if (formData.username) requestData.append('user[username]', formData.username);

      // User data
      if (formData.username) requestData.append('user[username]', formData.username);
      if (formData.email) requestData.append('user[email]', formData.email);
      if (formData.firstName) requestData.append('user[first_name]', formData.firstName);
      if (formData.lastName) requestData.append('user[last_name]', formData.lastName);
      if (formData.phoneNumber) requestData.append('user[phone_number]', formData.phoneNumber);
      if (formData.location) requestData.append('user[location]', formData.location);
      if (formData.serviceBio) requestData.append('user[bio]', formData.serviceBio);
      
      if (formData.password) {
        requestData.append('user[password]', formData.password);
      }
      
      if (profileImage) {
        requestData.append('user[profile_picture]', profileImage);
      }

      // Profile data
      if (formData.categoryId) requestData.append('category', categoryId);
      if (formData.gender) requestData.append('gender', formData.gender);
      if (formData.budgetAmount) requestData.append('budget', formData.budgetAmount);
      if (formData.tiktokUsername) requestData.append('tiktok_username', formData.tiktokUsername);
      if (formData.tiktokAvatarUrl) requestData.append('avatar_url', formData.tiktokAvatarUrl);
      if (formData.tiktokDisplayName) requestData.append('display_name', formData.tiktokDisplayName);
      if (formData.tiktokFollowerCount) requestData.append('follower_count', Number(formData.tiktokFollowerCount));
      if (formData.tiktokVideoCount) requestData.append('video_count', Number(formData.tiktokVideoCount));
      if (formData.tiktokLikesCount) requestData.append('likes_count', Number(formData.tiktokLikesCount));
      
      // Languages
      languageIds.forEach(langId => {
        requestData.append('languages[]', langId);
      });

      // Use PATCH instead of PUT and target the me endpoint
      const response = await backendUrl.patch('/auth/influencer-register/me/', requestData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Update successful:', response.data);
      alert('Profile updated successfully!');
      navigate('/WelcomePage')
      
    } catch (err) {
      console.error('Update error:', err);
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

 useEffect(() => {
    // we're the user is redirected to the Signup form from TikTok OAuth
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    
    if (code && state) {
      // We are returning from TikTok OAuth, and then restore previous state(form data and current step)
      const savedFormData = localStorage.getItem('formDataBeforeTikTok');
      const savedStep = localStorage.getItem('currentStepBeforeTikTok');
      
      if (savedFormData && savedStep) {
        setFormData(JSON.parse(savedFormData));
        setCurrentStep(Number(savedStep));
      }
    }
  }, []);

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


