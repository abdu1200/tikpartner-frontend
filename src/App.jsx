import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import ForgetPassword from './components/ForgetPassword'
import BrandHomePage from './pages/brands/HomePage'
import BrandSignupForm from './pages/brands/signup/SignupForm'
import BrandLoginForm from './pages/brands/LoginForm'
import BrandPasswordReset from './pages/brands/PasswordReset'
import InfluencerHomePage from './pages/influencers/HomePage'
import InfluencerSignupForm from './pages/influencers/signup/SignupForm'
import InfluencerLoginForm from './pages/influencers/LoginForm'
import InfluencerPasswordReset from './pages/influencers/PasswordReset'

import BrowseInfluencersPage from './pages/brands/BrowseInfluencer/BrowseInfluencersPage'
import InfluencerDetailPage from './pages/brands/BrowseInfluencer/InfluencerDetailPage'
import SearchInfluencersPage from './pages/brands/SearchInfluencer/SearchInfluencersPage'

import ConversationListPage from './components/ConversationList'
import ChatPage from './components/Chat'






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
      <Route path="/BrowseInfluencersPage" element={<BrowseInfluencersPage />} />
      <Route path="/influencer/:id" element={<InfluencerDetailPage />} />
      <Route path="/SearchInfluencersPage" element={<SearchInfluencersPage />} />
      <Route path="/ConversationList" element={<ConversationListPage />} />
      <Route path="/conversations/:conversationId" element={<ChatPage />} />


    </Routes>
  )
}

export default App



// return (
//   <div>
//     <HomePage />
//   </div>
// )