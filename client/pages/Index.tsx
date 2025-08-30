import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Sparkles, Shield, Users, LogOut } from "lucide-react";
import { NutriCareLogo } from "@/components/NutriCareLogo";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MobileNav } from "@/components/MobileNav";
import { WeeklyPlanPreview } from "@/components/WeeklyPlanPreview";
import {
  FloatingElements,
  GlowingCard,
  AnimatedCounter,
} from "@/components/VisualEffects";

export default function Index() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 relative overflow-hidden">
      <FloatingElements />
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-rose-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <NutriCareLogo size="md" />
              <span className="ml-2 text-xl font-bold text-rose-900 font-quicksand">
                NutriCare
              </span>
            </div>
            <MobileNav />
            <div className="hidden md:flex items-center space-x-8">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-rose-700 hover:text-rose-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/diet-plan-generator"
                    className="text-rose-700 hover:text-rose-900 transition-colors"
                  >
                    Diet Plans
                  </Link>
                  <Link
                    to="/about"
                    className="text-rose-700 hover:text-rose-900 transition-colors"
                  >
                    About
                  </Link>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-lavender-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <span className="text-rose-900 font-medium">
                        {user.name}
                      </span>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="border-rose-300 text-rose-700 hover:bg-rose-50"
                      size="sm"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <a
                    href="#features"
                    className="text-rose-700 hover:text-rose-900 transition-colors"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    className="text-rose-700 hover:text-rose-900 transition-colors"
                  >
                    How It Works
                  </a>
                  <Link
                    to="/about"
                    className="text-rose-700 hover:text-rose-900 transition-colors"
                  >
                    About
                  </Link>
                  <Link to="/register">
                    <Button className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                {user ? (
                  <>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-rose-900 leading-tight">
                      Welcome back,
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-lavender-500">
                        {" "}
                        {user.name.split(" ")[0]}
                      </span>
                      !
                    </h1>
                    <p className="text-lg md:text-xl text-rose-700 max-w-2xl">
                      Your personalized nutrition journey continues. Access your
                      diet plans, track your progress, and get AI-powered
                      guidance tailored specifically for your{" "}
                      {user.role === "pregnant" ? "pregnancy" : "lactation"}{" "}
                      journey.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-rose-900 leading-tight">
                      Personalized
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-lavender-500">
                        {" "}
                        Nutrition
                      </span>
                      <br />
                      for Every Mother
                    </h1>
                    <p className="text-lg md:text-xl text-rose-700 max-w-2xl">
                      Get AI-powered, personalized diet plans tailored to your
                      health reports and pregnancy journey. Supporting mothers
                      through every stage with science-backed nutrition
                      guidance.
                    </p>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/diet-plan-generator">
                      <Button className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                        Generate Diet Plan
                      </Button>
                    </Link>
                    <Link to="/dashboard">
                      <Button
                        variant="outline"
                        className="border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                      >
                        View Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                        Start Your Journey
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        variant="outline"
                        className="border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-sage-600" />
                  <span className="text-sage-700 text-sm">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-sage-600" />
                  <span className="text-sage-700 text-sm">
                    Trusted by 10k+ Mothers
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fed4e30a48aec483489234b0932ccd474%2Fffd0c26432524aba8a7b2e184d9af57d?format=webp&width=800"
                  alt="Peaceful pregnant woman practicing yoga meditation by the window"
                  className="w-full h-[600px] object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent rounded-3xl"></div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-lavender-200 to-lavender-300 rounded-full opacity-70 animate-pulse"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-peach-200 to-peach-300 rounded-full opacity-60 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 -right-8 w-16 h-16 bg-gradient-to-br from-rose-200 to-rose-300 rounded-full opacity-50 animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Plan Preview for Logged-in Users */}
      {user && <WeeklyPlanPreview />}

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-4 font-quicksand">
              Why Choose NutriCare?
            </h2>
            <p className="text-lg text-rose-700 max-w-3xl mx-auto">
              Our AI-powered platform combines your medical reports with
              nutritional science to create personalized meal plans that support
              your health journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered Personalization",
                description:
                  "Advanced algorithms analyze your health reports to create perfectly tailored nutrition plans.",
              },
              {
                icon: Heart,
                title: "Pregnancy & Lactation Support",
                description:
                  "Specialized meal plans designed for expecting and nursing mothers' unique nutritional needs.",
              },
              {
                icon: Shield,
                title: "Science-Backed Nutrition",
                description:
                  "Every recommendation is based on the latest nutritional research and medical guidelines.",
              },
            ].map((feature, index) => (
              <GlowingCard
                key={index}
                className="p-8 rounded-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105"
              >
                <feature.icon className="h-12 w-12 text-rose-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-xl font-semibold text-rose-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-rose-700">{feature.description}</p>
              </GlowingCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-rose-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-rose-700 max-w-3xl mx-auto">
              Get personalized nutrition guidance in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Your Reports",
                description:
                  "Securely upload your blood test results and medical reports for analysis.",
              },
              {
                step: "02",
                title: "AI Analysis",
                description:
                  "Our AI analyzes your health data and creates personalized nutrition recommendations.",
              },
              {
                step: "03",
                title: "Get Your Plan",
                description:
                  "Receive customized meal plans, shopping lists, and ongoing nutrition support.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-lavender-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-rose-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-rose-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Only show for non-logged-in users */}
      {!user && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-500 to-lavender-500">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Nutrition?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of mothers who have already started their
              personalized nutrition journey with NutriCare.
            </p>
            <Link to="/register">
              <Button className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                Start Free Today
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-rose-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <NutriCareLogo size="md" className="brightness-200" />
                <span className="ml-2 text-xl font-bold font-quicksand">
                  NutriCare
                </span>
              </div>
              <p className="text-rose-200 max-w-md">
                Empowering mothers with personalized nutrition guidance through
                AI-powered health analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-rose-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-rose-200">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-rose-800 mt-8 pt-8 text-center text-rose-200">
            <p>&copy; 2024 NutriCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
