import React from "react";
import logoDark from "../assets/logo-dark.png";
import { Menu, Settings, Info, Phone } from "lucide-react";
import { BRAND_COLORS, UI_COLORS } from "../utils/colors";
import { DropdownMenu } from "./common";

export const NavBar = () => {
  const dropdownItems = [
    {
      icon: <Settings className="w-4 h-4" color={UI_COLORS.INFO} />,
      label: 'Settings',
      onClick: () => console.log('Settings clicked')
    },
    {
      icon: <Info className="w-4 h-4" color={UI_COLORS.SUCCESS} />,
      label: 'About',
      onClick: () => console.log('About clicked')
    },
    {
      icon: <Phone className="w-4 h-4" color={UI_COLORS.WARNING} />,
      label: 'Support',
      onClick: () => console.log('Support clicked')
    }
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3">
        <img src={logoDark} alt="Breeth" className="w-8 h-8 object-contain" />
        <span className="text-xl font-bold tracking-tight text-white">BREETH</span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        <a href="#" className="text-gray-300 hover:text-brand-primary transition-colors duration-200 text-sm font-medium">
          Home
        </a>
        <a href="#" className="text-gray-300 hover:text-brand-primary transition-colors duration-200 text-sm font-medium">
          About
        </a>
        <a href="#" className="text-gray-300 hover:text-brand-primary transition-colors duration-200 text-sm font-medium">
          Contact
        </a>
      </div>

      <DropdownMenu
        trigger={
          <Menu className="w-5 h-5" color={BRAND_COLORS.PRIMARY} />
        }
        items={dropdownItems}
        menuClassName="mt-4"
      />
    </nav>
  );
};
