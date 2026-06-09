import React, { useState } from 'react';

const cultureTabs = [
  { id: 'cuisine', label: 'Cuisine' },
  { id: 'festivals', label: 'Festivals' },
  { id: 'attire', label: 'Heritage Attire' }
];

const cultureData = {
  cuisine: {
    title: "Himachali Dham & Delicacies",
    description: "Himachali cuisine is deeply shaped by the rugged climate. The traditional feast, 'Dham', is cooked by hereditary chefs called 'Boti' in brass vessels, featuring slow-cooked lentils, rice, and yogurt gravies.",
    image: "/src/assets/himachali_dham.png",
    imageFilter: "contrast(1.05) brightness(1.0)",
    items: [
      {
        name: "Siddu",
        description: "Steamed wheat flour bun stuffed with poppy seeds, walnuts, and spices, served soaked in pure hot clarified butter (ghee)."
      },
      {
        name: "Chana Madra",
        description: "Kabuli chickpeas slow-cooked in a rich, spiced yogurt-based gravy. A signature dish of the Chamba region."
      },
      {
        name: "Babru",
        description: "Black-gram stuffed deep-fried flatbread, similar to kachoris, best enjoyed hot with spicy tamarind chutney."
      },
      {
        name: "Tudkiya Bhath",
        description: "A spicy local pulao enriched with lentils, potatoes, local spices, yogurt, and a touch of cardamom."
      }
    ]
  },
  festivals: {
    title: "Divine Rites & Fairs",
    description: "Every village in Himachal has its own presiding local deity (Devta), and festivals are celebratory congregations of deities carried on wooden litters. The celebrations are loud, full of folk dancing (Nati), and brass band music.",
    image: "/src/assets/spiti_monastery.png",
    imageFilter: "saturate(0.8) brightness(0.95)",
    items: [
      {
        name: "Kullu Dussehra",
        description: "A week-long international festival in October where over 250 local deities assemble in Kullu's Dhalpur Maidan to pay obeisance to Lord Raghunath."
      },
      {
        name: "Minjar Fair",
        description: "Held in Chamba during August, celebrating agricultural abundance with music, historical processions, and floating silk minjars down the Ravi river."
      },
      {
        name: "Losar Festival",
        description: "The Tibetan New Year celebrated in Spiti, Lahaul, and McLeod Ganj with masked cham dances in monasteries and butter sculptures."
      },
      {
        name: "Lavi Fair",
        description: "A 300-year-old historic trade fair in Rampur during November, celebrating ancient trade treaties with Tibet, showcasing Kinnauri woolens."
      }
    ]
  },
  attire: {
    title: "Heritage Weaves & Woolens",
    description: "To combat the high-altitude cold, Himachali people wear hand-woven woolen textiles. These garments feature distinct geometric borders and patterns that represent their local valleys.",
    image: "/src/assets/kinnaur_valley.png",
    imageFilter: "contrast(1.05) brightness(0.9)",
    items: [
      {
        name: "Chola-Dora",
        description: "Traditional attire of the Gaddi shepherds, featuring a heavy wool gown (Chola) secured at the waist by a thick hand-woven black rope (Dora)."
      },
      {
        name: "Pattu",
        description: "A thick, heavily patterned hand-woven wool blanket worn by women in Kullu and Mandi, pinned at the shoulders with local silver pins."
      },
      {
        name: "Dhatu",
        description: "A square headscarf worn by women in Shimla and Sirmaur valleys, tied gracefully behind the head to cover the hair during field work."
      },
      {
        name: "Himachali Cap",
        description: "The iconic colorful wool cap worn with pride by local men, featuring velvet bands representing different districts (Kullu green, Bushahr orange)."
      }
    ]
  }
};

export default function CultureHub() {
  const [activeTab, setActiveTab] = useState('cuisine');
  const data = cultureData[activeTab];

  return (
    <section id="culture" className="culture-section section-padding">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Culture Hub</span>
          <h2 className="section-title text-gradient">Himalayan Heritage</h2>
          <p className="section-desc">
            Immerse yourself in the ancient traditions, unique mountain cuisine, divine festivals, and textile heritage of Devbhumi.
          </p>
        </div>

        <div className="culture-tabs">
          {cultureTabs.map((tab) => (
            <button
              key={tab.id}
              className={`culture-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="culture-content active" id={`culture-${activeTab}`}>
          <div className="culture-text-panel">
            <h3>{data.title}</h3>
            <p>{data.description}</p>
            <div className="culture-highlights-list">
              {data.items.map((item) => (
                <div key={item.name} className="culture-highlight-item">
                  <strong>{item.name}</strong>
                  <span>{item.description}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="culture-media-panel">
            <img
              src={data.image}
              alt={data.title}
              style={{ filter: data.imageFilter }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
