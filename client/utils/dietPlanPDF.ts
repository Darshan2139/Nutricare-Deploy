import jsPDF from 'jspdf';

export interface DietPlanPDFData {
  id: string;
  generatedAt: string;
  overallScore: number;
  recommendations: string[];
  nutritionalInsights: {
    strengths: string[];
    concerns: string[];
    priorities: string[];
  };
  weeklyMealPlan: {
    [day: string]: {
      breakfast?: { name: string; calories: number; nutrients: string[]; ingredients?: string[]; instructions?: string };
      lunch?: { name: string; calories: number; nutrients: string[]; ingredients?: string[]; instructions?: string };
      dinner?: { name: string; calories: number; nutrients: string[]; ingredients?: string[]; instructions?: string };
      snacks?: Array<{ name: string; calories: number; nutrients: string[]; time: string }>;
    };
  };
  supplements: string[];
  restrictions: string[];
  dailyTargets: {
    calories: number;
    protein: number;
    iron: number;
    calcium: number;
    folate: number;
    vitaminD: number;
  };
  healthData?: {
    age?: number;
    height?: number;
    weight?: number;
    trimester?: number;
    dietPreference?: string;
  };
}

export const generateDietPlanPDF = (dietPlan: DietPlanPDFData, fileName: string = 'diet-plan.pdf') => {
  try {
    const doc = new jsPDF();
    
    // Set up fonts and colors
    doc.setFont('helvetica');
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 127); // Rose color
    
    // Header
    doc.text('NutriCare - Personalized Diet Plan', 20, 30);
    
    // Basic info
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date(dietPlan.generatedAt).toLocaleDateString()}`, 20, 45);
    doc.text(`Plan ID: ${dietPlan.id}`, 20, 55);
    
    // Health Score
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 127);
    doc.text(`Overall Health Score: ${dietPlan.overallScore}/100`, 20, 75);
    
    // Health Data Summary
    if (dietPlan.healthData) {
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Health Profile:', 20, 90);
      doc.setFontSize(10);
      doc.text(`Age: ${dietPlan.healthData.age} years`, 25, 100);
      doc.text(`Height: ${dietPlan.healthData.height} cm`, 25, 107);
      doc.text(`Weight: ${dietPlan.healthData.weight} kg`, 25, 114);
      doc.text(`Pregnancy Stage: ${dietPlan.healthData.trimester} trimester`, 25, 121);
      doc.text(`Diet Preference: ${dietPlan.healthData.dietPreference}`, 25, 128);
    }
    
    // Recommendations
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 127);
    doc.text('Key Recommendations:', 20, 150);
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    dietPlan.recommendations.forEach((rec, index) => {
      doc.text(`• ${rec}`, 25, 160 + (index * 7));
    });
    
    // Nutritional Insights
    let yPos = 150 + (dietPlan.recommendations.length * 7) + 20;
    
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 127);
    doc.text('Nutritional Analysis:', 20, yPos);
    yPos += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94); // Green
    doc.text('Strengths:', 25, yPos);
    yPos += 7;
    dietPlan.nutritionalInsights.strengths.forEach((strength, index) => {
      doc.text(`• ${strength}`, 30, yPos + (index * 5));
    });
    yPos += dietPlan.nutritionalInsights.strengths.length * 5 + 10;
    
    doc.setTextColor(239, 68, 68); // Red
    doc.text('Concerns:', 25, yPos);
    yPos += 7;
    dietPlan.nutritionalInsights.concerns.forEach((concern, index) => {
      doc.text(`• ${concern}`, 30, yPos + (index * 5));
    });
    yPos += dietPlan.nutritionalInsights.concerns.length * 5 + 10;
    
    doc.setTextColor(59, 130, 246); // Blue
    doc.text('Priorities:', 25, yPos);
    yPos += 7;
    dietPlan.nutritionalInsights.priorities.forEach((priority, index) => {
      doc.text(`• ${priority}`, 30, yPos + (index * 5));
    });
    yPos += dietPlan.nutritionalInsights.priorities.length * 5 + 15;
    
    // Daily Targets
    doc.setFontSize(14);
    doc.setTextColor(220, 38, 127);
    doc.text('Daily Nutritional Targets:', 20, yPos);
    yPos += 15;
    
    const targets = [
      ['Nutrient', 'Target'],
      ['Calories', `${dietPlan.dailyTargets.calories} kcal`],
      ['Protein', `${dietPlan.dailyTargets.protein}g`],
      ['Iron', `${dietPlan.dailyTargets.iron}mg`],
      ['Calcium', `${dietPlan.dailyTargets.calcium}mg`],
      ['Folate', `${dietPlan.dailyTargets.folate}mcg`],
      ['Vitamin D', `${dietPlan.dailyTargets.vitaminD} IU`]
    ];
    
    // Simple table without autoTable
    targets.forEach((row, rowIndex) => {
      const x = 20;
      const y = yPos + (rowIndex * 8);
      
      if (rowIndex === 0) {
        // Header row
        doc.setFillColor(220, 38, 127);
        doc.rect(x, y - 5, 80, 8, 'F');
        doc.setTextColor(255, 255, 255);
      } else {
        doc.setTextColor(50, 50, 50);
      }
      
      doc.setFontSize(10);
      doc.text(row[0], x + 2, y);
      doc.text(row[1], x + 50, y);
    });
    
    // Add new page for meal plan
    doc.addPage();
    
    // Weekly Meal Plan
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 127);
    doc.text('Weekly Meal Plan', 20, 30);
    
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let dayYPos = 50;
    
    days.forEach((day, dayIndex) => {
      const dayMeals = dietPlan.weeklyMealPlan[day];
      if (!dayMeals) return;
      
      // Check if we need a new page
      if (dayYPos > 250) {
        doc.addPage();
        dayYPos = 30;
      }
      
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 127);
      doc.text(day.charAt(0).toUpperCase() + day.slice(1), 20, dayYPos);
      dayYPos += 10;
      
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      
      if (dayMeals.breakfast) {
        doc.text(`Breakfast: ${dayMeals.breakfast.name}`, 25, dayYPos);
        doc.text(`   Calories: ${dayMeals.breakfast.calories} | Nutrients: ${dayMeals.breakfast.nutrients.join(', ')}`, 30, dayYPos + 5);
        dayYPos += 15;
      }
      
      if (dayMeals.lunch) {
        doc.text(`Lunch: ${dayMeals.lunch.name}`, 25, dayYPos);
        doc.text(`   Calories: ${dayMeals.lunch.calories} | Nutrients: ${dayMeals.lunch.nutrients.join(', ')}`, 30, dayYPos + 5);
        dayYPos += 15;
      }
      
      if (dayMeals.dinner) {
        doc.text(`Dinner: ${dayMeals.dinner.name}`, 25, dayYPos);
        doc.text(`   Calories: ${dayMeals.dinner.calories} | Nutrients: ${dayMeals.dinner.nutrients.join(', ')}`, 30, dayYPos + 5);
        dayYPos += 15;
      }
      
      if (dayMeals.snacks && dayMeals.snacks.length > 0) {
        dayMeals.snacks.forEach((snack, snackIndex) => {
          doc.text(`Snack (${snack.time}): ${snack.name}`, 25, dayYPos);
          doc.text(`   Calories: ${snack.calories} | Nutrients: ${snack.nutrients.join(', ')}`, 30, dayYPos + 5);
          dayYPos += 12;
        });
      }
      
      dayYPos += 10; // Space between days
    });
    
    // Add new page for supplements and restrictions
    doc.addPage();
    
    // Supplements
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 127);
    doc.text('Recommended Supplements:', 20, 30);
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    dietPlan.supplements.forEach((supplement, index) => {
      doc.text(`• ${supplement}`, 25, 45 + (index * 8));
    });
    
    // Restrictions
    doc.setFontSize(16);
    doc.setTextColor(220, 38, 127);
    doc.text('Dietary Restrictions:', 20, 120);
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    dietPlan.restrictions.forEach((restriction, index) => {
      doc.text(`• ${restriction}`, 25, 135 + (index * 8));
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Generated by NutriCare - AI-Powered Nutrition for Maternal Health', 20, 280);
    
    // Save the PDF
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const downloadDietPlan = (dietPlan: DietPlanPDFData) => {
  const fileName = `nutricare-diet-plan-${new Date().toISOString().split('T')[0]}.pdf`;
  return generateDietPlanPDF(dietPlan, fileName);
};

// Alternative simple text download
export const downloadDietPlanAsText = (dietPlan: DietPlanPDFData) => {
  try {
    let content = `NUTRICARE - PERSONALIZED DIET PLAN\n`;
    content += `Generated on: ${new Date(dietPlan.generatedAt).toLocaleDateString()}\n`;
    content += `Plan ID: ${dietPlan.id}\n`;
    content += `Overall Health Score: ${dietPlan.overallScore}/100\n\n`;
    
    if (dietPlan.healthData) {
      content += `HEALTH PROFILE:\n`;
      content += `Age: ${dietPlan.healthData.age} years\n`;
      content += `Height: ${dietPlan.healthData.height} cm\n`;
      content += `Weight: ${dietPlan.healthData.weight} kg\n`;
      content += `Pregnancy Stage: ${dietPlan.healthData.trimester} trimester\n`;
      content += `Diet Preference: ${dietPlan.healthData.dietPreference}\n\n`;
    }
    
    content += `KEY RECOMMENDATIONS:\n`;
    dietPlan.recommendations.forEach((rec, index) => {
      content += `${index + 1}. ${rec}\n`;
    });
    content += `\n`;
    
    content += `NUTRITIONAL INSIGHTS:\n`;
    content += `Strengths:\n`;
    dietPlan.nutritionalInsights.strengths.forEach((strength, index) => {
      content += `  • ${strength}\n`;
    });
    content += `\nConcerns:\n`;
    dietPlan.nutritionalInsights.concerns.forEach((concern, index) => {
      content += `  • ${concern}\n`;
    });
    content += `\nPriorities:\n`;
    dietPlan.nutritionalInsights.priorities.forEach((priority, index) => {
      content += `  • ${priority}\n`;
    });
    content += `\n`;
    
    content += `DAILY NUTRITIONAL TARGETS:\n`;
    content += `Calories: ${dietPlan.dailyTargets.calories} kcal\n`;
    content += `Protein: ${dietPlan.dailyTargets.protein}g\n`;
    content += `Iron: ${dietPlan.dailyTargets.iron}mg\n`;
    content += `Calcium: ${dietPlan.dailyTargets.calcium}mg\n`;
    content += `Folate: ${dietPlan.dailyTargets.folate}mcg\n`;
    content += `Vitamin D: ${dietPlan.dailyTargets.vitaminD} IU\n\n`;
    
    content += `WEEKLY MEAL PLAN:\n`;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    days.forEach((day) => {
      const dayMeals = dietPlan.weeklyMealPlan[day];
      if (dayMeals) {
        content += `\n${day.toUpperCase()}:\n`;
        if (dayMeals.breakfast) {
          content += `  Breakfast: ${dayMeals.breakfast.name} (${dayMeals.breakfast.calories} cal)\n`;
        }
        if (dayMeals.lunch) {
          content += `  Lunch: ${dayMeals.lunch.name} (${dayMeals.lunch.calories} cal)\n`;
        }
        if (dayMeals.dinner) {
          content += `  Dinner: ${dayMeals.dinner.name} (${dayMeals.dinner.calories} cal)\n`;
        }
        if (dayMeals.snacks) {
          dayMeals.snacks.forEach((snack) => {
            content += `  Snack (${snack.time}): ${snack.name} (${snack.calories} cal)\n`;
          });
        }
      }
    });
    
    content += `\nRECOMMENDED SUPPLEMENTS:\n`;
    dietPlan.supplements.forEach((supplement, index) => {
      content += `  • ${supplement}\n`;
    });
    
    content += `\nDIETARY RESTRICTIONS:\n`;
    dietPlan.restrictions.forEach((restriction, index) => {
      content += `  • ${restriction}\n`;
    });
    
    content += `\nGenerated by NutriCare - AI-Powered Nutrition for Maternal Health`;
    
    // Create and download text file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutricare-diet-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading text file:', error);
    return false;
  }
};
