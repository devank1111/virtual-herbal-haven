import { useState, useRef, useEffect } from "react";
import {
  Mail, Phone, Calendar, Shield, Camera,
  Edit3, Save, X, User
} from "lucide-react";

// Firebase imports (assume firebase is already initialized elsewhere)
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

/* ─── Types ─── */
interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  age: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  photoURL?: string;
  bookmarkedPlants?: { name: string; latin: string; tag: string; color: string }[];
}

/* ─── Avatar ─── */
function Avatar({
  user, editable, onUpload,
}: {
  user: UserProfile; editable: boolean; onUpload: (f: File) => Promise<void>;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(user.photoURL);
  const initials = user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase();

  useEffect(() => {
    setPreview(user.photoURL);
  }, [user.photoURL]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{
        width: 120, height: 120, borderRadius: "50%",
        border: "2px solid #e0e0e0",
        overflow: "hidden",
        background: preview ? "transparent" : "#f0f0f0",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {preview ? (
          <img src={preview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 40, color: "#555", fontWeight: 300 }}>
            {initials}
          </span>
        )}
      </div>
      {editable && (
        <>
          <button
            onClick={() => ref.current?.click()}
            title="Upload profile picture"
            style={{
              position: "absolute", bottom: 4, right: 4, width: 30, height: 30,
              borderRadius: "50%", background: "#fff", border: "1px solid #ccc",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Camera size={14} color="#555" />
          </button>
          <input ref={ref} type="file" accept="image/*" hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                setPreview(URL.createObjectURL(f));
                await onUpload(f);
              }
            }} />
        </>
      )}
    </div>
  );
}

/* ─── Editable Field ─── */
function Field({ icon, label, value, name, type = "text", editing, onChange }: {
  icon: React.ReactNode; label: string; value: string | number;
  name: string; type?: string; editing: boolean; onChange: (k: string, v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: "1px solid #eee" }}>
      <div style={{ width: 36, color: "#777", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{label}</p>
        {editing ? (
          <input type={type} defaultValue={String(value)} onChange={(e) => onChange(name, e.target.value)}
            style={{
              fontSize: 15, color: "#333",
              background: "#f9f9f9", border: "1px solid #ddd",
              borderRadius: 6, padding: "8px 12px", width: "100%", outline: "none",
            }} />
        ) : (
          <p style={{ fontSize: 15, color: "#333" }}>{String(value)}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<UserProfile>>({});
  const [toast, setToast] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const userData = userSnap.data() as Omit<UserProfile, 'uid'>;
            setUser({ uid: firebaseUser.uid, ...userData });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleSave = async () => {
    if (!user) return;

    const updates: Partial<UserProfile> = {
      ...draft,
      updatedAt: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName: updates.displayName || user.displayName,
        email: updates.email || user.email,
        phone: updates.phone || user.phone,
        age: updates.age !== undefined ? Number(updates.age) : user.age,
        updatedAt: updates.updatedAt,
      });

      setUser((prev) => prev ? { ...prev, ...updates } : null);
      setDraft({});
      setEditing(false);
      setToast(true);
      setTimeout(() => setToast(false), 2800);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handlePhotoUpload = async (file: File) => {
    if (!user) return;

    try {
      const storageRef = ref(storage, `profile_pictures/${user.uid}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        photoURL: downloadURL,
        updatedAt: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }),
      });

      setUser((prev) => prev ? { ...prev, photoURL: downloadURL } : null);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please try again.");
    }
  };

  const change = (k: string, v: string) => setDraft((p) => ({ ...p, [k]: v }));

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#555" }}>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <p style={{ color: "#555", marginBottom: 16 }}>Please log in to view your profile.</p>
        <button onClick={() => window.location.href = "/login"} style={{
          background: "#0070f3", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 6,
          fontSize: 14, cursor: "pointer"
        }}>Go to Login</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", padding: "48px 24px" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1e1e1e", color: "#fff", padding: "10px 24px",
          borderRadius: 30, fontSize: 14, zIndex: 999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}>
          Profile updated successfully
        </div>
      )}

      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Profile Header Card */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <Avatar user={user} editable={editing} onUpload={handlePhotoUpload} />

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 32, fontWeight: 400, margin: "0 0 8px 0", color: "#222" }}>
                {editing && draft.displayName ? draft.displayName : user.displayName}
              </h1>
              <p style={{ fontSize: 15, color: "#666", margin: 0 }}>{user.email}</p>
            </div>

            <div>
              {!editing ? (
                <button onClick={() => setEditing(true)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "transparent", border: "1px solid #ccc",
                  borderRadius: 6, padding: "10px 20px", fontSize: 14,
                  cursor: "pointer", color: "#333",
                }}>
                  <Edit3 size={16} /> Edit Profile
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleSave} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "#0070f3", border: "none", borderRadius: 6,
                    padding: "10px 20px", fontSize: 14, color: "#fff", cursor: "pointer",
                  }}>
                    <Save size={16} /> Save
                  </button>
                  <button onClick={() => { setDraft({}); setEditing(false); }} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "transparent", border: "1px solid #ccc",
                    borderRadius: 6, padding: "10px 16px", fontSize: 14, cursor: "pointer",
                  }}>
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Details Card */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "32px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 400, margin: "0 0 4px 0", color: "#222" }}>Personal Details</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Manage your profile information</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 40px" }}>
            <Field icon={<User size={16} />} label="Full Name" value={user.displayName} name="displayName" type="text" editing={editing} onChange={change} />
            <Field icon={<Mail size={16} />} label="Email Address" value={user.email} name="email" type="email" editing={editing} onChange={change} />
            <Field icon={<Phone size={16} />} label="Phone Number" value={user.phone} name="phone" type="tel" editing={editing} onChange={change} />
            <Field icon={<Calendar size={16} />} label="Age" value={user.age} name="age" type="number" editing={editing} onChange={change} />
            <Field icon={<Shield size={16} />} label="Role" value={user.role} name="role" editing={false} onChange={() => {}} />
          </div>
        </div>
      </div>
    </div>
  );
}