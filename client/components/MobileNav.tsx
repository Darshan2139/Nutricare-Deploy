import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NutriCareLogo } from "@/components/NutriCareLogo";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Heart,
  Menu,
  LogOut,
  User,
  BarChart3,
  MessageCircle,
  AlertTriangle,
  Sparkles,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function MobileNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    setIsOpen(false);
    navigate("/");
  };

  const closeSheet = () => setIsOpen(false);

  const menuItems = user
    ? [
        {
          icon: BarChart3,
          label: "Dashboard",
          href: "/dashboard",
          description: "View your health overview",
        },
        {
          icon: Sparkles,
          label: "Diet Plans",
          href: "/diet-plan-generator",
          description: "Generate personalized nutrition plans",
        },
        {
          icon: User,
          label: "Profile",
          href: "/profile",
          description: "Manage your personal information",
        },
        {
          icon: MessageCircle,
          label: "AI Nutritionist",
          href: "/chatbot",
          description: "Ask nutrition questions",
        },
        {
          icon: AlertTriangle,
          label: "Emergency Help",
          href: "/emergency",
          description: "Find nearby hospitals",
        },
        {
          icon: Info,
          label: "About",
          href: "/about",
          description: "Learn about NutriCare",
        },
      ]
    : [
        {
          icon: Info,
          label: "About",
          href: "/about",
          description: "Learn about NutriCare",
        },
        {
          icon: MessageCircle,
          label: "Try AI Chat",
          href: "/chatbot",
          description: "Ask nutrition questions",
        },
      ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden p-2 hover:bg-rose-50"
          size="sm"
        >
          <Menu className="h-5 w-5 text-rose-700" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 border-rose-100"
      >
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center text-rose-900 font-quicksand">
            <NutriCareLogo size="sm" className="mr-2" />
            NutriCare
          </SheetTitle>
          {user && (
            <div className="flex items-center space-x-3 pt-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-lavender-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <p className="font-medium text-rose-900">{user.name}</p>
                <p className="text-sm text-rose-600">
                  {user.role === "pregnant"
                    ? "Expecting Mother"
                    : "Lactating Mother"}
                </p>
              </div>
            </div>
          )}
        </SheetHeader>

        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              onClick={closeSheet}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/50 transition-all duration-200 hover:shadow-sm group"
            >
              <div className="w-10 h-10 bg-white/70 rounded-lg flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-200">
                <item.icon className="h-5 w-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-rose-900">{item.label}</p>
                <p className="text-xs text-rose-600">{item.description}</p>
              </div>
            </Link>
          ))}

          {!user && (
            <div className="pt-4 space-y-2">
              <Link to="/login" onClick={closeSheet}>
                <Button
                  variant="outline"
                  className="w-full border-rose-300 text-rose-700 hover:bg-rose-50"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={closeSheet}>
                <Button className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {user && (
            <div className="pt-6">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Visual Enhancement */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gradient-to-r from-rose-500/10 to-lavender-500/10 rounded-lg p-4 text-center">
            <Heart className="h-8 w-8 text-rose-400 mx-auto mb-2" />
            <p className="text-sm text-rose-700 font-medium">
              Caring for mothers everywhere
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
