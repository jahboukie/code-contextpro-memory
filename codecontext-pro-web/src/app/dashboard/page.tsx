'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';

interface UserStats {
  executions_used: number;
  executions_limit: number;
  files_tracked: number;
  files_limit: number;
  subscription_tier: 'free' | 'pro' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'trial';
  next_billing_date?: string;
}

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Simulate fetching user stats - replace with actual API call
      setTimeout(() => {
        setUserStats({
          executions_used: 12,
          executions_limit: 25,
          files_tracked: 8,
          files_limit: 25,
          subscription_tier: 'free',
          subscription_status: 'active'
        });
        setStatsLoading(false);
      }, 1000);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpgrade = () => {
    router.push('/upgrade');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">🔄 Loading dashboard...</div>
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
              <span className="ml-4 px-3 py-1 bg-purple-600 text-white text-sm rounded-full">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Your <span className="text-purple-400">Cognitive Dashboard</span>
          </h2>
          <p className="text-xl text-purple-300 max-w-3xl mx-auto">
            Transform any AI assistant into an autonomous agentic partner with persistent memory and execution capabilities.
          </p>
        </div>

        {statsLoading ? (
          <div className="text-center text-white text-xl">🔄 Loading your cognitive stats...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Usage Stats */}
            <div className="bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">🤖 Autonomous Executions</h3>
                <span className="text-purple-300 text-sm">{userStats?.subscription_tier.toUpperCase()}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-purple-300 mb-2">
                  <span>Used: {userStats?.executions_used}</span>
                  <span>Limit: {userStats?.executions_limit}</span>
                </div>
                <div className="w-full bg-purple-900/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 progress-bar"
                    style={{ '--progress-width': `${((userStats?.executions_used || 0) / (userStats?.executions_limit || 1)) * 100}%` } as React.CSSProperties}
                  ></div>
                </div>
              </div>
              <p className="text-purple-200 text-sm">
                AI can autonomously execute and test code {Math.max(0, (userStats?.executions_limit || 0) - (userStats?.executions_used || 0))} more times this month.
              </p>
            </div>

            {/* Memory Stats */}
            <div className="bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">🧠 Persistent Memory</h3>
                <span className="text-green-400 text-sm">ACTIVE</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-purple-300 mb-2">
                  <span>Tracked: {userStats?.files_tracked}</span>
                  <span>Limit: {userStats?.files_limit}</span>
                </div>
                <div className="w-full bg-purple-900/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${((userStats?.files_tracked || 0) / (userStats?.files_limit || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-purple-200 text-sm">
                AI remembers {userStats?.files_tracked} files with {Math.max(0, (userStats?.files_limit || 0) - (userStats?.files_tracked || 0))} slots remaining.
              </p>
            </div>

            {/* Subscription Status */}
            <div className="bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">💎 Cognitive Tier</h3>
                <span className={`text-sm px-2 py-1 rounded ${
                  userStats?.subscription_tier === 'free' ? 'bg-gray-600 text-gray-200' :
                  userStats?.subscription_tier === 'pro' ? 'bg-blue-600 text-white' :
                  'bg-purple-600 text-white'
                }`}>
                  {userStats?.subscription_tier.toUpperCase()}
                </span>
              </div>
              <div className="mb-4">
                <p className="text-purple-200 text-sm mb-2">
                  {userStats?.subscription_tier === 'free' 
                    ? 'Experience basic cognitive upgrades with 25/25 limits.'
                    : userStats?.subscription_tier === 'pro'
                    ? 'Full agentic transformation with enhanced capabilities.'
                    : 'Complete AI autonomy with unlimited cognitive power.'
                  }
                </p>
              </div>
              {userStats?.subscription_tier === 'free' && (
                <button
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  🚀 Upgrade to Pro - $19.99/month
                </button>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">🛠️ Quick Setup</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                <div>
                  <h4 className="text-white font-semibold">Install CLI</h4>
                  <p className="text-purple-300 text-sm">Get the CodeContext Pro CLI tool</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                  📥 Install
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-purple-900/30 rounded-lg">
                <div>
                  <h4 className="text-white font-semibold">Initialize Project</h4>
                  <p className="text-purple-300 text-sm">Set up cognitive memory for your project</p>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300">
                  🧠 Initialize
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">📊 Cognitive Analytics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Memory Retention Rate</span>
                <span className="text-green-400 font-bold">98.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Execution Success Rate</span>
                <span className="text-blue-400 font-bold">85.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Pattern Learning Score</span>
                <span className="text-purple-400 font-bold">Advanced</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300">Agentic Autonomy Level</span>
                <span className="text-yellow-400 font-bold">
                  {userStats?.subscription_tier === 'free' ? 'Basic' : 
                   userStats?.subscription_tier === 'pro' ? 'Enhanced' : 'Maximum'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action for Free Users */}
        {userStats?.subscription_tier === 'free' && (
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-12 text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready for Full <span className="text-purple-400">Agentic Transformation</span>?
            </h3>
            <p className="text-xl text-purple-300 mb-8 max-w-3xl mx-auto">
              Upgrade to Pro and unlock 50 autonomous executions, 50 tracked files, and enhanced cognitive capabilities for just $19.99/month.
            </p>
            <button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25"
            >
              🚀 Upgrade to Agentic Pro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
