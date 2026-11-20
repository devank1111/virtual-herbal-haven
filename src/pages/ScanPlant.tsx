import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePlants } from "@/hooks/usePlants";

interface PlantResult {
  status: string;
  message?: string;
  scientific_name?: string;
  common_name?: string;
  confidence?: number;
  details?: Record<string, string>;
  saved?: boolean;
}
const API = import.meta.env.VITE_PLANT_API_URL || "http://localhost:8000";

export default function ScanPlant() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PlantResult | null>(null);
  const { plants, loading: plantsLoading, error: plantsError } = usePlants();
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  async function identify() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const form = new FormData();
      form.append("image", file);
      const res = await fetch(`${API}/identify`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Unable to identify image");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const normalizeName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

const predictedName = result?.common_name || "";

const matchedPlant =
  result?.status === "predicted" &&
  typeof result.confidence === "number" &&
  result.confidence >= 0.8 &&
  !plantsError
    ? plants.find(
        (plant) =>
          normalizeName(plant.name) === normalizeName(predictedName) ||
          normalizeName(plant.scientificName) === normalizeName(predictedName)
      )
    : undefined;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f1f8f0",
        padding: "3rem 1rem",
        color: "#173b29",
      }}
    >
      <div
        style={{
          maxWidth: 650,
          margin: "auto",
          background: "white",
          padding: 28,
          borderRadius: 18,
          boxShadow: "0 8px 25px #173b2915",
        }}
      >
        <Link to="/garden">← Back to garden</Link>
        <h1 style={{ fontSize: 30, fontWeight: 700, marginTop: 20 }}>
          🌿 Scan a Plant
        </h1>
        <p>
          Take a plant photo or upload one from your gallery. Only plant images
          are supported.
        </p>
        <label style={{ display: "block", marginTop: 22, fontWeight: 600 }}>
          Plant image
        </label>
        <input
          aria-label="Plant image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult(null);
            setError("");
          }}
          style={{ display: "block", margin: "12px 0" }}
        />
        {preview && (
          <img
            src={preview}
            alt="Selected plant"
            style={{
              width: "100%",
              maxHeight: 360,
              objectFit: "contain",
              borderRadius: 12,
            }}
          />
        )}
        <button
          disabled={!file || loading}
          onClick={identify}
          style={{
            background: "#267849",
            color: "white",
            padding: "12px 22px",
            borderRadius: 10,
            marginTop: 16,
            opacity: !file || loading ? 0.5 : 1,
          }}
        >
          {loading ? "Analyzing..." : "Identify Plant"}
        </button>
        {error && (
          <p role="alert" style={{ color: "#a12525", marginTop: 16 }}>
            {error}
          </p>
        )}
        {result && (
          <section
            style={{
              marginTop: 22,
              padding: 18,
              background: "#eef7ef",
              borderRadius: 12,
            }}
          >
            <h2 style={{ fontWeight: 700, fontSize: 21 }}>
              {result.common_name ||
                result.scientific_name ||
                "Identification result"}
            </h2>
            {result.scientific_name && (
              <p>
                <i>{result.scientific_name}</i>
              </p>
            )}
            {typeof result.confidence === "number" && (
              <p>Confidence: {(result.confidence * 100).toFixed(1)}%</p>
            )}
            <p>{result.message}</p>
            {result.details &&
              Object.entries(result.details).map(([key, value]) => (
                <p key={key}>
                  <b>{key}:</b> {value}
                </p>
              ))}
            {result.saved && <p>✓ Verified species saved to database</p>}
            
            {plantsLoading && (
  <p>Checking plant database...</p>
)}

{plantsError && (
  <p>Could not check the plant database.</p>
)}

{matchedPlant && (
  <Link
    to={`/plant/${matchedPlant.id}`}
    className="inline-block mt-4 px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors"
  >
    🌿 Explore Plant →
  </Link>
)}

{result.status === "predicted" && !plantsLoading && !plantsError && !matchedPlant && (
  <p className="mt-3 text-sm text-gray-600">
    No matching plant page is available for this prediction.
  </p>
)}

          </section>
        )}
      </div>
    </main>
  );
}
