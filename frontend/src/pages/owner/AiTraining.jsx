import Breadcrumb from "@/components/Breadcrumb";
import React, { useState } from "react";
import UploadPdf from "@/components/UploadPdf";
import RecentTrainingList from "@/components/RecentTrainingList";
import SpecialOfferUpload from "@/components/SpecialOfferUpload";

const AiTraining = () => {
  const [activeTab, setActiveTab] = useState("agent");

  return (
    <div>
      <Breadcrumb
        text={`Train your AI assistant with voice and text to enhance its capabilities`}
      />

      <div className="mt-6">
        <div className="flex border-b border-sky-200 mb-6 gap-8 px-2">
          <button
            onClick={() => setActiveTab("agent")}
            className={`pb-3 font-medium transition-colors relative cursor-pointer ${
              activeTab === "agent"
                ? "text-[#0F42FF] border-b-2 border-[#0F42FF]"
                : "text-sky-950 hover:text-[#0F42FF]"
            }`}
          >
            Agent Training
          </button>
          <button
            onClick={() => setActiveTab("special")}
            className={`pb-3 font-medium transition-colors relative cursor-pointer ${
              activeTab === "special"
                ? "text-[#0F42FF] border-b-2 border-[#0F42FF]"
                : "text-sky-950 hover:text-[#0F42FF]"
            }`}
          >
            Special Offers
          </button>
        </div>

        {activeTab === "agent" ? (
          <>
            {/* Content Area */}
            <div>
              <UploadPdf />
            </div>

            {/* Recent Training List */}
            <RecentTrainingList />
          </>
        ) : (
          <div>
            <SpecialOfferUpload />
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTraining;
