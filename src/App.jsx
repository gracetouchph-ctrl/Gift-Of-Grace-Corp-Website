import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturedProducts from './components/FeaturedProducts'
import CustomerReviews from './components/CustomerReviews'
import About from './components/About'
import WhereToFindUs from './components/WhereToFindUs'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <CustomerReviews />
      <About />
      <WhereToFindUs />
      <Footer />
      <Chatbot />
    </div>
  )
}

export default App

