import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ForgetPassword from './components/ForgetPassword'
import BrandHomePage from './components/brands/HomePage'
import BrandSignupForm from './components/brands/SignupForm'
import BrandLoginForm from './components/brands/LoginForm'
import BrandPasswordReset from './components/brands/PasswordReset'
import InfluencerHomePage from './components/influencers/HomePage'
import InfluencerSignupForm from './components/influencers/SignupForm'
import InfluencerLoginForm from './components/influencers/LoginForm'
import InfluencerPasswordReset from './components/influencers/PasswordReset'





function App() {

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/ForgetPassword" element={<ForgetPassword />} />
      <Route path="/BrandHomePage" element={<BrandHomePage />} />
      <Route path="/BrandSignup" element={<BrandSignupForm />} />
      <Route path="/BrandLogin" element={<BrandLoginForm />} />
      <Route path="/BrandPasswordReset" element={<BrandPasswordReset />} />
      <Route path="/InfluencerHomePage" element={<InfluencerHomePage />} />
      <Route path="/InfluencerSignup" element={<InfluencerSignupForm />} />
      <Route path="/InfluencerLogin" element={<InfluencerLoginForm />} />
      <Route path="/InfluencerPasswordReset" element={<InfluencerPasswordReset />} />
    </Routes>
  )
}

export default App



// return (
//   <div>
//     <HomePage />
//   </div>
// )