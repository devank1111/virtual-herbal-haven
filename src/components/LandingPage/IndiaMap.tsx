import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin } from "lucide-react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Plant {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  category: string[];
  state: string;
}

export default function IndiaMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const labelLayerRef = useRef<L.LayerGroup | null>(null);

  // ✅ KEY FIX: statesWithData aur plants dono ref mein — click handlers stale closure se bachenge
  const plantsRef = useRef<Plant[]>([]);
  const statesWithDataRef = useRef<Set<string>>(new Set());

  const [plants, setPlants] = useState<Plant[]>([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  // ── Firebase se plants fetch ──────────────────────────────────────────────
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const snapshot = await getDocs(collection(db, "plants"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Plant[];

        // Dono ref aur state update karo
        plantsRef.current = data;
        statesWithDataRef.current = new Set(data.map((p) => p.state));
        setPlants(data);
      } catch (err) {
        console.error("Firebase fetch error:", err);
      } finally {
        setLoadingPlants(false);
      }
    };
    fetchPlants();
  }, []);

  // ── Leaflet map init (sirf ek baar) ──────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [22.5, 82],
      zoom: 5,
      scrollWheelZoom: true,
      zoomControl: true,
      minZoom: 4,
      maxZoom: 10,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }
    ).addTo(map);

    const labelLayer = L.layerGroup().addTo(map);
    labelLayerRef.current = labelLayer;

    fetch(
      "https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States"
    )
      .then((res) => res.json())
      .then((geojson) => {
        const layer = L.geoJSON(geojson, {
          style: (feature) => {
            const name =
              feature?.properties?.NAME_1 || feature?.properties?.name || "";
            // Ref se latest data padhega — stale closure nahi hoga
            const hasData = statesWithDataRef.current.has(name);
            return {
              fillColor: hasData ? "#2d6a4f" : "#b7d4c6",
              fillOpacity: hasData ? 0.6 : 0.28,
              color: "#ffffff",
              weight: 1.8,
              opacity: 1,
            };
          },
          onEachFeature: (feature, featureLayer) => {
            const stateName =
              feature?.properties?.NAME_1 || feature?.properties?.name || "";

            const bounds = (featureLayer as L.Polygon).getBounds();
            const center = bounds.getCenter();

            // Label add karo
            const addLabel = (hasData: boolean) => {
              const labelHtml = `
                <div class="state-label-wrapper ${hasData ? "has-plants" : ""}">
                  ${hasData ? `<img src="/leaf.png" class="state-leaf-icon" alt="plant" />` : ""}
                  <span class="state-label-text">${stateName}</span>
                </div>
              `;
              return L.marker(center, {
                icon: L.divIcon({
                  html: labelHtml,
                  className: "",
                  iconAnchor: [40, hasData ? 28 : 8],
                  iconSize: [80, hasData ? 36 : 16],
                }),
                interactive: false,
              });
            };

            addLabel(false).addTo(labelLayer);

            featureLayer.on({
              mouseover: (e) => {
                // ✅ Ref se real-time check
                const hasData = statesWithDataRef.current.has(stateName);
                (e.target as L.Path).setStyle({
                  fillOpacity: hasData ? 0.85 : 0.42,
                  weight: 2.8,
                  color: hasData ? "#52b788" : "#aaa",
                });
                (e.target as L.Path).bringToFront();
              },
              mouseout: (e) => {
                layer.resetStyle(e.target as L.Path);
              },
              click: () => {
                // ✅ Ref se check — kabhi stale nahi hoga
                const hasData = statesWithDataRef.current.has(stateName);
                if (!hasData) return;

                layer.resetStyle();
                (featureLayer as L.Path).setStyle({
                  fillColor: "#1b4332",
                  fillOpacity: 0.88,
                  color: "#95d5b2",
                  weight: 3,
                });
                setSelectedState(stateName);
                map.flyToBounds(
                  (featureLayer as L.Polygon).getBounds(),
                  { padding: [40, 40], duration: 0.9 }
                );
              },
            });
          },
        }).addTo(map);

        geoJsonLayerRef.current = layer;
      })
      .catch((err) => console.error("GeoJSON load error:", err));

    mapInstanceRef.current = map;
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // ── Plants load hone ke baad map re-style + labels rebuild ───────────────
  useEffect(() => {
    if (loadingPlants || !geoJsonLayerRef.current || !labelLayerRef.current)
      return;

    // State polygons re-colour
    geoJsonLayerRef.current.eachLayer((fl) => {
      const layer = fl as L.Path & { feature?: any };
      const stateName =
        layer.feature?.properties?.NAME_1 ||
        layer.feature?.properties?.name ||
        "";
      const hasData = statesWithDataRef.current.has(stateName);
      layer.setStyle({
        fillColor: hasData ? "#2d6a4f" : "#b7d4c6",
        fillOpacity: hasData ? 0.6 : 0.28,
        color: "#ffffff",
        weight: 1.8,
        opacity: 1,
      });
    });

    // Labels rebuild with leaf icons for states that have data
    labelLayerRef.current.clearLayers();
    geoJsonLayerRef.current.eachLayer((fl) => {
      const layer = fl as L.Polygon & { feature?: any };
      const stateName =
        layer.feature?.properties?.NAME_1 ||
        layer.feature?.properties?.name ||
        "";
      const hasData = statesWithDataRef.current.has(stateName);
      const center = layer.getBounds().getCenter();

      const labelHtml = `
        <div class="state-label-wrapper ${hasData ? "has-plants" : ""}">
          ${hasData ? `<img src="/leaf.png" class="state-leaf-icon" alt="plant" />` : ""}
          <span class="state-label-text">${stateName}</span>
        </div>
      `;

      L.marker(center, {
        icon: L.divIcon({
          html: labelHtml,
          className: "",
          iconAnchor: [40, hasData ? 28 : 8],
          iconSize: [80, hasData ? 36 : 16],
        }),
        interactive: false,
      }).addTo(labelLayerRef.current!);
    });
  }, [loadingPlants, plants]);

  // ── Selected state ke plants ──────────────────────────────────────────────
  const statePlants = selectedState
    ? plantsRef.current.filter((p) => p.state === selectedState)
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
            Click on any highlighted state to see the medicinal plants found in that region.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-botanical-lg border border-border">

          <div ref={mapRef} className="w-full h-[600px] z-0" />

          {/* Loading overlay */}
          {loadingPlants && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground font-medium">
                  Loading plant data…
                </p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-6 left-4 z-10 bg-white/90 backdrop-blur-sm border border-border rounded-xl px-4 py-3 flex flex-col gap-2 shadow-md">
            <p className="text-xs font-bold text-foreground mb-1">Legend</p>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ background: "#2d6a4f" }} />
              <span className="text-xs text-muted-foreground">Has medicinal plants</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ background: "#b7d4c6" }} />
              <span className="text-xs text-muted-foreground">No data yet</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/leaf.png" className="w-4 h-4 object-contain" alt="leaf" />
              <span className="text-xs text-muted-foreground">= click to explore</span>
            </div>
          </div>

          {/* Side Panel */}
          <AnimatePresence>
            {selectedState && (
              <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 h-full w-full sm:w-96 bg-card/95 backdrop-blur-md border-l border-border z-10 overflow-y-auto"
              >
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <h3 className="font-display text-lg font-bold text-foreground">
                          {selectedState}
                        </h3>
                        <p className="text-xs text-muted-foreground">India</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedState(null);
                        geoJsonLayerRef.current?.resetStyle();
                        mapInstanceRef.current?.flyTo([22.5, 82], 5, { duration: 0.8 });
                      }}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {statePlants.length} medicinal plant{statePlants.length !== 1 ? "s" : ""} found
                  </p>

                  <div className="space-y-3">
                    {statePlants.map((plant) => (
                      <Link
                        key={plant.id}
                        to={`/plant/${plant.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-muted transition-colors group"
                      >
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {plant.name}
                          </h4>
                          <p className="text-xs text-muted-foreground italic truncate mb-1">
                            {plant.scientificName}
                          </p>
                          <div className="flex gap-1 flex-wrap">
                            {(Array.isArray(plant.category)
                              ? plant.category
                              : [plant.category]
                            )
                              .slice(0, 2)
                              .map((cat) => (
                                <span
                                  key={cat}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium"
                                >
                                  {cat}
                                </span>
                              ))}
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    ))}

                    {statePlants.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No plants found for this state.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .state-label-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
          pointer-events: none;
          width: 80px;
        }
        .state-leaf-icon {
          width: 20px;
          height: 20px;
          object-fit: contain;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.35));
          animation: leafPulse 2.6s ease-in-out infinite;
        }
        @keyframes leafPulse {
          0%, 100% { transform: scale(1);    opacity: 0.85; }
          50%       { transform: scale(1.2); opacity: 1;    }
        }
        .state-label-text {
          font-size: 9px;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
          color: #1b4332;
          text-shadow:
            0 0 3px #fff, 0 0 6px #fff,
            1px 1px 0 #fff, -1px -1px 0 #fff,
            1px -1px 0 #fff, -1px 1px 0 #fff;
          letter-spacing: 0.3px;
          line-height: 1.2;
        }
        .has-plants .state-label-text {
          color: #081c15;
          font-size: 10px;
        }
        .leaflet-container {
          font-family: inherit;
          background: #e8f4f0;
        }
      `}</style>
    </section>
  );
}