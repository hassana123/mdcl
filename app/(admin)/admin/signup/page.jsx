"use client"
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AdminSignup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    secretCode: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // This should be stored securely in environment variables
  const VALID_SECRET_CODE = 'MDCL2025ByHas'; 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate secret code
      if (formData.secretCode !== VALID_SECRET_CODE) {
        throw new Error('Invalid secret code');
      }

      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Validate password strength
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Create admin document in Firestore
      await setDoc(doc(db, 'admins', userCredential.user.uid), {
        email: formData.email,
        role: 'admin',
        createdAt: new Date().toISOString()
      });

      // Redirect to login page
      router.push('/admin/login');
    } catch (error) {
      console.error('Signup error:', error);
      setError(
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered'
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Signup
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your details to create an admin account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[color:var(--color-primary-olive)] focus:border-[color:var(--color-primary-olive)] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[color:var(--color-primary-olive)] focus:border-[color:var(--color-primary-olive)] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[color:var(--color-primary-olive)] focus:border-[color:var(--color-primary-olive)] focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>

            <div>
              <label htmlFor="secretCode" className="sr-only">
                Secret Code
              </label>
              <input
                id="secretCode"
                name="secretCode"
                type="password"
                required
                value={formData.secretCode}
                onChange={handleChange}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[color:var(--color-primary-olive)] focus:border-[color:var(--color-primary-olive)] focus:z-10 sm:text-sm"
                placeholder="Secret Code"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[color:var(--color-primary-light-brown)] hover:bg-[color:var(--color-primary-olive)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--color-primary-olive)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link
              href="/admin/login"
              className="font-medium text-[color:var(--color-primary-olive)] hover:text-[color:var(--color-primary-light-brown)]"
            >
              Already have an Admin account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup; 