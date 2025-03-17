import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useEffect } from "react";
// const BASE_URL = import.meta.env.VITE_API_URL;


const Home = () => {
  //  const getSubscriptionStatus = async () => {
  //     try {
  //       const response = await fetch(
  //         `${BASE_URL}/api/payment/v1/get-subscription-status`,
  //         {
  //           method: "GET",
  //           credentials: "include",
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );
  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   useEffect(()=>{
  //     getSubscriptionStatus();
  //   })
  return (
    <div>
      <Navbar />
      <Footer />
    </div>
  );
};

export default Home;
