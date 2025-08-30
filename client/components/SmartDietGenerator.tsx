import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sparkles,
  FileText,
  AlertCircle,
  CheckCircle,
  Upload,
  Brain,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SmartDietGeneratorProps {
  hasReports?: boolean;
  reportData?: any;
}

export function SmartDietGenerator({
  hasReports = false,
  reportData,
}: SmartDietGeneratorProps) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const generationSteps = [
    "Analyzing your health profile...",
    "Processing blood test results...",
    "Calculating nutritional requirements...",
    "Optimizing for pregnancy/lactation needs...",
    "Generating personalized meal plans...",
    "Adding variety and preferences...",
    "Finalizing your nutrition plan...",
  ];

  const handleGenerate = async () => {
    if (!hasReports) {
      toast.error(
        "Please upload your health reports first for accurate recommendations",
      );
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate AI generation process
    for (let i = 0; i < generationSteps.length; i++) {
      setTimeout(() => {
        setGenerationStep(i + 1);
        if (i < generationSteps.length - 1) {
          toast.info(generationSteps[i]);
        }
      }, i * 800);
    }

    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Your personalized diet plan is ready!");
      // Here you would normally navigate to the results or update state
    }, generationSteps.length * 800);
  };

  return (
    <div className="space-y-6">
      {/* Status Check */}
      <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center text-rose-900">
            <TrendingUp className="h-5 w-5 mr-2" />
            Diet Plan Requirements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Report Status */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hasReports
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {hasReports ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-rose-900">
                    Health Reports
                  </h4>
                  <p className="text-sm text-rose-600">
                    {hasReports
                      ? "Blood test analysis available"
                      : "Upload your latest blood test results"}
                  </p>
                </div>
              </div>
              {hasReports ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <Link to="/dashboard?tab=reports">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Reports
                  </Button>
                </Link>
              )}
            </div>

            {/* Profile Status */}
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-rose-900">
                    Profile Complete
                  </h4>
                  <p className="text-sm text-rose-600">
                    {user?.role === "pregnant"
                      ? "Pregnancy profile set up"
                      : "Lactation profile set up"}
                  </p>
                </div>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>

          {/* Warning for missing reports */}
          {!hasReports && (
            <Alert className="mt-4 border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Important:</strong> For the most accurate and
                personalized diet plan, please upload your recent blood test
                results. This helps our AI analyze your specific nutritional
                needs and deficiencies.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Generation Interface */}
      <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-lavender-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl text-rose-900">
            AI-Powered Diet Plan Generation
          </CardTitle>
          <CardDescription className="text-rose-600 text-lg">
            {hasReports
              ? "Ready to create your personalized nutrition plan based on your health data"
              : "Basic diet plan generation (enhanced recommendations available with health reports)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-rose-900 mb-2">
                  Creating Your Perfect Diet Plan
                </h3>
                <p className="text-rose-600 mb-4">
                  {generationStep < generationSteps.length
                    ? generationSteps[generationStep]
                    : "Finalizing..."}
                </p>
                <Progress
                  value={(generationStep / generationSteps.length) * 100}
                  className="h-3"
                />
                <p className="text-sm text-rose-500 mt-2">
                  {Math.round((generationStep / generationSteps.length) * 100)}%
                  Complete
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              {hasReports && reportData && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Your Health Data Will Include:
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm text-green-800">
                    <div>• Iron levels analysis</div>
                    <div>• Vitamin D status</div>
                    <div>• Calcium requirements</div>
                    <div>• Folate optimization</div>
                    <div>• Protein needs</div>
                    <div>• Overall nutritional gaps</div>
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                className={`w-full py-4 text-lg font-semibold ${
                  hasReports
                    ? "bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
                    : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
                }`}
              >
                <Sparkles className="h-5 w-5 mr-2" />
                {hasReports
                  ? "Generate Personalized Diet Plan"
                  : "Generate Basic Diet Plan"}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>

              <p className="text-sm text-rose-600">
                {hasReports
                  ? "This will create a comprehensive plan based on your blood test results and health profile"
                  : "Upload health reports for more accurate and personalized recommendations"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">
                  Need to Upload Reports?
                </h4>
                <p className="text-sm text-blue-700">
                  Get more accurate recommendations
                </p>
              </div>
            </div>
            <Link to="/dashboard?tab=reports" className="block mt-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Upload Blood Test Results
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-purple-600" />
              <div>
                <h4 className="font-semibold text-purple-900">
                  Have Questions?
                </h4>
                <p className="text-sm text-purple-700">
                  Ask our AI nutritionist
                </p>
              </div>
            </div>
            <Link to="/chatbot" className="block mt-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Chat with AI Nutritionist
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
