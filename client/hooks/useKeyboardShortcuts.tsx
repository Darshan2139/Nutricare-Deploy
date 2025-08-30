import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target as any)?.contentEditable === "true"
      ) {
        return;
      }

      // Handle different keyboard shortcuts
      switch (event.key) {
        case "F8":
          event.preventDefault();
          // Show notifications panel or toast
          toast.info("Notifications panel (F8)", {
            description: "View your latest notifications and updates",
          });
          break;

        case "?":
          if (event.shiftKey) {
            event.preventDefault();
            showKeyboardShortcutsHelp();
          }
          break;

        case "h":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            navigate("/");
            toast.info("Navigated to Home");
          }
          break;

        case "d":
          if ((event.ctrlKey || event.metaKey) && user) {
            event.preventDefault();
            navigate("/dashboard");
            toast.info("Navigated to Dashboard");
          }
          break;

        case "c":
          if ((event.ctrlKey || event.metaKey) && user) {
            event.preventDefault();
            navigate("/chatbot");
            toast.info("Navigated to AI Nutritionist");
          }
          break;

        case "g":
          if ((event.ctrlKey || event.metaKey) && user) {
            event.preventDefault();
            navigate("/diet-plan-generator");
            toast.info("Navigated to Diet Plan Generator");
          }
          break;

        case "e":
          if ((event.ctrlKey || event.metaKey) && user) {
            event.preventDefault();
            navigate("/emergency");
            toast.info("Navigated to Emergency Help");
          }
          break;

        case "p":
          if ((event.ctrlKey || event.metaKey) && user) {
            event.preventDefault();
            navigate("/profile");
            toast.info("Navigated to Profile");
          }
          break;

        case "l":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (user) {
              logout();
              navigate("/");
              toast.success("Logged out successfully");
            } else {
              navigate("/login");
              toast.info("Navigated to Login");
            }
          }
          break;

        case "Escape":
          // Close any open modals, dropdowns, etc.
          const openDialogs = document.querySelectorAll('[role="dialog"]');
          const openDropdowns = document.querySelectorAll(
            '[data-state="open"]',
          );

          if (openDialogs.length > 0 || openDropdowns.length > 0) {
            event.preventDefault();
            // Trigger escape on the most recent modal/dropdown
            const target =
              openDialogs[openDialogs.length - 1] ||
              openDropdowns[openDropdowns.length - 1];
            (target as HTMLElement)?.click();
            toast.info("Closed modal/dropdown");
          }
          break;
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, user, logout]);
};

const showKeyboardShortcutsHelp = () => {
  toast.info("Keyboard Shortcuts", {
    description: (
      <div className="space-y-2 text-sm">
        <div>
          <strong>F8</strong> - Notifications
        </div>

        <div>
          <strong>Ctrl/Cmd + H</strong> - Home
        </div>
        <div>
          <strong>Ctrl/Cmd + D</strong> - Dashboard
        </div>
        <div>
          <strong>Ctrl/Cmd + C</strong> - AI Nutritionist
        </div>
        <div>
          <strong>Ctrl/Cmd + G</strong> - Diet Plan Generator
        </div>
        <div>
          <strong>Ctrl/Cmd + E</strong> - Emergency Help
        </div>
        <div>
          <strong>Ctrl/Cmd + P</strong> - Profile
        </div>
        <div>
          <strong>Ctrl/Cmd + L</strong> - Login/Logout
        </div>
        <div>
          <strong>Esc</strong> - Close modals
        </div>
        <div>
          <strong>Shift + ?</strong> - Show this help
        </div>
      </div>
    ),
    duration: 8000,
  });
};
