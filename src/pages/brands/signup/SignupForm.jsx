import { useState } from 'react';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2CompanyInfo from './Step2CompanyInfo';
import Step3CompanyDetails from './Step3CompanyDetails';
import backendUrl from '../../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';


export default function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Step 1 data
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    
    // Step 2 data
    companyName: '',
    businessType: 'tech',
    
    // Step 3 data
    companySize: '1 - 10',
    companyBio: ''
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

      //Map business type to the corresponding ID/PK in the db
      const categoryIdMap = {
        'tech': 2,
        'fashion': 3,
        'health': 4,
        'food': 5,
        'entertainment': 1,
        'education': 6
      };

      const categoryId = categoryIdMap[formData.businessType];

      // Format the data according to the expected structure
      const requestData = {
        user: {
          username: formData.username,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_type: "brand",
          bio: formData.companyBio || "",
          password: formData.password
        },
        category: categoryId,
        company_name: formData.companyName,
        company_size: formData.companySize,
      };
      
      //console.log('Sending data:', JSON.stringify(requestData));

      const response = await backendUrl.post('/auth/brand-register/', requestData);
      
      console.log('Registration successful:', response.data);
      
      navigate('/BrowseInfluencersPage');

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
          <Step2CompanyInfo 
            formData={formData}
            handleChange={handleChange}
            updateFormData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <Step3CompanyDetails 
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