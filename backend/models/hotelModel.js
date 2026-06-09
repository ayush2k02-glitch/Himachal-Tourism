const fs = require('fs');
const path = require('path');

const hotelsFilePath = path.join(__dirname, '..', 'hotels.json');

// Default Hotel Data to initialize if hotels.json doesn't exist
const defaultHotels = [
  {
    id: "h1",
    name: "Wildflower Palace",
    region: "shimla",
    location: "Chharabra, Shimla",
    rating: 4.9,
    price: 18500,
    image: "/src/assets/hotel_wildflower.png",
    roomsAvailable: 5,
    totalRooms: 10,
    amenities: ["WiFi", "Spa", "Pool", "Mountain View", "Restaurant"],
    description: "A luxury colonial-style retreat nestled high in pine and cedar forests, offering magnificent views of the snow-clad peaks."
  },
  {
    id: "h2",
    name: "Solang River Heights",
    region: "manali",
    location: "Solang Valley, Manali",
    rating: 4.8,
    price: 14200,
    image: "/src/assets/hotel_solang.png",
    roomsAvailable: 4,
    totalRooms: 8,
    amenities: ["WiFi", "Adventure Guide", "Mountain View", "Balcony", "Restaurant"],
    description: "A premium alpine chalet perched beside the rushing river, perfect for adventure seekers who value luxury."
  },
  {
    id: "h3",
    name: "Spiti Oasis Retreat",
    region: "spiti",
    location: "Kaza, Spiti Valley",
    rating: 4.7,
    price: 9500,
    image: "/src/assets/hotel_spiti.png",
    roomsAvailable: 3,
    totalRooms: 6,
    amenities: ["Stargazing Deck", "Oxygen Kit", "Local Cuisine", "WiFi"],
    description: "An authentic, eco-friendly retreat constructed in traditional mud-brick style, offering comfortable sanctuary in the high-altitude cold desert."
  },
  {
    id: "h4",
    name: "Tirthan River Whispers",
    region: "tirthan",
    location: "Jibhi, Tirthan Valley",
    rating: 4.8,
    price: 11000,
    image: "/src/assets/hotel_tirthan.png",
    roomsAvailable: 3,
    totalRooms: 5,
    amenities: ["WiFi", "Trout Fishing", "Riverside Garden", "Fireplace"],
    description: "A cozy riverside wood-and-stone cottage offering deep peace, forest walks, and personal trout-fishing access."
  },
  {
    id: "h5",
    name: "Dhauladhar Vista Resort",
    region: "dharamshala",
    location: "McLeod Ganj, Dharamshala",
    rating: 4.6,
    price: 8900,
    image: "/src/assets/paragliding.png",
    roomsAvailable: 4,
    totalRooms: 8,
    amenities: ["WiFi", "Yoga Deck", "Spa", "Mountain View"],
    description: "Unwind at this wellness-focused resort offering stunning panoramic views of the Dhauladhar range and daily yoga classes."
  },
  {
    id: "h6",
    name: "Kinner Kailash Cottages",
    region: "kinnaur",
    location: "Kalpa, Kinnaur",
    rating: 4.9,
    price: 12500,
    image: "/src/assets/kinnaur_valley.png",
    roomsAvailable: 2,
    totalRooms: 4,
    amenities: ["WiFi", "Apple Orchard", "Fireplace", "Mountain View"],
    description: "Exquisite cottages facing the legendary Kinner Kailash peak, situated directly within lush apple orchards."
  },
  {
    id: "h7",
    name: "Barot Trout Heights Lodge",
    region: "mandi",
    location: "Barot Valley, Mandi",
    rating: 4.8,
    price: 8500,
    image: "/src/assets/hotel_barot.png",
    roomsAvailable: 3,
    totalRooms: 6,
    amenities: ["WiFi", "Trout Fishing", "Riverside Garden", "Fireplace"],
    description: "A quiet mountain retreat surrounded by tall cedar trees, featuring direct access to trout-fishing spots."
  },
  {
    id: "h8",
    name: "Chamba Palace Heritage",
    region: "chamba",
    location: "Chamba Town, Chamba",
    rating: 4.7,
    price: 9800,
    image: "/src/assets/hotel_chamba.png",
    roomsAvailable: 4,
    totalRooms: 8,
    amenities: ["WiFi", "Historic Carvings", "Terrace Café", "Restaurant"],
    description: "A beautifully restored royal residency showcasing classic Chamba timber architecture and traditional carvings."
  },
  {
    id: "h9",
    name: "Parvati Woods Glamping",
    region: "kasol",
    location: "Kasol, Parvati Valley",
    rating: 4.9,
    price: 7500,
    image: "/src/assets/hotel_kasol.png",
    roomsAvailable: 3,
    totalRooms: 5,
    amenities: ["WiFi", "Geodesic Dome", "Campfire", "Riverside Views"],
    description: "Premium geodesic dome tents perched high in pine woods, overlooking the white waters of the Parvati River."
  },
  {
    id: "h10",
    name: "Hatu Peak Alpine Resort",
    region: "shimla",
    location: "Narkanda, Shimla",
    rating: 4.8,
    price: 13500,
    image: "/src/assets/hotel_narkanda.png",
    roomsAvailable: 4,
    totalRooms: 8,
    amenities: ["WiFi", "Skiing Gear", "Fireplace", "Mountain View"],
    description: "Luxury alpine stone-and-wood resort in Narkanda with slanted shingle roofs and private balconies overlooking Hatu peak."
  }
];

/**
 * Reads all hotels from the JSON database file, initializing with defaults if missing.
 * @returns {Array} List of hotels
 */
const readAll = () => {
  try {
    if (!fs.existsSync(hotelsFilePath)) {
      writeAll(defaultHotels);
      return defaultHotels;
    }
    const data = fs.readFileSync(hotelsFilePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading hotels file:', error);
    return defaultHotels;
  }
};

/**
 * Writes the complete hotels list to the JSON database file.
 * @param {Array} hotels 
 * @returns {boolean} Success status
 */
const writeAll = (hotels) => {
  try {
    fs.writeFileSync(hotelsFilePath, JSON.stringify(hotels, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing hotels file:', error);
    return false;
  }
};

/**
 * Finds a single hotel by ID.
 * @param {string} id 
 * @returns {Object|undefined} The hotel object
 */
const readById = (id) => {
  const hotels = readAll();
  return hotels.find(h => h.id === id);
};

/**
 * Increments/decrements available room count for a hotel.
 * @param {string} id 
 * @param {number} countChange 
 * @returns {boolean} Success status
 */
const updateRoomsAvailable = (id, countChange) => {
  const hotels = readAll();
  const hotelIndex = hotels.findIndex(h => h.id === id);
  if (hotelIndex === -1) return false;

  const hotel = hotels[hotelIndex];
  const newRooms = hotel.roomsAvailable + countChange;
  
  if (newRooms < 0 || newRooms > hotel.totalRooms) {
    return false; // Invalid room availability boundary
  }

  hotel.roomsAvailable = newRooms;
  hotels[hotelIndex] = hotel;
  writeAll(hotels);
  return true;
};

/**
 * Updates a hotel's image path.
 * @param {string} id 
 * @param {string} imageUrl 
 * @returns {boolean} Success status
 */
const updateHotelImage = (id, imageUrl) => {
  const hotels = readAll();
  const hotelIndex = hotels.findIndex(h => h.id === id);
  if (hotelIndex === -1) return false;

  hotels[hotelIndex].image = imageUrl;
  writeAll(hotels);
  return true;
};

module.exports = {
  readAll,
  writeAll,
  readById,
  updateRoomsAvailable,
  updateHotelImage
};
