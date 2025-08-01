import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/authContext';
import { fetchUsers, fetchMagazines } from '../lib/api';
import AdminLayout from '../components/layouts/AdminLayout';

interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalMagazines: number;
  revenue: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSubscriptions: 856,
    totalMagazines: 0,
    revenue: 12456
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users data
      const usersResult = await fetchUsers();
      
      if (usersResult.success && usersResult.data && Array.isArray(usersResult.data)) {
        setStats(prevStats => ({
          ...prevStats,
          totalUsers: usersResult.data!.length
        }));
      }
      
      // Fetch magazines data
      const magazinesResult = await fetchMagazines();
      
      if (magazinesResult.success && magazinesResult.data && Array.isArray(magazinesResult.data)) {
        setStats(prevStats => ({
          ...prevStats,
          totalMagazines: magazinesResult.data!.length
        }));
      }
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, gradient, trend, trendValue }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    gradient: string;
    trend?: 'up' | 'down';
    trendValue?: string;
  }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white ${gradient} card-hover shadow-strong`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm ${
              trend === 'up' ? 'text-green-200' : 'text-red-200'
            }`}>
              <svg className={`w-4 h-4 ${trend === 'up' ? 'rotate-0' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-white/80 mb-2">{title}</h3>
            {loading ? (
              <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded-lg w-24"></div>
              </div>
            ) : (
          <p className="text-3xl font-bold">{value}</p>
            )}
          </div>
    </div>
  );

  const QuickActionCard = ({ title, description, icon, href, color }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    href: string;
    color: string;
  }) => (
    <Link href={href} className="group">
      <div className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 card-hover border border-slate-200/50">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          {description}
        </p>
        <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform duration-200">
          Get Started
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );

  const ActivityItem = ({ icon, title, description, time, type }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    time: string;
    type: 'success' | 'info' | 'warning';
  }) => {
    const colors = {
      success: 'text-green-600 bg-green-100',
      info: 'text-blue-600 bg-blue-100',
      warning: 'text-orange-600 bg-orange-100'
    };

    return (
      <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200">
        <div className={`p-2 rounded-lg ${colors[type]} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">{title}</p>
          <p className="text-sm text-slate-600 mt-1">{description}</p>
          <p className="text-xs text-slate-400 mt-2">{time}</p>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, <span className="gradient-text">{user?.name || 'Admin'}!</span>
          </h1>
          <p className="text-slate-600 text-lg">
            Here's what's happening with your EchoReads platform today.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            trend="up"
            trendValue="+12%"
          />
          
          <StatCard
            title="Active Subscriptions"
            value={stats.activeSubscriptions.toLocaleString()}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            trend="up"
            trendValue="+8%"
          />
          
          <StatCard
            title="Total Magazines"
            value={stats.totalMagazines.toLocaleString()}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            trend="up"
            trendValue="+15%"
          />
          
          <StatCard
            title="Revenue"
            value={`$${stats.revenue.toLocaleString()}`}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
            gradient="bg-gradient-to-br from-orange-500 to-orange-600"
            trend="up"
            trendValue="+23%"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft border border-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-200/50">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Quick Actions</h2>
                <p className="text-slate-600">Manage your platform efficiently with these quick actions</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <QuickActionCard
                    title="Add Magazine"
                    description="Create and publish new magazines to your platform"
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    }
                    href="/magazines/add"
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                  />
                  
                  <QuickActionCard
                    title="Manage Users"
                    description="View and manage user accounts and subscriptions"
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                    href="/users"
                    color="bg-gradient-to-br from-green-500 to-green-600"
                  />
                  
                  <QuickActionCard
                    title="View Magazines"
                    description="Browse and manage all published magazines"
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    }
                    href="/magazines"
                    color="bg-gradient-to-br from-purple-500 to-purple-600"
                  />
                  
                  <QuickActionCard
                    title="Categories"
                    description="Organize content with categories and tags"
                    icon={
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    }
                    href="/categories"
                    color="bg-gradient-to-br from-orange-500 to-orange-600"
                  />
          </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft border border-slate-200/50 overflow-hidden">
              <div className="p-6 border-b border-slate-200/50">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">Recent Activity</h2>
                <p className="text-slate-600">Latest updates from your platform</p>
              </div>
              <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
                <ActivityItem
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  title="New user registered"
                  description="Jane Doe joined the platform"
                  time="5 minutes ago"
                  type="success"
                />
                
                <ActivityItem
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                  title="Magazine updated"
                  description="Fashion Trends magazine was updated"
                  time="1 hour ago"
                  type="info"
                />
                
                <ActivityItem
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  title="New subscription"
                  description="Premium Plan subscription activated"
                  time="2 hours ago"
                  type="success"
                />
                
                <ActivityItem
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  }
                  title="Profile updated"
                  description="John Smith updated their profile"
                  time="3 hours ago"
                  type="info"
                />
                
                <ActivityItem
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  }
                  title="New magazine published"
                  description="Tech Insights Monthly is now live"
                  time="4 hours ago"
                  type="success"
                />
                
                <ActivityItem
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  }
                  title="Category created"
                  description="New Lifestyle category added"
                  time="6 hours ago"
                  type="info"
                />
          </div>
        </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard; 