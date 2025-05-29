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
import SendContractPage from './pages/brands/contract/SendContract'
import WorkHistoryPage from './pages/brands/WorkHistory'
import PortfolioPage from './pages/brands/Portfolio'


import WelcomePage from './pages/influencers/WelcomePage'
import StripeSuccessPage from './pages/influencers/StripeSuccess'
import SubmitPortfolioPage from './pages/influencers/SubmitPortfolio'
import MyPortfolioPage from './pages/influencers/MyPortfolio'
import MySubscriptionPage from './pages/influencers/MySubscription'
import MessageBrands from './pages/influencers/MessageBrands'


import ConversationListPage from './components/conversation/ConversationList'
import ChatPage from './components/conversation/Chat'

import ContractsPage from './pages/brands/contract/Contracts'
import RequestedOffersList from './pages/brands/contract/requestedOffers/RequestedOffersList'
import RequestedOfferDetail from './pages/brands/contract/requestedOffers/RequestedOfferDetail'
import AcceptedOffersList from './pages/brands/contract/acceptedOffers/AcceptedOffersList'
import AcceptedOfferDetail from './pages/brands/contract/acceptedOffers/AcceptedOfferDetail'
import ActiveContractsList from './pages/brands/contract/activeContracts/ActiveContractsList'
import ActiveContractDetail from './pages/brands/contract/activeContracts/ActiveContractDetail'
import ApproveWorksList from './pages/brands/contract/approveWorks/ApproveWorksList'
import ApproveWorkDetail from './pages/brands/contract/approveWorks/ApproveWorkDetail'
import RevisionContractsList from './pages/brands/contract/revisionContracts/RevisionContractsList'
import RevisionContractDetail from './pages/brands/contract/revisionContracts/RevisionContractDetail'
import ReleasedContractsList from './pages/brands/contract/releasedContracts/ReleasedContractsList'
import ReleasedContractDetail from './pages/brands/contract/releasedContracts/ReleasedContractDetail'
import ReviewedContractsList from './pages/brands/contract/reviewedContracts/ReviewedContractsList'
import ReviewedContractDetail from './pages/brands/contract/reviewedContracts/ReviewedContractDetail'



import InfContractsPage from './pages/influencers/contract/Contracts'
import InfRequestedOffersList from './pages/influencers/contract/requestedOffers/RequestedOffersList'
import InfRequestedOfferDetail from './pages/influencers/contract/requestedOffers/RequestedOfferDetail'
import InfAcceptedOffersList from './pages/influencers/contract/acceptedOffers/AcceptedOffersList'
import InfAcceptedOfferDetail from './pages/influencers/contract/acceptedOffers/AcceptedOfferDetail'
import InfActiveContractsList from './pages/influencers/contract/activeContracts/ActiveContractsList'
import InfActiveContractDetail from './pages/influencers/contract/activeContracts/ActiveContractDetail'
import InfRevisionContractsList from './pages/influencers/contract/revisionContracts/RevisionContractsList'
import InfRevisionContractDetail from './pages/influencers/contract/revisionContracts/RevisionContractDetail'
import InfReleasedContractsList from './pages/influencers/contract/releasedContracts/ReleasedContractsList'
import InfReleasedContractDetail from './pages/influencers/contract/releasedContracts/ReleasedContractDetail'
import InfReviewedContractsList from './pages/influencers/contract/reviewedContracts/ReviewedContractsList'
import InfReviewedContractDetail from './pages/influencers/contract/reviewedContracts/ReviewedContractDetail'




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
      <Route path="/SendContract/:id" element={<SendContractPage />} />
      <Route path="/WorkHistoryPage/:influencerUserId" element={<WorkHistoryPage />} />
      <Route path="/PortfolioPage/:influencerId" element={<PortfolioPage />} />


      <Route path="/WelcomePage" element={<WelcomePage />} />
      <Route path="/StripeSuccessPage" element={<StripeSuccessPage />} />
      <Route path="/SubmitPortfolioPage" element={<SubmitPortfolioPage />} />
      <Route path="/MyPortfolioPage" element={<MyPortfolioPage />} />
      <Route path="/MySubscriptionPage" element={<MySubscriptionPage />} />
      <Route path="/MessageBrands" element={<MessageBrands />} />


      <Route path="/ConversationList" element={<ConversationListPage />} />
      <Route path="/conversations/:conversationId" element={<ChatPage />} />
      
      <Route path="/Contracts" element={<ContractsPage />} />
      <Route path="/RequestedOffersList" element={<RequestedOffersList />} />
      <Route path="/RequestedOffer/:id" element={<RequestedOfferDetail />} />
      <Route path="/AcceptedOffersList" element={<AcceptedOffersList />} />
      <Route path="/AcceptedOffer/:id" element={<AcceptedOfferDetail />} />
      <Route path="/ActiveContractsList" element={<ActiveContractsList />} />
      <Route path="/ActiveContract/:id" element={<ActiveContractDetail />} />
      <Route path="/ApproveWorksList" element={<ApproveWorksList />} />
      <Route path="/ApproveWork/:id" element={<ApproveWorkDetail />} />
      <Route path="/RevisionContractsList" element={<RevisionContractsList />} />
      <Route path="/RevisionContract/:id" element={<RevisionContractDetail />} />
      <Route path="/ReleasedContractsList" element={<ReleasedContractsList />} />
      <Route path="/ReleasedContract/:id" element={<ReleasedContractDetail />} />
      <Route path="/ReviewedContractsList" element={<ReviewedContractsList />} />
      <Route path="/ReviewedContract/:id" element={<ReviewedContractDetail />} />



      <Route path="/InfContracts" element={<InfContractsPage />} />
      <Route path="/InfRequestedOffersList" element={<InfRequestedOffersList />} />
      <Route path="/InfRequestedOffer/:id" element={<InfRequestedOfferDetail />} />
      <Route path="/InfAcceptedOffersList" element={<InfAcceptedOffersList />} />
      <Route path="/InfAcceptedOffer/:id" element={<InfAcceptedOfferDetail />} />
      <Route path="/InfActiveContractsList" element={<InfActiveContractsList />} />
      <Route path="/InfActiveContract/:id" element={<InfActiveContractDetail />} />
      <Route path="/InfRevisionContractsList" element={<InfRevisionContractsList />} />
      <Route path="/InfRevisionContract/:id" element={<InfRevisionContractDetail />} />
      <Route path="/InfReleasedContractsList" element={<InfReleasedContractsList />} />
      <Route path="/InfReleasedContract/:id" element={<InfReleasedContractDetail />} />
      <Route path="/InfReviewedContractsList" element={<InfReviewedContractsList />} />
      <Route path="/InfReviewedContract/:id" element={<InfReviewedContractDetail />} />


    </Routes>
  )
}

export default App



// return (
//   <div>
//     <HomePage />
//   </div>
// )