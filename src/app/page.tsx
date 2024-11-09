// app/page.tsx
import { Metadata } from "next";
import Home from "./components/Home/Home"; // Import your Home component

// Define metadata for the page
export const metadata: Metadata = {
  title: "MadeTrade Ethical Product Search",
  description: "Discover ethical, sustainable products with AI-powered search on MadeTrade.",
};

// Server component that renders the Home component
const Page = () => {
  return <Home />; // Render the Home component here
};

export default Page;
