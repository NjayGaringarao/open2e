import { useEvaluation } from "@/context/main/useEvaluation";
import InputCard from "./InputCard";
import OutputCard from "./OutputCard";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { useRef, useEffect } from "react";
import "swiper/css";

const Evaluation = () => {
  const { sheet, isLoading, isEvaluating } = useEvaluation();
  const swiperRef = useRef<SwiperType | null>(null);

  // Check if evaluation result exists
  const hasResult = sheet.score !== null && sheet.justification !== "";

  // Auto-scroll to output card after evaluation completes
  useEffect(() => {
    if (hasResult && !isLoading && swiperRef.current) {
      swiperRef.current.slideTo(1);
    }
  }, [hasResult, isLoading]);

  return (
    <div className="w-full flex flex-col relative flex-1 overflow-hidden">
      <Swiper
        spaceBetween={26}
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="w-full h-full"
        resistance={true}
        resistanceRatio={0.85}
        speed={300}
      >
        <SwiperSlide>
          <InputCard swiperRef={swiperRef} isEvaluating={isEvaluating} />
        </SwiperSlide>
        {hasResult && (
          <SwiperSlide>
            <OutputCard swiperRef={swiperRef} />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default Evaluation;
