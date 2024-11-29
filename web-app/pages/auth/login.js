import React, { useRef } from "react";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  // Use useRef to reference input fields
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get values from refs
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const result = await signIn("credentials", {
        email,
        password,
        redirect: true, // Automatically redirect on success
        callbackUrl: "/user/profile", // Specify redirect URL on successful login
    });

    if (result?.error) {
        setError(result.error); // Display error if login fails
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg w-96 p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email:
            </label>
            <input
              ref={emailRef}
              type="email"
              id="email"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password:
            </label>
            <input
              ref={passwordRef}
              type="password"
              id="password"
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
