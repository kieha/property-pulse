import type { Metadata } from "next";
import "@/assets/styles/globals.css";
import "photoswipe/dist/photoswipe.css";
import { ToastContainer } from "react-toastify";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import { GlobalProvider } from "@/context/GlobalContext";

export const metadata: Metadata = {
  title: "PropertyPulse | Find The Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, find rentals, find properties",
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en">
          <body>
            <NavBar />
            <main>{children}</main>
            <Footer />
            <ToastContainer />
          </body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
};

export default MainLayout;
