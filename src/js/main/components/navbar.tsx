import React from "react";
import logoDark from "../assets/logo-dark.png";
import { Sparkles } from "lucide-react";

export const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-black/60 border-b border-gray-800 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <img src={logoDark} alt="Breeth" className="w-8 h-8 object-contain" />
        <span className="text-xl font-bold tracking-tight text-white">BREETH AI</span>
      </div>

      <div className="flex items-center gap-2 text-purple-400">
        <Sparkles className="w-5 h-5" />
        <span className="text-sm font-medium">AI-Powered Editing</span>
      </div>
    </nav>
  );
};
