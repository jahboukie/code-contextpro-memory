'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

export default function SuccessPage() {
  const [user, loading, error] = useAuthState(auth);
  const [tier, setTier] = useState<string>('starter');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const tierParam = searchParams.get('tier');
    if (tierParam) {
      setTier(tierParam);
    }
  }, [searchParams]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">🔄 Loading success page...</div>
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
              <h1 className="text-2xl font-bold text-white">🧠 CodeContext Pro</h1>
              <span className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded-full">
                ✅ ACTIVATED
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="text-8xl mb-6">🎉</div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="text-green-400">Cognitive Upgrade</span> Activated!
          </h2>
          <p className="text-xl text-purple-300 max-w-3xl mx-auto">
            Welcome to the future of AI development! Your {tier === 'starter' ? 'Starter' : 'Pro'} subscription is now active.
            <span className="text-white font-semibold"> Let's get you set up.</span>
          </p>
        </div>

        {/* Subscription Details */}
        <div className="bg-white/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">📋 Subscription Details</h3>
            <span className={`px-4 py-2 rounded-full text-white font-bold ${
              tier === 'starter' ? 'bg-blue-600' : 'bg-purple-600'
            }`}>
              {tier === 'starter' ? 'STARTER' : 'PRO'} TIER
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-purple-300">Monthly Price:</span>
                <span className="text-white font-bold">${tier === 'starter' ? '19.99' : '99.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Autonomous Executions:</span>
                <span className="text-green-400 font-bold">{tier === 'starter' ? '25' : '700'}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Tracked Files:</span>
                <span className="text-green-400 font-bold">{tier === 'starter' ? '25' : '1,000'} files</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-purple-300">Next Billing:</span>
                <span className="text-white font-bold">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Status:</span>
                <span className="text-green-400 font-bold">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Memory:</span>
                <span className="text-green-400 font-bold">Persistent</span>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6">🚀 Quick Setup Guide</h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Install CodeContext Pro CLI</h4>
                <div className="bg-black/30 rounded-lg p-4 mb-2">
                  <code className="text-green-400">npm install -g codecontext-pro</code>
                  <button 
                    onClick={() => copyToClipboard('npm install -g codecontext-pro')}
                    className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-all duration-300"
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="text-purple-300 text-sm">Install the CLI tool globally to access cognitive upgrades.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Initialize Your Project</h4>
                <div className="bg-black/30 rounded-lg p-4 mb-2">
                  <code className="text-green-400">codecontext init</code>
                  <button 
                    onClick={() => copyToClipboard('codecontext init')}
                    className="ml-4 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-all duration-300"
                  >
                    📋 Copy
                  </button>
                </div>
                <p className="text-purple-300 text-sm">Set up persistent memory for your development project.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Start Using Cognitive AI</h4>
                <p className="text-purple-300 text-sm mb-2">
                  Your AI assistant now has persistent memory and autonomous execution capabilities. 
                  Start any conversation and watch your AI remember context across sessions!
                </p>
                <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-4">
                  <p className="text-green-300 text-sm">
                    ✨ <strong>Pro Tip:</strong> Your AI will now remember your coding patterns, project decisions, and preferences permanently!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105"
          >
            🧠 Go to Dashboard
          </button>
          
          <a
            href="mailto:support@codecontextpro.com"
            className="bg-transparent border-2 border-purple-400 text-purple-200 hover:bg-purple-400 hover:text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 text-center"
          >
            📧 Get Support
          </a>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <p className="text-purple-300 text-sm">
            🎉 Thank you for upgrading to CodeContext Pro! Your AI is now cognitively enhanced.
          </p>
        </div>
      </div>
    </div>
  );
}
