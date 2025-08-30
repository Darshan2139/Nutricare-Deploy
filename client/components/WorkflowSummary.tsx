import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Brain,
  TrendingUp,
  Apple,
  Download,
  Share,
  Calendar,
  Users,
  Shield,
  Zap,
} from "lucide-react";

export function WorkflowSummary() {
  const features = [
    {
      icon: FileText,
      title: "Smart Document Processing",
      description:
        "AI-powered extraction of key health markers from your reports",
      color: "bg-blue-100 text-blue-800",
    },
    {
      icon: Brain,
      title: "Advanced Analysis",
      description: "Machine learning algorithms analyze your nutritional needs",
      color: "bg-purple-100 text-purple-800",
    },
    {
      icon: TrendingUp,
      title: "Health Insights",
      description: "Comprehensive breakdown of your health status and risks",
      color: "bg-green-100 text-green-800",
    },
    {
      icon: Apple,
      title: "Personalized Plans",
      description: "Custom diet plans tailored to your specific requirements",
      color: "bg-rose-100 text-rose-800",
    },
  ];

  const benefits = [
    {
      icon: Calendar,
      title: "Weekly Updates",
      description: "Regular plan updates based on your progress",
    },
    {
      icon: Download,
      title: "Downloadable Reports",
      description: "PDF and JSON formats for easy sharing",
    },
    {
      icon: Share,
      title: "Share with Doctors",
      description: "Easy sharing with your healthcare team",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your health data is secure and private",
    },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      {/* How It Works */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-900">
            <Zap className="h-5 w-5 mr-2" />
            How Our AI Analysis Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-blue-700">{feature.description}</p>
                </div>
                <Badge className={feature.color}>{index + 1}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-green-900">
            <Users className="h-5 w-5 mr-2" />
            Benefits & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <benefit.icon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 mb-1">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-green-700">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
