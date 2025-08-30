import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Brain,
  FileText,
  Apple,
  CheckCircle,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "pending" | "active" | "completed";
  estimatedTime: string;
}

interface ProcessGuideProps {
  currentStep: number;
}

export function ProcessGuide({ currentStep }: ProcessGuideProps) {
  const steps: Step[] = [
    {
      id: 1,
      title: "Upload Report",
      description: "Upload your blood test or medical report",
      icon: Upload,
      status:
        currentStep > 1
          ? "completed"
          : currentStep === 1
            ? "active"
            : "pending",
      estimatedTime: "30 seconds",
    },
    {
      id: 2,
      title: "AI Analysis",
      description: "Our AI analyzes your data for nutritional insights",
      icon: Brain,
      status:
        currentStep > 2
          ? "completed"
          : currentStep === 2
            ? "active"
            : "pending",
      estimatedTime: "2-3 minutes",
    },
    {
      id: 3,
      title: "Health Report",
      description: "Receive detailed analysis of your health markers",
      icon: FileText,
      status:
        currentStep > 3
          ? "completed"
          : currentStep === 3
            ? "active"
            : "pending",
      estimatedTime: "Instant",
    },
    {
      id: 4,
      title: "Diet Plan",
      description: "Get your personalized nutrition plan",
      icon: Apple,
      status:
        currentStep > 4
          ? "completed"
          : currentStep === 4
            ? "active"
            : "pending",
      estimatedTime: "Instant",
    },
  ];

  const getStepColor = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500";
      case "active":
        return "bg-rose-500 text-white border-rose-500";
      case "pending":
        return "bg-gray-100 text-gray-400 border-gray-200";
    }
  };

  const getStepBg = (status: Step["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "active":
        return "bg-rose-50 border-rose-200";
      case "pending":
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-rose-900">
          <Zap className="h-5 w-5 mr-2" />
          Analysis Process
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-8 left-8 right-8 h-0.5 bg-gray-200">
            <div
              className="h-full bg-rose-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step Card */}
                <div
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${getStepBg(step.status)}`}
                >
                  {/* Step Number/Icon */}
                  <div className="flex items-center justify-center mb-3">
                    <div
                      className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepColor(step.status)}`}
                    >
                      {step.status === "completed" ? (
                        <CheckCircle className="h-8 w-8" />
                      ) : step.status === "active" ? (
                        <step.icon className="h-8 w-8 animate-pulse" />
                      ) : (
                        <step.icon className="h-8 w-8" />
                      )}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="text-center">
                    <h3
                      className={`font-semibold mb-2 ${
                        step.status === "active"
                          ? "text-rose-900"
                          : step.status === "completed"
                            ? "text-green-900"
                            : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        step.status === "active"
                          ? "text-rose-700"
                          : step.status === "completed"
                            ? "text-green-700"
                            : "text-gray-400"
                      }`}
                    >
                      {step.description}
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          step.status === "active"
                            ? "border-rose-300 text-rose-700"
                            : step.status === "completed"
                              ? "border-green-300 text-green-700"
                              : "border-gray-300 text-gray-500"
                        }`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {step.estimatedTime}
                      </Badge>
                    </div>
                  </div>

                  {/* Status Indicator */}
                  {step.status === "active" && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-4 h-4 bg-rose-500 rounded-full animate-ping"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-rose-500 rounded-full"></div>
                    </div>
                  )}
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-2 z-10">
                    <ArrowRight
                      className={`h-6 w-6 ${
                        currentStep > step.id
                          ? "text-rose-500"
                          : "text-gray-300"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
