# ML Integration Endpoints (Manual Report Data)

Base URL prefix: `/api/health`

Authentication: Bearer JWT required for all endpoints.

## Create Manual Health Entry
- Method: POST
- URL: `/api/health/entries`
- Body (JSON): ManualHealthEntry fields subset
```
{
  "entryDate": "2025-08-27",
  "age": 28,
  "height": 165,
  "weight": 65,
  "bmi": 23.9,
  "trimester": 2,
  "hemoglobinLevel": 11.5,
  "bloodSugar": 90,
  "bloodPressure": { "systolic": 110, "diastolic": 70 },
  "medicalHistory": ["diabetes"],
  "vitaminD": 30,
  "vitaminB12": 400,
  "calcium": 9.2,
  "dietPreference": "vegetarian",
  "foodAllergies": ["nuts"],
  "religiousCulturalRestrictions": ["jain"],
  "activityLevel": "moderate",
  "sleepHours": 7,
  "waterIntake": 2.5,
  "isMultiple": false,
  "isHighRisk": false,
  "currentSupplements": ["folic acid", "iron"],
  "notes": "Sample notes"
}
```
- Response: created HealthEntry document

## Get User Entries
- Method: GET
- URL: `/api/health/entries`
- Response: array of HealthEntry

## Get Entry by ID
- Method: GET
- URL: `/api/health/entries/:id`

## Update Entry
- Method: PUT
- URL: `/api/health/entries/:id`
- Body: partial HealthEntry

## Delete Entry
- Method: DELETE
- URL: `/api/health/entries/:id`

## Health Summary
- Method: GET
- URL: `/api/health/summary/:userId`
- Response: simple summary { count, latest }

---

# Plan Endpoints (for ML generated plans)

Base URL prefix: `/api/plans`

## Generate Plan (to be wired with ML model later)
- Method: POST
- URL: `/api/plans/generate`
- Body:
```
{
  "healthEntryId": "<id>",
  "mockPlan": {
    "overallScore": 78,
    "nutritionalInsights": { "strengths": [], "concerns": [], "priorities": [] },
    "weeklyMealPlan": { /* structured plan */ },
    "recommendations": [],
    "supplements": [],
    "restrictions": []
  }
}
```
- Response: created Plan document

## List Plans
- Method: GET
- URL: `/api/plans`

## Get Plan by ID
- Method: GET
- URL: `/api/plans/:id`

## Update Plan
- Method: PUT
- URL: `/api/plans/:id`

## Delete Plan
- Method: DELETE
- URL: `/api/plans/:id`

---

# Uploads (Cloudinary)

Base URL prefix: `/api/uploads`

## Upload Image
- Method: POST
- URL: `/api/uploads/image`
- Body:
```
{ "file": "data:image/png;base64,....", "folder": "nutricare" }
```
- Response:
```
{ "url": "https://...", "publicId": "nutricare/...." }
```