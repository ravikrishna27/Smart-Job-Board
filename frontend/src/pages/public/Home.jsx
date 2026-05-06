import HeroSection from "../../components/home/HeroSection";
import FeaturedJobs from "../../components/home/FeaturedJobs";
import JobCategories from "../../components/home/JobCategories";
import Statistics from "../../components/home/Statistics";
import CallToAction from "../../components/home/CallToAction";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <Statistics />
      <FeaturedJobs />
      <JobCategories />
      <CallToAction />
    </div>
  );
}
