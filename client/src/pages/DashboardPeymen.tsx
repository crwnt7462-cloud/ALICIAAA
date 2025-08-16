import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Settings, 
  Bell, 
  BarChart3,
  CreditCard,
  Users,
  Wallet,
  MessageSquare,
  TrendingUp,
  PieChart,
  Home,
  User,
  Calendar,
  Clock
} from "lucide-react";

export default function DashboardPeymen() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  if (statsLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-lg"></div>
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="grid grid-cols-3 gap-6">
              {Array.from({length: 3}).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-60 bg-white shadow-sm flex flex-col border-r border-gray-100">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="font-bold text-gray-900 text-lg">Peymen</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            <div className="flex items-center space-x-3 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Home className="w-4 h-4" />
              <span className="font-medium text-sm">Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <User className="w-4 h-4" />
              <span className="text-sm">Profile</span>
            </div>
            
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Wallet className="w-4 h-4" />
              <span className="text-sm">Wallet</span>
            </div>
            
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm">Analytics</span>
            </div>
            
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm">Messages</span>
            </div>
            
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Users className="w-4 h-4" />
              <span className="text-sm">Clients</span>
            </div>
            
            <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </div>
          </nav>
          
          {/* Premium Account Card */}
          <div className="p-3 mx-3 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-3 text-white">
              <h3 className="font-semibold text-sm mb-1">Get a Premium Account</h3>
              <p className="text-xs opacity-90 mb-3">Unlock advanced features</p>
              <button className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors w-full">
                Get Now
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Welcome to Peymen</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                  />
                </div>
                
                <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Settings className="w-4 h-4 text-gray-600" />
                </button>
                
                <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 relative">
                  <Bell className="w-4 h-4 text-gray-600" />
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                </button>
                
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">AV</span>
                </div>
              </div>
            </div>

            {/* Stats Cards - Exact Layout */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Total Services</p>
                    <p className="text-lg font-bold text-gray-900">$124</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">New Clients</p>
                    <p className="text-lg font-bold text-gray-900">$142</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs mb-1">Revenue</p>
                    <p className="text-lg font-bold text-gray-900">$155</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="text-right">
                  <p className="text-gray-600 text-xs mb-1">Month</p>
                  <p className="text-2xl font-bold text-gray-900">$234.2</p>
                </div>
              </div>
            </div>

            {/* Main Content Grid - Exact Layout */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="col-span-2 space-y-6">
                {/* Reach Financial Goals Card */}
                <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Reach financial goals faster</h3>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                        Learn More
                      </button>
                    </div>
                    
                    <div className="flex-1 flex justify-center">
                      {/* Credit Card */}
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 text-white w-56">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-xs opacity-90">Universal Card</span>
                          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-white/40 rounded-full"></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs opacity-90">**** **** 5678 5432</p>
                          <p className="text-xs opacity-75">Salon Avyento</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex justify-end">
                      <div className="w-20 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {/* Simple chart representation */}
                        <svg width="60" height="30" viewBox="0 0 60 30" className="text-gray-400">
                          <path d="M5,20 Q15,8 30,15 T55,10" stroke="currentColor" strokeWidth="1.5" fill="none" />
                          <circle cx="15" cy="12" r="1.5" fill="currentColor" />
                          <circle cx="45" cy="13" r="1.5" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transactions Section */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Your Transaction */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">Your Transaction</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-xs">🛍️</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">Shopping</p>
                            <p className="text-xs text-gray-500">Today</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600 text-sm">$27</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 text-xs">🎬</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">Movie</p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                          </div>
                        </div>
                        <span className="font-semibold text-red-600 text-sm">$15</span>
                      </div>
                    </div>
                  </div>

                  {/* Your Transfer */}
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">Your Transfer</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-xs">JW</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">Jenny Wilson</p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600 text-sm">$45</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium text-xs">DR</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">Dianne Russell</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                        <span className="font-semibold text-green-600 text-sm">$32</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Goals Completed Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-5 text-white">
                  <div className="text-center">
                    <p className="text-xs opacity-75 mb-1">Goals for 2023</p>
                    <h2 className="text-lg font-bold mb-3">Completed</h2>
                    
                    {/* Circular Progress */}
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          stroke="white"
                          strokeWidth="6"
                          fill="none"
                          strokeDasharray={`${100 * 2.827} 283`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}