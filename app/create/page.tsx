"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Image as ImageIcon } from "lucide-react";

export default function CreateCampaign() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    const data = {
      title: formData.get("title"),
      organizer: formData.get("organizer"),
      goal: Number(formData.get("goal")),
      currency: formData.get("currency"), // USD, EUR, GBP
      description: formData.get("description"), // Short summary
      story: formData.get("story"), // Long story
      imageUrl: formData.get("imageUrl"), 
    };

    try {
      const res = await fetch("/api/campaigns/create", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/"); // Redirect home after success
        router.refresh();
      } else {
        alert("Error creating campaign. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">Start your fundraiser</h1>
          <p className="mt-2 text-gray-600">We'll guide you through the steps to launch your campaign.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: BASICS */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">1. The Basics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name</label>
                <input name="organizer" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Sarah Smith" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                <input name="title" required className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="e.g. Help the Smith Family Rebuild" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select 
                  name="currency" 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500 font-bold">
                    {currency === "USD" ? "$" : currency === "EUR" ? "€" : "£"}
                  </span>
                  <input name="goal" type="number" required min="1" className="w-full border border-gray-300 p-3 pl-8 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="5000" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: MEDIA & STORY */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">2. Tell Your Story</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input name="imageUrl" required className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="https://..." defaultValue="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Paste a link to an image (Unsplash, etc.) for now.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Summary (Visible on cards)</label>
              <input name="description" required maxLength={150} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none" placeholder="A brief sentence about your cause..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Story</label>
              <textarea 
                name="story" 
                required 
                rows={8} 
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-sans" 
                placeholder="Tell the full story here. You can paste more image links or YouTube links here as text for now." 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Launch Fundraiser"}
          </button>

        </form>
      </div>
    </div>
  );
}
