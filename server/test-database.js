import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nutricare', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User schema (simplified version)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  pregnancyInfo: {
    dueDate: String,
    gestationAge: Number,
    trimester: Number,
    isMultiple: Boolean,
    multipleType: String,
    multipleCount: Number,
    complications: [String],
    expectedWeightGain: Number,
    previousPregnancies: {
      count: Number,
      complications: [String],
      outcomes: [String],
    },
    lastCheckupDate: String,
  },
  personalInfo: {
    phone: String,
    address: String,
    dateOfBirth: String,
    emergencyContact: String,
    bio: String,
    height: Number,
    weight: Number,
    activityLevel: String,
    healthGoals: [String],
  },
  medicalHistory: {
    surgeries: [{
      procedure: String,
      date: String,
      complications: String,
    }],
    chronicDiseases: [String],
    allergies: [String],
    currentMedications: [{
      name: String,
      dosage: String,
      frequency: String,
    }],
    bloodType: String,
  },
  foodPreferences: {
    cuisineTypes: [String],
    dietaryRestrictions: [String],
    dietPreference: String,
    foodAllergies: [String],
    religiousCulturalRestrictions: [String],
    dislikedFoods: [String],
  },
  lifestyleInfo: {
    sleepHours: Number,
    waterIntake: Number,
    currentSupplements: [String],
    isHighRisk: Boolean,
  },
  isProfileComplete: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function testDatabase() {
  try {
    console.log('Testing database connection and lastCheckupDate field...');
    
    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users in database`);
    
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log(`- Name: ${user.name}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Role: ${user.role}`);
      console.log(`- Pregnancy Info:`, user.pregnancyInfo);
      console.log(`- Last Checkup Date: ${user.pregnancyInfo?.lastCheckupDate || 'Not set'}`);
      console.log(`- Due Date: ${user.pregnancyInfo?.dueDate || 'Not set'}`);
      console.log(`- Is Profile Complete: ${user.isProfileComplete}`);
    });
    
    // Test updating a user with lastCheckupDate if no users exist
    if (users.length === 0) {
      console.log('\nNo users found. Creating a test user with lastCheckupDate...');
      
      const testUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        role: 'pregnant',
        pregnancyInfo: {
          dueDate: '2024-06-15',
          gestationAge: 20,
          trimester: 2,
          isMultiple: false,
          complications: [],
          expectedWeightGain: 12,
          previousPregnancies: {
            count: 0,
            complications: [],
            outcomes: [],
          },
          lastCheckupDate: '2024-03-10', // This is the field we're testing
        },
        personalInfo: {
          height: 165,
          weight: 65,
          activityLevel: 'moderate',
        },
        isProfileComplete: true,
      });
      
      await testUser.save();
      console.log('Test user created successfully with lastCheckupDate: 2024-03-10');
    }
    
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    mongoose.connection.close();
  }
}

testDatabase();
