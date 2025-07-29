import { useEffect, useState } from "react";
import cour1 from "../assets/images/cour1.png";
import cour2 from "../assets/images/cour2.png";
import cour3 from "../assets/images/cour3.png";
import cour4 from "../assets/images/cour4.png";

const Corousal = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { id: 1, content: "Slide 1", image: cour1 },
    { id: 2, content: "Slide 2", image: cour3 },
    { id: 3, content: "Slide 3", image: cour2 },
    { id: 4, content: "Slide 4", image: cour4 },
  ];

  const slidesPerPage = 3;

  // Auto-slide logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Compute the 3 slides to show (with wrap-around)
  const visibleSlides = Array.from({ length: slidesPerPage }, (_, i) => {
    const index = (currentSlide + i) % slides.length;
    return slides[index];
  });

  return (
    <div className="w-full relative overflow-hidden">
      {/* Slide Track */}
      <div className="flex transition-all duration-700 ease-in-out w-full">
        {visibleSlides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className="w-1/3 flex-shrink-0 p-2"
          >
            <div className="rounded-2xl max-h-[400px] h-auto flex justify-center items-center overflow-hidden bg-black">
              <img
                src={slide.image}
                alt={slide.content}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        onClick={() =>
          setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
      >
        &lt;
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-10"
        onClick={() =>
          setCurrentSlide((prev) => (prev + 1) % slides.length)
        }
      >
        &gt;
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-3 w-3 mx-1 rounded-full ${
              currentSlide === index ? "bg-blue-500" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Corousal;
