"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface ProductImagesProps {
  imageUrls: string[];
}

const ProductImages = ({ imageUrls }: ProductImagesProps) => {
  if (!imageUrls || imageUrls.length === 0) return null;

  return (
    <Swiper
      navigation={true}
      modules={[Navigation]}
      spaceBetween={50}
      slidesPerView={1}
      loop={true}
      className="mySwiper"
    >
      {imageUrls.map((url, index) => (
        <SwiperSlide key={index}>
          <div className="relative w-full h-[400px] lg:h-[500px]">
            <Image
              src={url}
              alt={`Product Image ${index + 1}`}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0} // first image loads faster
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductImages;