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
import peppermintImg from "@/assets/plants/peppermint.jpg";
import moringaImg from "@/assets/plants/moringa.jpg";
import hibiscusImg from "@/assets/plants/hibiscus.jpg";
import cinnamonImg from "@/assets/plants/cinnamon.jpg";
import sandalwoodImg from "@/assets/plants/sandalwood.jpg";

export type PlantCategory = "Adaptogen" | "Digestive" | "Immunity" | "Skin & Hair" | "Brain & Nerves" | "Respiratory" | "Anti-inflammatory" | "Detox";

export interface PlantReference {
  title: string;
  authors: string;
  journal: string;
  year: number;
  link: string;
}

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
  nativeLocation: string;
  partsUsed: string[];
  medicinalUses: string[];
  preparation: string;
  precautions: string;
  funFact: string;
  researcher: string;
  references: PlantReference[];
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
    nativeLocation: "Indian Subcontinent, Southeast Asia",
    researcher: "Dr. Narendra Singh, King George's Medical University",
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
    funFact: "In Hindu tradition, Tulsi is considered a manifestation of Goddess Lakshmi and is worshipped daily in millions of Indian households.",
    references: [
      { title: "Tulsi - Ocimum sanctum: A herb for all reasons", authors: "Cohen, M.M.", journal: "Journal of Ayurveda and Integrative Medicine", year: 2014, link: "https://doi.org/10.4103/0975-9476.146554" },
      { title: "An Overview on Ashwagandha: A Rasayana (Rejuvenator) of Ayurveda", authors: "Singh, N. et al.", journal: "African Journal of Traditional, Complementary and Alternative Medicines", year: 2011, link: "https://doi.org/10.4314/ajtcam.v8i5S.9" }
    ]
  },
  {
    id: "ashwagandha",
    name: "Ashwagandha",
    scientificName: "Withania somnifera",
    hindiName: "अश्वगंधा",
    image: ashwagandhaImg,
    category: ["Adaptogen", "Brain & Nerves", "Immunity"],
    ayushSystem: ["Ayurveda", "Unani"],
    nativeLocation: "India, Middle East, Northern Africa",
    researcher: "Dr. K. Chandrasekhar, Prakruti Hospital, Hyderabad",
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
    funFact: "Ashwagandha is called 'Indian Ginseng' due to its rejuvenating properties, though it is botanically unrelated to true ginseng.",
    references: [
      { title: "A prospective, randomized double-blind, placebo-controlled study of safety and efficacy of a high-concentration full-spectrum extract of Ashwagandha root", authors: "Chandrasekhar, K. et al.", journal: "Indian Journal of Psychological Medicine", year: 2012, link: "https://doi.org/10.4103/0253-7176.106022" },
      { title: "Efficacy and Safety of Ashwagandha Root Extract in Subclinical Hypothyroid Patients", authors: "Sharma, A.K. et al.", journal: "Journal of Alternative and Complementary Medicine", year: 2018, link: "https://doi.org/10.1089/acm.2017.0183" }
    ]
  },
  {
    id: "turmeric",
    name: "Turmeric",
    scientificName: "Curcuma longa",
    hindiName: "हल्दी",
    image: turmericImg,
    category: ["Anti-inflammatory", "Immunity", "Skin & Hair"],
    ayushSystem: ["Ayurveda", "Siddha", "Unani"],
    nativeLocation: "Tropical South Asia (India, Indonesia)",
    researcher: "Dr. Bharat B. Aggarwal, MD Anderson Cancer Center",
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
    funFact: "India produces over 80% of the world's turmeric supply. It has been used as a natural dye for fabrics and in religious ceremonies for centuries.",
    references: [
      { title: "Curcumin: A Review of Its Effects on Human Health", authors: "Hewlings, S.J. & Kalman, D.S.", journal: "Foods", year: 2017, link: "https://doi.org/10.3390/foods6100092" },
      { title: "Therapeutic Roles of Curcumin: Lessons Learned from Clinical Trials", authors: "Aggarwal, B.B. & Harikumar, K.B.", journal: "The AAPS Journal", year: 2013, link: "https://doi.org/10.1208/s12248-012-9432-8" }
    ]
  },
  {
    id: "neem",
    name: "Neem",
    scientificName: "Azadirachta indica",
    hindiName: "नीम",
    image: neemImg,
    category: ["Skin & Hair", "Immunity", "Detox"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    nativeLocation: "Indian Subcontinent, Myanmar",
    researcher: "Dr. H.S. Puri, Indian Institute of Integrative Medicine",
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
    funFact: "A single neem tree can produce up to 50 kg of fruit per year and can live for over 200 years. It's often called 'Sarva Roga Nivarini' — the cure for all ailments.",
    references: [
      { title: "Neem (Azadirachta indica): Prehistory to contemporary medicinal uses to humankind", authors: "Kumar, V.S. & Navaratnam, V.", journal: "Asian Pacific Journal of Tropical Biomedicine", year: 2013, link: "https://doi.org/10.1016/S2221-1691(13)60105-7" }
    ]
  },
  {
    id: "aloe-vera",
    name: "Aloe Vera",
    scientificName: "Aloe barbadensis miller",
    hindiName: "घृतकुमारी",
    image: aloeVeraImg,
    category: ["Skin & Hair", "Digestive", "Anti-inflammatory"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    nativeLocation: "Arabian Peninsula, North Africa",
    researcher: "Dr. Josias Hamman, Tshwane University of Technology",
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
    funFact: "Cleopatra reportedly used aloe vera gel as part of her daily beauty regimen. The plant is sometimes called the 'Plant of Immortality' by ancient Egyptians.",
    references: [
      { title: "Composition and Applications of Aloe vera Leaf Gel", authors: "Hamman, J.H.", journal: "Molecules", year: 2008, link: "https://doi.org/10.3390/molecules13081599" }
    ]
  },
  {
    id: "brahmi",
    name: "Brahmi",
    scientificName: "Bacopa monnieri",
    hindiName: "ब्राह्मी",
    image: brahmiImg,
    category: ["Brain & Nerves", "Adaptogen"],
    ayushSystem: ["Ayurveda"],
    nativeLocation: "Wetlands of India, Nepal, Sri Lanka, East Asia",
    researcher: "Dr. Con Stough, Swinburne University of Technology",
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
    funFact: "Ancient Vedic scholars reportedly consumed Brahmi to memorize lengthy hymns and scriptures. It's still used by students in India during exam seasons.",
    references: [
      { title: "The chronic effects of an extract of Bacopa monniera (Brahmi) on cognitive function in healthy human subjects", authors: "Stough, C. et al.", journal: "Psychopharmacology", year: 2001, link: "https://doi.org/10.1007/s002130100815" }
    ]
  },
  {
    id: "amla",
    name: "Amla",
    scientificName: "Phyllanthus emblica",
    hindiName: "आंवला",
    image: amlaImg,
    category: ["Immunity", "Skin & Hair", "Digestive"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    nativeLocation: "India, Tropical Southeast Asia",
    researcher: "Dr. S.S. Patel, Institute of Pharmacy, Nirma University",
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
    funFact: "A single amla fruit contains as much Vitamin C as 2 oranges, and its antioxidant properties remain intact even after drying or cooking — a rarity among natural foods.",
    references: [
      { title: "Emblica officinalis (Amla): A review for its phytochemistry, ethnomedicinal uses and pharmacology", authors: "Patel, S.S. & Goyal, R.K.", journal: "Journal of Applied Pharmaceutical Science", year: 2012, link: "https://doi.org/10.7324/JAPS.2012.2403" }
    ]
  },
  {
    id: "shatavari",
    name: "Shatavari",
    scientificName: "Asparagus racemosus",
    hindiName: "शतावरी",
    image: shatavariImg,
    category: ["Adaptogen", "Digestive", "Immunity"],
    ayushSystem: ["Ayurveda"],
    nativeLocation: "India, Sri Lanka, Himalayas, Southeast Asia",
    researcher: "Dr. Nandini Sharma, Banaras Hindu University",
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
    funFact: "Shatavari has been used in Ayurveda for over 4,000 years and is mentioned in ancient texts like Charaka Samhita as one of the most important herbs for vitality.",
    references: [
      { title: "Pharmacological activities of Asparagus racemosus (Shatavari): A review", authors: "Sharma, N. & Kumar, A.", journal: "International Journal of Pharmaceutical Sciences and Research", year: 2017, link: "https://doi.org/10.13040/IJPSR.0975-8232" }
    ]
  },
  {
    id: "giloy",
    name: "Giloy",
    scientificName: "Tinospora cordifolia",
    hindiName: "गिलोय",
    image: giloyImg,
    category: ["Immunity", "Detox", "Anti-inflammatory"],
    ayushSystem: ["Ayurveda", "Siddha"],
    nativeLocation: "India, Myanmar, Sri Lanka, Tropical Africa",
    researcher: "Dr. Renu Jain, University of Rajasthan",
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
    funFact: "During the COVID-19 pandemic, the Indian government's AYUSH Ministry recommended Giloy as a daily immunity booster, leading to a massive surge in demand across India.",
    references: [
      { title: "Tinospora cordifolia (Giloy): A Review on its Phytochemical and Pharmacological Profile", authors: "Jain, R. et al.", journal: "Journal of Ethnopharmacology", year: 2019, link: "https://doi.org/10.1016/j.jep.2019.112015" }
    ]
  },
  {
    id: "lavender",
    name: "Lavender",
    scientificName: "Lavandula angustifolia",
    hindiName: "लैवेंडर",
    image: lavenderImg,
    category: ["Brain & Nerves", "Skin & Hair", "Respiratory"],
    ayushSystem: ["Unani", "Homeopathy"],
    nativeLocation: "Mediterranean Region, Kashmir, Southern Europe",
    researcher: "Dr. Peir Hossein Koulivand, Tehran University of Medical Sciences",
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
    funFact: "The word 'lavender' comes from the Latin 'lavare,' meaning 'to wash.' Romans used lavender to scent their baths, beds, and clothes over 2,500 years ago.",
    references: [
      { title: "Lavender and the Nervous System", authors: "Koulivand, P.H. et al.", journal: "Evidence-Based Complementary and Alternative Medicine", year: 2013, link: "https://doi.org/10.1155/2013/681304" }
    ]
  },
  {
    id: "peppermint",
    name: "Peppermint",
    scientificName: "Mentha × piperita",
    hindiName: "पुदीना",
    image: peppermintImg,
    category: ["Digestive", "Respiratory", "Brain & Nerves"],
    ayushSystem: ["Ayurveda", "Unani"],
    nativeLocation: "Europe, Mediterranean, now worldwide",
    researcher: "Dr. Diane McKay, Tufts University",
    description: "Peppermint is a hybrid mint cross between watermint and spearmint. It is widely used in both Eastern and Western herbal traditions for its cooling, soothing properties. The menthol in peppermint leaves provides the characteristic minty scent and therapeutic effects.",
    habitat: "Originally from Europe but now cultivated globally. In India, major production in Uttar Pradesh and Punjab. Thrives in moist, shaded environments with rich soil.",
    partsUsed: ["Leaves", "Essential Oil", "Stem"],
    medicinalUses: [
      "Relieves irritable bowel syndrome (IBS) symptoms",
      "Soothes nausea, indigestion, and bloating",
      "Clears nasal congestion and respiratory passages",
      "Reduces headache and migraine intensity",
      "Improves mental focus and alertness",
      "Natural antimicrobial properties"
    ],
    preparation: "Fresh or dried leaves brewed as tea (steep 5-10 minutes). Peppermint oil capsules for IBS relief. Diluted essential oil applied topically for headaches. Inhalation of steam with peppermint oil for congestion.",
    precautions: "Peppermint oil capsules may cause heartburn. Not recommended for infants and young children. May worsen GERD symptoms. Essential oil should be diluted before topical use.",
    funFact: "Peppermint was first described in 1753 by Carl Linnaeus. It cannot reproduce by seed and spreads only through runners — every peppermint plant is a clone!",
    references: [
      { title: "A review of the bioactivity and potential health benefits of peppermint tea", authors: "McKay, D.L. & Blumberg, J.B.", journal: "Phytotherapy Research", year: 2006, link: "https://doi.org/10.1002/ptr.1936" },
      { title: "Peppermint oil for the treatment of irritable bowel syndrome", authors: "Khanna, R. et al.", journal: "Journal of Clinical Gastroenterology", year: 2014, link: "https://doi.org/10.1097/MCG.0b013e3182a88e68" }
    ]
  },
  {
    id: "moringa",
    name: "Moringa",
    scientificName: "Moringa oleifera",
    hindiName: "सहजन",
    image: moringaImg,
    category: ["Immunity", "Anti-inflammatory", "Digestive"],
    ayushSystem: ["Ayurveda", "Siddha", "Unani"],
    nativeLocation: "Sub-Himalayan regions of India, Pakistan, Afghanistan",
    researcher: "Dr. Jed W. Fahey, Johns Hopkins University",
    description: "Moringa, known as the 'Miracle Tree' or 'Drumstick Tree,' is one of the most nutrient-dense plants on earth. Nearly every part of the tree is edible and packed with vitamins, minerals, and amino acids. It has been used in traditional medicine for over 4,000 years.",
    habitat: "Native to the sub-Himalayan regions. Grows rapidly in tropical and subtropical climates. Highly drought-resistant and can thrive in poor, sandy soil. Widely cultivated across India, Africa, and Southeast Asia.",
    partsUsed: ["Leaves", "Seeds", "Pods (Drumsticks)", "Flowers", "Bark", "Root"],
    medicinalUses: [
      "Extremely nutrient-dense — rich in vitamins A, C, E, calcium, and iron",
      "Powerful anti-inflammatory and antioxidant",
      "Helps regulate blood sugar and cholesterol levels",
      "Supports brain health and neuroprotection",
      "Promotes wound healing and tissue repair",
      "Antibacterial properties — fights infections"
    ],
    preparation: "Leaves consumed fresh in salads or cooked in dishes. Leaf powder added to smoothies, soups, or teas. Drumsticks cooked in sambar and curries. Seeds can be roasted and eaten. Moringa tea from dried leaves.",
    precautions: "Root bark contains spirochin — avoid consuming root bark in large amounts. Pregnant women should avoid moringa bark and root. May interact with thyroid and diabetes medications.",
    funFact: "Moringa leaves contain 7x the Vitamin C of oranges, 4x the calcium of milk, 4x the Vitamin A of carrots, and 3x the potassium of bananas — truly a superfood!",
    references: [
      { title: "Moringa oleifera: A Review of the Medical Evidence for Its Nutritional, Therapeutic, and Prophylactic Properties", authors: "Fahey, J.W.", journal: "Trees for Life Journal", year: 2005, link: "https://doi.org/10.1201/9781420039078" },
      { title: "The miracle tree: Moringa oleifera", authors: "Anwar, F. et al.", journal: "Phytotherapy Research", year: 2007, link: "https://doi.org/10.1002/ptr.2023" }
    ]
  },
  {
    id: "hibiscus",
    name: "Hibiscus",
    scientificName: "Hibiscus rosa-sinensis",
    hindiName: "गुड़हल",
    image: hibiscusImg,
    category: ["Skin & Hair", "Immunity", "Digestive"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    nativeLocation: "Tropical Asia (China, India, Pacific Islands)",
    researcher: "Dr. Ali Esmail Al-Snafi, University of Thi-Qar, Iraq",
    description: "Hibiscus is a stunningly beautiful flowering plant with deep roots in traditional medicine across multiple cultures. Known as 'Japa' in Ayurveda, the vibrant red flower is not only ornamental but packed with antioxidants, vitamins, and minerals that support overall health.",
    habitat: "Native to tropical Asia, now cultivated worldwide in warm climates. Common garden plant across India, found in nearly every state. Thrives in full sunlight with well-watered, nutrient-rich soil.",
    partsUsed: ["Flowers", "Leaves", "Root", "Calyces"],
    medicinalUses: [
      "Promotes hair growth and prevents premature graying",
      "Lowers blood pressure naturally",
      "Rich in antioxidants — fights oxidative stress",
      "Supports liver health and detoxification",
      "Aids weight management and metabolism",
      "Helps manage menstrual pain and irregularities"
    ],
    preparation: "Flowers brewed as hibiscus tea (steep in hot water 5-10 minutes). Flower paste applied to hair for conditioning. Fresh petals ground into a face pack for skin care. Hibiscus oil made by infusing petals in coconut oil.",
    precautions: "May lower blood pressure significantly — monitor if on BP medications. Not recommended during pregnancy. May interact with chloroquine (malaria drug). Excess tea consumption may affect liver in rare cases.",
    funFact: "In India, hibiscus flowers are offered to Goddess Kali and Lord Ganesha in Hindu worship. The flower is also the national flower of Malaysia.",
    references: [
      { title: "Chemical constituents and pharmacological effects of Hibiscus rosa-sinensis - A review", authors: "Al-Snafi, A.E.", journal: "International Journal of Pharmaceutical Sciences and Research", year: 2018, link: "https://doi.org/10.13040/IJPSR.0975-8232" },
      { title: "Hibiscus sabdariffa L. – A phytochemical and pharmacological review", authors: "Da-Costa-Rocha, I. et al.", journal: "Food Chemistry", year: 2014, link: "https://doi.org/10.1016/j.foodchem.2014.05.002" }
    ]
  },
  {
    id: "cinnamon",
    name: "Cinnamon",
    scientificName: "Cinnamomum verum",
    hindiName: "दालचीनी",
    image: cinnamonImg,
    category: ["Digestive", "Anti-inflammatory", "Immunity"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    nativeLocation: "Sri Lanka, Southern India (Kerala, Tamil Nadu)",
    researcher: "Dr. Priyanga Ranasinghe, University of Colombo, Sri Lanka",
    description: "Cinnamon is one of the oldest and most prized spices in the world, with a medicinal history spanning over 4,000 years. Known as 'Dalchini' in Hindi and 'Twak' in Ayurveda, it is derived from the inner bark of Cinnamomum trees and is valued for its warm, sweet flavor and powerful healing properties.",
    habitat: "Native to Sri Lanka and the Malabar Coast of India. Grows in tropical evergreen forests. Cultivated commercially in Sri Lanka, Kerala, Tamil Nadu, and Karnataka. Requires warm, humid climate with plenty of rainfall.",
    partsUsed: ["Inner Bark", "Essential Oil", "Leaves"],
    medicinalUses: [
      "Helps regulate blood sugar levels in type 2 diabetes",
      "Anti-inflammatory and reduces chronic pain",
      "Antimicrobial — fights bacterial and fungal infections",
      "Supports heart health and lowers LDL cholesterol",
      "Rich in antioxidants (polyphenols)",
      "Aids digestion and relieves bloating"
    ],
    preparation: "Bark sticks added to curries, teas, and desserts. Cinnamon powder mixed with honey as a tonic. Cinnamon tea brewed by boiling a stick in water. Essential oil used in aromatherapy. Traditional Ayurvedic combination with cardamom and ginger.",
    precautions: "Cassia cinnamon (common variety) contains coumarin which can damage liver in high doses — prefer Ceylon cinnamon. May lower blood sugar too much when combined with diabetes medications. Avoid large doses during pregnancy.",
    funFact: "In ancient Egypt, cinnamon was considered more precious than gold. It was used in the embalming process and as a gift for monarchs and gods.",
    references: [
      { title: "Cinnamon as a potential therapeutic agent for type 2 diabetes mellitus: A systematic review and meta-analysis", authors: "Ranasinghe, P. et al.", journal: "Diabetic Medicine", year: 2012, link: "https://doi.org/10.1111/j.1464-5491.2012.03718.x" },
      { title: "Medicinal properties of 'true' cinnamon (Cinnamomum zeylanicum): A systematic review", authors: "Ranasinghe, P. et al.", journal: "BMC Complementary Medicine and Therapies", year: 2013, link: "https://doi.org/10.1186/1472-6882-13-275" }
    ]
  },
  {
    id: "sandalwood",
    name: "Sandalwood",
    scientificName: "Santalum album",
    hindiName: "चन्दन",
    image: sandalwoodImg,
    category: ["Skin & Hair", "Brain & Nerves", "Anti-inflammatory"],
    ayushSystem: ["Ayurveda", "Unani", "Siddha"],
    nativeLocation: "Southern India (Karnataka, Tamil Nadu, Kerala)",
    researcher: "Dr. T.P. Hemavathy, Indian Institute of Science, Bangalore",
    description: "Sandalwood is one of the most sacred and expensive woods in the world. Known as 'Chandan' in Hindi, it has been integral to Indian culture, spirituality, and medicine for over 4,000 years. Its heartwood produces a fragrant essential oil that is highly valued in perfumery and traditional medicine.",
    habitat: "Native to the dry deciduous forests of Southern India, especially Karnataka (Mysore sandalwood is the finest quality). Also found in Tamil Nadu, Kerala, and parts of Southeast Asia. Grows as a semi-parasitic tree, relying on host tree roots for nutrients.",
    partsUsed: ["Heartwood", "Essential Oil", "Bark", "Roots"],
    medicinalUses: [
      "Cooling agent — reduces body heat and inflammation",
      "Promotes clear, glowing skin and treats acne",
      "Calms the mind and reduces anxiety (aromatherapy)",
      "Antiseptic and antibacterial for skin infections",
      "Supports urinary tract health",
      "Used in meditation for mental clarity and focus"
    ],
    preparation: "Sandalwood paste made by rubbing heartwood on a wet stone. Essential oil used in aromatherapy and skincare. Sandalwood powder mixed with rose water for face packs. Chandan tilak applied on forehead for cooling effect. Oil used in massage therapy.",
    precautions: "Pure sandalwood oil is very concentrated — always dilute before application. Some individuals may develop contact dermatitis. Avoid ingestion of essential oil. Adulterated products are common — ensure authenticity.",
    funFact: "Indian sandalwood takes 15-20 years to develop its fragrant heartwood. Karnataka's sandalwood forests are so valuable that sandalwood trees are considered government property, and their illegal felling is a serious criminal offense.",
    references: [
      { title: "Sandalwood Oil as a Botanical Therapeutic in Dermatology", authors: "Moy, R.L. & Levenson, C.", journal: "Journal of Clinical and Aesthetic Dermatology", year: 2017, link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5749697/" },
      { title: "Santalum album: A review on phytochemistry and pharmacology", authors: "Hemavathy, T.P. et al.", journal: "International Journal of PharmTech Research", year: 2015, link: "https://doi.org/10.13140/RG.2.1.1553.3284" }
    ]
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
