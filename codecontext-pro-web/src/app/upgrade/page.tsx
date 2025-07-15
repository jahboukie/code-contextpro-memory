'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

export default function UpgradePage() {
  const [user, loading, error] = useAuthState(auth);
  const [selectedTier, setSelectedTier] = useState<'starter' | 'pro'>('starter');
  const [paymentLoading, setPaymentLoading] = useState(false);
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

  const handlePayment = async (tier: 'starter' | 'pro') => {
    setPaymentLoading(true);
    
    try {
      // Simulate payment processing - replace with actual Stripe integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page
      router.push(`/success?tier=${tier}`);
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">🔄 Loading upgrade options...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-purple-300 hover:text-white mr-4 transition-colors duration-300"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-white">🧠 CodeContext Pro</h1>
              <span className="ml-4 px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
                AI Cognitive Upgrades
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={user.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full" />
                <span className="text-white text-sm">{user.displayName || user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Choose Your <span className="text-green-400">Cognitive Upgrade</span>
          </h2>
          <p className="text-xl text-purple-300 max-w-3xl mx-auto">
            Transform your AI assistant into an autonomous agentic partner. 
            <span className="text-white font-semibold"> Select the tier that matches your needs.</span>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Starter Tier */}
          <div className={`bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm border rounded-3xl p-8 text-center relative overflow-hidden cursor-pointer transition-all duration-300 ${
            selectedTier === 'starter' ? 'border-blue-400 scale-105' : 'border-blue-500/30'
          }`} onClick={() => setSelectedTier('starter')}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold text-sm mb-6">
                🧠 STARTER COGNITIVE UPGRADE
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">Starter</h3>
              <div className="text-5xl font-bold text-white mb-2">
                $19.99
                <span className="text-xl text-purple-300 font-normal">/month</span>
              </div>
              <div className="text-purple-300 mb-8">
                Perfect for individual developers
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">25 autonomous executions/month</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">25 tracked files with memory</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">Persistent cognitive memory</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">Autonomous code execution</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">Pattern learning & adaptation</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">Works with any AI assistant</span>
                </div>
              </div>

              {selectedTier === 'starter' && (
                <div className="absolute top-4 right-4">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    ✓
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pro Tier */}
          <div className={`bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border rounded-3xl p-8 text-center relative overflow-hidden cursor-pointer transition-all duration-300 ${
            selectedTier === 'pro' ? 'border-purple-400 scale-105' : 'border-purple-500/30'
          }`} onClick={() => setSelectedTier('pro')}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold text-sm mb-6">
                🚀 PRO COGNITIVE UPGRADE
              </div>
              
              <h3 className="text-3xl font-bold text-white mb-4">Pro</h3>
              <div className="text-5xl font-bold text-white mb-2">
                $99
                <span className="text-xl text-purple-300 font-normal">/month</span>
              </div>
              <div className="text-purple-300 mb-8">
                For professional development teams
              </div>

              <div className="space-y-4 mb-8 text-left">
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">700 autonomous executions/month</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">1,000 tracked files with memory</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">Advanced pattern recognition</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">Priority execution queue</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">Enhanced cognitive capabilities</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-3">✅</span>
                  <span className="text-white">Everything in Starter +</span>
                </div>
              </div>

              {selectedTier === 'pro' && (
                <div className="absolute top-4 right-4">
                  <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    ✓
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="text-center">
          <button
            onClick={() => handlePayment(selectedTier)}
            disabled={paymentLoading}
            className={`bg-gradient-to-r ${
              selectedTier === 'starter' 
                ? 'from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600' 
                : 'from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            } text-white font-bold py-6 px-12 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {paymentLoading ? (
              <>🔄 Processing Payment...</>
            ) : (
              <>🚀 Subscribe to {selectedTier === 'starter' ? 'Starter' : 'Pro'} - ${selectedTier === 'starter' ? '19.99' : '99'}/month</>
            )}
          </button>
          
          <p className="text-purple-300 mt-6 text-sm">
            30-day money-back guarantee • Cancel anytime • Instant activation
          </p>
        </div>
      </div>
    </div>
  );
}
