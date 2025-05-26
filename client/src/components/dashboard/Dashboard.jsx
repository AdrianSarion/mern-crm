import { useState } from "react";
import {
  BarChart3,
  Users,
  Calendar,
  Settings,
  Mail,
  Bell,
  Search,
  Menu,
  X,
  UserPlus,
  DollarSign,
  Activity,
  Box,
  TrendingUp,
  Layers,
  PieChart,
  Target,
  Clock,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Building2,
  CircleDollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BarChart from "../charts/BarChart";
import LineChart from "../charts/LineChart";
import PolarChart from "../charts/PolarChart";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = [
    {
      title: "Total Customers",
      value: "2,543",
      change: "+12.5%",
      icon: <Users className="h-5 w-5 text-blue-400" />,
      trend: <ArrowUpRight className="h-4 w-4" />,
      bg: "bg-blue-400/10",
    },
    {
      title: "Revenue",
      value: "$45,234",
      change: "+15.2%",
      icon: <CircleDollarSign className="h-5 w-5 text-green-400" />,
      trend: <ArrowUpRight className="h-4 w-4" />,
      bg: "bg-green-400/10",
    },
    {
      title: "Active Projects",
      value: "95",
      change: "-8.1%",
      icon: <Briefcase className="h-5 w-5 text-purple-400" />,
      trend: <ArrowDownRight className="h-4 w-4" />,
      bg: "bg-purple-400/10",
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "+2.3%",
      icon: <Target className="h-5 w-5 text-orange-400" />,
      trend: <ArrowUpRight className="h-4 w-4" />,
      bg: "bg-orange-400/10",
    },
  ];

  const recentActivity = [
    {
      icon: <UserPlus className="h-4 w-4 text-blue-400" />,
      title: "New Customer Added",
      time: "2 minutes ago",
      bg: "bg-blue-400/10",
    },
    {
      icon: <CheckCircle2 className="h-4 w-4 text-green-400" />,
      title: "Project Completed",
      time: "1 hour ago",
      bg: "bg-green-400/10",
    },
    {
      icon: <AlertCircle className="h-4 w-4 text-orange-400" />,
      title: "New Task Alert",
      time: "3 hours ago",
      bg: "bg-orange-400/10",
    },
  ];

  const navItems = [
    { icon: <BarChart3 size={20} />, label: "Dashboard", active: true },
    { icon: <Users size={20} />, label: "Customers" },
    { icon: <Briefcase size={20} />, label: "Projects" },
    { icon: <Calendar size={20} />, label: "Schedule" },
    { icon: <PieChart size={20} />, label: "Reports" },
    { icon: <Layers size={20} />, label: "Tasks" },
    { icon: <Building2 size={20} />, label: "Companies" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed lg:static lg:block transition-all duration-300 ${
          isSidebarOpen ? "left-0" : "-left-64"
        } z-50`}>
        <div className="flex h-screen w-64 flex-col bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 p-4">
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <Box className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 text-transparent bg-clip-text">
              Clikkle CRM
            </span>
          </div>
          
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  item.active 
                    ? "bg-gray-700/50 text-white" 
                    : "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                }`}>
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-40">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-gray-300 hover:text-white">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="w-[200px] pl-9 bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
                />
              </div>
              <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                <Mail size={20} />
              </Button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-white font-medium">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-6 hover:bg-gray-800/70 transition-colors">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    {stat.icon}
                  </div>
                  <div className={`flex items-center gap-1 ${
                    stat.change.startsWith("+") ? "text-green-400" : "text-red-400"
                  }`}>
                    <span className="text-sm font-medium">{stat.change}</span>
                    {stat.trend}
                  </div>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">{stat.value}</h3>
                <p className="text-sm text-gray-400">{stat.title}</p>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Analytics Overview</h2>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                <Clock className="mr-2 h-4 w-4" />
                Last 30 Days
              </Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <BarChart3 size={18} />
                  </Button>
                </div>
                <BarChart />
              </Card>
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Customer Growth</h3>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <TrendingUp size={18} />
                  </Button>
                </div>
                <LineChart />
              </Card>
            </div>
            <div className="mt-6">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <PieChart size={18} />
                  </Button>
                </div>
                <PolarChart />
              </Card>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Activity</h2>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:text-white">
                View All
              </Button>
            </div>
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 overflow-hidden">
              <div className="divide-y divide-gray-700/50">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="p-4 hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-xl ${activity.bg} p-2`}>
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-gray-400">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
