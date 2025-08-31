import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MapPin,
  Phone,
  Globe,
  Navigation,
  Clock,
  AlertTriangle,
  Hospital,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { EnhancedNavbar } from "@/components/EnhancedNavbar";

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
  rating?: number;
}

export default function Emergency() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [manualAddress, setManualAddress] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const { user } = useAuth();
  const searchSectionRef = useRef<HTMLDivElement>(null);



  useEffect(() => {
    // Try to get user's current location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          findNearbyHospitals(
            position.coords.latitude,
            position.coords.longitude,
          );
        },
        (error) => {
          setLocationError(
            "Unable to get your location. Please enter your address manually.",
          );
        },
      );
    } else {
      setLocationError(
        "Geolocation is not supported by this browser. Please enter your address manually.",
      );
    }
  }, []);

  const findNearbyHospitals = async (lat: number, lng: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/hospitals/nearby?lat=${lat}&lng=${lng}&radius=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch hospitals');
      }
      const data = await response.json();
      console.log('Hospitals data received:', data);
      // Extract hospitals array from the response
      const hospitalsArray = data.hospitals || data;
      console.log('Hospitals array:', hospitalsArray);
      setHospitals(hospitalsArray);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error('Failed to fetch hospitals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleManualLocationSearch = async () => {
    if (!manualAddress.trim()) {
      toast.error("Please enter a valid address");
      return;
    }

    setIsLoading(true);
    try {
      // Geocode the address using backend API
      const response = await fetch(`${API_BASE}/hospitals/geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: manualAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to geocode address');
      }

      const coords = await response.json();
      console.log('Geocoded coordinates:', coords);
      setUserLocation(coords);
      await findNearbyHospitals(coords.lat, coords.lng);
      toast.success("Searching for hospitals near your location...");
    } catch (error) {
      console.error('Error geocoding address:', error);
      toast.error('Failed to find location. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDirections = (hospital: Hospital) => {
    // Open Google Maps with directions using coordinates for more accurate navigation
    const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.location.lat},${hospital.location.lng}`;
    window.open(url, "_blank");
  };

  const handleCallHospital = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const emergencyContacts = [
    {
      name: "Emergency Services",
      number: "108",
      description: "Medical Emergency",
    },
    {
      name: "Police",
      number: "100",
      description: "Police Emergency",
    },
    {
      name: "Fire Services",
      number: "101",
      description: "Fire Emergency",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <EnhancedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-3xl font-bold text-rose-900">Emergency Help</h1>
            </div>
            <Button
              onClick={scrollToSearch}
              className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span className="font-semibold">Search Hospitals</span>
            </Button>
          </div>
          <p className="text-rose-700">
            Find nearby hospitals and emergency contacts for immediate
            assistance
          </p>
        </div>

        {/* Gujarat Hospital Search Banner */}
        <Card className="bg-blue-50 border-blue-200 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  🏥 Hospital Search Coverage
                </h3>
                <p className="text-blue-800 mb-3">
                  <strong>Currently available for Gujarat state only.</strong> Our hospital database includes major cities and districts across Gujarat.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Available Cities & Districts:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm">
                    <span className="text-blue-700">• Ahmedabad</span>
                    <span className="text-blue-700">• Surat</span>
                    <span className="text-blue-700">• Vadodara</span>
                    <span className="text-blue-700">• Rajkot</span>
                    <span className="text-blue-700">• Bhavnagar</span>
                    <span className="text-blue-700">• Jamnagar</span>
                    <span className="text-blue-700">• Gandhinagar</span>
                    <span className="text-blue-700">• Anand</span>
                    <span className="text-blue-700">• Bharuch</span>
                    <span className="text-blue-700">• Mehsana</span>
                    <span className="text-blue-700">• Junagadh</span>
                    <span className="text-blue-700">• Kutch</span>
                    <span className="text-blue-700">• Navsari</span>
                    <span className="text-blue-700">• Valsad</span>
                    <span className="text-blue-700">• Patan</span>
                    <span className="text-blue-700">• Banaskantha</span>
                    <span className="text-blue-700">• Sabarkantha</span>
                    <span className="text-blue-700">• Aravalli</span>
                    <span className="text-blue-700">• Mahisagar</span>
                    <span className="text-blue-700">• Dahod</span>
                    <span className="text-blue-700">• Panchmahal</span>
                    <span className="text-blue-700">• Chhota Udaipur</span>
                    <span className="text-blue-700">• Narmada</span>
                    <span className="text-blue-700">• Tapi</span>
                    <span className="text-blue-700">• Dang</span>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mt-3">
                  💡 <strong>Tip:</strong> Enter your city name or area for best results. If your location isn't found, try searching for the nearest major city.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="bg-red-50 border-red-200 mb-8">
          <CardHeader>
            <CardTitle className="text-red-900 flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Contacts
            </CardTitle>
            <CardDescription className="text-red-700">
              Call these numbers for immediate emergency assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 border border-red-200"
                >
                  <h3 className="font-semibold text-red-900 mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-red-700 mb-2">
                    {contact.description}
                  </p>
                  <Button
                    onClick={() => handleCallHospital(contact.number)}
                    className="bg-red-600 hover:bg-red-700 text-white w-full"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    {contact.number}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8" ref={searchSectionRef}>
          {/* Location Input */}
          <Card className="bg-white/80 backdrop-blur-sm border-rose-100">
            <CardHeader>
              <CardTitle className="text-rose-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Your Location
              </CardTitle>
              <CardDescription className="text-rose-600">
                We'll find the nearest hospitals to your location
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {locationError && (
                <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                  <p className="text-sm text-rose-700">{locationError}</p>
                </div>
              )}

              <div>
                <Label htmlFor="address" className="text-rose-700">
                  Enter your address
                </Label>
                <div className="flex space-x-2 mt-1">
                  <Input
                    id="address"
                    placeholder="123 Main St, City, State"
                    value={manualAddress}
                    onChange={(e) => setManualAddress(e.target.value)}
                    className="border-rose-200 focus:border-rose-500"
                  />
                  <Button
                    onClick={handleManualLocationSearch}
                    className="bg-rose-500 hover:bg-rose-600"
                    disabled={isLoading}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {userLocation && (
                <div className="bg-sage-50 border border-sage-200 rounded-lg p-3">
                  <p className="text-sm text-sage-700">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location detected. Showing nearby hospitals.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Hospital List */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-rose-100">
              <CardHeader>
                <CardTitle className="text-rose-900 flex items-center">
                  <Hospital className="h-5 w-5 mr-2" />
                  Nearby Hospitals
                  {hospitals.length > 0 && (
                    <Badge className="ml-2 bg-sage-500 text-white">
                      {hospitals.length} found
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-rose-600">
                  Hospitals sorted by distance from your location
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-rose-600">
                      Searching for nearby hospitals...
                    </p>
                  </div>
                ) : hospitals.length > 0 ? (
                  <div className="space-y-4">
                    {hospitals.map((hospital) => (
                      <div
                        key={hospital.id}
                        className="border border-rose-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-rose-900 text-lg">
                              {hospital.name}
                            </h3>
                            <p className="text-rose-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {hospital.address}
                            </p>
                            {hospital.distance && (
                              <p className="text-sm text-sage-600">
                                {hospital.distance.toFixed(1)} km away
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            {hospital.specialties.includes("Emergency Medicine") && (
                              <Badge className="bg-red-100 text-red-700">
                                Emergency Services
                              </Badge>
                            )}
                            {(hospital.specialties.includes("Obstetrics") || hospital.specialties.includes("Gynecology")) && (
                              <Badge className="bg-rose-100 text-rose-700">
                                Maternity Ward
                              </Badge>
                            )}
                            {hospital.rating && (
                              <div className="flex items-center">
                                <span className="text-sm text-rose-600">
                                  ⭐ {hospital.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="font-medium text-rose-800 mb-2">
                            Specialties:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {hospital.specialties.map((specialty, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs border-rose-300 text-rose-700"
                              >
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleCallHospital(hospital.phone)}
                            className="bg-rose-500 hover:bg-rose-600 text-white flex-1"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Call: {hospital.phone}
                          </Button>
                          <Button
                            onClick={() => handleGetDirections(hospital)}
                            variant="outline"
                            className="border-rose-300 text-rose-700 hover:bg-rose-50"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Directions
                          </Button>
                          {hospital.website && (
                            <Button
                              onClick={() =>
                                window.open(hospital.website, "_blank")
                              }
                              variant="outline"
                              className="border-rose-300 text-rose-700 hover:bg-rose-50"
                            >
                              <Globe className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Hospital className="h-12 w-12 text-rose-300 mx-auto mb-4" />
                    <p className="text-rose-600">
                      Enter your location to find nearby hospitals
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Important Notes */}
        <Card className="bg-peach-50 border-peach-200 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Clock className="h-6 w-6 text-peach-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-peach-900 mb-2">
                  Important Notes
                </h3>
                <ul className="text-sm text-peach-800 space-y-1">
                  <li>• In case of severe emergency, call 108 immediately</li>
                  <li>
                    • Hospital information may not reflect real-time
                    availability
                  </li>
                  <li>
                    • Contact hospitals directly to confirm maternity services
                  </li>
                  <li>
                    • Keep your health insurance information readily available
                  </li>
                  <li>• Consider having a hospital bag prepared in advance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
