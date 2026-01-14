import { db } from "@/lib/db";
import { DonateButton } from "./donate-button";
import Image from "next/image";
import { formatDistance } from "date-fns";
import { Facebook, MessageCircle } from "lucide-react"; // Icons

export const dynamic = "force-dynamic";

export default async function CampaignPage({ params }: { params: { id: string } }) {
  const campaign = await db.campaign.findUnique({
    where: { id: params.id },
    include: {
      donations: { orderBy: { createdAt: "desc" } },
      updates: { orderBy: { createdAt: "desc" } }
    },
  });

  if (!campaign) return <div>Campaign not found</div>;

  // Logic for Donor Lists
  const recentDonors = campaign.donations.slice(0, 10);
  const topDonors = [...campaign.donations].sort((a, b) => b.amount - a.amount).slice(0, 10);

  // Currency Symbol Helper
  const getSymbol = (curr: string) => {
    if (curr === "EUR") return "€";
    if (curr === "GBP") return "£";
    return "$";
  };
  const symbol = getSymbol(campaign.currency);

  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Image */}
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
            <Image 
              src={campaign.imageUrl} 
              alt={campaign.title} 
              fill 
              className="object-cover"
            />
          </div>

          {/* Title & Organizer */}
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{campaign.title}</h1>
            <p className="text-gray-500">Organized by <span className="font-semibold text-purple-700">{campaign.organizer}</span></p>
          </div>

          {/* Navigation Tabs (Story / Updates) */}
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button className="border-b-4 border-purple-600 pb-3 font-bold text-purple-800">The Story</button>
              <button className="pb-3 font-medium text-gray-500 hover:text-gray-800">Updates ({campaign.updates.length})</button>
            </nav>
          </div>

          {/* The Story Box */}
          <div 
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: campaign.story || campaign.description }} 
          />
          {/* Note: This allows images to be full width automatically via Tailwind 'prose' */}

        </div>

        {/* RIGHT COLUMN (Sidebar) */}
        <div className="space-y-6">
          
          {/* Donation Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
            <div className="mb-6">
              <p className="text-3xl font-bold text-gray-900">
                {symbol}{campaign.raised.toLocaleString()} <span className="text-base font-normal text-gray-500">raised of {symbol}{campaign.goal.toLocaleString()}</span>
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-3 mt-3 mb-1">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 text-right">{campaign.donations.length} donations</p>
            </div>

            {/* Social Sharing Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
               <a 
                 href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://your-site.com/campaign/" + campaign.id)}`}
                 target="_blank"
                 className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
               >
                 <Facebook size={18} /> Facebook
               </a>
               <a 
                 href={`https://wa.me/?text=${encodeURIComponent(campaign.title + " " + "https://your-site.com/campaign/" + campaign.id)}`}
                 target="_blank"
                 className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition"
               >
                 <MessageCircle size={18} /> WhatsApp
               </a>
            </div>

            {/* Donate Button Component */}
            <DonateButton campaignId={campaign.id} currency={campaign.currency} symbol={symbol} />

            {/* TOP DONORS */}
            <div className="mt-8">
              <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Top Donations</h3>
              {topDonors.length === 0 ? <p className="text-sm text-gray-500">Be the first top donor!</p> : (
                <div className="space-y-4">
                  {topDonors.map((d) => (
                    <div key={d.id} className="flex items-center gap-3">
                      <div className="bg-yellow-100 text-yellow-700 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">★</div>
                      <div>
                        <p className="font-bold text-gray-900">{d.isAnonymous ? "Anonymous" : d.donorName}</p>
                        <p className="text-sm text-gray-500">{symbol}{d.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RECENT DONORS */}
            <div className="mt-8">
              <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Recent Donations</h3>
               {recentDonors.length === 0 ? <p className="text-sm text-gray-500">No donations yet.</p> : (
                <div className="space-y-4">
                  {recentDonors.map((d) => (
                    <div key={d.id} className="flex items-center gap-3">
                      <div className="bg-gray-100 text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                        {d.isAnonymous ? "A" : d.donorName?.[0] || "D"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{d.isAnonymous ? "Anonymous" : d.donorName}</p>
                        <p className="text-xs text-gray-500">
                          {symbol}{d.amount} • {formatDistance(d.createdAt, new Date(), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
