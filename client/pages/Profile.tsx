import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Heart,
  Camera,
  Save,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Upload,
  X,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { EnhancedNavbar } from "@/components/EnhancedNavbar";
import { profileAPI, utils } from "../../shared/api";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  emergencyContact: string;
  bio: string;
  profilePhoto: string;
}

interface HealthData {
  height: string;
  weight: string;
  bloodType: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
  activityLevel: string;
  healthGoals: string[];
  lastCheckupDate: string;
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    dateOfBirth: "",
    emergencyContact: "",
    bio: "",
    profilePhoto: user?.profilePhoto || "",
  });

  const [healthData, setHealthData] = useState<HealthData>({
    height: "",
    weight: "",
    bloodType: "",
    allergies: "",
    medications: "",
    medicalConditions: "",
    activityLevel: "",
    healthGoals: [],
    lastCheckupDate: "",
  });

  // Load user data on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const userData = await profileAPI.getProfile();
      
      setProfileData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.personalInfo?.phone || "",
        address: userData.personalInfo?.address || "",
        dateOfBirth: userData.personalInfo?.dateOfBirth || "",
        emergencyContact: userData.personalInfo?.emergencyContact || "",
        bio: userData.personalInfo?.bio || "",
        profilePhoto: userData.profilePhoto && !userData.profilePhoto.includes('placeholder') && !userData.profilePhoto.includes('via.placeholder') ? userData.profilePhoto : "",
      });
      
      setHealthData({
        height: userData.personalInfo?.height?.toString() || "",
        weight: userData.personalInfo?.weight?.toString() || "",
        bloodType: userData.medicalHistory?.bloodType || "",
        allergies: userData.medicalHistory?.allergies?.join(", ") || "",
        medications: userData.medicalHistory?.currentMedications?.map((m: any) => `${m.name} - ${m.dosage}`).join(", ") || "",
        medicalConditions: userData.medicalHistory?.chronicDiseases?.join(", ") || "",
        activityLevel: userData.personalInfo?.activityLevel || "",
        healthGoals: userData.personalInfo?.healthGoals || [],
        lastCheckupDate: userData.pregnancyInfo?.lastCheckupDate || "",
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile data. Please refresh the page.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file using utility function
    const validation = utils.validateImageFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setIsLoadingPhoto(true);
    try {
      // Convert file to base64
      const photoData = await utils.fileToBase64(file);
      
      // Upload to server
      const result = await profileAPI.uploadPhoto(photoData);
      
      setProfileData(prev => ({ ...prev, profilePhoto: result.profilePhoto }));
      updateUser({ ...user, profilePhoto: result.profilePhoto });
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    setIsDeletingPhoto(true);
    try {
      await profileAPI.deletePhoto();
      
      setProfileData(prev => ({ ...prev, profilePhoto: "" }));
      updateUser({ ...user, profilePhoto: "" });
      toast.success("Profile photo deleted successfully!");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo. Please try again.");
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Validate required fields
      if (!profileData.name.trim()) {
        toast.error("Name is required");
        return;
      }

      // Prepare the data for the API
      const updateData = {
        name: profileData.name.trim(),
        personalInfo: {
          phone: profileData.phone.trim(),
          address: profileData.address.trim(),
          dateOfBirth: profileData.dateOfBirth,
          emergencyContact: profileData.emergencyContact.trim(),
          bio: profileData.bio.trim(),
          height: healthData.height ? parseFloat(healthData.height) : undefined,
          weight: healthData.weight ? parseFloat(healthData.weight) : undefined,
          activityLevel: healthData.activityLevel as "sedentary" | "light" | "moderate" | "active" | "very_active" | undefined,
          healthGoals: healthData.healthGoals,
        },
        pregnancyInfo: {
          ...user?.pregnancyInfo, // Preserve existing pregnancy data
          lastCheckupDate: healthData.lastCheckupDate || undefined,
        },
        medicalHistory: {
          bloodType: healthData.bloodType,
          allergies: healthData.allergies.split(',').map(a => a.trim()).filter(a => a),
          chronicDiseases: healthData.medicalConditions.split(',').map(c => c.trim()).filter(c => c),
          currentMedications: healthData.medications.split(',').map(m => {
            const parts = m.trim().split(' - ');
            return {
              name: parts[0] || m.trim(),
              dosage: parts[1] || '',
              frequency: 'As prescribed'
            };
          }).filter(m => m.name),
        },
        isProfileComplete: true,
      };

      const updatedUser = await profileAPI.updateProfile(updateData);
      
      updateUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCancelEdit = () => {
    // Reload original data
    loadUserProfile();
    setIsEditing(false);
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <EnhancedNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-rose-700">Loading profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <EnhancedNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rose-900 mb-2">My Profile</h1>
          <p className="text-rose-700">
            Manage your personal information and health details
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
            <CardHeader className="text-center">
              <div className="relative mx-auto mb-4">
                <Avatar className="w-32 h-32 mx-auto">
                  <AvatarImage src={profileData.profilePhoto && !profileData.profilePhoto.includes('placeholder') && !profileData.profilePhoto.includes('via.placeholder') ? profileData.profilePhoto : undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-rose-500 to-lavender-500 text-white text-2xl">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <Button
                      size="sm"
                      onClick={triggerFileInput}
                      disabled={isLoadingPhoto}
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 bg-rose-500 hover:bg-rose-600"
                    >
                      {isLoadingPhoto ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </Button>
                    {profileData.profilePhoto && (
                      <Button
                        size="sm"
                        onClick={() => setShowDeleteDialog(true)}
                        disabled={isDeletingPhoto}
                        variant="destructive"
                        className="absolute top-0 right-0 rounded-full w-8 h-8 bg-red-500 hover:bg-red-600"
                      >
                        {isDeletingPhoto ? (
                          <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </Button>
                    )}
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <CardTitle className="text-rose-900">{user?.name}</CardTitle>
              <CardDescription className="text-rose-600">
                {user?.role === "pregnant"
                  ? "Expecting Mother"
                  : "Lactating Mother"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-2">
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-rose-500 hover:bg-rose-600"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="bg-sage-500 hover:bg-sage-600"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="border-rose-300 text-rose-700"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-rose-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-rose-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="border-rose-200 focus:border-rose-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-rose-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled={true}
                      className="border-rose-200 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-rose-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      placeholder="+91 98765 43210"
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-rose-700">
                      Date of Birth
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-rose-700">
                    Address
                  </Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        address: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="123 Main St, City, State, PIN"
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="emergencyContact" className="text-rose-700">
                    Emergency Contact
                  </Label>
                  <Input
                    id="emergencyContact"
                    value={profileData.emergencyContact}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        emergencyContact: e.target.value,
                      })
                    }
                    disabled={!isEditing}
                    placeholder="Emergency contact name and phone"
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="text-rose-700">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="Tell us a bit about yourself..."
                    className="border-rose-200 focus:border-rose-500"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-rose-900 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Health Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="height" className="text-rose-700">
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      value={healthData.height}
                      onChange={(e) =>
                        setHealthData({ ...healthData, height: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="165"
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-rose-700">
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      value={healthData.weight}
                      onChange={(e) =>
                        setHealthData({ ...healthData, weight: e.target.value })
                      }
                      disabled={!isEditing}
                      placeholder="60"
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodType" className="text-rose-700">
                      Blood Type
                    </Label>
                    <Select
                      value={healthData.bloodType}
                      onValueChange={(value) =>
                        setHealthData({ ...healthData, bloodType: value })
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="border-rose-200 focus:border-rose-500">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="allergies" className="text-rose-700">
                    Allergies
                  </Label>
                  <Input
                    id="allergies"
                    value={healthData.allergies}
                    onChange={(e) =>
                      setHealthData({ ...healthData, allergies: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="Peanuts, Shellfish, etc. (separate with commas)"
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="medications" className="text-rose-700">
                    Current Medications
                  </Label>
                  <Input
                    id="medications"
                    value={healthData.medications}
                    onChange={(e) =>
                      setHealthData({ ...healthData, medications: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="Medicine Name - Dosage (separate with commas)"
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="medicalConditions" className="text-rose-700">
                    Medical Conditions
                  </Label>
                  <Input
                    id="medicalConditions"
                    value={healthData.medicalConditions}
                    onChange={(e) =>
                      setHealthData({ ...healthData, medicalConditions: e.target.value })
                    }
                    disabled={!isEditing}
                    placeholder="Diabetes, Hypertension, etc. (separate with commas)"
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="activityLevel" className="text-rose-700">
                    Activity Level
                  </Label>
                  <Select
                    value={healthData.activityLevel}
                    onValueChange={(value) =>
                      setHealthData({ ...healthData, activityLevel: value })
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="border-rose-200 focus:border-rose-500">
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very_active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lastCheckupDate" className="text-rose-700">
                    Last Checkup Date
                  </Label>
                  <Input
                    id="lastCheckupDate"
                    type="date"
                    value={healthData.lastCheckupDate}
                    onChange={(e) =>
                      setHealthData({ ...healthData, lastCheckupDate: e.target.value })
                    }
                    disabled={!isEditing}
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Photo Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your profile photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPhoto}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePhoto}
              disabled={isDeletingPhoto}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeletingPhoto ? "Deleting..." : "Delete Photo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
