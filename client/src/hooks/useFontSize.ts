import { useState, useEffect } from "react";

type FontSize = "small" | "medium" | "large" | "extra-large";

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  useEffect(() => {
    // Load saved font size from localStorage on mount
    const savedFontSize = localStorage.getItem("fontSize") as FontSize;
    if (savedFontSize) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }
  }, []);

  const updateFontSize = (newSize: FontSize) => {
    setFontSize(newSize);
    localStorage.setItem("fontSize", newSize);
    applyFontSize(newSize);
  };

  const applyFontSize = (size: FontSize) => {
    const html = document.documentElement;
    
    // Remove all existing font size classes
    html.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
    
    // Apply the appropriate class based on selected size
    switch (size) {
      case "small":
        html.classList.add("text-sm");
        break;
      case "medium":
        html.classList.add("text-base");
        break;
      case "large":
        html.classList.add("text-lg");
        break;
      case "extra-large":
        html.classList.add("text-xl");
        break;
    }
  };

  return { fontSize, updateFontSize };
}