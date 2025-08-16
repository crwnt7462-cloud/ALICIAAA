import React, { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight,
  Home,
  User,
  BarChart3,
  MessageSquare,
  HelpCircle,
  Menu,
  ChevronDown,
  MapPin,
  Activity
} from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: revenueChart = [], isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/dashboard/revenue-chart"],
  });

  if (statsLoading || revenueLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-20 bg-gradient-to-b from-purple-600 to-purple-700"></div>
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

  const friends = [
    { name: "Max Stone", activity: "Weekly Jogging", time: "3 min", avatar: "MS" },
    { name: "Grisha Jack", activity: "Daily Jogging", time: "7 min", avatar: "GJ" },
    { name: "Lori Patrick", activity: "Weekly Jogging", time: "15 min", avatar: "LP" },
    { name: "Cody Bryan", activity: "Marathon", time: "32 min", avatar: "CB" },
    { name: "Max Stone", activity: "Walking", time: "45 min", avatar: "MS" },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar violette */}
      <div className="w-20 bg-gradient-to-b from-purple-600 via-purple-600 to-purple-700 flex flex-col items-center py-6 shadow-xl">
        {/* Logo */}
        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
          <Bell className="w-6 h-6 text-white" />
        </div>
        
        {/* Navigation Icons */}
        <div className="space-y-6">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <Home className="w-6 h-6 text-white" />
          </div>
          
          <div className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer">
            <BarChart3 className="w-6 h-6 text-white/70" />
          </div>
          
          <div className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer">
            <Calendar className="w-6 h-6 text-white/70" />
          </div>
          
          <div className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer">
            <MessageSquare className="w-6 h-6 text-white/70" />
          </div>
          
          <div className="w-12 h-12 bg-transparent hover:bg-white/10 rounded-2xl flex items-center justify-center transition-colors cursor-pointer">
            <Clock className="w-6 h-6 text-white/70" />
          </div>
        </div>
        
        {/* User Avatar */}
        <div className="mt-auto mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-2xl flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex">
        {/* Zone principale */}
        <div className="flex-1 p-8 bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-gray-500 text-sm">Primary</p>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
            </div>
          </div>

          {/* Grille principale */}
          <div className="grid grid-cols-2 gap-6">
            {/* Overview Card - Grande carte à gauche */}
            <div className="col-span-1">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Overview</h2>
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1">
                    <span className="text-sm">{selectedPeriod}</span>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Graph Wave */}
                <div className="relative mb-6">
                  <svg width="100%" height="80" viewBox="0 0 400 80" className="opacity-50">
                    <path
                      d="M0,60 Q50,30 100,45 T200,35 T300,50 T400,25"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M0,40 Q50,10 100,25 T200,15 T300,30 T400,5"
                      stroke="rgba(255,182,193,0.8)"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                  
                  {/* Central circle with steps */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <div className="text-center">
                        <div className="text-lg font-bold">9.178</div>
                        <div className="text-xs opacity-75">Steps</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Mois */}
                <div className="flex justify-between text-xs mb-6 opacity-75">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span className="bg-white/20 px-2 py-1 rounded">Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                </div>
                
                {/* Stats en bas */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-xs opacity-75 mb-1">Total Time</div>
                    <div className="text-xl font-bold">748 Hr</div>
                    <div className="text-xs opacity-75">April</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-xs opacity-75 mb-1">Total Steps</div>
                    <div className="text-xl font-bold">9.178 St</div>
                    <div className="text-xs opacity-75">April</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <div className="text-xs opacity-75 mb-1">Target</div>
                    <div className="text-xl font-bold">9.200 St</div>
                    <div className="text-xs opacity-75">April</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Cartes de droite */}
            <div className="space-y-6">
              {/* Daily Jogging */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Daily Jogging</h3>
                  </div>
                </div>
              </div>
              
              {/* My Jogging */}
              <div className="bg-gradient-to-br from-pink-400 to-pink-500 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">My Jogging</h3>
                      <p className="text-sm opacity-75">Goal: 10k</p>
                      <p className="text-2xl font-bold mt-2">748 hr</p>
                      <p className="text-xs opacity-75">July</p>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Activity Cards en bas */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-2xl mb-4">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Bicycle Drill</h3>
              <p className="text-sm text-gray-500 mb-4">30 km / week</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>13 / 30km</span>
                <span className="text-pink-500">2 days left</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-2xl mb-4">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Jogging Hero</h3>
              <p className="text-sm text-gray-500 mb-4">15 km / month</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">13%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '13%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>2 / 15km</span>
                <span className="text-pink-500">17 days left</span>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-2xl mb-4">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Healthy Busy</h3>
              <p className="text-sm text-gray-500 mb-4">3500 steps / week</p>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">90%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>3200/3500 steps</span>
                <span className="text-pink-500">3 days left</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar droite - Friends */}
        <div className="w-80 bg-white p-6 border-l border-gray-100">
          {/* Header Friends */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-gray-900">Friends</span>
            </div>
            <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">View all</span>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6">
            <button className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg text-sm font-medium">
              Activities
            </button>
            <button className="flex-1 py-2 px-4 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">
              Online
            </button>
          </div>
          
          {/* Friends List */}
          <div className="space-y-4 mb-8">
            {friends.map((friend, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">{friend.avatar}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{friend.name}</div>
                    <div className="text-gray-500 text-xs">{friend.activity}</div>
                    <div className="text-gray-400 text-xs">{friend.time}</div>
                  </div>
                </div>
                <MessageSquare className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </div>
            ))}
          </div>
          
          {/* Live Map */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900 text-sm">Live map</span>
              </div>
              <span className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">View</span>
            </div>
            
            {/* Mini Map */}
            <div className="bg-gray-100 rounded-xl h-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
              {/* Simulated map points */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="absolute bottom-6 left-6 w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}