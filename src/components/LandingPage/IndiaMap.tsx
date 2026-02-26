import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cityPlants, CityData } from "@/data/cityPlants";
import { plants } from "@/data/plants";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Leaf } from "lucide-react";

export default function IndiaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [22.5, 78.5],
      zoom: 5,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    const customIcon = L.divIcon({
      html: `<div style="background: hsl(152, 45%, 28%); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); cursor: pointer;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1 6.5-2 11c-1.2 1.7-2.6 3.1-4 4.5z"/><path d="M10.7 10.7a1 1 0 1 0-1.4 1.4"/></svg>
      </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    cityPlants.forEach((city) => {
      const marker = L.marker([city.lat, city.lng], { icon: customIcon }).addTo(map);
      marker.bindTooltip(city.name, {
        permanent: false,
        direction: "top",
        className: "font-semibold",
      });
      marker.on("click", () => {
        setSelectedCity(city);
        map.flyTo([city.lat, city.lng], 8, { duration: 0.8 });
      });
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const cityPlantDetails = selectedCity
    ? plants.filter((p) => selectedCity.plantIds.includes(p.id))
    : [];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="text-sm font-semibold uppercase tracking-widest text-accent">
            Explore by Location
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-2 mb-4">
            Discover Plants Across India
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Click on any city marker to see the medicinal plants found in that region.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-botanical-lg border border-border">
          <div ref={mapRef} className="w-full h-[500px] z-0" />

          {/* City plants panel */}
          <AnimatePresence>
            {selectedCity && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 h-full w-full sm:w-96 bg-card/95 backdrop-blur-md border-l border-border z-10 overflow-y-auto"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {selectedCity.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{selectedCity.state}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedCity(null)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {cityPlantDetails.length} medicinal plants found
                  </p>

                  <div className="space-y-3">
                    {cityPlantDetails.map((plant) => (
                      <Link
                        key={plant.id}
                        to={`/plant/${plant.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-muted transition-colors group"
                      >
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                            {plant.name}
                          </h4>
                          <p className="text-xs text-muted-foreground italic">
                            {plant.scientificName}
                          </p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {plant.category.slice(0, 2).map((cat) => (
                              <span
                                key={cat}
                                className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Leaf className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
