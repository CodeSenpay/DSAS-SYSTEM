import schedulingModel from "../models/scheduling-models/scheduling-model.js";
// Map model to models objects
const models = {
  schedulingModel: {
    insert_availability: schedulingModel.insert_availability,
    update_availability: schedulingModel.update_availability,
    get_availability: schedulingModel.getAvailability,
    get_appointment: schedulingModel.getAppointment,
    insert_appointment: schedulingModel.insert_appointment,
    approve_appointment: schedulingModel.approveAppointment,
    insert_transactionType: schedulingModel.insertTransactionType,
    get_transactionType: schedulingModel.getTransactionType,
  },
};

// Utility for better error responses
function errorResponse(res, status, message, details = null) {
  const error = { error: message };
  if (details) error.details = details;
  return res.status(status).json(error);
}

// Enhanced controller
async function handle_schedule(req, res) {
  try {
    const { model, sp_name, payload } = req.body;

    // Validate input
    if (!model || !sp_name) {
      return errorResponse(res, 400, "Missing model or sp_name");
    }
    if (typeof model !== "string" || typeof sp_name !== "string") {
      return errorResponse(res, 400, "model and sp_name must be strings");
    }

    // Check if the model exists
    const ctrl = models[model];
    if (!ctrl) {
      return errorResponse(res, 404, `Model "${model}" not found`);
    }

    // Check if the function exists in the model
    const fn = ctrl[sp_name];
    if (typeof fn !== "function") {
      return errorResponse(
        res,
        404,
        `Function "${sp_name}" not found in model "${model}"`
      );
    }

    // Call the model function
    const result = await fn(payload, req, res);

    // If the function already sent a response, do not send another
    if (!res.headersSent) {
      res.status(200).json({ success: true, data: result });
    }
  } catch (err) {
    console.error("Schedule Controller Error:", err);
    errorResponse(res, 500, "Internal server error", err.message);
  }
}

export { handle_schedule };
