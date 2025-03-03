import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AROverlay = ({ building, distance }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [building]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      className="absolute left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 rounded-lg p-4 text-white"
    >
      <h3 className="text-xl font-bold text-yellow-400">{building.name}</h3>
      <p className="text-sm mt-1">{building.description}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-yellow-400">
          {distance < 1000
            ? `${Math.round(distance)}m away`
            : `${(distance / 1000).toFixed(1)}km away`}
        </span>
        <span className="text-sm">{building.hours}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {building.facilities.map((facility, index) => (
          <span
            key={index}
            className="text-xs bg-yellow-500 bg-opacity-25 rounded px-2 py-1"
          >
            {facility}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default AROverlay;
