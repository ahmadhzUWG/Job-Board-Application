import { useEffect, useState, useRef } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { app } from "../../auth/firebase.js";
import { getAuth } from "firebase/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import RoleSlide from "./RoleSlide.js";
import BasicInfoSlide from "./BasicInfoSlide.js";
import JobSeekerSlide from "./JobSeekerSlide.js";
import EmployerSlide from "./EmployerSlide.js";
import ReviewSlide from "./ReviewSlide.js";


function Registration() {
  const formRef = useRef(null);
  const auth = getAuth(app);
  const location = useLocation();
  const { email, password, fromSignup } = location.state || { fromSignup: false };
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    role: "JOBSEEKER", // Default selection
    password: password || "",
    email: email || "",
    description: "",
    industry: "",
    age: 0,
    gender: "",
    resumeUrl: "",
    profileImageUrl: "", // Will be added later
  });

  if (!fromSignup) {
    return <Navigate to="/" replace />;
  }

  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      style={{ height: "100vh", width: "50%" }}
      allowTouchMove={false}
      onSwiper={(swiper) => {
        setSwiperInstance(swiper);
      }}

    >
      <SwiperSlide>
        <RoleSlide setUserData={setUserData} swiperInstance={swiperInstance} />
      </SwiperSlide>
      <SwiperSlide>
        <BasicInfoSlide userData={userData} setUserData={setUserData} swiperInstance={swiperInstance} />
      </SwiperSlide>
      <SwiperSlide>
        {userData.role === "JOBSEEKER"
          ? <JobSeekerSlide userData={userData} setUserData={setUserData} swiperInstance={swiperInstance} />
          : <EmployerSlide userData={userData} setUserData={setUserData} swiperInstance={swiperInstance} />}
      </SwiperSlide>
      <SwiperSlide>
        <ReviewSlide userData={userData} setUserData={setUserData} swiperInstance={swiperInstance} />
      </SwiperSlide>
    </Swiper>

  )
}

export default Registration
