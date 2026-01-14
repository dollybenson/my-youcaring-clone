// app/page.tsx
import { db } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const campaigns = await db.campaign.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-purple-700">YouCaring Clone</h1>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition">
          Start a Fundraiser
        </button>
      </nav>

      {/* Hero Section */}
      <div className="bg-purple-700 text-white text-center py-20 px-4">
        <h2 className="text-4xl font-bold mb-4">Compassionate Crowdfunding</h2>
        <p className="text-xl opacity-90">The leader in free online fundraising.</p>
      </div>

      {/* Campaigns Grid */}
      <div className="max-w-6xl mx-auto p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Trending Fundraisers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.map((c) => (
            <Link key={c.id} href={`/campaign/${c.id}`} className="group">
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden border">
                <div className="h-48 bg-gray-200 relative">
                   {/* Replace with real image tag if imageUrl exists */}
                   {c.imageUrl && <img src={c.imageUrl} alt={c.title} className="w-full h-full object-cover"/>}
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-lg text-purple-900 group-hover:underline mb-2">{c.title}</h4>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{c.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div className="bg-purple-600 h-2.5 rounded-full" 
                         style={{ width: `${Math.min((c.raised / c.goal) * 100, 100)}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>${(c.raised / 100).toLocaleString()} raised</span>
                    <span className="text-gray-500">of ${(c.goal / 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
