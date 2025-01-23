import React from "react";
import { MenuIcon } from "lucide-react";
import logo from "../assets/logo.svg";

export const NavBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex flex-row justify-between items-center p-3 bg-[rgba(246,188,255,0.09)] shadow-md backdrop-blur-lg">
      <img src={logo} className="w-10 h-10" />
      <h1 className="text-3xl font-black tracking-wider">Breeth</h1>
      <div className="relative">
        <button onClick={() => setIsOpen(!isOpen)}>
          <MenuIcon />
        </button>
        {isOpen && (
          <div className="absolute bg-black mt-4 pb-4">
            <div className="flex flex-col space-y-4 align-start p-4">
            <span className="text-light">Settings</span>
            </div>
          </div>
        )}
       
      </div>
      
    </div>
  );
};
