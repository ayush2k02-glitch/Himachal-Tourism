import React, { useState } from 'react';

const destinationsData = [
  {
    name: "🥾 Triund & Dharamkot",
    region: "dharamshala",
    image: "/src/assets/triund_ridge.png",
    duration: "2-3 Days",
    rating: "9.6 Ratings",
    description: "Trek through scenic rhododendron forests to the grassy Triund ridge and camp directly beneath the dramatic rocky Dhauladhar cliffs.",
    price: "6,800",
    tag: "Trekking",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Triund+Ridge+McLeod+Ganj+Tourism"
  },
  {
    name: "🎿 Narkanda & Hatu Peak",
    region: "shimla",
    image: "/src/assets/narkanda_hatu.png",
    duration: "2-3 Days",
    rating: "9.4 Ratings",
    description: "Explore high-altitude apple orchards, experience winter skiing on snow-capped slopes, and enjoy panoramic 360-degree views of the snow-clad Himalayas from Hatu Peak.",
    price: "5,800",
    tag: "Skiing & Views",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Hatu+Peak+Narkanda+Tourism"
  },
  {
    name: "🎣 Barot Valley",
    region: "mandi",
    image: "/src/assets/barot_valley.png",
    duration: "2-3 Days",
    rating: "9.3 Ratings",
    description: "Discover a hidden gem famous for its colonial-era hydro project, trout-fishing in Uhl river, and pristine terraced green slopes.",
    price: "5,500",
    tag: "Nature & Fishing",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Barot+Valley+Mandi+Tourism"
  },
  {
    name: "🛕 Chamba Temple Town",
    region: "chamba",
    image: "/src/assets/chamba_temple.png",
    duration: "3-4 Days",
    rating: "9.4 Ratings",
    description: "Admire centuries-old wooden architecture, shikhara temples, and traditional miniature paintings in this ancient kingdom.",
    price: "6,200",
    tag: "Heritage",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Chamba+Temples+Tourism"
  },
  {
    name: "🏡 Chitkul Village",
    region: "kinnaur",
    image: "/src/assets/chitkul_village.png",
    duration: "5-6 Days",
    rating: "9.7 Ratings",
    description: "Explore the last inhabited village on the Indo-Tibetan border, set in pristine alpine valley with beautiful wooden houses.",
    price: "11,200",
    tag: "Last Border Village",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Chitkul+Village+Kinnaur+Tourism"
  },
  {
    name: "🪵 Jibhi Valley",
    region: "tirthan",
    image: "/src/assets/jibhi_valley.png",
    duration: "3-4 Days",
    rating: "9.5 Ratings",
    description: "Settle into cozy wooden cottages beside crystal-clear streams, and hike to Jalori Pass and Serolsar Lake.",
    price: "6,500",
    tag: "Nature & Cozy",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Jibhi+Tirthan+Valley+Tourism"
  },
  {
    name: "⛺ Jispa & Lahaul Valley",
    region: "spiti",
    image: "/src/assets/jispa_lahaul.png",
    duration: "4-5 Days",
    rating: "9.4 Ratings",
    description: "Drive through the engineering marvel Atal Tunnel to reach Jispa, offering riverside camps, stone houses, and raw landscapes.",
    price: "9,800",
    tag: "High Mountain Camping",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Jispa+Lahaul+Tourism"
  },
  {
    name: "🏔️ Kinnaur Valley",
    region: "kinnaur",
    image: "/src/assets/kinnaur_valley.png",
    duration: "5-6 Days",
    rating: "9.6 Ratings",
    description: "Marvel at the giant Kinner Kailash peaks, explore Kalpa's heritage, and enjoy organic golden apples.",
    price: "10,500",
    tag: "Mountain Pass Adventure",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kalpa+Kinnaur+Tourism"
  },
  {
    name: "🌱 Palampur Tea Gardens",
    region: "dharamshala",
    image: "/src/assets/palampur_tea.png",
    duration: "2-3 Days",
    rating: "9.2 Ratings",
    description: "Stroll through lush green tea gardens, visit historic temples, and explore pottery in Andretta village.",
    price: "5,200",
    tag: "Tea Orchards & Pottery",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Palampur+Tea+Gardens+Tourism"
  },
  {
    name: "☸️ Prashar Lake",
    region: "mandi",
    image: "/src/assets/prashar_lake.png",
    duration: "2 Days",
    rating: "9.5 Ratings",
    description: "Trek to the mysterious high-altitude lake featuring a floating island and a 14th-century wooden temple dedicated to sage Prashar.",
    price: "4,200",
    tag: "Trekking & Mystery",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Prashar+Lake+Mandi+Tourism"
  },
  {
    name: "🪷 Rewalsar Sacred Lake",
    region: "mandi",
    image: "/src/assets/rewalsar_lake.png",
    duration: "2 Days",
    rating: "9.1 Ratings",
    description: "Explore the sacred lake, holy to Buddhists, Hindus, and Sikhs, featuring giant caves, floating islands, and monasteries.",
    price: "3,800",
    tag: "Spiritual Harmony",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Rewalsar+Lake+Mandi+Tourism"
  },
  {
    name: "🌸 Sangla Valley",
    region: "kinnaur",
    image: "/src/assets/sangla_valley.png",
    duration: "4-5 Days",
    rating: "9.5 Ratings",
    description: "Explore the scenic valley surrounded by giant snow peaks, walnut orchards, and the historic Kamru Fort.",
    price: "9,500",
    tag: "Pine Forests & Orchards",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sangla+Valley+Kinnaur+Tourism"
  },
  {
    name: "🏡 Shoja Hamlet",
    region: "tirthan",
    image: "/src/assets/shoja_hamlet.png",
    duration: "2-3 Days",
    rating: "9.3 Ratings",
    description: "Unwind in a quiet hamlet surrounded by thick pine woods, offering panoramic views of the entire valley.",
    price: "5,500",
    tag: "Unwind & Nature",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Shoja+Tirthan+Valley+Tourism"
  },
  {
    name: "☸️ Spiti Key Monastery",
    region: "spiti",
    image: "/src/assets/spiti_monastery.png",
    duration: "7-8 Days",
    rating: "9.8 Ratings",
    description: "Embark on an overland journey to the cold desert wilderness, visiting the 1,000-year-old Key Monastery perched on a cliff.",
    price: "14,500",
    tag: "Buddhist Heritage",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Key+Monastery+Spiti+Tourism"
  },
  {
    name: "🌲 Tirthan River Valley",
    region: "tirthan",
    image: "/src/assets/tirthan_valley.png",
    duration: "3-4 Days",
    rating: "9.6 Ratings",
    description: "Fish for trout in the roaring Tirthan River and explore the Great Himalayan National Park, a UNESCO World Heritage site.",
    price: "7,800",
    tag: "Eco-Adventure & GHNP",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Tirthan+Valley+GHNP+Tourism"
  },
  {
    name: "🚂 Shimla Toy Train",
    region: "shimla",
    image: "/src/assets/toy_train.png",
    duration: "2-3 Days",
    rating: "9.4 Ratings",
    description: "Ride the historic UNESCO Kalka-Shimla toy train and explore colonial architecture on the Mall Road.",
    price: "4,500",
    tag: "Colonial Heritage",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Shimla+Mall+Road+Tourism"
  },
  {
    name: "🪂 Bir Billing Paragliding",
    region: "dharamshala",
    image: "/src/assets/paragliding.png",
    duration: "2-3 Days",
    rating: "9.8 Ratings",
    description: "Soar high in the air at the world's second-highest paragliding take-off site, Bir Billing, and land in scenic valley meadows.",
    price: "8,500",
    tag: "Aerosports & Cafes",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Bir+Billing+Paragliding+Tourism"
  },
  {
    name: "❄️ Manali & Solang Valley",
    region: "manali",
    image: "/src/assets/hero_bg.png",
    duration: "3-4 Days",
    rating: "9.6 Ratings",
    description: "Experience high-altitude paragliding, zorbing, and river rafting in Kullu, with snowy passes and old wood cabins.",
    price: "7,200",
    tag: "Alpine Adventure",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Solang+Valley+Manali+Tourism"
  },
  {
    name: "💨 Kasol & Parvati River",
    region: "kasol",
    image: "/src/assets/kasol_woods.png",
    duration: "2-3 Days",
    rating: "9.7 Ratings",
    description: "Stroll along the rushing Parvati River, trek through pine forests to Chalal village, and enjoy organic food in vibrant local cafes.",
    price: "4,800",
    tag: "Riverside Woods",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kasol+Parvati+Valley+Tourism"
  },
  {
    name: "🕉️ Langza & Buddha Statue",
    region: "spiti",
    image: "/src/assets/langza_buddha.png",
    duration: "3-4 Days",
    rating: "9.8 Ratings",
    description: "Visit the towering Buddha statue overlooking Spiti's fossil village, and explore ancient Tibetan mud-brick architecture at 4,400m altitude.",
    price: "11,500",
    tag: "Tibetan Heritage",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Langza+Buddha+Statue+Spiti+Tourism"
  },
  {
    name: "🌲 Dalhousie & Khajjiar",
    region: "chamba",
    image: "/src/assets/khajjiar_meadows.png",
    duration: "3-4 Days",
    rating: "9.5 Ratings",
    description: "Explore the giant cedar glades of Khajjiar Meadows, walk along Dalhousie's colonial pathways, and admire panoramic snow peaks.",
    price: "6,500",
    tag: "Alpine Meadows",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Khajjiar+Meadows+Dalhousie+Tourism"
  },
  {
    name: "🏏 Dharamshala HPCA Stadium",
    region: "dharamshala",
    image: "/src/assets/dharamshala_stadium.png",
    duration: "2 Days",
    rating: "9.7 Ratings",
    description: "Visit the stunning, colorful high-altitude cricket stadium nestled against the backdrop of the towering snow-covered Dhauladhar range.",
    price: "4,500",
    tag: "Sports & Views",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Dharamshala+Cricket+Stadium+Tourism"
  },
  {
    name: "🏔️ Jalori Pass & Serolsar Lake",
    region: "tirthan",
    image: "/src/assets/jalori_pass.png",
    duration: "2 Days",
    rating: "9.4 Ratings",
    description: "Trek through dense oak and pine woods from Jalori Pass at 3,120m to reach the holy waters of Serolsar Lake.",
    price: "5,200",
    tag: "High Mountain Pass",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Jalori+Pass+Tirthan+Valley+Tourism"
  },
  {
    name: "🏰 Mashobra Pine Reserve Forest",
    region: "shimla",
    image: "/src/assets/hotel_wildflower.png",
    duration: "2 Days",
    rating: "9.5 Ratings",
    description: "Walk through one of Asia's largest pine and oak forest reserves, with wild flora, high-altitude trails, and quiet wood cabins.",
    price: "3,500",
    tag: "Pine Woods Walk",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Mashobra+Reserve+Forest+Shimla+Tourism"
  },
  {
    name: "⛺ Tosh Village Glacial Trail",
    region: "kasol",
    image: "/src/assets/hotel_kasol.png",
    duration: "2-3 Days",
    rating: "9.6 Ratings",
    description: "Hike up the scenic ridge of Tosh village to view wooden Himachali homes, snow bridges, and the gushing glacial streams of Parvati Valley.",
    price: "4,200",
    tag: "Glacial Valley Trek",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Tosh+Village+Glacier+Trek+Parvati+Valley+Tourism"
  },
  {
    name: "🛖 Kaza Heritage & Mud-Brick Homes",
    region: "spiti",
    image: "/src/assets/hotel_spiti.png",
    duration: "3-4 Days",
    rating: "9.5 Ratings",
    description: "Stay in authentic mud-brick homes in Kaza, Spiti Valley's capital, exploring high-altitude farming and solar-passive traditional design.",
    price: "5,500",
    tag: "Mudhouse Experience",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Kaza+Mudhouse+Homestays+Spiti+Tourism"
  },
  {
    name: "🎣 Uhl River Riverside Camps",
    region: "mandi",
    image: "/src/assets/hotel_barot.png",
    duration: "2 Days",
    rating: "9.4 Ratings",
    description: "Camp on the banks of Uhl River in Barot Valley, featuring personal trout-angling access, bonfires, and cedar woods walking.",
    price: "3,800",
    tag: "Riverside Camps",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Uhl+River+Camping+Mandi+Tourism"
  },
  {
    name: "🌲 Old Manali & Hadimba Temple",
    region: "manali",
    image: "/src/assets/hadimba_temple.jpg",
    duration: "2 Days",
    rating: "9.5 Ratings",
    description: "Walk through giant deodar forests to the ancient wooden Hadimba temple, and explore Old Manali's winding paths, cafes, and wooden cabins.",
    price: "3,200",
    tag: "Colonial & Pine Trails",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Hadimba+Temple+Old+Manali+Tourism"
  },
  {
    name: "🌊 Jogini Waterfalls Hike",
    region: "manali",
    image: "/src/assets/tirthan_valley.png",
    duration: "1 Day",
    rating: "9.6 Ratings",
    description: "Trek through pine woods and apple orchards from Vashisht village to the stunning Jogini Waterfall, and soak in natural hot springs.",
    price: "1,500",
    tag: "Pine Forest Trek",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Jogini+Waterfalls+Manali+Tourism"
  },
  {
    name: "🏔️ Sach Pass Overland",
    region: "chamba",
    image: "/src/assets/jispa_lahaul.png",
    duration: "3-4 Days",
    rating: "9.7 Ratings",
    description: "Embark on an overland Jeep adventure across Sach Pass (4,420m) inside walls of thick snow to explore the rugged Pangi Valley.",
    price: "9,800",
    tag: "Glacial Pass Adventure",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Sach+Pass+Chamba+Tourism"
  },
  {
    name: "🛕 Bharmour Chaurasi Temples",
    region: "chamba",
    image: "/src/assets/chamba_temple.png",
    duration: "2-3 Days",
    rating: "9.4 Ratings",
    description: "Visit Bharmour, Chamba's ancient capital, home to the 84 sacred Chaurasi stone temples dating back to the 7th century.",
    price: "4,500",
    tag: "Ancient Stone Shrines",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Chaurasi+Temples+Bharmour+Tourism"
  }
];

const filterOptions = [
  { label: 'All Circuits', value: 'all' },
  { label: 'Shimla', value: 'shimla' },
  { label: 'Manali', value: 'manali' },
  { label: 'Dharamshala', value: 'dharamshala' },
  { label: 'Spiti Valley', value: 'spiti' },
  { label: 'Kinnaur', value: 'kinnaur' },
  { label: 'Tirthan Valley', value: 'tirthan' },
  { label: 'Chamba', value: 'chamba' },
  { label: 'Mandi & Barot', value: 'mandi' },
  { label: 'Parvati Valley', value: 'kasol' }
];


export default function Destinations({ onOpenInquiry, searchQuery, onSearchQueryChange }) {
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (e) => {
    onSearchQueryChange(e.target.value);
  };

  const filteredDestinations = destinationsData.filter((dest) => {
    const regionMatch = activeFilter === 'all' || dest.region === activeFilter;
    const query = searchQuery.trim().toLowerCase();
    const textMatch =
      !query ||
      dest.name.toLowerCase().includes(query) ||
      dest.description.toLowerCase().includes(query) ||
      dest.tag.toLowerCase().includes(query) ||
      dest.region.toLowerCase().includes(query);
    return regionMatch && textMatch;
  });

  return (
    <section id="destinations" className="destinations-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Explore Circuits</span>
          <h2 className="section-title text-gradient">Himalayan Tour Circuits</h2>
          <p className="section-desc">
            Explore carefully curated circuits, each offering a distinct mountain ecosystem, culture, and adventure profile.
          </p>
        </div>

        <div className="region-filters">
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              className={`filter-btn ${activeFilter === opt.value ? 'active' : ''}`}
              onClick={() => handleFilterChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="dest-search-bar">
          <svg className="dest-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="dest-search-input"
            type="text"
            placeholder="Search by name, activities (e.g. trekking, heritage), or regions..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {filteredDestinations.length === 0 ? (
          <div id="no-search-results" style={{ display: 'block', textAlign: 'center', padding: '3rem 0' }}>
            <h3>No matching destinations found.</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
              Try searching for something else or explore on Google.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a
                id="fallback-google-search"
                href={`https://www.google.com/search?q=Himachal+Tourism+${encodeURIComponent(searchQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="card-btn"
                style={{ padding: '0.65rem 1.5rem', borderRadius: '50px' }}
              >
                Search on Google
              </a>
              <a
                id="fallback-google-maps"
                href={`https://www.google.com/maps/search/?api=1&query=Himachal+Tourism+${encodeURIComponent(searchQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="card-btn"
                style={{ padding: '0.65rem 1.5rem', borderRadius: '50px' }}
              >
                Explore Maps
              </a>
            </div>
          </div>
        ) : (
          <div className="destination-grid">
            {filteredDestinations.map((dest) => (
              <article key={dest.name} className="dest-card glass-panel" data-region={dest.region}>
                <div className="card-img-wrapper">
                  <img src={dest.image} alt={dest.name} />
                  <span className="card-tag">{dest.tag}</span>
                </div>
                <div className="card-content">
                  <div className="card-meta">
                    <span className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {dest.duration}
                    </span>
                    <span className="meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      {dest.rating}
                    </span>
                  </div>
                  <h3>{dest.name}</h3>
                  <p>{dest.description}</p>
                  <div className="card-footer">
                    <div className="card-price">
                      Starts at<span>₹{dest.price}</span>
                    </div>
                    <div className="card-actions" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <a
                        href={dest.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="card-map-btn"
                        title="View on Google Maps"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </a>
                      <button className="card-btn open-booking-modal" onClick={() => onOpenInquiry(dest.name)}>
                        Book Now
                        <svg viewBox="0 0 24 24">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
