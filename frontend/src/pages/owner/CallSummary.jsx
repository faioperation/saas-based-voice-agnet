import React, { useState } from "react";
import { FileText, X, Bot, User, Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import Dropdown from "../../components/Dropdown";

const CallSummary = () => {
  const axiosSecure = useAxiosSecure();
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    data: null,
  });

  const { data: callsResponse, isLoading } = useQuery({
    queryKey: ["callSummaries"],
    queryFn: async () => {
      const res = await axiosSecure.get("/business-owner/call-summary");
      return res.data;
    },
  });

  const calls = callsResponse?.data || [];

  const handleActionSelect = (option, row) => {
    // option will be "Call Summary" or "Call Transcript"
    setModalState({ isOpen: true, type: option, data: row });
  };

  const handleDownload = async () => {
    if (!modalState.data?.id) return;
    try {
      const toastId = toast.loading("Downloading PDF...");
      const res = await axiosSecure.get(
        `/business-owner/call-summary/download/${modalState.data.id}`,
        {
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Call_${modalState.type.replace(/\s+/g, "_")}_${modalState.data.id}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Download complete", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to download PDF");
    }
  };

  const columns = [
    { key: "callerId", Title: "Caller ID", width: "20%" },
    { key: "duration", Title: "Call Duration", width: "20%" },
    { key: "time", Title: "Time", width: "20%" },
    { key: "date", Title: "Date", width: "20%" },
    {
      key: "action",
      Title: "Summary",
      width: "20%",
      sortable: false,
      render: (row) => (
        <div className="relative w-[180px]">
          {/* Custom icon positioning over the dropdown */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <FileText className="w-4 h-4 text-sky-700" />
          </div>
          <Dropdown
            placeholder="Summary"
            options={["Call Summary", "Call Transcript"]}
            onSelect={(val) => handleActionSelect(val, row)}
            inputClass="!bg-white !placeholder-sky-800 !border !border-sky-200 !text-sky-950 !rounded-[10px] !py-2.5 !pl-10 !pr-10 !font-medium !text-[13.5px] shadow-[0_2px_10px_rgba(14,165,233,0.06)] hover:shadow-[0_4px_15px_rgba(14,165,233,0.12)] !cursor-pointer hover:!border-sky-300 transition-all"
            optionClass="!bg-white !text-sky-950 !border !border-sky-100 !rounded-[10px] shadow-[0_10px_40px_rgba(14,165,233,0.15)] !mt-1.5 overflow-hidden z-50"
            icon="!text-sky-500 !right-3"
          />
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div>
        <Breadcrumb text="You can see your AI call summary" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-[#2563EB] w-10 h-10" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb text="You can see your AI call summary" />

      <div className="w-full overflow-visible">
        {calls.length > 0 ? (
          <Table
            TableHeads={columns}
            TableRows={calls}
            headClass=" border-b border-slate-100 text-slate-800 whitespace-nowrap bg-slate-50/50"
            tableClass="border-none"
            wrapperClass="overflow-visible"
          />
        ) : (
          <div className="p-8 text-center text-sky-700 text-sm">
            No call summaries found.
          </div>
        )}
      </div>

      {/* Dynamic Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 text-slate-800">
          <div
            className={`bg-white border border-slate-100 rounded-3xl w-full relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col ${modalState.type === "Call Transcript" ? "max-w-[600px]" : "max-w-[600px]"}`}
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-lg font-semibold text-slate-800">
                {modalState.type}
              </h2>
              <button
                onClick={() =>
                  setModalState({ isOpen: false, type: null, data: null })
                }
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Call Transcript Content */}
            {modalState.type === "Call Transcript" && (
              <div className="p-8 max-h-[500px] overflow-y-auto space-y-6 custom-scrollbar bg-slate-50/30">
                {modalState.data?.transcript?.length > 0 ? (
                  modalState.data.transcript.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-4 ${msg.role === "User" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === "AI" ? "bg-emerald-100 text-emerald-600" : "bg-sky-100 text-sky-600"}`}>
                        {msg.role === "AI" ? (
                          <Bot className="w-5 h-5" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                      <div
                        className={`px-5 py-3.5 rounded-2xl text-[15px] max-w-[80%] shadow-sm leading-relaxed ${msg.role === "User" ? "bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-tr-sm shadow-blue-500/20" : "bg-white border border-slate-100 text-slate-700 rounded-tl-sm"}`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-slate-500">
                    No transcript available.
                  </div>
                )}
              </div>
            )}

            {/* Call Summary Content */}
            {modalState.type === "Call Summary" && (
              <div className="flex flex-col">
                <div className="p-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                  <p className="text-slate-700 text-[15.5px] leading-relaxed whitespace-pre-wrap">
                    {modalState.data?.summary || "No summary available."}
                  </p>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="border-t border-slate-100 px-8 py-5 flex justify-end mt-auto bg-slate-50/50 rounded-b-3xl">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors text-slate-700 hover:text-sky-700 px-6 py-2.5 rounded-xl text-[14px] font-semibold cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallSummary;
