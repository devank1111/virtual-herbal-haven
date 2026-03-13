export interface CityData {
  name: string;
  state: string;
  lat: number;
  lng: number;
  plantIds: string[];
}

export const cityPlants: CityData[] = [
  {
    name: "Delhi",
    state: "Delhi",
    lat: 28.6139,
    lng: 77.209,
    plantIds: ["tulsi", "neem", "aloe-vera", "giloy", "peppermint", "moringa"],
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.076,
    lng: 72.8777,
    plantIds: ["tulsi", "turmeric", "neem", "hibiscus", "moringa", "aloe-vera"],
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    lat: 12.9716,
    lng: 77.5946,
    plantIds: ["sandalwood", "tulsi", "ashwagandha", "neem", "turmeric", "hibiscus"],
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lng: 80.2707,
    plantIds: ["neem", "tulsi", "turmeric", "cinnamon", "moringa", "shatavari"],
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    plantIds: ["tulsi", "neem", "brahmi", "giloy", "hibiscus", "peppermint"],
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    plantIds: ["ashwagandha", "aloe-vera", "neem", "tulsi", "amla", "giloy"],
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.385,
    lng: 78.4867,
    plantIds: ["ashwagandha", "turmeric", "neem", "tulsi", "moringa", "amla"],
  },
  {
    name: "Lucknow",
    state: "Uttar Pradesh",
    lat: 26.8467,
    lng: 80.9462,
    plantIds: ["tulsi", "neem", "peppermint", "amla", "giloy", "brahmi"],
  },
  {
    name: "Kochi",
    state: "Kerala",
    lat: 9.9312,
    lng: 76.2673,
    plantIds: ["cinnamon", "turmeric", "sandalwood", "moringa", "brahmi", "shatavari"],
  },
  {
    name: "Dehradun",
    state: "Uttarakhand",
    lat: 30.3165,
    lng: 78.0322,
    plantIds: ["ashwagandha", "tulsi", "lavender", "brahmi", "amla", "giloy"],
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0225,
    lng: 72.5714,
    plantIds: ["neem", "tulsi", "aloe-vera", "ashwagandha", "moringa", "amla"],
  },
  {
    name: "Mysore",
    state: "Karnataka",
    lat: 12.2958,
    lng: 76.6394,
    plantIds: ["sandalwood", "tulsi", "turmeric", "neem", "hibiscus", "cinnamon"],
  },
  // ── New Regional Entries ──
  {
    name: "Bhopal",
    state: "Madhya Pradesh",
    lat: 23.2599,
    lng: 77.4126,
    plantIds: ["ashwagandha", "kalmegh", "sarpagandha", "safed-musli", "gudmar", "arjun", "amla", "shatavari", "giloy", "bahera", "harra", "dahiman", "malkangni", "bael", "chirata", "kurchi", "guggul", "nagarmotha", "vidarikand", "palash"],
  },
  {
    name: "Thiruvananthapuram",
    state: "Kerala",
    lat: 8.5241,
    lng: 76.9366,
    plantIds: ["brahmi", "keezharnelli", "neermathalam", "nannari", "chittaratha", "thazhuthama", "thumba", "vayambu", "turmeric", "adulsa", "cinnamon", "mukkutti", "koduveli", "neela-amari", "cheroola"],
  },
  {
    name: "Dehradun",
    state: "Uttarakhand",
    lat: 30.3165,
    lng: 78.0322,
    plantIds: ["kutki", "jatamansi", "atis", "seabuckthorn", "brahma-kamal", "kesar", "tejpat", "ashwagandha", "tulsi", "lavender", "brahmi", "amla", "giloy", "pashanbhed", "tagar", "devdaru"],
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lng: 88.3639,
    plantIds: ["ulat-kambal", "harjora", "aparajita", "shiuli", "ghrita-kumari", "ayapan", "lebu-ghas", "bamunhati", "tulsi", "neem", "brahmi", "giloy", "hibiscus", "peppermint"],
  },
  {
    name: "Gangtok",
    state: "Sikkim",
    lat: 27.3389,
    lng: 88.6065,
    plantIds: ["jatamansi", "kutki", "brahma-kamal", "atis", "tagar", "devdaru", "brahmi", "giloy"],
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    lat: 26.9124,
    lng: 75.7873,
    plantIds: ["isabgol", "senna", "aloe-vera", "neem", "shankhpushpi", "gokhru", "henna", "karela", "tulsi", "ashwagandha", "amla", "giloy", "methi", "ajwain", "vasaka"],
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    lat: 23.0225,
    lng: 72.5714,
    plantIds: ["isabgol", "senna", "aloe-vera", "neem", "shankhpushpi", "gokhru", "henna", "karela", "tulsi", "moringa", "amla", "methi", "ajwain", "vasaka"],
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    lat: 31.1048,
    lng: 77.1734,
    plantIds: ["kutki", "jatamansi", "kesar", "tejpat", "devdaru", "tagar", "pashanbhed", "atis", "seabuckthorn", "brahma-kamal", "lavender", "ashwagandha"],
  },
];
