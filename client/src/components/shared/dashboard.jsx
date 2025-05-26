"use client";

import * as React from "react";
import {
  Home,
  Building2,
  BarChart2,
  Users2,
  Video,
  ListTodo,
  LayoutGrid,
  Mail,
  MessageSquare,
  Calendar,
  Settings,
  ChevronDown,
  Menu,
  Search,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { CompanySwitcher } from "./company-switch";
import { Nav } from "./nav-bar";
import Cookies from "js-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { UserNav } from "./user-nav";
import { Badge } from "../ui/badge";

export function Dash({
  user,
  //   companies,
  defaultLayout = [12, 97],
  defaultCollapsed = true,
  navCollapsedSize,
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const navigate = useNavigate();

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          Cookies.set("react-resizable-panels:layout", JSON.stringify(sizes));
        }}
        className="h-screen items-stretch">
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={10}
          maxSize={16}
          onExpand={() => {
            setIsCollapsed(false);
            Cookies.set("react-resizable-panels:collapsed", JSON.stringify(false));
          }}
          onCollapse={() => {
            setIsCollapsed(true);
            Cookies.set("react-resizable-panels:collapsed", JSON.stringify(true));
          }}
          className={cn(
            "bg-[#FFFFFF] border-r border-[#0000001A]",
            isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out",
          )}>
          <div
            className={cn(
              "flex h-[52px] items-center border-b border-[#0000001A]",
              isCollapsed ? "justify-center" : "px-2",
            )}>
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-2 cursor-pointer">
              <img src="/logo.png" alt="Clikkle" className="h-8" />
              {!isCollapsed && (
                <span className="text-lg font-semibold text-[#000000DE]">
                  Clikkle
                </span>
              )}
            </div>
          </div>
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Dashboard",
                href: "/overview",
                icon: Home,
                variant: "ghost",
              },
              {
                title: "Companies",
                href: "/companies",
                icon: Building2,
                variant: "ghost",
              },
            ]}
          />
          <div className={cn("px-2 py-2", isCollapsed && "hidden")}>
            <div className="flex items-center justify-between text-sm text-[#00000099]">
              <span>More</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Stats",
                href: "/stats",
                icon: BarChart2,
                variant: "ghost",
              },
              {
                title: "Contacts",
                href: "/contacts",
                icon: Users2,
                variant: "ghost",
              },
              {
                title: "Deals",
                href: "/deals",
                icon: Video,
                variant: "ghost",
              },
              {
                title: "Tasks",
                href: "/tasks",
                icon: ListTodo,
                variant: "ghost",
              },
              {
                title: "Kanban",
                href: "/kanban",
                icon: LayoutGrid,
                variant: "ghost",
              },
            ]}
          />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Emails",
                href: "/emails",
                icon: Mail,
                variant: "ghost",
              },
              {
                title: "Chat",
                href: "/chat",
                icon: MessageSquare,
                variant: "ghost",
              },
              {
                title: "Calendar",
                href: "/calendar",
                icon: Calendar,
                variant: "ghost",
              },
            ]}
          />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: "Settings",
                href: "/settings",
                icon: Settings,
                variant: "ghost",
              },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle className="bg-[#0000001A]" />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} className="bg-white">
          <div className="flex justify-between items-center px-4 py-2 bg-white border-b border-[#0000001A]">
            <div className="flex items-center gap-2">
              <Menu className="h-5 w-5 text-[#00000099]" />
              <span className="text-sm font-medium text-[#000000DE]">Menu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00000099]" />
                <Input 
                  placeholder="Search..." 
                  className="w-[280px] pl-9 bg-white border-[#0000001A] text-[#000000DE] placeholder:text-[#00000099]"
                />
              </div>
              <UserNav user={user} />
            </div>
          </div>
          <div className="p-4">
            <Outlet />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
