import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  X,
  PlusCircle,
  FileText,
  MapPin,
  Beaker,
  User,
  AlertCircle,
  Leaf,
  Loader2,
  Globe,
  Home,
  Hash,
  Languages,
  BookOpen,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/firebase'; // adjust path to your firebase config
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';

// Updated Plant interface with all new fields
interface Plant {
  id: string;
  name: string;
  about: string;
  image: string;
  medicinalUse: string[];          // changed from single string to array
  nativeLocation: string;
  keyResearcher: string;
  precautions: string;
  researchPapers: string[];
  // New fields
  scientificName: string;
  hindiName: string;
  category: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  habitat: string;
  preparation: string;
  createdAt?: any;
}

// Initial form state includes all new fields
const INITIAL_FORM_STATE: Omit<Plant, 'id'> = {
  name: '',
  about: '',
  image: '',
  medicinalUse: [''],               // array with one empty string
  nativeLocation: '',
  keyResearcher: '',
  precautions: '',
  researchPapers: [''],
  scientificName: '',
  hindiName: '',
  category: '',
  city: '',
  state: '',
  lat: undefined,
  lng: undefined,
  habitat: '',
  preparation: '',
};

export default function PlantDashboard() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time listener for Firestore "plants" collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'plants'), (snapshot) => {
      const plantsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Plant[];
      setPlants(plantsData);
    }, (error) => {
      console.error("Firestore listener error:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenModal = (plant?: Plant) => {
    if (plant) {
      // Ensure arrays exist (for old documents that might not have them)
      setFormData({
        ...plant,
        medicinalUse: plant.medicinalUse?.length ? plant.medicinalUse : [''],
        researchPapers: plant.researchPapers?.length ? plant.researchPapers : [''],
      });
      setEditingId(plant.id);
    } else {
      setFormData(INITIAL_FORM_STATE);
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData(INITIAL_FORM_STATE);
    setEditingId(null);
  };

  // Generic input change handler for text/textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Handle number inputs (lat/lng)
    if (type === 'number') {
      setFormData({ ...formData, [name]: value === '' ? undefined : parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Special handler for array fields (medicinalUse and researchPapers)
  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'medicinalUse' | 'researchPapers',
    index: number
  ) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = e.target.value;
    setFormData({ ...formData, [field]: updatedArray });
  };

  const addArrayField = (field: 'medicinalUse' | 'researchPapers') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayField = (field: 'medicinalUse' | 'researchPapers', index: number) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty strings from arrays
      const filteredMedicinalUse = formData.medicinalUse.filter(item => item.trim() !== '');
      const filteredResearchPapers = formData.researchPapers.filter(item => item.trim() !== '');

      const plantData = {
        ...formData,
        medicinalUse: filteredMedicinalUse,
        researchPapers: filteredResearchPapers,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        // Update existing document
        const plantRef = doc(db, 'plants', editingId);
        await updateDoc(plantRef, plantData);
      } else {
        // Add new document
        await addDoc(collection(db, 'plants'), {
          ...plantData,
          createdAt: serverTimestamp(),
        });
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving plant:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePlant = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this specimen?')) {
      try {
        await deleteDoc(doc(db, 'plants', id));
      } catch (error) {
        console.error("Error deleting plant:", error);
        alert("Failed to delete. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(98%_0.01_160)] text-[oklch(20%_0.02_160)] font-sans selection:bg-[oklch(85%_0.12_140)]">
      {/* Navigation */}
      <nav className="border-b border-[oklch(90%_0.01_160)] bg-white/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[oklch(35%_0.05_150)] rounded-xl flex items-center justify-center text-white">
              <Leaf size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase">Nature   <span className="font-bold opacity-50">Garden</span></h1>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[oklch(35%_0.05_150)] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[oklch(25%_0.05_150)] transition-all active:scale-95 shadow-lg shadow-[oklch(35%_0.05_150/0.2)]"
          >
            <Plus size={18} />
            <span>Add New Specimen</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {plants.length === 0 && (
          <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-[oklch(90%_0.01_160)] rounded-3xl">
            <div className="w-16 h-16 bg-[oklch(95%_0.01_160)] rounded-full flex items-center justify-center mb-4 text-[oklch(50%_0.01_160)]">
              <Search size={24} />
            </div>
            <p className="text-lg font-medium opacity-60">No specimens cataloged yet.</p>
            <button onClick={() => handleOpenModal()} className="mt-4 text-[oklch(35%_0.05_150)] font-semibold underline underline-offset-4">Begin first entry</button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {plants.map((plant) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={plant.id}
                className="group bg-white border border-[oklch(90%_0.01_160)] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-[oklch(35%_0.05_150/0.05)] transition-all"
              >
                <div className="aspect-[4/3] bg-[oklch(95%_0.01_160)] relative overflow-hidden">
                  {plant.image ? (
                    <img src={plant.image} alt={plant.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[oklch(80%_0.01_160)]">
                      <Leaf size={48} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleOpenModal(plant)} className="p-2 bg-white rounded-full shadow-md hover:text-blue-600 transition-colors">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deletePlant(plant.id)} className="p-2 bg-white rounded-full shadow-md hover:text-red-600 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold mb-2">{plant.name}</h3>
                  <p className="text-sm text-[oklch(50%_0.01_160)] line-clamp-2 mb-4 leading-relaxed">{plant.about}</p>
                  <div className="flex flex-wrap gap-2">
                    {plant.nativeLocation && (
                      <span className="px-3 py-1 bg-[oklch(95%_0.01_160)] rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <MapPin size={10} /> {plant.nativeLocation}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-[oklch(95%_0.01_160)] rounded-full text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <FileText size={10} /> {plant.researchPapers?.length || 0} Papers
                    </span>
                    {/* Optional: show category if exists */}
                    {plant.category && (
                      <span className="px-3 py-1 bg-[oklch(95%_0.01_160)] rounded-full text-[10px] uppercase tracking-widest font-bold">
                        {plant.category}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-[oklch(20%_0.02_160/0.4)] backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-8 border-b border-[oklch(90%_0.01_160)] flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-serif font-bold">{editingId ? 'Edit Specimen' : 'New Catalog Entry'}</h2>
                  <p className="text-sm opacity-50">Fill in the botanical details below</p>
                </div>
                <button onClick={handleCloseModal} className="p-2 hover:bg-[oklch(95%_0.01_160)] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Row 1: Basic names */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <Leaf size={12} /> Common Name *
                    </label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                      placeholder="e.g. Aloe Vera"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <BookOpen size={12} /> Scientific Name
                    </label>
                    <input
                      name="scientificName"
                      value={formData.scientificName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                      placeholder="Aloe barbadensis miller"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <Languages size={12} /> Hindi Name
                    </label>
                    <input
                      name="hindiName"
                      value={formData.hindiName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                      placeholder="घृतकुमारी"
                    />
                  </div>
                </div>

                {/* Row 2: Category & Habitat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <Hash size={12} /> Category
                    </label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                      placeholder="e.g. Succulent, Herb, Tree"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <Droplets size={12} /> Habitat
                    </label>
                    <input
                      name="habitat"
                      value={formData.habitat}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                      placeholder="Tropical, Arid, etc."
                    />
                  </div>
                </div>

                {/* About the plant */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">About the Plant</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all resize-none"
                    placeholder="Describe the physical characteristics and history..."
                  />
                </div>

                {/* Location details: nativeLocation + city/state + lat/lng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <MapPin size={12} /> Native Region
                    </label>
                    <input
                      name="nativeLocation"
                      value={formData.nativeLocation}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                      placeholder="e.g. Arabian Peninsula"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <Globe size={12} /> City / District
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">State</label>
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="lat"
                      value={formData.lat ?? ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                      placeholder="23.4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      name="lng"
                      value={formData.lng ?? ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                      placeholder="78.9876"
                    />
                  </div>
                </div>

                {/* Researcher & Precautions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <User size={12} /> Key Researcher
                    </label>
                    <input
                      name="keyResearcher"
                      value={formData.keyResearcher}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2 text-amber-700">
                      <AlertCircle size={12} /> Precautions
                    </label>
                    <input
                      name="precautions"
                      value={formData.precautions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-2 ring-amber-200 outline-none transition-all"
                      placeholder="e.g. Do not consume during pregnancy"
                    />
                  </div>
                </div>

                {/* Preparation (new textarea) */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Preparation / Usage Method</label>
                  <textarea
                    name="preparation"
                    value={formData.preparation}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all resize-none"
                    placeholder="How to prepare or use this plant..."
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-50">Image URL</label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Medicinal Use (array) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <Beaker size={12} /> Medicinal Uses
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField('medicinalUse')}
                      className="text-xs font-bold text-[oklch(35%_0.05_150)] flex items-center gap-1 hover:opacity-70"
                    >
                      <PlusCircle size={14} /> Add Use
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.medicinalUse.map((use, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          value={use}
                          onChange={(e) => handleArrayInputChange(e, 'medicinalUse', index)}
                          className="flex-1 px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                          placeholder="e.g. Anti-inflammatory, Digestive aid"
                        />
                        {formData.medicinalUse.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField('medicinalUse', index)}
                            className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Research Papers (array) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-50 flex items-center gap-2">
                      <FileText size={12} /> Research Papers
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayField('researchPapers')}
                      className="text-xs font-bold text-[oklch(35%_0.05_150)] flex items-center gap-1 hover:opacity-70"
                    >
                      <PlusCircle size={14} /> Add Paper
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.researchPapers.map((paper, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          value={paper}
                          onChange={(e) => handleArrayInputChange(e, 'researchPapers', index)}
                          className="flex-1 px-4 py-3 bg-[oklch(98%_0.01_160)] border border-[oklch(90%_0.01_160)] rounded-xl focus:ring-2 ring-[oklch(35%_0.05_150/0.2)] outline-none transition-all"
                          placeholder="DOI or Paper URL"
                        />
                        {formData.researchPapers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeArrayField('researchPapers', index)}
                            className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[oklch(35%_0.05_150)] text-white py-4 rounded-2xl font-bold hover:bg-[oklch(25%_0.05_150)] transition-all shadow-xl shadow-[oklch(35%_0.05_150/0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        {editingId ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      editingId ? 'Update Specimen' : 'Save to Archive'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-8 py-4 border border-[oklch(90%_0.01_160)] rounded-2xl font-bold hover:bg-[oklch(95%_0.01_160)] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}