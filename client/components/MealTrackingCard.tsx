import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Apple } from "lucide-react";
import { API_BASE } from "@/lib/api";
import { toast } from "sonner";

interface MealTrackingCardProps {
  planId: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  mealName: string;
  calories: number;
  nutrients: string[];
  isCompleted?: boolean;
  onMealCompleted?: () => void;
}

export function MealTrackingCard({
  planId,
  mealType,
  mealName,
  calories,
  nutrients,
  isCompleted = false,
  onMealCompleted
}: MealTrackingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleMarkCompleted = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error("Please log in to track meals");
        return;
      }

      const response = await fetch(`${API_BASE}/analytics/meals/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          mealType,
          mealName,
          date: new Date().toISOString().split('T')[0],
          notes: "Marked as completed from dashboard",
          caloriesConsumed: calories
        }),
      });

      if (response.ok) {
        toast.success(`${mealType} marked as completed!`);
        onMealCompleted?.();
      } else {
        const error = await response.json();
        toast.error(error.error?.message || "Failed to mark meal as completed");
      }
    } catch (error) {
      console.error("Error marking meal as completed:", error);
      toast.error("Failed to mark meal as completed");
    } finally {
      setLoading(false);
    }
  };

  const getMealIcon = () => {
    switch (mealType) {
      case "breakfast":
        return "🌅";
      case "lunch":
        return "🍽️";
      case "dinner":
        return "🍴";
      case "snack":
        return "🍎";
      default:
        return "🍽️";
    }
  };

  const getMealColor = () => {
    switch (mealType) {
      case "breakfast":
        return "bg-orange-50 border-orange-200";
      case "lunch":
        return "bg-blue-50 border-blue-200";
      case "dinner":
        return "bg-purple-50 border-purple-200";
      case "snack":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  return (
    <Card className={`${getMealColor()} transition-all duration-300 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center">
            <span className="mr-2">{getMealIcon()}</span>
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </CardTitle>
          {isCompleted && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Check className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-900">{mealName}</h4>
          <p className="text-sm text-gray-600">{calories} calories</p>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {nutrients.map((nutrient, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {nutrient}
            </Badge>
          ))}
        </div>

        {!isCompleted && (
          <Button
            onClick={handleMarkCompleted}
            disabled={loading}
            size="sm"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? (
              <Clock className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Mark as Completed
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
