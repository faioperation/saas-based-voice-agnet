import Breadcrumb from "@/components/Breadcrumb";
import React, { useState } from "react";
import UploadPdf from "@/components/UploadPdf";
import RecentTrainingList from "@/components/RecentTrainingList";

const AiTraining = () => {
  return (
    <div>
      <Breadcrumb
        text={`Train your AI assistant with voice and text to enhance its capabilities`}
      />

      <div className="mt-6">
        {/* Content Area */}
        <div>
          <UploadPdf />
        </div>

        {/* Recent Training List */}
        <RecentTrainingList />
      </div>
    </div>
  );
};

export default AiTraining;
