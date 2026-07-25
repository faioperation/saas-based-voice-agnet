import React, { useState } from "react";
import { Eye, X, Printer, Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

import Table from "../../components/Table";
import Breadcrumb from "../../components/Breadcrumb";

const OrderList = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["ordersList"],
    queryFn: async () => {
      const res = await axiosSecure.get("/business-owner/order");
      return res.data;
    },
  });

  const { data: orderDetailsResponse, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["orderDetail", selectedOrderId],
    enabled: !!selectedOrderId,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/business-owner/order/${selectedOrderId}`,
      );
      return res.data;
    },
  });

  const orders = ordersResponse?.data || [];
  const selectedOrder = orderDetailsResponse?.data;
  const orderProducts = selectedOrder?.items || [];

  const handleViewClick = (order) => {
    setSelectedOrderId(order.id);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
  };

  const handleDownload = async () => {
    if (!selectedOrder) return;
    try {
      const toastId = toast.loading("Downloading invoice...");
      const res = await axiosSecure.get(
        `/business-owner/order/download/${selectedOrder.id}`,
        {
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${selectedOrder.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success("Download complete", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to download invoice");
    }
  };

  const handlePrint = async () => {
    if (!selectedOrder) return;
    try {
      const toastId = toast.loading("Preparing print...");
      const res = await axiosSecure.get(
        `/business-owner/order/download/${selectedOrder.id}`,
        {
          responseType: "blob",
        },
      );
      const url = window.URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      toast.dismiss(toastId);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to prepare print");
    }
  };

  const columns = [
    { key: "callId", Title: "Caller ID", width: "25%" },
    { key: "customerName", Title: "Customer Name", width: "20%" },
    { key: "time", Title: "Time", width: "15%" },
    { key: "date", Title: "Date", width: "15%" },
    { key: "orderType", Title: "Order Type", width: "10%" },
    {
      key: "action",
      Title: "Action",
      width: "15%",
      sortable: false,
      render: (row) => (
        <div className="flex justify-center">
          <button
            onClick={() => handleViewClick(row)}
            className="text-sky-700 hover:text-sky-950 transition-colors p-2 hover:bg-gray-800 rounded-lg"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div>
        <Breadcrumb text="You can see your order" />
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-[#2563EB] w-10 h-10" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumb text="You can see your order" />

      <div className="w-full">
        {orders.length > 0 ? (
          <Table
            TableHeads={columns}
            TableRows={orders}
            headClass=" border-b border-[#1A1A1A] text-gray-900 whitespace-nowrap last:[&>div]:justify-center"
            tableClass="border-none"
          />
        ) : (
          <div className="p-8 text-center text-sky-700 text-sm">
            No orders found.
          </div>
        )}
      </div>

      {/* View Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm p-4 text-slate-800">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-[700px] overflow-hidden relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800">
                Order Summary{" "}
                {selectedOrder && (
                  <span className="text-sky-600 font-medium">
                    ({selectedOrder.customerName})
                  </span>
                )}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 p-2 rounded-full border border-slate-200 shadow-sm transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isDetailsLoading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="animate-spin text-[#2563EB] w-8 h-8" />
              </div>
            ) : (
              <>
                {/* Table Content */}
                <div className="px-8 py-2 max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-4 text-[14px] font-semibold text-slate-600">
                          Product name
                        </th>
                        <th className="py-4 text-[14px] font-semibold text-slate-600 text-center">
                          Order Quantity
                        </th>
                        <th className="py-4 text-[14px] font-semibold text-slate-600">
                          Time
                        </th>
                        <th className="py-4 text-[14px] font-semibold text-slate-600 text-right">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderProducts.length > 0 ? (
                        orderProducts.map((product, idx) => (
                          <tr
                            key={product.id || idx}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-5 text-[14px] text-slate-700 font-medium">
                              {product.product_name || `Item ${idx + 1}`}
                            </td>
                            <td className="py-5 text-[14px] text-slate-700 text-center">
                              <span className="inline-block px-4">
                                {product.quantity}
                              </span>
                            </td>
                            <td className="py-5 text-[14px] text-slate-700">
                              {selectedOrder?.time || "-"}
                            </td>
                            <td className="py-5 text-[14px] text-slate-700 text-right">
                              £{product.unit_prize || 0}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-8 text-center text-slate-500 text-sm"
                          >
                            No items found for this order.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Actions */}
                <div className="px-8 py-6 flex justify-between items-center bg-slate-50/50 border-t border-slate-100">
                  <div className="text-[15px] font-semibold text-slate-800">
                    Total:{" "}
                    <span className="text-sky-600">
                      £{selectedOrder?.totalPrice || 0}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors text-slate-700 hover:text-sky-700 px-6 py-2.5 rounded-xl text-[14px] font-semibold cursor-pointer shadow-sm"
                    >
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-colors text-slate-700 hover:text-sky-700 px-6 py-2.5 rounded-xl text-[14px] font-semibold cursor-pointer shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderList;
