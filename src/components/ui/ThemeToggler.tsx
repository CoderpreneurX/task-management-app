"use client";

import { useState, useEffect } from "react";
import { Button } from "./Button";

const ThemeToggler = () => {
    // ✅ Load theme from localStorage or default to light
    const [theme, setTheme] = useState("light");

    // ✅ Ensure we check the document only on the client
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || 
            (document.documentElement.classList.contains("dark") ? "dark" : "light");
        setTheme(storedTheme);
        document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }, []);

    // ✅ Toggle function
    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
        localStorage.setItem("theme", newTheme); // ✅ Save preference
    };

    return (
        <Button onClick={toggleTheme} className="fixed z-10 p-1 top-2 right-2">
            {theme === "dark" ? "☀️" : "🌙"}
        </Button>
    );
};

export default ThemeToggler;
