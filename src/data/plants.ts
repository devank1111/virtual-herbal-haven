import tulsiImg from "@/assets/plants/tulsi.jpg";
import ashwagandhaImg from "@/assets/plants/ashwagandha.jpg";
import turmericImg from "@/assets/plants/turmeric.jpg";
import neemImg from "@/assets/plants/neem.jpg";
import aloeVeraImg from "@/assets/plants/aloe-vera.jpg";
import brahmiImg from "@/assets/plants/brahmi.jpg";
import amlaImg from "@/assets/plants/amla.jpg";
import shatavariImg from "@/assets/plants/shatavari.jpg";
import giloyImg from "@/assets/plants/giloy.jpg";
import lavenderImg from "@/assets/plants/lavender.jpg";

export type PlantCategory = "Adaptogen" | "Digestive" | "Immunity" | "Skin & Hair" | "Brain & Nerves" | "Respiratory" | "Anti-inflammatory" | "Detox";

export interface Plant {
  id: string;
  name: string;
  scientificName: string;
  hindiName: string;
  image: string;
  category: PlantCategory[];
  ayushSystem: ("Ayurveda" | "Yoga" | "Unani" | "Siddha" | "Homeopathy")[];
  description: string;
  habitat: string;
  partsUsed: string[];
  medicinalUses: string[];
  preparation: string;
  precautions: string;
  funFact: string;
}

export const plants: Plant[] = [
  {
    id: "tulsi",
    name: "Tulsi",
    scientificName: "Ocimum tenuiflorum",
    hindiName: "तुलसी",
    image: tulsiImg,
    category: ["Immunity", "Respiratory", "Adaptogen"],
    ayushSystem: ["Ayurveda", "Siddha"],
    description: "Known as the 'Queen of Herbs,' Tulsi (Holy Basil) is one of the most sacred plants in India. It has been used for thousands of years in Ayurvedic medicine for its diverse healing properties. Every part of the plant — leaves, stem, flower, root, seeds — is beneficial.",
    habitat: "Native to the Indian subcontinent, widely cultivated throughout Southeast Asia. Thrives in warm, tropical climates and is commonly found in household gardens across India.",
    partsUsed: ["Leaves", "Seeds", "Stem", "Root", "Flowers"],
    medicinalUses: [
      "Boosts immunity and fights infections",
      "Relieves respiratory disorders like cough, cold, and asthma",
      "Reduces stress and anxiety (adaptogenic properties)",
      "Helps regulate blood sugar levels",
      "Supports cardiovascular health",
      "Anti-inflammatory and antioxidant effects"
    ],
    preparation: "Fresh leaves can be chewed daily or brewed as tea. Tulsi tea is made by boiling 5-6 leaves in water for 10 minutes. Can also be consumed as dried powder, juice, or essential oil extract.",
    precautions: "May lower blood sugar levels significantly — diabetics should monitor. Not recommended during pregnancy in large doses. May interact with blood-thinning medications.",
    funFact: "In Hindu tradition, Tulsi is considered a manifestation of Goddess Lakshmi and is worshipped daily in millions of Indian households."
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    hindiName: "अश्वगंधा",
    image: ashwagandhaImg,
    category: ["Adaptogen", "Brain & Nerves", "Immunity"],
    ayushSystem: ["Ayurveda", "Unani"],
    description: "Ashwagandha, meaning 'smell of horse,' is one of the most powerful herbs in Ayurvedic healing. It has been used for over 3,000 years to relieve stress, increase energy levels, and improve concentration. It is classified as a Rasayana (rejuvenator) in Ayurveda.",
    habitat: "Found in dry regions of India, the Middle East, and parts of Africa. Grows well in sandy, well-drained soil and prefers arid conditions.",
    partsUsed: ["Root", "Leaves", "Berries"],
    medicinalUses: [
      "Reduces cortisol levels and manages stress",
      "Enhances brain function and memory",
      "Increases muscle strength and endurance",
      "Supports thyroid function",
      "Improves sleep quality",
      "Boosts testosterone and fertility in men"
    ],
    preparation: "Root powder (churna) is mixed with warm milk and honey before bedtime. Also available as capsules, liquid extracts, and as KSM-66 standardized extract. Traditional dose: 3-6 grams of root powder daily.",
    precautions: "Avoid during pregnancy. May interact with thyroid medications, immunosuppressants, and sedatives. Start with lower doses to assess tolerance.",
    funFact: "Ashwagandha is called 'Indian Ginseng' due to its rejuvenating properties, though it is botanically unrelated to true ginseng."
  },
  {
    id: "turmeric",
    name: "Turmeric",
    scientificName: "Curcuma longa",
    hindiName: "हल्दी",
    image: turmericImg,
    category: ["Anti-inflammatory", "Immunity", "Skin & Hair"],
    ayushSystem: ["Ayurveda", "Siddha", "Unani"],
    description: "Turmeric is a golden spice that has been a cornerstone of Indian medicine and cuisine for over 4,000 years. Its active compound, curcumin, is responsible for its vibrant color and powerful anti-inflammatory and antioxidant properties.",
    habitat: "Native to tropical South Asia, primarily India. Requires warm, humid climate with well-drained soil. Major cultivation in states like Andhra Pradesh, Tamil Nadu, and Maharashtra.",
    partsUsed: ["Rhizome (Root)"],
    medicinalUses: [
      "Powerful anti-inflammatory agent",
      "Strong antioxidant that neutralizes free radicals",
      "Supports joint health and reduces arthritis pain",
      "Promotes wound healing and skin health",
      "Aids digestion and gut health",
      "May help prevent heart disease and cancer"
    ],
    preparation: "Used fresh or as dried powder in cooking. 'Golden milk' (Haldi doodh) is prepared by mixing turmeric with warm milk. Can be made into paste for topical application. Combine with black pepper to enhance curcumin absorption by 2000%.",
    precautions: "High doses may cause digestive issues. May interact with blood-thinning medications. Avoid excessive use if you have gallbladder problems.",
    funFact: "India produces over 80% of the world's turmeric supply. It has been used as a natural dye for fabrics and in religious ceremonies for centuries."
  },
  {
    id: "neem",
    name: "Neem",
    scientificName: "Azadirachta indica",
    hindiName: "नीम",
    image: neemImg,
    category: ["Skin & Hair", "Immunity", "Detox"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    description: "Neem is called the 'Village Pharmacy' in India due to its extraordinary range of therapeutic applications. Every part of the neem tree — bark, leaves, flowers, seeds, and oil — has been used in traditional medicine for centuries.",
    habitat: "Native to the Indian subcontinent. Grows in tropical and semi-tropical regions, highly drought-resistant. Can thrive in poor soil conditions and is found throughout India.",
    partsUsed: ["Leaves", "Bark", "Seeds", "Oil", "Flowers", "Fruit"],
    medicinalUses: [
      "Treats skin conditions like acne, eczema, and psoriasis",
      "Natural antibacterial and antifungal agent",
      "Supports oral health and dental hygiene",
      "Purifies blood and detoxifies the body",
      "Acts as a natural insect repellent",
      "Helps manage blood sugar levels"
    ],
    preparation: "Leaves can be boiled in water for a skin wash. Neem oil is applied topically for skin issues. Neem twigs are traditionally used as toothbrushes (datun). Dried leaf powder can be consumed in capsule form.",
    precautions: "Not recommended during pregnancy or for those trying to conceive. Internal use in children should be limited. Neem oil should not be ingested in large quantities.",
    funFact: "A single neem tree can produce up to 50 kg of fruit per year and can live for over 200 years. It's often called 'Sarva Roga Nivarini' — the cure for all ailments."
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    hindiName: "घृतकुमारी",
    image: aloeVeraImg,
    category: ["Skin & Hair", "Digestive", "Anti-inflammatory"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    description: "Aloe Vera, known as 'Kumari' in Ayurveda, is a succulent plant that has been used for medicinal purposes for thousands of years across many cultures. The clear gel found inside its thick, fleshy leaves contains over 75 active compounds.",
    habitat: "Native to the Arabian Peninsula but now cultivated worldwide in tropical, semi-tropical, and arid climates. Grows well in well-drained, sandy soil with plenty of sunlight.",
    partsUsed: ["Leaf Gel", "Leaf Latex", "Leaf Skin"],
    medicinalUses: [
      "Soothes and heals burns, cuts, and skin irritations",
      "Moisturizes and nourishes skin and hair",
      "Supports digestive health and relieves constipation",
      "Helps manage blood sugar in type 2 diabetes",
      "Reduces dental plaque and oral inflammation",
      "Boosts immune system function"
    ],
    preparation: "Fresh gel is extracted from leaves and applied topically or consumed as juice. For skin care, apply gel directly. For digestion, blend gel with water. Aloe juice should be consumed fresh for maximum benefit.",
    precautions: "Aloe latex (yellow substance under leaf skin) is a strong laxative — avoid oral consumption. May interact with diabetes and heart medications. Topical use is generally safe for most people.",
    funFact: "Cleopatra reportedly used aloe vera gel as part of her daily beauty regimen. The plant is sometimes called the 'Plant of Immortality' by ancient Egyptians."
  },
  {
    id: "brahmi",
    name: "Brahmi",
    scientificName: "Bacopa monnieri",
    hindiName: "ब्राह्मी",
    image: brahmiImg,
    category: ["Brain & Nerves", "Adaptogen"],
    ayushSystem: ["Ayurveda"],
    description: "Brahmi is one of the most revered herbs in Ayurveda for enhancing cognitive function. Named after Lord Brahma, the creator god in Hinduism, it has been used for centuries as a brain tonic and memory enhancer by Vedic scholars.",
    habitat: "Found in wetlands, muddy shores, and marshes throughout India, Nepal, Sri Lanka, and other tropical regions. Thrives in moist, swampy conditions near water bodies.",
    partsUsed: ["Whole Plant", "Leaves"],
    medicinalUses: [
      "Enhances memory, learning, and concentration",
      "Reduces anxiety and mental fatigue",
      "Supports healthy brain aging",
      "Has neuroprotective properties",
      "Helps manage ADHD symptoms",
      "Promotes restful sleep"
    ],
    preparation: "Fresh juice of leaves is traditionally consumed. Brahmi ghee (clarified butter infused with Brahmi) is used in Ayurvedic formulations. Available as powder, tablets, and liquid extracts. Often combined with Shankhapushpi for enhanced brain benefits.",
    precautions: "May cause mild nausea or digestive upset initially. Can increase the effects of thyroid medications. Consult a practitioner before combining with other sedatives.",
    funFact: "Ancient Vedic scholars reportedly consumed Brahmi to memorize lengthy hymns and scriptures. It's still used by students in India during exam seasons."
  },
  {
    id: "amla",
    name: "Amla",
    scientificName: "Phyllanthus emblica",
    hindiName: "आंवला",
    image: amlaImg,
    category: ["Immunity", "Skin & Hair", "Digestive"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    description: "Amla (Indian Gooseberry) is considered one of the best rejuvenating herbs in Ayurveda. It is the richest natural source of Vitamin C, containing 20 times more than an orange. It is a key ingredient in the famous Triphala and Chyawanprash formulations.",
    habitat: "Native to India and grows throughout tropical and subtropical regions. Found in deciduous forests and cultivated commercially in states like Uttar Pradesh, Madhya Pradesh, and Rajasthan.",
    partsUsed: ["Fruit", "Seeds", "Leaves", "Bark"],
    medicinalUses: [
      "Exceptionally rich in Vitamin C — powerful immunity booster",
      "Promotes healthy hair growth and prevents premature graying",
      "Improves digestion and relieves hyperacidity",
      "Supports liver health and detoxification",
      "Strengthens eyesight and vision health",
      "Anti-aging properties for skin rejuvenation"
    ],
    preparation: "Can be eaten raw, dried, or as juice. Amla murabba (preserve) is a popular preparation. Amla powder can be mixed with water or added to smoothies. Amla oil is widely used for hair care.",
    precautions: "May lower blood sugar — diabetics should monitor. Very sour taste when raw, which some find unpleasant. Excessive consumption may cause acid reflux in some individuals.",
    funFact: "A single amla fruit contains as much Vitamin C as 2 oranges, and its antioxidant properties remain intact even after drying or cooking — a rarity among natural foods."
  },
  {
    id: "shatavari",
    name: "Shatavari",
    scientificName: "Asparagus racemosus",
    hindiName: "शतावरी",
    image: shatavariImg,
    category: ["Adaptogen", "Digestive", "Immunity"],
    ayushSystem: ["Ayurveda"],
    description: "Shatavari, meaning 'she who possesses a hundred husbands,' is the primary Ayurvedic herb for women's health. It is a powerful adaptogen and has been used for centuries to support the female reproductive system across all stages of life.",
    habitat: "Found throughout India in tropical and subtropical regions, especially in low jungles and shaded areas. Grows as a climbing plant with delicate, fern-like leaves and small, fragrant white flowers.",
    partsUsed: ["Tuberous Root"],
    medicinalUses: [
      "Supports women's reproductive health across all life stages",
      "Promotes lactation in nursing mothers",
      "Balances hormones and eases menstrual discomfort",
      "Strengthens immune system",
      "Soothes digestive tract and reduces acidity",
      "Adaptogenic — helps body cope with stress"
    ],
    preparation: "Root powder (1-2 teaspoons) is traditionally mixed with warm milk and honey. Available as tablets, capsules, and liquid extract. Often combined with Ashwagandha for comprehensive adaptogenic support.",
    precautions: "Avoid if you have estrogen-sensitive conditions. Not recommended for those with kidney disorders. May cause allergic reactions in people sensitive to asparagus family plants.",
    funFact: "Shatavari has been used in Ayurveda for over 4,000 years and is mentioned in ancient texts like Charaka Samhita as one of the most important herbs for vitality."
  },
  {
    id: "giloy",
    name: "Giloy",
    scientificName: "Tinospora cordifolia",
    hindiName: "गिलोय",
    image: giloyImg,
    category: ["Immunity", "Detox", "Anti-inflammatory"],
    ayushSystem: ["Ayurveda", "Siddha"],
    description: "Giloy, also known as 'Amrita' (the root of immortality), is a powerful immunomodulator that has gained enormous popularity for its ability to boost immunity. Its heart-shaped leaves and climbing vine nature make it easily identifiable.",
    habitat: "Native to tropical regions of India, Myanmar, and Sri Lanka. It's a climbing shrub that grows on other trees, especially neem and mango trees. Found abundantly in deciduous and dry forests.",
    partsUsed: ["Stem", "Root", "Leaves"],
    medicinalUses: [
      "Powerful immunomodulator — boosts innate immunity",
      "Effective against recurrent fevers (dengue, malaria, swine flu)",
      "Helps manage chronic fever and infections",
      "Detoxifies and purifies blood",
      "Reduces inflammation and joint pain in arthritis",
      "Supports liver health and digestion"
    ],
    preparation: "Stem juice is extracted and consumed fresh. Giloy satva (starch extract) is a traditional preparation. The stem can be boiled in water to make a decoction (kadha). Often combined with tulsi and black pepper for fever management.",
    precautions: "May lower blood sugar excessively — diabetics should monitor closely. Avoid before scheduled surgery. Overuse may lead to constipation in some individuals.",
    funFact: "During the COVID-19 pandemic, the Indian government's AYUSH Ministry recommended Giloy as a daily immunity booster, leading to a massive surge in demand across India."
  },
  {
    id: "lavender",
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    hindiName: "लैवेंडर",
    image: lavenderImg,
    category: ["Brain & Nerves", "Skin & Hair", "Respiratory"],
    ayushSystem: ["Unani", "Homeopathy"],
    description: "Lavender is a fragrant herb renowned worldwide for its calming properties. While originating from the Mediterranean, it has been adopted into various traditional healing systems including Unani medicine. Its essential oil is one of the most popular in aromatherapy.",
    habitat: "Native to the Mediterranean region, now cultivated in India (especially Kashmir and Himachal Pradesh), Europe, and worldwide. Prefers well-drained soil, full sunlight, and moderate climate.",
    partsUsed: ["Flowers", "Essential Oil", "Leaves"],
    medicinalUses: [
      "Promotes relaxation and reduces anxiety",
      "Improves sleep quality and treats insomnia",
      "Relieves headaches and migraines",
      "Soothes skin irritations and minor burns",
      "Acts as a natural antiseptic",
      "May help reduce blood pressure"
    ],
    preparation: "Essential oil is used in aromatherapy via diffuser or applied topically (diluted with carrier oil). Dried flowers can be brewed as calming tea. Lavender sachets placed under pillows promote restful sleep.",
    precautions: "Essential oil should not be ingested. Always dilute before skin application. May cause skin irritation in sensitive individuals. Use caution with hormone-sensitive conditions.",
    funFact: "The word 'lavender' comes from the Latin 'lavare,' meaning 'to wash.' Romans used lavender to scent their baths, beds, and clothes over 2,500 years ago."
  }
];

export const categories: PlantCategory[] = [
  "Adaptogen",
  "Digestive",
  "Immunity",
  "Skin & Hair",
  "Brain & Nerves",
  "Respiratory",
  "Anti-inflammatory",
  "Detox"
];
