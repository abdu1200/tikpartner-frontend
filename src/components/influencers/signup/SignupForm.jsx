import { useState, useEffect } from 'react';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2ServiceInfo from './Step2ServiceInfo';
import Step3ServiceDetails from './Step3ServiceDetails';
import axios from 'axios';

export default function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1 data
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    
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

      //Map content type to the corresponding ID/PK in the db
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

      // Format the data according to the expected structure
      const requestData = {
        user: {
          username: formData.username,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: "influencer",
          bio: formData.serviceBio || "",
          password: formData.password
        },
        category: categoryId,
        languages: languageIds,
        budget: formData.budgetAmount,
        tiktok_username: formData.tiktokUsername,
        avatar_url: formData.tiktokAvatarUrl,
        display_name: formData.tiktokDisplayName,
        follower_count: Number(formData.tiktokFollowerCount),
        video_count: Number(formData.tiktokVideoCount),
        likes_count: Number(formData.tiktokLikesCount),
      };
      
      //console.log('Sending data:', JSON.stringify(requestData));

      const response = await axios.post('https://tikbackend.onrender.com/auth/influencer-register/', requestData);
      
      console.log('Registration successful:', response.data);
      alert('Signup successful!');
      // You could redirect to login page or dashboard here
      
    } catch (err) {
      console.log('Registration error:', err.message);

      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers); }

      setError(
        err.response?.data?.message || 
        err.message || 
        'Something went wrong. Please try again.'
      );

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


  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalInfo 
            formData={formData}
            handleChange={handleChange}
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