import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  images: string[];
}

const BackgroundSlideshow: React.FC<Props> = ({ images }) => {
  const [index, setIndex] = useState(0);

  const fallbackImages = [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=2169&auto=format&fit=crop'
  ];

  const displayImages = images.length > 0 ? images : fallbackImages;

  useEffect(() => {
    if (displayImages.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [displayImages]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={displayImages[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 2.5,
            ease: "easeInOut"
          }}
          className="absolute inset-0"
        >
          <motion.img
            src={displayImages[index]}
            alt=""
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="w-full h-full object-cover brightness-[0.4] grayscale-[0.2]"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default BackgroundSlideshow;
