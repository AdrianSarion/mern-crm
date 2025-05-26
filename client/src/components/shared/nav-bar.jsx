import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Nav({ links, isCollapsed }) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col py-1 bg-transparent">
      <nav className="grid gap-0.5 group-[[data-collapsed=true]]:justify-center">
        {links.map((link, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <div>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) => {
                      return cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-9 w-9 p-0 flex items-center justify-center",
                        "text-gray-400 hover:text-white hover:bg-gray-700",
                        isActive && "bg-gray-700 text-white"
                      )
                    }}>
                    <link.icon className="h-[18px] w-[18px]" />
                    <span className="sr-only">{link.title}</span>
                  </NavLink>
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                className="flex items-center gap-4 bg-gray-800 border-gray-700 text-gray-100">
                {link.title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <NavLink
              key={index}
              to={link.href}
              className={({ isActive }) => {
                return cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "justify-start h-9 px-2",
                  "text-gray-400 hover:text-white hover:bg-gray-700",
                  isActive && "bg-gray-700 text-white"
                )
              }}>
              <link.icon className="mr-2 h-[18px] w-[18px]" />
              <span className="text-sm">{link.title}</span>
            </NavLink>
          ),
        )}
      </nav>
    </div>
  );
}
