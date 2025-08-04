import React from 'react';
import {
  FaMoneyBillWave,
  FaUtensils,
  FaUserShield,
  FaQuoteLeft,
  FaQuestionCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#c9e4f6] via-[#d6f7ef] to-[#eaf9e2] text-gray-800 py-16 px-4 sm:px-6 md:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold drop-shadow-sm">
          Smart Mess Management
        </h1>
        <p className="mt-3 text-sm sm:text-lg md:text-xl text-gray-700 max-w-xl mx-auto">
          Simplify your daily mess operations with a smooth, elegant platform.
        </p>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 md:px-6 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
          ✨ Why Choose Smart Mess?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <FeatureCard
            icon={<FaMoneyBillWave className="text-3xl sm:text-4xl text-teal-500" />}
            title="Expense Tracking"
            description="Easily track and manage daily expenses with transparency."
          />
          <FeatureCard
            icon={<FaUtensils className="text-3xl sm:text-4xl text-amber-500" />}
            title="Meal Count"
            description="Log daily meals with a click and keep everything organized."
          />
          <FeatureCard
            icon={<FaUserShield className="text-3xl sm:text-4xl text-indigo-500" />}
            title="Secure Roles"
            description="Separate access for manager and members for better security."
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4 sm:px-6 md:px-6 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
          🛠️ How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
          <InfoCard step="1" title="Create or Join a Mess" />
          <InfoCard step="2" title="Add Meals & Expenses Daily" />
          <InfoCard step="3" title="Get Dashboard Calculations" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-12 px-4 sm:px-6 md:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
          💬 What Users Say
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          <Testimonial
            name="Rafiul Islam"
            message="Smart Mess made our mess life super easy! Now no more fighting over calculation errors!"
          />
          <Testimonial
            name="Mim Jannat"
            message="The design is clean and easy to use. Tracking meals is just a click away!"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 px-4 sm:px-6 md:px-6 bg-white">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-10">
          ❓ Frequently Asked Questions
        </h2>
        <div className="space-y-5 max-w-3xl mx-auto">
          <Faq
            question="Is this platform free?"
            answer="Yes, Smart Mess is completely free to use for individuals and messes."
          />
          <Faq
            question="Can I use it on mobile?"
            answer="Absolutely! The app is fully responsive and works smoothly on phones and tablets."
          />
          <Faq
            question="Who can see the expense data?"
            answer="Only mess members and managers can view internal data securely."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-500 text-white py-12 px-4 sm:px-6 md:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">🎉 Get Started Today!</h2>
        <p className="mt-3 text-base sm:text-lg md:text-lg max-w-md mx-auto">
          Join your mess or create one and simplify your mess life now.
        </p>
        <div className="mt-5">
          <Link
            to={'register'}
            className="bg-white text-emerald-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}

// Reusable Components
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-5 sm:p-6 shadow-md rounded-lg text-center border hover:shadow-xl transition-all duration-300">
    <div className="mb-3">{icon}</div>
    <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
    <p className="text-sm sm:text-base text-gray-600 mt-1">{description}</p>
  </div>
);

const InfoCard = ({ step, title }) => (
  <div className="bg-lime-50 p-5 sm:p-6 rounded shadow hover:shadow-md transition-all">
    <div className="text-5xl sm:text-6xl font-bold text-emerald-400 mb-3">{step}</div>
    <h4 className="text-lg sm:text-xl font-semibold text-gray-700">{title}</h4>
  </div>
);

const Testimonial = ({ name, message }) => (
  <div className="bg-white p-5 sm:p-6 rounded-lg shadow-md border">
    <FaQuoteLeft className="text-teal-400 text-xl sm:text-2xl mb-3" />
    <p className="text-sm sm:text-base text-gray-700 italic">"{message}"</p>
    <p className="mt-3 text-xs sm:text-sm font-semibold text-gray-800">- {name}</p>
  </div>
);

const Faq = ({ question, answer }) => (
  <div className="bg-gray-100 p-3 sm:p-4 rounded-md">
    <h4 className="font-semibold text-emerald-600 flex items-center gap-2 text-sm sm:text-base">
      <FaQuestionCircle /> {question}
    </h4>
    <p className="text-xs sm:text-sm text-gray-700 mt-1">{answer}</p>
  </div>
);

export default Home;
