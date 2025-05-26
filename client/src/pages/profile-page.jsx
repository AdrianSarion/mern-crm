import { Spinner } from "@/components/ui/spinner";
import { tabs } from "@/data/profile";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import { User, Settings, Shield, Bell, Key, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  const [tab, setTab] = useState(tabs[0]);
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="flex-1 flex-col space-y-8 p-8 md:flex bg-gray-900">
        <div className="flex items-center justify-center">
          <Spinner size="large" className="text-blue-400" />
        </div>
      </div>
    );
  }

  const tabIcons = {
    profile: <User size={18} />,
    account: <UserCircle size={18} />,
    security: <Shield size={18} />,
    notifications: <Bell size={18} />,
    password: <Key size={18} />,
    settings: <Settings size={18} />,
  };

  return (
    <main className="flex min-h-screen flex-col p-6 gap-8 bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      <div className="max-w-6xl w-full grid gap-1 mx-auto">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          {tabIcons[tab.value.toLowerCase()] || <User size={24} />}
          {tab.title}
        </h1>
        <p className="text-m font-medium text-gray-400">
          {tab.description}
        </p>
      </div>
      <div className="grid items-start max-w-6xl w-full md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] mx-auto gap-6">
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-4">
          <nav className="text-sm text-gray-400 grid gap-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.value}
                to={tab.href}
                end
                onClick={() => setTab(tab)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                    "hover:text-white hover:bg-gray-700/50",
                    isActive ? "bg-gray-700/50 text-white font-medium" : "",
                  )
                }>
                {tabIcons[tab.value.toLowerCase()] || <User size={18} />}
                {tab.title}
              </NavLink>
            ))}
          </nav>
        </Card>
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 p-6">
          <Outlet context={user} />
        </Card>
      </div>
    </main>
  );
}
