import { StatusCodes } from "http-status-codes";
import { PrinterService } from "./printer.service.js";
import DevBuildError from "../../../lib/DevBuildError.js";

const handleError = (res, error, context = "Printer Management") => {
  console.error(`${context} Error:`, error);
  if (error instanceof DevBuildError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || "An internal server error occurred",
  });
};

const getPrinters = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await PrinterService.getPrinters(userId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Printers fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Get Printers");
  }
};

const getPrinterById = async (req, res) => {
  try {
    const userId = req.user.id;
    const printerId = req.params.id;
    const result = await PrinterService.getPrinterById(userId, printerId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Printer fetched successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Get Printer By ID");
  }
};

const createPrinter = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await PrinterService.createPrinter(userId, req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Printer registered successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Create Printer");
  }
};

const updatePrinter = async (req, res) => {
  try {
    const userId = req.user.id;
    const printerId = req.params.id;
    const result = await PrinterService.updatePrinter(
      userId,
      printerId,
      req.body,
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Printer updated successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Update Printer");
  }
};

const deletePrinter = async (req, res) => {
  try {
    const userId = req.user.id;
    const printerId = req.params.id;
    const result = await PrinterService.deletePrinter(userId, printerId);

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Printer deleted successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Delete Printer");
  }
};

const queueOrderPrint = async (req, res) => {
  try {
    const userId = req.user.id;
    const printerId = req.params.id;
    const { orderId } = req.body;

    if (!orderId) {
      throw new DevBuildError("Order ID is required", StatusCodes.BAD_REQUEST);
    }

    const result = await PrinterService.queueOrderPrint(
      userId,
      printerId,
      orderId,
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Print job queued successfully",
      data: result,
    });
  } catch (error) {
    return handleError(res, error, "Queue Print Job");
  }
};

const handlePrinterPoll = async (req, res) => {
  try {
    const { printerMAC, statusCode } = req.body;
    console.log(
      `CloudPRNT Poll: Received poll from printer ${printerMAC} with status ${statusCode}`,
    );

    const result = await PrinterService.handlePrinterPoll(
      printerMAC,
      statusCode,
    );

    if (result.jobReady) {
      return res.status(StatusCodes.OK).json(result);
    } else {
      // Star CloudPRNT accepts 204 No Content or 200 with jobReady: false
      return res.status(StatusCodes.NO_CONTENT).send();
    }
  } catch (error) {
    console.error("CloudPRNT Poll Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "An internal error occurred",
    });
  }
};

const handlePrinterGetJob = async (req, res) => {
  try {
    const jobToken =
      req.query.jobToken || req.query.token || req.query.jobtoken;
    console.log(
      `CloudPRNT GetJob: Requesting job content for token: ${jobToken}`,
    );

    const receiptText = await PrinterService.getPrintJobContent(jobToken);

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(StatusCodes.OK).send(receiptText);
  } catch (error) {
    console.error("CloudPRNT GetJob Error:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Error generating receipt");
  }
};

const handlePrinterConfirmJob = async (req, res) => {
  try {
    const jobToken =
      req.query.jobToken || req.query.token || req.query.jobtoken;
    const code = req.query.code;
    const mac = req.query.mac;

    console.log(
      `CloudPRNT ConfirmJob: Received confirmation for token: ${jobToken}, status code: ${code}, MAC: ${mac}`,
    );

    await PrinterService.confirmPrintJob(jobToken, code);

    // Respond with empty 200 OK (no body, per protocol)
    return res.status(StatusCodes.OK).send();
  } catch (error) {
    console.error("CloudPRNT ConfirmJob Error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
  }
};

export const PrinterController = {
  getPrinters,
  getPrinterById,
  createPrinter,
  updatePrinter,
  deletePrinter,
  queueOrderPrint,
  handlePrinterPoll,
  handlePrinterGetJob,
  handlePrinterConfirmJob,
};
