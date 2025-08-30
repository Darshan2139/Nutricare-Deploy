import { Button } from "@/components/ui/button";
import { NutriCareLogo } from "@/components/NutriCareLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  User,
  FileText,
  BarChart3,
  MessageCircle,
  AlertTriangle,
  LogOut,
  Sparkles,
  ChevronDown,
  Play,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MobileNav } from "./MobileNav";

interface EnhancedNavbarProps {
  showFullNav?: boolean;
}

export function EnhancedNavbar({ showFullNav = true }: EnhancedNavbarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
    },
    {
      label: "Exercise Videos",
      href: "/exercise-videos",
      icon: Play,
    },
    {
      label: "AI Nutritionist",
      href: "/chatbot",
      icon: MessageCircle,
    },
    {
      label: "Diet Plans",
      href: "/diet-plan-generator",
      icon: Sparkles,
    },
    {
      label: "Emergency Help",
      href: "/emergency",
      icon: AlertTriangle,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <NutriCareLogo size="md" />
            <span className="ml-2 text-xl font-bold text-rose-900 font-quicksand">
              NutriCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          {showFullNav && user && (
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-medium"
                      : "text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-200 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-lavender-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-rose-900 dark:text-rose-100">
                        {user.name}
                      </div>
                      <div className="text-xs text-rose-600 dark:text-rose-400">
                        {user.role === "pregnant"
                          ? "Expecting Mother"
                          : "Lactating Mother"}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-rose-100 dark:border-gray-700"
                >
                  <Link
                    to="/profile"
                    className="block px-3 py-2 border-b border-rose-100 dark:border-gray-700 hover:bg-rose-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="font-medium text-rose-900 dark:text-rose-100">
                      {user.name}
                    </div>
                    <div className="text-sm text-rose-600 dark:text-rose-400">
                      {user.email}
                    </div>
                    <div className="text-xs text-rose-500 dark:text-rose-500 mt-1">
                      Click to view profile
                    </div>
                  </Link>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center w-full cursor-pointer"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center w-full cursor-pointer"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard?tab=reports"
                      className="flex items-center w-full cursor-pointer"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Reports
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link
                      to="/diet-plan-generator"
                      className="flex items-center w-full cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Diet Plan
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-rose-100" />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="border-rose-300 text-rose-700 hover:bg-rose-50"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-rose-500 hover:bg-rose-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
