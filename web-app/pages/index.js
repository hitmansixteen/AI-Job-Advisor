import React from 'react';
import { useRouter } from 'next/router';

const LandingPage = () => {
    const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      <main className="flex-grow flex items-center justify-center bg-gradient-to-r from-white-400 via-white-500 to-white-600 text-black py-20">
        <div className="text-center">
          <h2 className="text-4xl font-semibold mb-4">Find Your Dream Job</h2>
          <p className="text-xl mb-8">Our AI-powered job advisor helps you discover the best job opportunities based on your skills, experience, and preferences.</p>
          <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold rounded-lg">
            Get Started
          </button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>© 2024 AI Job Advisor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;