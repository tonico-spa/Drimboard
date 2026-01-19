"use client";
import { useState, useRef } from 'react';
import styles from '../styles/ActivitiesCarousel.module.css';

const ActivitiesCarousel = () => {
  const images = [
    '/activities/IMG_0122.jpg',
    '/activities/IMG_1445.jpg',
    '/activities/IMG_3032.jpg',
    '/activities/IMG_3072.jpg',
    '/activities/IMG_3339.jpg',
    '/activities/IMG_3345.jpg',
    '/activities/IMG_3608.jpg',
    '/activities/IMG_4173.jpg',
    '/activities/IMG_4178.jpg',
    '/activities/IMG_4179.jpg',
    '/activities/IMG_4180.jpg',
    '/activities/IMG_4181.jpg',
    '/activities/IMG_4388.jpg',
  ];

  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = 'paused';
      const currentScroll = trackRef.current.scrollLeft || 0;
      trackRef.current.scrollLeft = currentScroll - 400;
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.animationPlayState = isPaused ? 'paused' : 'running';
        }
      }, 300);
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.style.animationPlayState = 'paused';
      const currentScroll = trackRef.current.scrollLeft || 0;
      trackRef.current.scrollLeft = currentScroll + 400;
      setTimeout(() => {
        if (trackRef.current) {
          trackRef.current.style.animationPlayState = isPaused ? 'paused' : 'running';
        }
      }, 300);
    }
  };

  // Duplicate images for infinite effect
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <div className={styles.carouselContainer}>
  
      <div 
        className={styles.carouselWrapper}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={trackRef}
          className={`${styles.carouselTrack} ${isPaused ? styles.paused : ''}`}
        >
          {duplicatedImages.map((image, index) => (
            <div key={index} className={styles.carouselSlide}>
              <img 
                src={image} 
                alt={`Activity ${(index % images.length) + 1}`}
                className={styles.carouselImage}
              />
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default ActivitiesCarousel;
