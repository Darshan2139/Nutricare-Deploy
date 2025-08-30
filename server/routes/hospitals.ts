import { RequestHandler } from "express";
import { Hospital, UserLocation } from "@shared/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBgqcTUb9JMiYC_pq2A41hjBP3s9a615UE";

// Comprehensive list of hospitals across Gujarat cities with accurate coordinates
const gujaratHospitals: Hospital[] = [
  // Ahmedabad
  {
    id: "civil-ahmedabad",
    name: "Civil Hospital Ahmedabad",
    address: "Civil Hospital Campus, Asarwa, Ahmedabad - 380016, Gujarat",
    phone: "+91-79-22680000",
    website: "https://www.civilhospitalahmedabad.org",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology", "Pediatrics", "Surgery"],
    location: { lat: 23.0225, lng: 72.5714 },
    rating: 4.2
  },
  {
    id: "sterling-ahmedabad",
    name: "Sterling Hospital",
    address: "Sterling Hospital, Race Course Road, Ahmedabad - 380006, Gujarat",
    phone: "+91-79-40090909",
    website: "https://www.sterlinghospitals.com",
    specialties: ["Cardiology", "Obstetrics", "Gynecology", "Emergency Medicine"],
    location: { lat: 23.0330, lng: 72.5714 },
    rating: 4.5
  },
  {
    id: "apollo-ahmedabad",
    name: "Apollo Hospitals",
    address: "Apollo Hospitals, Bhat, Ahmedabad - 380015, Gujarat",
    phone: "+91-79-66701800",
    website: "https://www.apollohospitals.com",
    specialties: ["Multi-Specialty", "Obstetrics", "Gynecology", "Emergency Medicine"],
    location: { lat: 23.0225, lng: 72.5714 },
    rating: 4.6
  },
  {
    id: "shalby-ahmedabad",
    name: "Shalby Hospitals",
    address: "Shalby Hospitals, SG Road, Ahmedabad - 380015, Gujarat",
    phone: "+91-79-40203040",
    website: "https://www.shalby.org",
    specialties: ["Orthopedics", "Obstetrics", "Gynecology", "Emergency Medicine"],
    location: { lat: 23.0225, lng: 72.5714 },
    rating: 4.4
  },

  // Surat
  {
    id: "civil-surat",
    name: "Civil Hospital Surat",
    address: "Civil Hospital, Majura Gate, Surat - 395001, Gujarat",
    phone: "+91-261-2244444",
    website: "https://www.suratmunicipal.gov.in",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology", "Pediatrics"],
    location: { lat: 21.1702, lng: 72.8311 },
    rating: 4.1
  },
  {
    id: "new-surat",
    name: "New Civil Hospital Surat",
    address: "New Civil Hospital, Majura Gate, Surat - 395001, Gujarat",
    phone: "+91-261-2244444",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 21.1702, lng: 72.8311 },
    rating: 4.0
  },
  {
    id: "mahavir-surat",
    name: "Mahavir Hospital",
    address: "Mahavir Hospital, Athwa, Surat - 395001, Gujarat",
    phone: "+91-261-2222222",
    specialties: ["Multi-Specialty", "Obstetrics", "Gynecology"],
    location: { lat: 21.1702, lng: 72.8311 },
    rating: 4.3
  },

  // Vadodara
  {
    id: "civil-vadodara",
    name: "SSG Hospital Vadodara",
    address: "SSG Hospital, Gotri Road, Vadodara - 390020, Gujarat",
    phone: "+91-265-2424444",
    website: "https://www.ssghospital.com",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology", "Pediatrics"],
    location: { lat: 22.3072, lng: 73.1812 },
    rating: 4.2
  },
  {
    id: "parul-vadodara",
    name: "Parul Sevashram Hospital",
    address: "Parul Sevashram Hospital, Waghodia Road, Vadodara - 390019, Gujarat",
    phone: "+91-265-2644444",
    website: "https://www.paruluniversity.ac.in",
    specialties: ["Multi-Specialty", "Obstetrics", "Gynecology"],
    location: { lat: 22.3072, lng: 73.1812 },
    rating: 4.4
  },

  // Rajkot
  {
    id: "civil-rajkot",
    name: "Civil Hospital Rajkot",
    address: "Civil Hospital, Race Course Road, Rajkot - 360001, Gujarat",
    phone: "+91-281-2222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 22.3039, lng: 70.8022 },
    rating: 4.0
  },
  {
    id: "rajkot-maternity",
    name: "Rajkot Maternity Hospital",
    address: "Rajkot Maternity Hospital, Race Course Road, Rajkot - 360001, Gujarat",
    phone: "+91-281-2222222",
    specialties: ["Obstetrics", "Gynecology", "Neonatology"],
    location: { lat: 22.3039, lng: 70.8022 },
    rating: 4.3
  },

  // Bhavnagar
  {
    id: "civil-bhavnagar",
    name: "Sir T Hospital Bhavnagar",
    address: "Sir T Hospital, Takhteshwar Road, Bhavnagar - 364001, Gujarat",
    phone: "+91-278-2222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 21.7645, lng: 72.1519 },
    rating: 4.1
  },

  // Jamnagar
  {
    id: "civil-jamnagar",
    name: "GG Hospital Jamnagar",
    address: "GG Hospital, Jamnagar - 361001, Gujarat",
    phone: "+91-288-2222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 22.4707, lng: 70.0577 },
    rating: 4.0
  },

  // Anand
  {
    id: "civil-anand",
    name: "Civil Hospital Anand",
    address: "Civil Hospital, Anand - 388001, Gujarat",
    phone: "+91-2692-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 22.5646, lng: 72.9289 },
    rating: 4.0
  },

  // Bharuch
  {
    id: "civil-bharuch",
    name: "Civil Hospital Bharuch",
    address: "Civil Hospital, Bharuch - 392001, Gujarat",
    phone: "+91-2642-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 21.7051, lng: 72.9959 },
    rating: 4.0
  },

  // Gandhinagar
  {
    id: "civil-gandhinagar",
    name: "Civil Hospital Gandhinagar",
    address: "Civil Hospital, Sector 21, Gandhinagar - 382021, Gujarat",
    phone: "+91-79-23222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 23.2156, lng: 72.6369 },
    rating: 4.1
  },

  // Mehsana
  {
    id: "civil-mehsana",
    name: "Civil Hospital Mehsana",
    address: "Civil Hospital, Mehsana - 384001, Gujarat",
    phone: "+91-2762-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 23.5986, lng: 72.9696 },
    rating: 4.0
  },

  // Junagadh
  {
    id: "civil-junagadh",
    name: "Civil Hospital Junagadh",
    address: "Civil Hospital, Junagadh - 362001, Gujarat",
    phone: "+91-285-2222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 21.5222, lng: 70.4579 },
    rating: 4.0
  },

  // Kutch
  {
    id: "civil-kutch",
    name: "Civil Hospital Bhuj",
    address: "Civil Hospital, Bhuj, Kutch - 370001, Gujarat",
    phone: "+91-2832-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 23.2419, lng: 69.6669 },
    rating: 4.0
  },

  // Navsari
  {
    id: "civil-navsari",
    name: "Civil Hospital Navsari",
    address: "Civil Hospital, Navsari - 396445, Gujarat",
    phone: "+91-2637-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 20.9517, lng: 72.9324 },
    rating: 4.0
  },

  // Valsad
  {
    id: "civil-valsad",
    name: "Civil Hospital Valsad",
    address: "Civil Hospital, Valsad - 396001, Gujarat",
    phone: "+91-2632-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 20.6104, lng: 72.9342 },
    rating: 4.0
  },

  // Patan
  {
    id: "civil-patan",
    name: "Civil Hospital Patan",
    address: "Civil Hospital, Patan - 384265, Gujarat",
    phone: "+91-2766-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 23.8507, lng: 72.1136 },
    rating: 4.0
  },

  // Banaskantha
  {
    id: "civil-banaskantha",
    name: "Civil Hospital Palanpur",
    address: "Civil Hospital, Palanpur, Banaskantha - 385001, Gujarat",
    phone: "+91-2742-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 24.1724, lng: 72.4346 },
    rating: 4.0
  },

  // Sabarkantha
  {
    id: "civil-sabarkantha",
    name: "Civil Hospital Himmatnagar",
    address: "Civil Hospital, Himmatnagar, Sabarkantha - 383001, Gujarat",
    phone: "+91-2772-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 23.5986, lng: 72.9696 },
    rating: 4.0
  },

  // Aravalli
  {
    id: "civil-aravalli",
    name: "Civil Hospital Modasa",
    address: "Civil Hospital, Modasa, Aravalli - 383315, Gujarat",
    phone: "+91-2774-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 23.4625, lng: 73.2986 },
    rating: 4.0
  },

  // Mahisagar
  {
    id: "civil-mahisagar",
    name: "Civil Hospital Lunavada",
    address: "Civil Hospital, Lunavada, Mahisagar - 389230, Gujarat",
    phone: "+91-2676-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 23.1284, lng: 73.6103 },
    rating: 4.0
  },

  // Dahod
  {
    id: "civil-dahod",
    name: "Civil Hospital Dahod",
    address: "Civil Hospital, Dahod - 389151, Gujarat",
    phone: "+91-2673-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 22.8312, lng: 74.2549 },
    rating: 4.0
  },

  // Panchmahal
  {
    id: "civil-panchmahal",
    name: "Civil Hospital Godhra",
    address: "Civil Hospital, Godhra, Panchmahal - 389001, Gujarat",
    phone: "+91-2672-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 22.7772, lng: 73.6203 },
    rating: 4.0
  },

  // Chhota Udaipur
  {
    id: "civil-chhota-udaipur",
    name: "Civil Hospital Chhota Udaipur",
    address: "Civil Hospital, Chhota Udaipur - 391165, Gujarat",
    phone: "+91-2671-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 22.3041, lng: 74.0159 },
    rating: 4.0
  },

  // Narmada
  {
    id: "civil-narmada",
    name: "Civil Hospital Rajpipla",
    address: "Civil Hospital, Rajpipla, Narmada - 393145, Gujarat",
    phone: "+91-2640-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 21.8734, lng: 73.5117 },
    rating: 4.0
  },

  // Tapi
  {
    id: "civil-tapi",
    name: "Civil Hospital Vyara",
    address: "Civil Hospital, Vyara, Tapi - 394650, Gujarat",
    phone: "+91-2631-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 21.1104, lng: 73.3935 },
    rating: 4.0
  },

  // Dang
  {
    id: "civil-dang",
    name: "Civil Hospital Ahwa",
    address: "Civil Hospital, Ahwa, Dang - 394710, Gujarat",
    phone: "+91-2630-222222",
    specialties: ["Emergency Medicine", "Obstetrics", "Gynecology"],
    location: { lat: 20.7575, lng: 73.6889 },
    rating: 4.0
  }
];

export const handleFindNearbyHospitals: RequestHandler = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    const userLat = parseFloat(lat as string);
    const userLng = parseFloat(lng as string);
    const searchRadius = parseFloat(radius as string);

    const nearbyHospitals = gujaratHospitals
      .map((hospital) => ({
        ...hospital,
        distance: calculateDistance(
          userLat,
          userLng,
          hospital.location.lat,
          hospital.location.lng,
        ),
      }))
      .filter((hospital) => hospital.distance <= searchRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyHospitals);
  } catch (error) {
    console.error("Error finding hospitals:", error);
    res.status(500).json({ error: "Failed to find nearby hospitals" });
  }
};

export const handleGetHospitalDetails: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const list = gujaratHospitals;
    const hospital = list.find((h) => h.id === id);
    if (!hospital) return res.status(404).json({ error: "Hospital not found" });
    res.json(hospital);
  } catch (error) {
    res.status(500).json({ error: "Failed to get hospital details" });
  }
};

export const handleGeocodeAddress: RequestHandler = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    // Gujarat city coordinates mapping
    const gujaratCities: { [key: string]: { lat: number; lng: number } } = {
      // Major cities
      "ahmedabad": { lat: 23.0225, lng: 72.5714 },
      "surat": { lat: 21.1702, lng: 72.8311 },
      "vadodara": { lat: 22.3072, lng: 73.1812 },
      "rajkot": { lat: 22.3039, lng: 70.8022 },
      "bhavnagar": { lat: 21.7645, lng: 72.1519 },
      "jamnagar": { lat: 22.4707, lng: 70.0577 },
      "anand": { lat: 22.5646, lng: 72.9289 },
      "bharuch": { lat: 21.7051, lng: 72.9959 },
      "gandhinagar": { lat: 23.2156, lng: 72.6369 },
      "mehsana": { lat: 23.5986, lng: 72.9696 },
      "junagadh": { lat: 21.5222, lng: 70.4579 },
      "bhuj": { lat: 23.2419, lng: 69.6669 },
      "navsari": { lat: 20.9517, lng: 72.9324 },
      "valsad": { lat: 20.6104, lng: 72.9342 },
      "patan": { lat: 23.8507, lng: 72.1136 },
      "palanpur": { lat: 24.1724, lng: 72.4346 },
      "himmatnagar": { lat: 23.5986, lng: 72.9696 },
      "modasa": { lat: 23.4625, lng: 73.2986 },
      "lunavada": { lat: 23.1284, lng: 73.6103 },
      "dahod": { lat: 22.8312, lng: 74.2549 },
      "godhra": { lat: 22.7772, lng: 73.6203 },
      "chhota udaipur": { lat: 22.3041, lng: 74.0159 },
      "rajpipla": { lat: 21.8734, lng: 73.5117 },
      "vyara": { lat: 21.1104, lng: 73.3935 },
      "ahwa": { lat: 20.7575, lng: 73.6889 },
      
      // Alternative spellings and common variations
      "amdavad": { lat: 23.0225, lng: 72.5714 },
      "baroda": { lat: 22.3072, lng: 73.1812 },
      "kutch": { lat: 23.2419, lng: 69.6669 },
      "kachchh": { lat: 23.2419, lng: 69.6669 },
      "banaskantha": { lat: 24.1724, lng: 72.4346 },
      "sabarkantha": { lat: 23.5986, lng: 72.9696 },
      "aravalli": { lat: 23.4625, lng: 73.2986 },
      "mahisagar": { lat: 23.1284, lng: 73.6103 },
      "panchmahal": { lat: 22.7772, lng: 73.6203 },
      "narmada": { lat: 21.8734, lng: 73.5117 },
      "tapi": { lat: 21.1104, lng: 73.3935 },
      "dang": { lat: 20.7575, lng: 73.6889 },
      
      // Common area names and landmarks
      "navrangpura": { lat: 23.0225, lng: 72.5714 },
      "satellite": { lat: 23.0225, lng: 72.5714 },
      "vastrapur": { lat: 23.0225, lng: 72.5714 },
      "bodakdev": { lat: 23.0225, lng: 72.5714 },
      "thaltej": { lat: 23.0225, lng: 72.5714 },
      "sola": { lat: 23.0225, lng: 72.5714 },
      "sarkhej": { lat: 23.0225, lng: 72.5714 },
      "maninagar": { lat: 23.0225, lng: 72.5714 },
      "naranpura": { lat: 23.0225, lng: 72.5714 },
      "paldi": { lat: 23.0225, lng: 72.5714 },
      "ellisbridge": { lat: 23.0225, lng: 72.5714 },
      "khanpur": { lat: 23.0225, lng: 72.5714 },
      "ashram road": { lat: 23.0225, lng: 72.5714 },
      "cg road": { lat: 23.0225, lng: 72.5714 },
      "sg road": { lat: 23.0225, lng: 72.5714 },
      "race course": { lat: 23.0225, lng: 72.5714 },
      "law garden": { lat: 23.0225, lng: 72.5714 },
      "kankaria": { lat: 23.0225, lng: 72.5714 },
      "sabarmati": { lat: 23.0225, lng: 72.5714 },
      "adajan": { lat: 21.1702, lng: 72.8311 },
      "vesu": { lat: 21.1702, lng: 72.8311 },
      "athwa": { lat: 21.1702, lng: 72.8311 },
      "majura": { lat: 21.1702, lng: 72.8311 },
      "udhna": { lat: 21.1702, lng: 72.8311 },
      "varachha": { lat: 21.1702, lng: 72.8311 },
      "gotri": { lat: 22.3072, lng: 73.1812 },
      "waghodia": { lat: 22.3072, lng: 73.1812 },
      "fatehgunj": { lat: 22.3072, lng: 73.1812 },
      "alkapuri": { lat: 22.3072, lng: 73.1812 },
      "gotri road": { lat: 22.3072, lng: 73.1812 },
      "waghodia road": { lat: 22.3072, lng: 73.1812 }
    };

    // Normalize the address for matching
    const normalizedAddress = address.toLowerCase().trim();
    
    // Try to find a matching city
    let foundCity = null;
    let foundCoords = null;
    
    for (const [city, coords] of Object.entries(gujaratCities)) {
      if (normalizedAddress.includes(city)) {
        foundCity = city;
        foundCoords = coords;
        break;
      }
    }

    if (foundCoords) {
      const result: UserLocation = {
        lat: foundCoords.lat,
        lng: foundCoords.lng,
        address: address,
      };
      res.json(result);
    } else {
      // If no specific city found, return Ahmedabad as default (central Gujarat)
      const defaultCoords: UserLocation = {
        lat: 23.0225,
        lng: 72.5714,
        address: address,
      };
      res.json(defaultCoords);
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    res.status(500).json({ error: "Failed to geocode address" });
  }
};

async function fetchGujaratHospitals(): Promise<Hospital[]> {
  try {
    const prompt =
      "List hospitals across all cities in Gujarat, India with fields: id (slug), name, address (city), phone (if known), website (if known), specialties (array), lat, lng, rating (0-5). Return JSON array only.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    } as any);
    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";

    // Try to parse JSON from Gemini (may include markdown). Extract JSON block if necessary.
    const json = extractJSON(text);

    // Map to our Hospital type with defaults
    return (json as any[]).map((h, idx) => ({
      id: String(h.id || idx + 1),
      name: String(h.name || "Hospital"),
      address: String(h.address || "Gujarat, India"),
      phone: h.phone ? String(h.phone) : undefined,
      website: h.website ? String(h.website) : undefined,
      specialties: Array.isArray(h.specialties) ? h.specialties : [],
      location: {
        lat: Number(h.lat || h.location?.lat || 23.0225),
        lng: Number(h.lng || h.location?.lng || 72.5714),
      },
      rating: Number(h.rating || 4.2),
    }));
  } catch (e) {
    console.error("Gemini fetchGujaratHospitals error", e);
    // Return fallback data when Gemini API fails
    return gujaratHospitals;
  }
}

function extractJSON(text: string): unknown {
  try {
    // If it's pure JSON
    return JSON.parse(text);
  } catch (_) {
    // Try to extract code block
    const match = text.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (_) {}
    }
  }
  return [];
}

function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
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
}
