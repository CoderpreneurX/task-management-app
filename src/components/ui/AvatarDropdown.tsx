"use client"; // Ensure this runs in the browser

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

interface User {
  fullName: string;
  email: string;
  role: string;
}

const AvatarDropdown = ({ user }: { user: User }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [positionAbove, setPositionAbove] = useState(true);
  const router = useRouter();

  // Handle clicks outside to close the dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Adjust position based on available space
  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;

      if (buttonRect.top < dropdownHeight + 12) {
        // Not enough space above, show below
        setPositionAbove(false);
      } else {
        // Enough space, show above
        setPositionAbove(true);
      }
    }
  }, [isOpen]);

  const handleLogout = () => {
    router.push("/logout")
  };

  return (
    <div className="relative">
      {/* Avatar Icon */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
      >
        <FaUserCircle size={36} className="text-gray-600 hover:text-gray-800 transition duration-200" />
      </button>

      {/* Dropdown (Appears above & aligns to the left) */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 w-56 bg-white shadow-lg rounded-lg border border-gray-200 z-50 ${
            positionAbove ? "bottom-12" : "top-12"
          }`}
        >
          <div className="px-4 py-3">
            <p className="text-gray-900 font-semibold">{user.fullName} - {`(${user.role})`}</p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
