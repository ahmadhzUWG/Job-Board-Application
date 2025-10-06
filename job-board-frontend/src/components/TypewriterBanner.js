import React, { memo } from "react";
import Typewriter from "./typewritter.tsx";

const TypewriterBanner = () => (
  <Typewriter
    text={[
      "Discover Jobs and Unlock Your Potential",
      "Connect with Top Employers",
      "Your Dream Job Awaits",
    ]}
    speed={65}
    waitTime={2000}
    deleteSpeed={50}
    initialDelay={300}
    cursorChar={"|"}
    className="custom-typewriter mb-4"
  />
);

export default memo(TypewriterBanner);