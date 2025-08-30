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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  FileText,
  Brain,
  Sparkles,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  RefreshCw,
  Zap,
  Target,
  Heart,
  Apple,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ProcessGuide } from "./ProcessGuide";
import { WorkflowSummary } from "./WorkflowSummary";

interface AnalysisResult {
  id: string;
  fileName: string;
  uploadedAt: string;
  status: "analyzing" | "completed" | "error";
  analysisData?: {
    bloodMarkers: {
      name: string;
      value: number;
      unit: string;
      status: "normal" | "low" | "high" | "critical";
      normalRange: string;
    }[];
    nutritionalInsights: {
      deficiencies: string[];
      excesses: string[];
      recommendations: string[];
    };
    riskFactors: string[];
    overallScore: number;
  };
  generatedDietPlan?: {
    focus: string[];
    restrictions: string[];
    keyNutrients: string[];
    mealSuggestions: string[];
  };
}

export function ReportAnalysisFlow() {
  const { user } = useAuth();
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(
    null,
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFileUpload = async (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    setIsUploading(true);
    setUploadProgress(0);
    setCurrentStep(1);

    // Simulate file upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(uploadInterval);
      setIsUploading(false);
      setUploadProgress(100);
      setCurrentStep(2);
      startAnalysis(file);
    }, 2500);
  };

  const startAnalysis = async (file: File) => {
    setIsAnalyzing(true);
    setCurrentStep(2);

    const newAnalysis: AnalysisResult = {
      id: Date.now().toString(),
      fileName: file.name,
      uploadedAt: new Date().toISOString(),
      status: "analyzing",
    };

    setCurrentAnalysis(newAnalysis);
    setAnalysisResults((prev) => [...prev, newAnalysis]);

    // Simulate analysis progress
    setTimeout(() => {
      setCurrentStep(3);
    }, 2000);

    setTimeout(() => {
      const completedAnalysis: AnalysisResult = {
        ...newAnalysis,
        status: "completed",
        analysisData: {
          bloodMarkers: [
            {
              name: "Hemoglobin",
              value: 10.5,
              unit: "g/dL",
              status: "low",
              normalRange: "12.0-15.5 g/dL",
            },
            {
              name: "Iron",
              value: 45,
              unit: "μg/dL",
              status: "low",
              normalRange: "60-170 μg/dL",
            },
            {
              name: "Vitamin D",
              value: 18,
              unit: "ng/mL",
              status: "low",
              normalRange: "30-100 ng/mL",
            },
            {
              name: "Calcium",
              value: 9.8,
              unit: "mg/dL",
              status: "normal",
              normalRange: "8.5-10.5 mg/dL",
            },
            {
              name: "Folate",
              value: 3.2,
              unit: "ng/mL",
              status: "low",
              normalRange: "4.0-20.0 ng/mL",
            },
            {
              name: "B12",
              value: 890,
              unit: "pg/mL",
              status: "normal",
              normalRange: "200-900 pg/mL",
            },
          ],
          nutritionalInsights: {
            deficiencies: [
              "Iron deficiency indicating potential anemia",
              "Vitamin D insufficiency affecting bone health",
              "Low folate levels critical for pregnancy",
              "Hemoglobin below normal range",
            ],
            excesses: [],
            recommendations: [
              "Increase iron-rich foods (spinach, lean meat, legumes)",
              "Add vitamin D sources or consider supplementation",
              "Include folate-rich foods (leafy greens, citrus fruits)",
              "Consider prenatal vitamins with iron and folate",
            ],
          },
          riskFactors: [
            "Anemia risk due to low iron and hemoglobin",
            "Bone health concerns from vitamin D deficiency",
            "Neural tube defect risk from low folate",
          ],
          overallScore: 65,
        },
        generatedDietPlan: {
          focus: [
            "Iron-rich foods",
            "Vitamin D sources",
            "Folate enhancement",
            "Protein optimization",
          ],
          restrictions: ["Limit caffeine with iron-rich meals"],
          keyNutrients: ["Iron", "Folate", "Vitamin D", "Vitamin C", "Protein"],
          mealSuggestions: [
            "Spinach and iron-fortified cereal for breakfast",
            "Lean meat with vitamin C-rich vegetables",
            "Salmon with leafy greens",
            "Legume-based protein sources",
          ],
        },
      };

      setCurrentAnalysis(completedAnalysis);
      setAnalysisResults((prev) =>
        prev.map((item) =>
          item.id === newAnalysis.id ? completedAnalysis : item,
        ),
      );
      setIsAnalyzing(false);
      setCurrentStep(4);
      toast.success("Report analysis completed!");
    }, 4000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4" />;
      case "low":
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "critical":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Upload Section - Fixed Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Area - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-rose-50 to-lavender-50 border-rose-200 shadow-xl h-full">
            <CardHeader className="bg-gradient-to-r from-rose-500 to-lavender-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <Heart className="h-6 w-6 mr-3" />
                Blood Test Analysis
              </CardTitle>
              <CardDescription className="text-rose-100">
                Upload your blood test reports for AI-powered nutritional
                insights and personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {!isUploading && !isAnalyzing ? (
                <div className="space-y-6">
                  {/* Quick Upload Buttons */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="h-24 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-center">
                        <Heart className="h-8 w-8 mx-auto mb-2" />
                        <div className="font-semibold">Blood Test</div>
                        <div className="text-xs opacity-90">
                          CBC, Iron, Vitamins
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="h-24 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2" />
                        <div className="font-semibold">Medical Records</div>
                        <div className="text-xs opacity-90">
                          Reports, Prescriptions
                        </div>
                      </div>
                    </Button>

                    <Button
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="h-24 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                        <div className="font-semibold">Ultrasound</div>
                        <div className="text-xs opacity-90">
                          Pregnancy Progress
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Main Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      isDragOver
                        ? "border-rose-400 bg-rose-50 scale-105"
                        : "border-rose-300 hover:border-rose-400 hover:bg-rose-50/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-lavender-500 rounded-full flex items-center justify-center shadow-lg">
                        <Upload className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-rose-900 mb-2">
                          Drop Your Files Here
                        </h3>
                        <p className="text-rose-600 mb-4 max-w-md mx-auto">
                          Drag and drop your health reports, or use the quick
                          upload buttons above
                        </p>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) =>
                            e.target.files && handleFileUpload(e.target.files)
                          }
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="inline-block">
                          <Button
                            type="button"
                            className="bg-gradient-to-r from-rose-500 to-lavender-500 hover:from-rose-600 hover:to-lavender-600 text-white px-8 py-3 text-lg shadow-lg"
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                          >
                            <Upload className="h-5 w-5 mr-2" />
                            Browse Files
                          </Button>
                        </label>
                        <p className="text-sm text-rose-500 mt-3">
                          Supports PDF, JPG, PNG, DOC formats • Max 10MB •
                          Secure & Private
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isUploading && (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                        <Upload className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-rose-900">
                          Uploading Report...
                        </h3>
                        <Progress value={uploadProgress} className="mt-2" />
                        <p className="text-sm text-rose-600 mt-1">
                          {uploadProgress}% complete
                        </p>
                      </div>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="h-8 w-8 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-rose-900">
                          AI Analysis in Progress...
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mt-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <p className="text-sm text-rose-600 mt-2">
                          Our AI is analyzing your report and extracting
                          nutritional insights...
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports Sidebar - Takes 1 column */}
        <div className="lg:col-span-1">
          <Card className="bg-white/90 border-rose-100 shadow-lg h-full">
            <CardHeader>
              <CardTitle className="flex items-center text-rose-900 text-lg">
                <FileText className="h-5 w-5 mr-2" />
                Recent Reports
              </CardTitle>
              <CardDescription className="text-rose-600">
                Your latest uploads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisResults.length > 0 ? (
                analysisResults
                  .slice(-3)
                  .reverse()
                  .map((result) => (
                    <div
                      key={result.id}
                      className="p-3 bg-gradient-to-r from-rose-50 to-peach-50 rounded-lg border border-rose-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-rose-900 text-sm truncate">
                            {result.fileName}
                          </h4>
                          <p className="text-xs text-rose-600">
                            {new Date(result.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge
                          className={`text-xs ${
                            result.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : result.status === "analyzing"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.status === "completed" && (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          {result.status}
                        </Badge>
                        {result.status === "completed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs"
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload className="h-8 w-8 text-rose-400" />
                  </div>
                  <p className="text-rose-600 text-sm">
                    No reports uploaded yet
                  </p>
                  <p className="text-rose-500 text-xs">
                    Upload your first blood test to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Process Guide - Moved below upload */}
      <ProcessGuide currentStep={currentStep} />

      {/* Workflow Summary - shown when no analysis exists */}
      {analysisResults.length === 0 && !currentAnalysis && <WorkflowSummary />}

      {/* Analysis Results */}
      {currentAnalysis?.status === "completed" &&
        currentAnalysis.analysisData && (
          <div className="space-y-6">
            {/* Overall Health Score */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-900">
                  <Zap className="h-5 w-5 mr-2" />
                  Overall Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-4xl font-bold text-purple-900 mb-2">
                      {currentAnalysis.analysisData.overallScore}/100
                    </div>
                    <p className="text-purple-700">
                      Based on your blood test analysis
                    </p>
                  </div>
                  <div className="w-24 h-24 relative">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-purple-200"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(currentAnalysis.analysisData.overallScore * 251) / 100} 251`}
                        className="text-purple-600"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-900">
                        {currentAnalysis.analysisData.overallScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Blood Markers Analysis */}
            <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-rose-900">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Blood Markers Analysis
                </CardTitle>
                <CardDescription className="text-rose-600">
                  Detailed breakdown of your blood test results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentAnalysis.analysisData.bloodMarkers.map(
                    (marker, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-rose-100 bg-rose-50/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-rose-900">
                            {marker.name}
                          </h4>
                          <Badge
                            className={`${getStatusColor(marker.status)} border`}
                          >
                            {getStatusIcon(marker.status)}
                            <span className="ml-1 capitalize">
                              {marker.status}
                            </span>
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-rose-800">
                            {marker.value} {marker.unit}
                          </p>
                          <p className="text-sm text-rose-600">
                            Normal: {marker.normalRange}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Nutritional Insights */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-900">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Key Deficiencies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentAnalysis.analysisData.nutritionalInsights.deficiencies.map(
                      (deficiency, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg"
                        >
                          <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                          <p className="text-orange-800 text-sm">
                            {deficiency}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <Target className="h-5 w-5 mr-2" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentAnalysis.analysisData.nutritionalInsights.recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                          <p className="text-green-800 text-sm">
                            {recommendation}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generated Diet Plan Preview */}
            {currentAnalysis.generatedDietPlan && (
              <Card className="bg-gradient-to-br from-rose-50 to-lavender-50 border-rose-200 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-rose-900">
                    <span className="flex items-center">
                      <Apple className="h-5 w-5 mr-2" />
                      Personalized Diet Plan Generated
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-rose-500 hover:bg-rose-600"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Plan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-rose-300 text-rose-700"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription className="text-rose-600">
                    AI-generated nutrition plan based on your blood test
                    analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-rose-900 mb-2 flex items-center">
                          <Heart className="h-4 w-4 mr-2" />
                          Focus Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.generatedDietPlan.focus.map(
                            (focus, index) => (
                              <Badge
                                key={index}
                                className="bg-rose-100 text-rose-800 border-rose-200"
                              >
                                {focus}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-rose-900 mb-2 flex items-center">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Key Nutrients
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentAnalysis.generatedDietPlan.keyNutrients.map(
                            (nutrient, index) => (
                              <Badge
                                key={index}
                                className="bg-lavender-100 text-lavender-800 border-lavender-200"
                              >
                                {nutrient}
                              </Badge>
                            ),
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-rose-900 mb-2 flex items-center">
                        <Apple className="h-4 w-4 mr-2" />
                        Meal Suggestions
                      </h4>
                      <div className="space-y-2">
                        {currentAnalysis.generatedDietPlan.mealSuggestions.map(
                          (suggestion, index) => (
                            <div
                              key={index}
                              className="p-3 bg-white/70 rounded-lg border border-rose-100"
                            >
                              <p className="text-rose-800 text-sm">
                                {suggestion}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="text-center">
                    <Button className="bg-gradient-to-r from-rose-500 to-lavender-500 hover:from-rose-600 hover:to-lavender-600 text-white px-8 py-3 text-lg">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Complete 7-Day Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
    </div>
  );
}
