import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Adjust this import path to your firebase config

// ─────────────────────────────────────────────────────────────
// model-viewer web component ke liye TypeScript declaration
// ─────────────────────────────────────────────────────────────
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean | string;
          "camera-controls"?: boolean | string;
          "shadow-intensity"?: string;
          exposure?: string;
          loading?: "auto" | "lazy" | "eager";
          reveal?: "auto" | "interaction" | "manual";
          ar?: boolean | string;
          "ar-modes"?: string;
          style?: React.CSSProperties;
          className?: string;
          onLoad?: () => void;
          onError?: (e: Event) => void;
        },
        HTMLElement
      >;
    }
  }
}

// ─────────────────────────────────────────────────────────────
// MODEL VIEWER SCRIPT LOADER — sirf ek baar load hota hai
// ─────────────────────────────────────────────────────────────
function useModelViewerScript() {
  const [ready, setReady] = useState(
    () =>
      typeof window !== "undefined" && !!customElements.get("model-viewer")
  );

  useEffect(() => {
    if (ready) return;
    if (customElements.get("model-viewer")) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@google/model-viewer@3.4.0/dist/model-viewer.min.js";
    script.onload = () => setReady(true);
    document.head.appendChild(script);
  }, [ready]);

  return ready;
}

// ─────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────
function ModelSkeleton() {
  return (
    <div className="w-full h-[480px] rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-3xl">
        🌿
      </div>
      <p className="text-gray-400 text-sm font-medium">
        3D Model load ho raha hai…
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EMPTY STATE — jab modelUrl nahi hoga
// ─────────────────────────────────────────────────────────────
function ModelEmpty({ plantName }: { plantName: string }) {
  return (
    <div className="w-full h-[480px] rounded-2xl border border-dashed border-gray-200 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center gap-3">
      <span className="text-5xl">🪴</span>
      <p className="text-gray-600 font-semibold text-[15px]">
        {plantName} ka 3D model abhi available nahi hai
      </p>
      <p className="text-gray-400 text-sm">Jald hi add kiya jayega.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────
interface PlantModelProps {
  /** Plant ID from Firebase */
  plantId?: string;
  /** Plant ka display name — empty/error states mein use hota hai */
  plantName?: string;
  /** Direct model URL (optional, if you already have it) */
  modelUrl?: string;
}

// ─────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────
export default function PlantModel({
  plantId,
  plantName = "Yeh paudha",
  modelUrl: propModelUrl,
}: PlantModelProps) {
  const scriptReady = useModelViewerScript();
  const modelViewerRef = useRef<HTMLElement>(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchedModelUrl, setFetchedModelUrl] = useState<string | null>(propModelUrl || null);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch modelUrl from Firebase if plantId is provided and no modelUrl prop
  useEffect(() => {
    const fetchModelUrl = async () => {
      if (!plantId) return;
      if (propModelUrl) {
        setFetchedModelUrl(propModelUrl);
        return;
      }
      if (isFetching) return;

      setIsFetching(true);
      try {
        console.log(`Fetching model for plant ID: ${plantId}`);
        const plantDoc = await getDoc(doc(db, "plants", plantId));
        
        if (plantDoc.exists()) {
          const plantData = plantDoc.data();
          const url = plantData.modelUrl || plantData.modelURL || plantData.model_url || null;
          
          if (url) {
            console.log("Model URL found:", url);
            setFetchedModelUrl(url);
          } else {
            console.log("No model URL found in plant document");
            setFetchedModelUrl(null);
          }
        } else {
          console.log("Plant document not found");
          setFetchedModelUrl(null);
        }
      } catch (error) {
        console.error("Error fetching plant model:", error);
        setFetchedModelUrl(null);
        setModelError(true);
      } finally {
        setIsFetching(false);
        setIsLoading(false);
      }
    };

    fetchModelUrl();
  }, [plantId, propModelUrl]);

  const finalUrl = fetchedModelUrl?.trim() || null;

  // Reset states when URL changes
  useEffect(() => {
    if (finalUrl) {
      setModelLoaded(false);
      setModelError(false);
      setIsLoading(true);
    }
  }, [finalUrl]);

  // Safety timeout to prevent infinite loading spinner
  useEffect(() => {
    if (!finalUrl || !scriptReady || !isLoading) return;

    const timeoutId = setTimeout(() => {
      if (!modelLoaded && !modelError && isLoading) {
        console.warn("Model loading timeout - switching to error state");
        setModelError(true);
        setIsLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [finalUrl, scriptReady, modelLoaded, modelError, isLoading]);

  // Check if model-viewer already has a loaded model
  useEffect(() => {
    if (!modelViewerRef.current || !finalUrl) return;

    const modelViewer = modelViewerRef.current as any;
    
    if (modelViewer.loaded) {
      setModelLoaded(true);
      setIsLoading(false);
    }

    const handleModelVisibility = () => {
      if (!modelLoaded) {
        setModelLoaded(true);
        setIsLoading(false);
      }
    };

    modelViewer.addEventListener('model-visibility', handleModelVisibility);
    
    return () => {
      modelViewer.removeEventListener('model-visibility', handleModelVisibility);
    };
  }, [finalUrl, modelLoaded]);

  // Handle load event
  const handleModelLoad = () => {
    console.log("Model loaded successfully");
    setModelLoaded(true);
    setIsLoading(false);
    setModelError(false);
  };

  // Handle error event
  const handleModelError = (e: Event) => {
    console.error("Model loading error:", e);
    setModelError(true);
    setIsLoading(false);
  };

  // Retry function
  const handleRetry = () => {
    setModelError(false);
    setIsLoading(true);
    setModelLoaded(false);
    
    if (modelViewerRef.current) {
      const modelViewer = modelViewerRef.current as any;
      modelViewer.src = '';
      setTimeout(() => {
        if (finalUrl) {
          modelViewer.src = finalUrl;
        }
      }, 100);
    }
  };

  // Show skeleton while script is loading or fetching data
  if (!scriptReady || isFetching) return <ModelSkeleton />;
  
  // Show empty state if no model URL
  if (!finalUrl) return <ModelEmpty plantName={plantName} />;

  return (
    <div className="relative w-full h-[480px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50">

      {/* Loading spinner - only when loading and no error */}
      {isLoading && !modelLoaded && !modelError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-white/50 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin" />
          <p className="text-gray-600 text-sm font-medium">
            3D Model render ho raha hai…
          </p>
          <p className="text-gray-400 text-xs">
            {plantName} ka model load ho raha hai
          </p>
        </div>
      )}

      {/* Error overlay */}
      {modelError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-red-50/90 backdrop-blur-sm rounded-2xl">
          <span className="text-4xl">⚠️</span>
          <p className="text-red-600 font-semibold text-sm">
            3D model render nahi ho saka
          </p>
          <p className="text-gray-500 text-xs max-w-xs text-center px-4">
            Firebase mein modelUrl check karein ya network verify karein.
            {finalUrl && (
              <span className="block mt-1 text-gray-400 break-all">
                URL: {finalUrl.substring(0, 60)}...
              </span>
            )}
          </p>
          <button
            onClick={handleRetry}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
          >
            🔄 Retry
          </button>
        </div>
      )}

      {/* Google model-viewer web component */}
      <model-viewer
        ref={modelViewerRef}
        src={finalUrl}
        alt={`${plantName} 3D model`}
        auto-rotate
        camera-controls
        shadow-intensity="1.2"
        exposure="1.1"
        loading="eager"
        reveal="auto"
        ar
        ar-modes="webxr scene-viewer quick-look"
        style={{ 
          width: "100%", 
          height: "100%", 
          background: "transparent",
          opacity: modelLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out"
        }}
        onLoad={handleModelLoad}
        onError={handleModelError}
      />

      {/* Controls hint badges - show after model loads */}
      {modelLoaded && (
        <div className="absolute bottom-3 right-3 flex gap-2 pointer-events-none animate-fade-in">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/20 backdrop-blur-md text-white/90 border border-white/15">
            🖱️ Drag to rotate
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/20 backdrop-blur-md text-white/90 border border-white/15">
            📱 AR view
          </span>
        </div>
      )}

      {/* Success indicator */}
      {modelLoaded && (
        <div className="absolute top-3 left-3 pointer-events-none animate-fade-in">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-500/90 backdrop-blur-md text-white">
            ✓ Model Ready
          </span>
        </div>
      )}
    </div>
  );
}

// Add this CSS to your global styles or component
const styles = `
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-in-out forwards;
  }
`;

// Inject styles if not already present
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  if (!document.querySelector('#model-viewer-styles')) {
    styleSheet.id = 'model-viewer-styles';
    document.head.appendChild(styleSheet);
  }
}