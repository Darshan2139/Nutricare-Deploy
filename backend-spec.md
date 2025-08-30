# NutriCare Backend Specification

## Project Overview

**NutriCare** – AI-powered Nutrition Planner for pregnant and lactating mothers

## Tech Stack

- **Backend**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API Type**: REST API
- **Validation**: Joi or express-validator
- **Security**: Helmet, CORS, rate limiting
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── userController.ts
│   │   ├── healthController.ts
│   │   └── planController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   └── rateLimiter.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── HealthEntry.ts
│   │   ├── NutritionPlan.ts
│   │   └── DietPlan.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── health.ts
│   │   └── plans.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── aiService.ts
│   │   └── nutritionService.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── validation.ts
│   │   └── constants.ts
│   ├── config/
│   │   └── database.ts
│   └── app.ts
├── tests/
├── package.json
└── README.md
```

## API Endpoints

### Authentication Routes

| Method | Endpoint                    | Description                | Auth Required |
| ------ | --------------------------- | -------------------------- | ------------- |
| POST   | `/api/auth/register`        | Register new user          | No            |
| POST   | `/api/auth/login`           | Login user and return JWT  | No            |
| POST   | `/api/auth/refresh`         | Refresh JWT token          | Yes           |
| POST   | `/api/auth/logout`          | Logout user                | Yes           |
| GET    | `/api/auth/profile`         | Get logged-in user profile | Yes           |
| PUT    | `/api/auth/change-password` | Change user password       | Yes           |

### User Management Routes

| Method | Endpoint                       | Description                  | Auth Required |
| ------ | ------------------------------ | ---------------------------- | ------------- |
| GET    | `/api/users`                   | Fetch all users (admin only) | Yes (Admin)   |
| GET    | `/api/users/:id`               | Fetch single user            | Yes           |
| PUT    | `/api/users/:id`               | Update user profile          | Yes           |
| DELETE | `/api/users/:id`               | Delete user (admin only)     | Yes (Admin)   |
| PUT    | `/api/users/:id/profile-setup` | Complete profile setup       | Yes           |

### Health Data Routes

| Method | Endpoint                      | Description                 | Auth Required |
| ------ | ----------------------------- | --------------------------- | ------------- |
| POST   | `/api/health/entries`         | Create manual health entry  | Yes           |
| GET    | `/api/health/entries`         | Get user's health entries   | Yes           |
| GET    | `/api/health/entries/:id`     | Get specific health entry   | Yes           |
| PUT    | `/api/health/entries/:id`     | Update health entry         | Yes           |
| DELETE | `/api/health/entries/:id`     | Delete health entry         | Yes           |
| GET    | `/api/health/summary/:userId` | Get health summary for user | Yes           |

### Nutrition Plan Routes

| Method | Endpoint              | Description                | Auth Required |
| ------ | --------------------- | -------------------------- | ------------- |
| POST   | `/api/plans/generate` | Generate AI nutrition plan | Yes           |
| GET    | `/api/plans`          | Get user's nutrition plans | Yes           |
| GET    | `/api/plans/:id`      | Get specific plan details  | Yes           |
| PUT    | `/api/plans/:id`      | Update nutrition plan      | Yes           |
| DELETE | `/api/plans/:id`      | Delete nutrition plan      | Yes           |
| POST   | `/api/plans/:id/sync` | Sync plan to dashboard     | Yes           |

### Meal Tracking Routes

| Method | Endpoint                  | Description            | Auth Required |
| ------ | ------------------------- | ---------------------- | ------------- |
| POST   | `/api/meals/log`          | Log meal consumption   | Yes           |
| GET    | `/api/meals/today`        | Get today's meals      | Yes           |
| GET    | `/api/meals/history`      | Get meal history       | Yes           |
| PUT    | `/api/meals/:id/complete` | Mark meal as completed | Yes           |

## Database Models

### User Model

```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string; // hashed
  role: "pregnant" | "lactating";
  age: number;
  profilePhoto?: string;

  // Profile Setup Data
  personalInfo: {
    height: number; // cm
    weight: number; // kg
    activityLevel:
      | "sedentary"
      | "light"
      | "moderate"
      | "active"
      | "very_active";
    healthGoals: string[];
  };

  pregnancyInfo: {
    dueDate?: string;
    gestationAge?: number;
    trimester?: 1 | 2 | 3;
    isMultiple: boolean;
    multipleType?: "twins" | "triplets" | "other";
    multipleCount?: number;
    complications?: string;
    expectedWeightGain?: number;
    previousPregnancies?: string;
  };

  lactationInfo?: {
    babyAge: number; // months
    feedingType: "exclusive" | "combination" | "pumping";
    concerns?: string;
  };

  medicalHistory: {
    surgeries?: string;
    chronicDiseases: string[];
    allergies?: string;
    currentMedications?: string;
    bloodPressure?: string;
    bloodType?: string;
  };

  foodPreferences: {
    cuisineTypes: string[];
    dietaryRestrictions: string[];
    dietPreference: "vegetarian" | "non-vegetarian" | "vegan";
    foodAllergies: string[];
    religiousCulturalRestrictions: string[];
    dislikedFoods?: string;
  };

  lifestyleInfo: {
    sleepHours: number;
    waterIntake: number; // liters
    currentSupplements: string[];
    isHighRisk: boolean;
  };

  isProfileComplete: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Health Entry Model

```typescript
interface IHealthEntry {
  _id: ObjectId;
  userId: ObjectId;
  entryDate: Date;

  // Basic Demographics
  age: number;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  trimester?: 1 | 2 | 3;

  // Medical Information
  hemoglobinLevel?: number; // g/dL
  bloodSugar?: number; // mg/dL
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  medicalHistory: string[];

  // Nutrition-related Lab Values
  vitaminD?: number; // ng/mL
  vitaminB12?: number; // pg/mL
  vitaminA?: number; // mg/L
  vitaminC?: number; // mg/dL
  calcium?: number; // mg/dL
  ironLevels?: {
    serumFerritin?: number;
    hemoglobin?: number;
  };

  // Dietary Preferences
  dietPreference: string;
  foodAllergies: string[];
  religiousCulturalRestrictions: string[];

  // Lifestyle & Habits
  activityLevel: string;
  sleepHours: number;
  waterIntake: number;

  // Special Conditions
  isMultiple: boolean;
  multipleType?: string;
  isHighRisk: boolean;
  currentSupplements: string[];

  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Nutrition Plan Model

```typescript
interface INutritionPlan {
  _id: ObjectId;
  userId: ObjectId;
  healthEntryId: ObjectId;

  planType: "ai_generated" | "custom";
  status: "active" | "completed" | "archived";

  // AI Analysis Results
  overallScore: number; // 0-100
  analysisDate: Date;

  recommendations: string[];

  nutritionalInsights: {
    strengths: string[];
    concerns: string[];
    priorities: string[];
  };

  // Weekly Meal Plan
  weeklyMealPlan: {
    [day: string]: {
      breakfast?: {
        name: string;
        calories: number;
        nutrients: string[];
        ingredients?: string[];
        instructions?: string;
      };
      lunch?: {
        name: string;
        calories: number;
        nutrients: string[];
        ingredients?: string[];
        instructions?: string;
      };
      dinner?: {
        name: string;
        calories: number;
        nutrients: string[];
        ingredients?: string[];
        instructions?: string;
      };
      snacks?: Array<{
        name: string;
        calories: number;
        nutrients: string[];
        time: string;
      }>;
    };
  };

  // Supplements & Restrictions
  supplements: string[];
  restrictions: string[];

  // Nutritional Goals
  dailyTargets: {
    calories: number;
    protein: number; // grams
    iron: number; // mg
    calcium: number; // mg
    folate: number; // mcg
    vitaminD: number; // IU
  };

  validFrom: Date;
  validTo: Date;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}
```

### Meal Log Model

```typescript
interface IMealLog {
  _id: ObjectId;
  userId: ObjectId;
  planId?: ObjectId;

  date: Date;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  mealName: string;

  calories: number;
  nutrients: string[];

  completedAt?: Date;
  isCompleted: boolean;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

## Middleware

### Authentication Middleware

```typescript
// Verify JWT token and attach user to request
export const authenticateToken = (req: Request, res: Response, next: NextFunction)

// Check if user has admin role
export const requireAdmin = (req: Request, res: Response, next: NextFunction)

// Check if user owns the resource or is admin
export const requireOwnershipOrAdmin = (req: Request, res: Response, next: NextFunction)
```

### Validation Middleware

```typescript
// Validate request body using Joi schemas
export const validateBody = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction)

// Validate request parameters
export const validateParams = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction)
```

### Rate Limiting

```typescript
// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Stricter rate limiting for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
});
```

## Error Handling

### Standard Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
  timestamp: string;
  path: string;
}
```

### Common Error Codes

- `AUTH_001`: Invalid credentials
- `AUTH_002`: Token expired
- `AUTH_003`: Access denied
- `VAL_001`: Validation error
- `NOT_FOUND`: Resource not found
- `SERVER_ERROR`: Internal server error

## Security Features

### Data Protection

- Password hashing with bcrypt (minimum 12 rounds)
- JWT tokens with short expiration (15 minutes) + refresh tokens
- Input sanitization and validation
- SQL injection prevention via Mongoose
- XSS protection with helmet

### HIPAA Compliance Considerations

- Encrypt sensitive health data at rest
- Audit logging for all health data access
- Secure data transmission (HTTPS only)
- User consent tracking
- Data retention policies
- Secure user authentication

## API Response Format

### Success Response

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### Error Response

```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}
```

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nutricare
MONGODB_TEST_URI=mongodb://localhost:27017/nutricare_test

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# AI Service (Future Integration)
AI_API_URL=https://your-ai-service.com
AI_API_KEY=your-ai-api-key

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100

# CORS
FRONTEND_URL=http://localhost:5173
```

## Installation & Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (v5+)
- npm or yarn

### Installation Steps

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment variables: `cp .env.example .env`
4. Configure environment variables
5. Start MongoDB service
6. Run database migrations: `npm run migrate`
7. Start development server: `npm run dev`

### Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "migrate": "node scripts/migrate.js",
    "seed": "node scripts/seed.js"
  }
}
```

## Testing Strategy

### Unit Tests

- Model validations
- Utility functions
- Service layer functions

### Integration Tests

- API endpoint testing
- Database operations
- Authentication flows

### Test Coverage

- Minimum 80% code coverage
- Critical paths 100% coverage

## Deployment

### Production Considerations

- Use PM2 for process management
- Configure reverse proxy (nginx)
- Set up SSL certificates
- Configure database clustering
- Set up monitoring and logging
- Configure backup strategies

### Environment-specific Configurations

- Development: Local MongoDB, verbose logging
- Staging: Cloud MongoDB, moderate logging
- Production: Clustered MongoDB, minimal logging, performance monitoring

## Future Enhancements

### AI Integration

- ML model API integration for nutrition analysis
- Real-time health recommendations
- Predictive analytics for health outcomes

### Additional Features

- Push notifications for meal reminders
- Integration with fitness trackers
- Telemedicine integration
- Meal planning with grocery lists
- Social features for community support

## API Documentation

### Generate Documentation

- Use Swagger/OpenAPI for API documentation
- Include request/response examples
- Document all error codes and responses
- Provide authentication examples

This specification provides a comprehensive foundation for building the NutriCare backend that supports all the frontend features while maintaining security, scalability, and HIPAA compliance standards.
