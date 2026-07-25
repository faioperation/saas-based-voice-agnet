import React, { useState } from "react";
import { Trash2, Edit2, X, Loader2, Plus, Printer } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";
import InputField from "../../components/Inputfield";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const PrinterManagement = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedPrinter, setSelectedPrinter] = useState(null);

  // Form states
  const [deviceName, setDeviceName] = useState("");
  const [serialNumber, setSerialNumber] = useState("");

  const { data: printersResponse, isLoading } = useQuery({
    queryKey: ["printers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/business-owner/printer");
      return res.data;
    },
  });

  const printers = printersResponse?.data || [];

  // Mutations
  const addPrinterMutation = useMutation({
    mutationFn: async (newPrinter) => {
      const res = await axiosSecure.post("/business-owner/printer", newPrinter);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["printers"]);
      toast.success("Printer added successfully");
      closeModals();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to add printer");
    },
  });

  const editPrinterMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(
        `/business-owner/printer/${id}`,
        data,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["printers"]);
      toast.success("Printer updated successfully");
      closeModals();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update printer");
    },
  });

  const deletePrinterMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/business-owner/printer/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["printers"]);
      toast.success("Printer deleted successfully");
      closeModals();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete printer");
    },
  });

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedPrinter(null);
    setDeviceName("");
    setSerialNumber("");
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!deviceName || !serialNumber) {
      toast.error("Please fill in all fields");
      return;
    }
    addPrinterMutation.mutate({
      device_name: deviceName,
      serial_number: serialNumber,
    });
  };

  const handleEditClick = (printer) => {
    setSelectedPrinter(printer);
    setDeviceName(printer.deviceName || printer.device_name || "");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!deviceName) {
      toast.error("Device name is required");
      return;
    }
    editPrinterMutation.mutate({
      id: selectedPrinter.id,
      data: { device_name: deviceName },
    });
  };

  const handleDeleteClick = (printer) => {
    setSelectedPrinter(printer);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPrinter?.id) {
      deletePrinterMutation.mutate(selectedPrinter.id);
    }
  };

  const columns = [
    {
      key: "deviceName",
      Title: "Device Name",
      width: "25%",
      render: (row) => (
        <div className="text-left text-gray-900 font-medium">
          {row.deviceName || row.device_name || "N/A"}
        </div>
      ),
    },
    {
      key: "serialNumber",
      Title: "Serial Number",
      width: "25%",
      render: (row) => (
        <div className="text-left text-sky-700 font-mono text-sm">
          {row.serialNumber || row.serial_number || "N/A"}
        </div>
      ),
    },
    {
      key: "status",
      Title: "Status",
      width: "15%",
      render: (row) => (
        <div className="text-left">
          <span
            className={`inline-block text-center px-3 py-1 text-[11px] font-medium text-sky-950 rounded-full capitalize ${row.status?.toLowerCase() === "online" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20" : "bg-red-500/20 text-red-400 border border-red-500/20"}`}
          >
            {row.status || "Offline"}
          </span>
        </div>
      ),
    },
    {
      key: "lastSeen",
      Title: "Last Seen",
      width: "20%",
      render: (row) => (
        <div className="text-left text-sky-700 text-sm">
          {row.lastSeen
            ? new Date(row.lastSeen).toLocaleString("en-GB")
            : "Never"}
        </div>
      ),
    },
    {
      key: "action",
      Title: "Action",
      width: "15%",
      sortable: false,
      render: (row) => (
        <div className="flex justify-start gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="text-blue-400 hover:text-blue-300 transition-colors p-2 hover:bg-blue-500/10 rounded-lg"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="text-red-500/70 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div>
        <Breadcrumb text="Printer Management" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-[#2563EB] w-10 h-10" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb text="Manage your kitchen and receipt printers" />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Printer
        </button>
      </div>

      <div className="w-full">
        {printers.length > 0 ? (
          <Table
            TableHeads={columns}
            TableRows={printers}
            headClass="border-b border-[#1A1A1A] text-gray-900 whitespace-nowrap [&>div]:justify-start"
            tableClass="border-none"
          />
        ) : (
          <div className="p-12 text-center text-sky-700 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center border border-gray-800">
              <Printer className="w-8 h-8 text-sky-600" />
            </div>
            <div>
              <h3 className="text-gray-900 text-lg font-medium mb-1">
                No printers configured
              </h3>
              <p className="text-sm">
                Add a printer to start sending orders to your kitchen.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Add Printer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 text-slate-800">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-[500px] relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-lg font-semibold text-slate-800">
                Add New Printer
              </h2>
              <button
                onClick={closeModals}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-8 space-y-5">
              <InputField
                label="Device Name"
                type="text"
                placeholder="Enter printer name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                labelClass="!text-sm !font-medium !text-slate-700"
                inputClass="!w-full !bg-white !border !border-slate-200 !rounded-xl !px-4 !py-3 !text-slate-800 !placeholder-slate-400 hover:!border-sky-300 focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !transition-colors !text-[14.5px] !shadow-sm"
              />
              <InputField
                label="Serial Number"
                type="text"
                placeholder="e.g. 00:11:62:AA:BB:CC"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                labelClass="!text-sm !font-medium !text-slate-700"
                inputClass="!w-full !bg-white !border !border-slate-200 !rounded-xl !px-4 !py-3 !text-slate-800 !placeholder-slate-400 hover:!border-sky-300 focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !transition-colors !text-[14.5px] !font-mono !shadow-sm"
              />
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addPrinterMutation.isPending}
                  className="flex items-center justify-center bg-sky-600 hover:bg-sky-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-white px-6 py-2.5 rounded-xl text-[14px] font-semibold min-w-[120px] shadow-sm hover:shadow-md hover:shadow-sky-600/20"
                >
                  {addPrinterMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Printer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Printer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 text-slate-800">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-[500px] relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
              <h2 className="text-lg font-semibold text-slate-800">
                Edit Printer Name
              </h2>
              <button
                onClick={closeModals}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 shadow-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-8 space-y-5">
              <InputField
                label="Device Name"
                type="text"
                placeholder="e.g. Kitchen Printer 1"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                labelClass="!text-sm !font-medium !text-slate-700"
                inputClass="!w-full !bg-white !border !border-slate-200 !rounded-xl !px-4 !py-3 !text-slate-800 !placeholder-slate-400 hover:!border-sky-300 focus:!border-sky-500 focus:!ring-1 focus:!ring-sky-500 !transition-colors !text-[14.5px] !shadow-sm"
              />
              <InputField
                label="Serial Number (Cannot be changed)"
                type="text"
                value={
                  selectedPrinter?.serialNumber ||
                  selectedPrinter?.serial_number ||
                  ""
                }
                disabled
                labelClass="!text-sm !font-medium !text-slate-500"
                inputClass="!w-full !bg-slate-50/70 !border !border-slate-200 !rounded-xl !px-4 !py-3 !text-slate-400 focus:!outline-none !text-[14.5px] !font-mono cursor-not-allowed !shadow-inner"
              />
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-5 py-2.5 rounded-xl text-[14px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editPrinterMutation.isPending}
                  className="flex items-center justify-center bg-sky-600 hover:bg-sky-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-white px-6 py-2.5 rounded-xl text-[14px] font-semibold min-w-[120px] shadow-sm hover:shadow-md hover:shadow-sky-600/20"
                >
                  {editPrinterMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-[450px] p-8 relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
            <button
              onClick={closeModals}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 shadow-sm transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2 className="text-slate-800 text-xl font-bold mb-3 text-center">
              Delete Printer?
            </h2>
            <p className="text-slate-600 text-[14.5px] leading-relaxed mb-8 text-center">
              Are you sure you want to delete{" "}
              <span className="text-slate-800 font-semibold">
                {selectedPrinter?.deviceName || selectedPrinter?.device_name}
              </span>
              ? This printer will no longer receive orders.
            </p>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={closeModals}
                className="bg-white text-slate-600 border border-slate-200 font-semibold px-8 py-2.5 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors text-[14px] shadow-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deletePrinterMutation.isPending}
                className="flex items-center justify-center bg-rose-500 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-rose-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors text-[14px] shadow-sm hover:shadow-md hover:shadow-rose-500/20 cursor-pointer min-w-[100px]"
              >
                {deletePrinterMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrinterManagement;
