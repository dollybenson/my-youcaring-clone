import { db } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const campaigns = await db.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      {/* HERO SECTION */}
      <div className="relative bg-purple-900 h-[500px] flex items-center justify-center text-center px-4">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 opacity-20">
             <Image 
               src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop"
               alt="Background"
               fill
               className="object-cover"
             />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">
            Compassionate Crowdfunding
          </h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            The trusted place for free online fundraising. Join millions of people supporting the causes they care about.
          </p>
          <button className="mt-8 bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-full font-bold shadow-lg transition-transform hover:scale-105">
            Start a Free Fundraiser
          </button>
        </div>
      </div>

      {/* TRENDING SECTION */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Trending Fundraisers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campaigns.length === 0 ? (
            <p className="text-gray-500">No campaigns found. Start one today!</p>
          ) : (
            campaigns.map((campaign) => (
              <Link
                key={campaign.id}
                href={`/campaign/${campaign.id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="relative h-56 w-full">
                  <Image
                    src={campaign.imageUrl || "/placeholder.jpg"}
                    alt={campaign.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-700 transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {campaign.description}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-gray-900">
                        ${campaign.raised.toLocaleString()} <span className="text-gray-500 font-normal">raised</span>
                      </span>
                      <span className="text-gray-500">
                        of ${campaign.goal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
