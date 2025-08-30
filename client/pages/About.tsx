import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  Brain,
  Shield,
  Users,
  Award,
  Target,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { NutriCareLogo } from "@/components/NutriCareLogo";
import { Link, useNavigate } from "react-router-dom";
import { EnhancedNavbar } from "@/components/EnhancedNavbar";
import { useAuth } from "@/contexts/AuthContext";

export default function About() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      // User is logged in, redirect to dashboard
      navigate("/dashboard");
    } else {
      // User is not logged in, redirect to register page
      navigate("/register");
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Nutrition",
      description:
        "Advanced machine learning algorithms analyze your health data to create personalized nutrition plans.",
    },
    {
      icon: Shield,
      title: "Medical Grade Security",
      description:
        "HIPAA-compliant platform ensuring your health data is secure and private.",
    },
    {
      icon: Users,
      title: "Expert Backed",
      description:
        "Developed in consultation with nutritionists, obstetricians, and maternal health specialists.",
    },
    {
      icon: Award,
      title: "Evidence-Based",
      description:
        "All recommendations are based on the latest scientific research and medical guidelines.",
    },
  ];

  const timeline = [
    {
      year: "2023",
      title: "Research & Development",
      description:
        "Extensive research into maternal nutrition needs and AI model development.",
    },
    {
      year: "2024",
      title: "Beta Launch",
      description:
        "Launched beta version with select healthcare providers and expecting mothers.",
    },
    {
      year: "2024",
      title: "Public Release",
      description:
        "Full platform launch with comprehensive features for maternal health support.",
    },
    {
      year: "Future",
      title: "Expansion",
      description:
        "Planning to expand to postpartum care, pediatric nutrition, and family health.",
    },
  ];

  const stats = [
    { number: "10,000+", label: "Mothers Supported" },
    { number: "95%", label: "User Satisfaction" },
    { number: "50+", label: "Medical Partners" },
    { number: "24/7", label: "AI Support" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <EnhancedNavbar showFullNav={false} />

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <NutriCareLogo size="lg" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-rose-900 mb-6 font-quicksand">
              About NutriCare
            </h1>
            <p className="text-xl text-rose-700 max-w-3xl mx-auto leading-relaxed">
              Empowering mothers through personalized, AI-driven nutrition
              guidance. We combine cutting-edge technology with evidence-based
              medical research to support every step of your maternal health
              journey.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-rose-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-rose-700 mb-6">
                At NutriCare, we believe every mother deserves personalized,
                science-backed nutrition guidance during pregnancy and
                lactation. Our mission is to democratize access to expert
                nutritional care through innovative AI technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-sage-500 mt-0.5" />
                  <p className="text-rose-700">
                    Provide personalized nutrition plans based on individual
                    health profiles
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-sage-500 mt-0.5" />
                  <p className="text-rose-700">
                    Support mothers through evidence-based recommendations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-sage-500 mt-0.5" />
                  <p className="text-rose-700">
                    Bridge the gap between medical care and daily nutrition
                    choices
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7055720/pexels-photo-7055720.jpeg"
                alt="Pregnant woman in peaceful meditation"
                className="w-full h-96 object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rose-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-lg text-rose-700 max-w-3xl mx-auto">
              Our platform combines the latest in AI technology with maternal
              health expertise to provide unprecedented personalized care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-rose-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-rose-500 mb-4" />
                  <CardTitle className="text-rose-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-rose-700 text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-rose-500 to-lavender-500">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-white/90">
              Join the growing community of mothers who trust NutriCare
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-white/90 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rose-900 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-rose-700">
              From research to reality - how we're revolutionizing maternal
              nutrition
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-rose-500 to-lavender-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{item.year}</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-rose-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-rose-700">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rose-900 mb-4">
              Expert Team
            </h2>
            <p className="text-lg text-rose-700">
              Our multidisciplinary team combines expertise in nutrition,
              technology, and maternal health
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Chief Medical Officer",
                specialty: "Maternal-Fetal Medicine",
              },
              {
                name: "Dr. Maria Rodriguez",
                role: "Lead Nutritionist",
                specialty: "Prenatal & Lactation Nutrition",
              },
              {
                name: "Dr. Michael Chen",
                role: "AI Research Director",
                specialty: "Machine Learning & Health Informatics",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-rose-100 text-center"
              >
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-lavender-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-xl font-bold">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <CardTitle className="text-rose-900">{member.name}</CardTitle>
                  <CardDescription className="text-rose-600">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-rose-700">{member.specialty}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-rose-900 mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-rose-700 mb-8">
            Join thousands of mothers who trust NutriCare for their nutritional
            guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 px-8 py-3 text-lg"
            >
              Get Started Today
            </Button>
            <Link to="/chatbot">
              <Button
                variant="outline"
                className="border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-3 text-lg"
              >
                Try AI Nutritionist
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rose-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
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
                  <Link to="/" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors"
                  >
                    Get Started
                  </Link>
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
