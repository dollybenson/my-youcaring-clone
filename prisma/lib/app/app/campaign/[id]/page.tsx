// app/campaign/[id]/page.tsx
import { db } from "@/lib/db";
import { DonateButton } from "./donate-button"; // Client component we will make next

export default async function CampaignPage({ params }: { params: { id: string } }) {
  const campaign = await db.campaign.findUnique({
    where: { id: params.id },
    include: { donations: { orderBy: { createdAt: 'desc' } } }
  });

  if (!campaign) return <div>Campaign not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        
        {/* Left Column: Story */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
             <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
             <div className="bg-gray-200 h-64 rounded-lg mb-6 w-full object-cover flex items-center justify-center text-gray-400">
                {campaign.imageUrl ? <img src={campaign.imageUrl} className="w-full h-full object-cover rounded-lg"/> : "Campaign Image"}
             </div>
             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{campaign.description}</p>
          </div>

          {/* Donations List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-xl mb-4">Words of Support ({campaign.donations.length})</h3>
            {campaign.donations.map((d) => (
              <div key={d.id} className="border-b last:border-0 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-purple-100 text-purple-700 rounded-full w-8 h-8 flex items-center justify-center font-bold text-xs">
                    {d.donorName ? d.donorName[0] : "A"}
                  </div>
                  <span className="font-bold text-gray-800">{d.donorName || "Anonymous"}</span>
                  <span className="text-gray-500 text-sm">donated ${(d.amount / 100).toLocaleString()}</span>
                </div>
                {d.message && <p className="text-gray-600 pl-10 text-sm">"{d.message}"</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Donation Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg sticky top-24 border-t-4 border-purple-600">
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">${(campaign.raised / 100).toLocaleString()}</span>
              <span className="text-gray-500 text-sm ml-1">raised of ${(campaign.goal / 100).toLocaleString()} goal</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div className="bg-purple-600 h-3 rounded-full" 
                   style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}></div>
            </div>

            {/* This Client Component handles the Logic */}
            <DonateButton campaignId={campaign.id} />
            
          </div>
        </div>
      </div>
    </div>
  );
}
