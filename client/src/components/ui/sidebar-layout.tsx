"use client";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "./SideBar";
import {
  LayoutDashboard,
  LogOut,
  Edit3,
  FileText,
  Clock,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AppLogo } from "./logo";

export function SidebarLayout() {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <LayoutDashboard className='text-primary-700 dark:text-primary-200 h-5 w-5 flex-shrink-0' />
      ),
    },
    {
      label: "New Draft",
      href: "/new-draft",
      icon: (
        <Edit3 className='text-primary-700 dark:text-primary-200 h-5 w-5 flex-shrink-0' />
      ),
    },
    {
      label: "All Drafts",
      href: "/all-drafts",
      icon: (
        <FileText className='text-primary-700 dark:text-primary-200 h-5 w-5 flex-shrink-0' />
      ),
    },
    {
      label: "Scheduled Posts",
      href: "/scheduled",
      icon: (
        <Clock className='text-primary-700 dark:text-primary-200 h-5 w-5 flex-shrink-0' />
      ),
    },
    {
      label: "Published Posts",
      href: "/published",
      icon: (
        <Send className='text-primary-700 dark:text-primary-200 h-5 w-5 flex-shrink-0' />
      ),
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <LogOut className='text-primary-700 dark:text-primary-200 h-5 w-5 flex-shrink-0' />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className={cn("flex bg-[#0a0a0b] w-full h-screen overflow-hidden")}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className='justify-between gap-10'>
          <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
            {open ? <Logo /> : <LogoIcon />}
            <div className='mt-8 flex flex-col gap-2'>
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "User Profile",
                href: "/profile",
                icon: (
                  <div className='h-7 w-7 flex-shrink-0 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center'>
                    <span className='text-white text-xs font-medium'>U</span>
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content Area */}
      <div className='flex flex-1 overflow-y-auto bg-[#0A0A0B]'>
        <Outlet />
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <div className='font-normal flex space-x-2 items-center text-sm text-primary-800 py-1 relative z-20'>
      <div className='h-5 w-6 bg-primary-600 dark:bg-primary-400 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0' />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className='font-medium text-primary-800 dark:text-primary-200 whitespace-pre'
      >
        <AppLogo size='small' />
      </motion.span>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className='font-normal flex space-x-2 items-center text-sm text-primary-800 py-1 relative z-20'>
      <div className='h-5 w-6 bg-primary-600 dark:bg-primary-400 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0' />
    </div>
  );
};
