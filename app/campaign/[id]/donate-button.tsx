"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react"; 

export function DonateButton({ campaignId }: { campaignId: string }) {
  const [amount, setAmount] = useState(50);
  const [tipPercent, setTipPercent] = useState(15);
  const [loading, setLoading] = useState(false);

  const tipAmount = (amount * tipPercent) / 100;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({ amount, tip: tipAmount, campaignId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={handleCheckout} disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl text-lg flex items-center justify-center gap-2">
        {loading ? <Loader2 className="animate-spin" /> : "Donate Now"}
      </button>
    </div>
  );
}
