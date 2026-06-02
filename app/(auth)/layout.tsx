import type { Metadata } from "next";
import "@/assets/styles/globals.css";
import AuthProvider from "@/components/AuthProvider";
import { GlobalProvider } from "@/context/GlobalContext";

export const metadata: Metadata = {
  title: "PropertyPulse | Find The Perfect Rental",
  description: "Find your dream rental property",
  keywords: "rental, find rentals, find properties",
};

const SigninLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <GlobalProvider>
      <AuthProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </AuthProvider>
    </GlobalProvider>
  );
};

export default SigninLayout;
