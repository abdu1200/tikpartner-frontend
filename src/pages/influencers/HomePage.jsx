import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import image1 from '../../assets/ronaldo2.jpg';
import { useNavigate } from 'react-router-dom'



export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const navigate = useNavigate();
  
  const slides = [
    { 
      id: 0, 
      src: image1, 
      alt: "Product showcase with floral background" 
    },
    { 
      id: 1, 
      src: image1, 
      alt: "Woman in pink outfit talking on phone" 
    },
    { 
      id: 2, 
      src: image1, 
      alt: "Blue water bottle" 
    }
  ];
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };


  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-outfit bg-gradient-to-b from-white to-pink-50">
      {/* Left Half (Carousel Section) */}
      <div className="w-full flex justify-center items-center px-[90px] pb-[60px] pt-[8px] md:pt-[40px] lg:w-1/2">
        <div className="relative w-full max-w-md md:max-w-2xl lg:max-w-4xl">
          <div className="flex justify-center items-center relative h-80 md:h-96">
            {slides.map((slide, index) => {
              let position = index - currentSlide;
              if (position < -1) position = slides.length - Math.abs(position);
              if (position > 1) position = position - slides.length;
  
              return (
                <div
                  key={slide.id}
                  className={`absolute transition-all duration-300 transform-gpu ${
                    position === -1
                      ? 'z-10 opacity-80'
                      : position === 0
                      ? 'z-20'
                      : position === 1
                      ? 'z-10 opacity-80'
                      : 'opacity-0'
                  }`}
                  style={{
                    transform:
                      position === -1
                        ? `translateX(-40%) scale(0.8) rotate(-10deg)`
                        : position === 0
                        ? `translateX(0) scale(1) rotate(0)`
                        : position === 1
                        ? `translateX(40%) scale(0.8) rotate(10deg)`
                        : `scale(0)`,
                  }}
                >
                  <img
                    src={slide.src || `/api/placeholder/260/400`}
                    alt={slide.alt}
                    className={`rounded-3xl overflow-hidden shadow-lg object-cover ${
                      position === 0
                        ? 'w-50 h-[251px] md:h-80 md:w-60 lg:w-74 lg:h-100'
                        : 'w-47 h-67 md:h-80 md:w-50 lg:w-74 lg:h-100'
                    }`}
                  />
                </div>
              );
            })}
  
            <button
              onClick={prevSlide}
              className="absolute left-[-70px] md:left-4 bg-white rounded-full p-2 shadow-md z-30 hover:bg-gray-100"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} />
            </button>
  
            <button
              onClick={nextSlide}
              className="absolute right-[-70px] md:right-4 bg-white rounded-full p-2 shadow-md z-30 hover:bg-gray-100"
              aria-label="Next slide"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
  
      {/* Right Half (Content Section) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-2 md:py-12 md:px-6 bg-white">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
          <div className="text-center mb-[60px]">
            <h1 className="text-2xl md:text-5xl mb-[9px]">
              <span className="text-pink-600">Tikpartner</span>
              <span className="text-gray-800"> - Influencers</span>
            </h1>
            <p className="text-sm md:text-2xl font-extralight">
              Find best influencers and grow your brand
            </p>
          </div>
  
          <div className="mb-[60px]">
            <button onClick={() => navigate('/InfluencerLogin')} className="w-full h-[56px] bg-pink-600 text-white py-3 px-6 rounded-sm text-md md:text-2xl hover:bg-pink-700 transition-colors cursor-pointer">
              Login
            </button>
          </div>
  
          <div>
            <p className="text-center text-sm md:text-xl mb-[12px] font-extralight">
              Don't have an account?
            </p>
            <button onClick={() => navigate('/InfluencerSignup')} className="w-full h-[56px] border-1 border-pink-600 text-pink-600 py-3 px-6 rounded-sm text-md md:text-2xl hover:bg-pink-50 transition-colors cursor-pointer">
              Signup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}  