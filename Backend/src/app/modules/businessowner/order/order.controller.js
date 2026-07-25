import { OrderService } from "./order.service.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { PdfGenerator } from "../../../utils/pdfGenerator.js";
import { StatusCodes } from "http-status-codes";

// Get orders controller
const getOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { vapiAgentId, agentId } = req.query;
    const result = await OrderService.getOrders(userId, {
      vapiAgentId,
      agentId,
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID controller
const getOrderById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await OrderService.getOrderById(userId, id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Order details retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Download order PDF controller
const downloadOrderPdf = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const orderData = await OrderService.getOrderById(userId, id);

    const pdfBuffer = await PdfGenerator.generatePdf("order-pdf", orderData);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=order_${id}.pdf`,
      "Content-Length": pdfBuffer.length,
    });

    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  getOrders,
  getOrderById,
  downloadOrderPdf,
};
