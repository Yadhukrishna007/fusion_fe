import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
const DefaultSection = () => {
  const container = useRef(null);
  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "../../../chat.json",
    });
  }, []);
  return (
    <div
      className="flex max-md:hidden  h-screen  w-[80%]   ml-1 bg-light-white_dark-charcoal-gray  
     items-center justify-center"
    >
      <div className=" w-[60%]  h-[60%]" ref={container}></div>
    </div>
  );
};

export default DefaultSection;
