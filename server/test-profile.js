import axios from 'axios';
const mongoose = require('mongoose');

const API_BASE = 'http://localhost:8080/api';

// Test data
const testUser = {
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
  role: 'pregnant'
};

let authToken = '';

async function testProfileAPI() {
  console.log('🧪 Testing Profile API...\n');

  try {
    // 1. Register a test user
    console.log('1. Registering test user...');
    const registerResponse = await axios.post(`${API_BASE}/auth/register`, testUser);
    console.log('✅ Registration successful');
    authToken = registerResponse.data.token;

    // 2. Get user profile
    console.log('\n2. Getting user profile...');
    const profileResponse = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.name);

    // 3. Update profile
    console.log('\n3. Updating profile...');
    const updateData = {
      name: 'Updated Test User',
      personalInfo: {
        phone: '+91 98765 43210',
        address: '123 Test Street, Test City',
        dateOfBirth: '1990-01-01',
        emergencyContact: 'Emergency Contact: +91 98765 43211',
        bio: 'This is a test bio',
        height: 165,
        weight: 60,
        activityLevel: 'moderate',
        healthGoals: ['Stay healthy', 'Eat well']
      },
      medicalHistory: {
        bloodType: 'A+',
        allergies: ['Peanuts'],
        chronicDiseases: ['None'],
        currentMedications: [
          {
            name: 'Folic Acid',
            dosage: '400mcg',
            frequency: 'Daily'
          }
        ]
      },
      isProfileComplete: true
    };

    const updateResponse = await axios.put(`${API_BASE}/users/me`, updateData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Profile updated:', updateResponse.data.name);

    // 4. Test photo upload (base64)
    console.log('\n4. Testing photo upload...');
    const testPhotoData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    const photoResponse = await axios.post(`${API_BASE}/users/upload-photo`, 
      { photoData: testPhotoData },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Photo upload successful');

    // 5. Test photo deletion
    console.log('\n5. Testing photo deletion...');
    const deletePhotoResponse = await axios.delete(`${API_BASE}/users/photo`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Photo deletion successful');

    // 6. Get updated profile
    console.log('\n6. Getting updated profile...');
    const finalProfileResponse = await axios.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Final profile retrieved');
    console.log('   - Name:', finalProfileResponse.data.name);
    console.log('   - Phone:', finalProfileResponse.data.personalInfo?.phone);
    console.log('   - Blood Type:', finalProfileResponse.data.medicalHistory?.bloodType);
    console.log('   - Profile Complete:', finalProfileResponse.data.isProfileComplete);
    console.log('   - Profile Photo:', finalProfileResponse.data.profilePhoto ? 'Present' : 'Deleted');

    console.log('\n🎉 All tests passed! Profile API is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

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
    
    // Connect to MongoDB
    mongoose.connect('mongodb://localhost:27017/nutricare', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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

// Run the test
testProfileAPI();
testDatabase();
