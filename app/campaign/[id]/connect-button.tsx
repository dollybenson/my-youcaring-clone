"use client";

import { useState } from "react";

export function ConnectStripeButton({ campaignId }: { campaignId: string }) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/connect", {
        method: "POST",
        body: JSON.stringify({ campaignId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Error: " + JSON.stringify(data));
    } catch (error) {
      alert("Error connecting Stripe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleConnect} 
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg text-sm mb-4 transition-colors"
    >
      {loading ? "Connecting..." : "Connect Bank Account (Required)"}
    </button>
  );
}
