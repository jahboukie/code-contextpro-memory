'use client';

import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Save user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        signUpDate: serverTimestamp(),
        tier: 'free',
        source: 'landing_page'
      }, { merge: true });

      console.log('User signed in:', user.email);

      // Automatically redirect to dashboard after successful sign-in
      router.push('/dashboard');
    } catch (error) {
      console.error('Sign-in error:', error);
      alert('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGetLifetimeAccess = () => {
    setLoading(true);
    // Redirect to Stripe payment
    window.location.href = 'https://buy.stripe.com/fZueVd1okd5W14W6Xb4Ja00';
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Sign-out error:', error);
      alert('Sign-out failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-4">
                🧠 AI Cognitive Upgrades
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
              🚀 Upgrade Any AI to<br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Agentic Agent
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-purple-200 mb-8 max-w-4xl mx-auto font-light">
              Transform Any AI from <span className="text-orange-400 font-semibold">Basic Assistant</span> to <span className="text-green-400 font-semibold">Autonomous Agent</span>
            </p>

            <p className="text-xl text-purple-300 mb-12 max-w-5xl mx-auto leading-relaxed">
              CodeContext Pro provides <span className="text-white font-semibold">cognitive upgrades</span> that give any AI <span className="text-white font-semibold">persistent memory</span> and <span className="text-white font-semibold">autonomous execution capabilities</span>.
              Watch your AI transform into a true agentic partner that remembers, learns, and acts independently.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              {authLoading ? (
                <div className="bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold">
                  🔄 Loading...
                </div>
              ) : !user ? (
                <>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="group relative inline-flex items-center px-10 py-5 border border-transparent text-xl font-bold rounded-2xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 disabled:opacity-50"
                  >
                    {loading ? (
                      <>🔄 Signing In...</>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        🧠 Access Dashboard
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <div className="text-blue-400 text-sm font-semibold mb-1">🧠 COGNITIVE UPGRADES</div>
                    <div className="text-purple-300 text-lg">Sign in to choose your tier: <span className="text-white font-bold">$29.99</span>, <span className="text-white font-bold">$199</span>, or <span className="text-white font-bold">$499/month</span></div>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-2xl text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 mb-4"
                  >
                    {loading ? (
                      <>🔄 Loading Dashboard...</>
                    ) : (
                      <>🧠 Access Dashboard</>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    <img src={user.photoURL || ''} alt="Profile" className="w-8 h-8 rounded-full" />
                    <p className="text-green-300 text-sm">
                      ✅ Signed in as {user.displayName || user.email}
                    </p>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-all duration-300 ml-2"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-purple-300 mb-16">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-blue-400 mr-2">🧠</span>
                <span className="font-medium">AI Cognitive Upgrades</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-green-400 mr-2">🤖</span>
                <span className="font-medium">Autonomous Agentic AI</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <span className="text-purple-400 mr-2">⚡</span>
                <span className="font-medium">Works with any AI assistant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Why AI Agents <span className="text-red-400">Stay Basic</span>
            </h2>
            <p className="text-xl text-purple-300 max-w-4xl mx-auto">
              No persistent memory. No autonomous execution. No learning between sessions.
              <span className="text-white font-semibold"> Time for cognitive upgrades.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {/* Problem Cards */}
            <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-red-400 mb-4">Basic Assistant</h3>
              <p className="text-red-200">No memory between sessions. Can't learn patterns. Requires constant hand-holding and re-explanation.</p>
            </div>

            <div className="bg-orange-900/20 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🔄</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-4">Manual Execution</h3>
              <p className="text-orange-200">Can't run code autonomously. Requires you to copy-paste and test everything manually.</p>
            </div>

            <div className="bg-yellow-900/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">💸</div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Limited Intelligence</h3>
              <p className="text-yellow-200">Paying for AI that can't evolve, adapt, or become truly autonomous in your workflow.</p>
            </div>
          </div>

          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI Cognitive <span className="text-green-400">Upgrades</span>
            </h2>
            <p className="text-xl text-purple-300 max-w-4xl mx-auto">
              Transform any AI into an <span className="text-white font-semibold">autonomous agentic partner</span> with persistent memory, autonomous execution, and continuous learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Solution Cards */}
            <div className="bg-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-2xl font-bold text-green-400 mb-4">Persistent Memory</h3>
              <p className="text-green-200">Cognitive upgrade that gives AI permanent memory across all sessions. Never forget context, decisions, or patterns.</p>
            </div>

            <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Autonomous Execution</h3>
              <p className="text-blue-200">AI becomes truly agentic - can execute, test, and validate code independently with 85% accuracy.</p>
            </div>

            <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-6xl mb-4">📈</div>
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Continuous Learning</h3>
              <p className="text-purple-200">AI evolves with every interaction, learning your patterns and becoming more intelligent over time.</p>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Choose Your <span className="text-green-400">Cognitive Upgrade</span>
            </h2>
            <p className="text-xl text-purple-300 max-w-3xl mx-auto">
              Transform any AI assistant into an autonomous agentic partner.
              <span className="text-white font-semibold"> Start your cognitive upgrade today.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Tier */}
            <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold text-sm mb-6">
                  🧠 STARTER COGNITIVE UPGRADE
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">Starter</h3>
                <div className="text-5xl font-bold text-white mb-2">
                  $29.99
                  <span className="text-xl text-purple-300 font-normal">/month</span>
                </div>
                <div className="text-purple-300 mb-8">
                  Perfect for individual developers
                </div>

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✅</span>
                    <span className="text-white">50 autonomous executions/month</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✅</span>
                    <span className="text-white">50 tracked files with memory</span>
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

                {!user ? (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50"
                  >
                    {loading ? (
                      <>🔄 Signing In...</>
                    ) : (
                      <>🧠 Start Cognitive Upgrade</>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50"
                  >
                    🧠 Access Dashboard
                  </button>
                )}
              </div>
            </div>

            {/* Professional Tier */}
            <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  🚀 MOST POPULAR
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white font-bold text-sm mb-6 mt-4">
                  🚀 PROFESSIONAL COGNITIVE UPGRADE
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">Professional</h3>
                <div className="text-5xl font-bold text-white mb-2">
                  $199
                  <span className="text-xl text-purple-300 font-normal">/month</span>
                </div>
                <div className="text-purple-300 mb-8">
                  For power users & consultants
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

                {!user ? (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50"
                  >
                    {loading ? (
                      <>🔄 Signing In...</>
                    ) : (
                      <>🚀 Get Professional</>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50"
                  >
                    🚀 Get Professional
                  </button>
                )}
              </div>
            </div>

            {/* Team Tier */}
            <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-sm border border-yellow-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  👑 ENTERPRISE
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 rounded-3xl"></div>

              <div className="relative z-10">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm mb-6 mt-4">
                  👑 TEAM COGNITIVE UPGRADE
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">Team</h3>
                <div className="text-5xl font-bold text-white mb-2">
                  $499
                  <span className="text-xl text-yellow-300 font-normal">/user/month</span>
                </div>
                <div className="text-yellow-300 mb-8">
                  For development teams
                </div>

                <div className="space-y-4 mb-8 text-left">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✅</span>
                    <span className="text-white">1,500 autonomous executions/month</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✅</span>
                    <span className="text-white">2,000 tracked files with memory</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✅</span>
                    <span className="text-white">Shared team memory (coming soon)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✅</span>
                    <span className="text-white">Team management dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✅</span>
                    <span className="text-white">Priority support & onboarding</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">✅</span>
                    <span className="text-white">Everything in Professional +</span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={true}
                  className="w-full bg-gray-600 text-gray-300 font-bold py-4 px-8 rounded-2xl text-lg cursor-not-allowed"
                >
                  👑 Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <a
            href="mailto:support@codecontextpro.com"
            className="inline-flex items-center px-8 py-4 border border-purple-400 text-lg font-medium rounded-xl text-purple-200 hover:text-white hover:bg-purple-700 transition-all duration-200 hover:border-purple-300"
          >
            📧 Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
