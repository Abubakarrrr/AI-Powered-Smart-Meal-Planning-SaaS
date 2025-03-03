import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleOpenMealPlanner = () => {
    const today = format(new Date(), "yyyy-MM-dd"); 
    navigate(`/planner/${today}`); 
  };
  return (
    <div>
      <Navbar />
      <Button onClick={handleOpenMealPlanner}>Open Meal Planner</Button>
      <Footer />
    </div>
  );
};

export default Home;
