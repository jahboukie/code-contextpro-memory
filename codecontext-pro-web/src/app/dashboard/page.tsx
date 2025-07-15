'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleStarterPayment = () => {
    // Redirect to Stripe payment for Starter tier ($19.99/month)
    // TODO: Replace with actual Stripe payment link for $19.99/month tier
    window.location.href = 'https://buy.stripe.com/starter-19-99-monthly';
  };

  const handleProPayment = () => {
    // Redirect to Stripe payment for Pro tier ($99/month)
    // TODO: Replace with actual Stripe payment link for $99/month tier
    window.location.href = 'https://buy.stripe.com/pro-99-monthly';
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600 text-xl">🔄 Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">🧠 CodeContext Pro</h1>
              <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                AI Cognitive Upgrades
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src={user.photoURL || '/default-avatar.png'}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-700 text-sm">{user.displayName || user.email}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-all duration-300"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your <span className="text-blue-600">Cognitive Upgrade</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform any AI assistant into an autonomous agentic partner with persistent memory and execution capabilities.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Starter Tier */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 font-bold text-sm mb-6">
              🧠 STARTER COGNITIVE UPGRADE
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">Starter</h3>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              $19.99
              <span className="text-xl text-gray-500 font-normal">/month</span>
            </div>
            <div className="text-gray-600 mb-8">
              Perfect for individual developers
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">25 autonomous executions/month</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">25 tracked files with memory</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Persistent cognitive memory</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Autonomous code execution</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Pattern learning & adaptation</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Works with any AI assistant</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleStarterPayment}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25"
            >
              🧠 Start Cognitive Upgrade
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                🚀 MOST POPULAR
              </span>
            </div>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 font-bold text-sm mb-6 mt-4">
              🚀 PRO COGNITIVE UPGRADE
            </div>

            <h3 className="text-3xl font-bold text-gray-900 mb-4">Pro</h3>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              $99
              <span className="text-xl text-gray-500 font-normal">/month</span>
            </div>
            <div className="text-gray-600 mb-8">
              For professional development teams
            </div>

            <div className="space-y-4 mb-8 text-left">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">700 autonomous executions/month</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">1,000 tracked files with memory</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Advanced pattern recognition</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Priority execution queue</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Enhanced cognitive capabilities</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-gray-700">Everything in Starter +</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProPayment}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              🚀 Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
