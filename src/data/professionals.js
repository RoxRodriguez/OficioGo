// Mock data for professionals in OficioGo
export const professionals = [
  {
    id: 1,
    name: "Carlos Mendoza",
    profession: "cerrajero",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    baseRate: 2500,
    currency: "ARS",
    serviceRadius: 15, // km
    rating: 4.8,
    totalReviews: 127,
    isAvailable: true,
    isVerified: true,
    location: {
      address: "Palermo, CABA",
      coordinates: { lat: -34.5875, lng: -58.4225 },
      neighborhood: "Palermo",
      city: "CABA",
      fullAddress: "Av. Santa Fe 3500, Palermo, CABA"
    },
    skills: ["Cerrajería 24hs", "Apertura de puertas", "Cambio de cerraduras", "Llaves codificadas"],
    workingHours: {
      monday: "08:00-20:00",
      tuesday: "08:00-20:00",
      wednesday: "08:00-20:00",
      thursday: "08:00-20:00",
      friday: "08:00-20:00",
      saturday: "09:00-18:00",
      sunday: "10:00-16:00"
    },
    emergencyService: true,
    description: "Cerrajero profesional con más de 10 años de experiencia. Servicio 24 horas para emergencias.",
    reviews: [
      {
        id: 1,
        clientName: "María González",
        rating: 5,
        comment: "Excelente servicio, muy rápido y profesional. Llegó en 20 minutos.",
        date: "2024-03-15"
      },
      {
        id: 2,
        clientName: "Roberto Silva",
        rating: 5,
        comment: "Muy recomendable, precio justo y trabajo de calidad.",
        date: "2024-03-10"
      },
      {
        id: 3,
        clientName: "Ana López",
        rating: 4,
        comment: "Buen servicio, aunque llegó un poco tarde.",
        date: "2024-03-08"
      }
    ]
  },
  {
    id: 2,
    name: "Miguel Rodríguez",
    profession: "pintor",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    baseRate: 3200,
    currency: "ARS",
    serviceRadius: 20,
    rating: 4.6,
    totalReviews: 89,
    isAvailable: true,
    isVerified: true,
    location: {
      address: "Villa Crespo, CABA",
      coordinates: { lat: -34.6000, lng: -58.4400 },
      neighborhood: "Villa Crespo",
      city: "CABA",
      fullAddress: "Av. Corrientes 4500, Villa Crespo, CABA"
    },
    skills: ["Pintura interior", "Pintura exterior", "Empapelado", "Restauración"],
    workingHours: {
      monday: "07:00-19:00",
      tuesday: "07:00-19:00",
      wednesday: "07:00-19:00",
      thursday: "07:00-19:00",
      friday: "07:00-19:00",
      saturday: "08:00-17:00",
      sunday: "No disponible"
    },
    emergencyService: false,
    description: "Pintor profesional especializado en trabajos residenciales y comerciales. Más de 15 años de experiencia.",
    reviews: [
      {
        id: 1,
        clientName: "Laura Martín",
        rating: 5,
        comment: "Excelente trabajo, muy prolijo y cumplió con los tiempos acordados.",
        date: "2024-03-12"
      },
      {
        id: 2,
        clientName: "Jorge Pérez",
        rating: 4,
        comment: "Buen trabajo, recomendable. Precio acorde al mercado.",
        date: "2024-03-05"
      }
    ]
  },
  {
    id: 3,
    name: "Franco Giménez",
    profession: "electricista",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    baseRate: 2800,
    currency: "ARS",
    serviceRadius: 12,
    rating: 4.9,
    totalReviews: 156,
    isAvailable: false, // Currently busy
    isVerified: true,
    location: {
      address: "Caballito, CABA",
      coordinates: { lat: -34.6200, lng: -58.4500 },
      neighborhood: "Caballito",
      city: "CABA",
      fullAddress: "Av. Rivadavia 5200, Caballito, CABA"
    },
    skills: ["Instalaciones eléctricas", "Tableros", "Iluminación", "Reparaciones"],
    workingHours: {
      monday: "08:00-18:00",
      tuesday: "08:00-18:00",
      wednesday: "08:00-18:00",
      thursday: "08:00-18:00",
      friday: "08:00-18:00",
      saturday: "09:00-15:00",
      sunday: "No disponible"
    },
    emergencyService: true,
    description: "Electricista matriculado con amplia experiencia en instalaciones residenciales e industriales.",
    reviews: [
      {
        id: 1,
        clientName: "Patricia Ramos",
        rating: 5,
        comment: "Muy profesional, solucionó el problema rápidamente y explicó todo claramente.",
        date: "2024-03-14"
      },
      {
        id: 2,
        clientName: "Carlos Mendez",
        rating: 5,
        comment: "Excelente electricista, trabajo de primera calidad.",
        date: "2024-03-09"
      },
      {
        id: 3,
        clientName: "Silvia Torres",
        rating: 5,
        comment: "Muy recomendable, llegó puntual y resolvió todo sin problemas.",
        date: "2024-03-07"
      }
    ]
  }
];

// Helper functions for filtering and searching
export const searchProfessionals = (profession, location) => {
  return professionals.filter(prof => 
    prof.profession.toLowerCase().includes(profession.toLowerCase())
  );
};

export const getProfessionalById = (id) => {
  return professionals.find(prof => prof.id === parseInt(id));
};

export const getAvailableProfessionals = () => {
  return professionals.filter(prof => prof.isAvailable);
};

export const getProfessionsList = () => {
  const professions = [...new Set(professionals.map(prof => prof.profession))];
  return professions.map(profession => ({
    value: profession,
    label: profession.charAt(0).toUpperCase() + profession.slice(1)
  }));
};

// Geolocation helper functions
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

// Search professionals by location and radius
export const searchProfessionalsByLocation = (userLat, userLng, maxDistance = 20, profession = '') => {
  return professionals
    .filter(prof => {
      // Filter by profession if specified
      if (profession && !prof.profession.toLowerCase().includes(profession.toLowerCase())) {
        return false;
      }
      
      // Calculate distance
      const distance = calculateDistance(
        userLat, userLng,
        prof.location.coordinates.lat, prof.location.coordinates.lng
      );
      
      // Check if within radius and professional's service radius
      return distance <= maxDistance && distance <= prof.serviceRadius;
    })
    .map(prof => {
      // Add distance information
      const distance = calculateDistance(
        userLat, userLng,
        prof.location.coordinates.lat, prof.location.coordinates.lng
      );
      
      return {
        ...prof,
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
        estimatedTime: Math.ceil(distance * 3) // Rough estimate: 3 minutes per km
      };
    })
    .sort((a, b) => a.distance - b.distance); // Sort by distance
};

// Get professionals in specific neighborhoods
export const getProfessionalsByNeighborhood = (neighborhood) => {
  return professionals.filter(prof => 
    prof.location.neighborhood?.toLowerCase().includes(neighborhood.toLowerCase())
  );
};

// Get all unique neighborhoods
export const getNeighborhoods = () => {
  const neighborhoods = [...new Set(professionals.map(prof => prof.location.neighborhood))].filter(Boolean);
  return neighborhoods.map(neighborhood => ({
    value: neighborhood,
    label: neighborhood
  }));
};

// Search with advanced filters
export const searchWithFilters = (filters) => {
  const {
    profession = '',
    userLocation = null,
    maxDistance = 20,
    minRating = 0,
    maxPrice = Infinity,
    isAvailable = null,
    emergencyService = null,
    isVerified = null
  } = filters;

  let results = professionals;

  // Filter by profession
  if (profession) {
    results = results.filter(prof => 
      prof.profession.toLowerCase().includes(profession.toLowerCase())
    );
  }

  // Filter by availability
  if (isAvailable !== null) {
    results = results.filter(prof => prof.isAvailable === isAvailable);
  }

  // Filter by emergency service
  if (emergencyService !== null) {
    results = results.filter(prof => prof.emergencyService === emergencyService);
  }

  // Filter by verification
  if (isVerified !== null) {
    results = results.filter(prof => prof.isVerified === isVerified);
  }

  // Filter by rating
  if (minRating > 0) {
    results = results.filter(prof => prof.rating >= minRating);
  }

  // Filter by price
  if (maxPrice < Infinity) {
    results = results.filter(prof => prof.baseRate <= maxPrice);
  }

  // Add location filtering and distance calculation
  if (userLocation && userLocation.latitude && userLocation.longitude) {
    results = results
      .filter(prof => {
        const distance = calculateDistance(
          userLocation.latitude, userLocation.longitude,
          prof.location.coordinates.lat, prof.location.coordinates.lng
        );
        return distance <= maxDistance && distance <= prof.serviceRadius;
      })
      .map(prof => {
        const distance = calculateDistance(
          userLocation.latitude, userLocation.longitude,
          prof.location.coordinates.lat, prof.location.coordinates.lng
        );
        
        return {
          ...prof,
          distance: Math.round(distance * 10) / 10,
          estimatedTime: Math.ceil(distance * 3)
        };
      })
      .sort((a, b) => a.distance - b.distance);
  }

  return results;
};