// This directly calls models
import { schedulingModel } from '../models/scheduling-models/scheduling-model.js';

// Map model to models objects
const models = {
    schedulingModel: { schedulingModel },
};

//Fix the routing of the controllers
async function handle(req, res) {
    try {
        const { model, sp_name, payload } = req.body;

        if (!model || !sp_name) {
            return res.status(400).json({ error: 'Missing model or sp_name' });
        }

        // Check if the controller exists
        const ctrl = models[model];
        if (!ctrl) {
            return res.status(404).json({ error: `Model "${model}" not found` });
        }

        // Check if the controller has the sp_name as a function
        const fn = ctrl[sp_name];
        if (typeof fn !== 'function') {
            return res.status(404).json({ error: `Function "${sp_name}" not found in model "${model}"` });
        }

        // Call the controller function
        const result = await fn(payload, req, res);

        // If controller function already sent response:
        if (!res.headersSent) {
            res.json({ success: true, data: result });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export { handle }
