// controllers/mainController.js
import { samplesp, otherFunction } from '../controllers/subsidy/sampleController.js'; // Use ES module import

// Map modules to controller objects
const controllers = {
    sampleController: samplesp,
};

//Fix the routing of the controllers
async function handle(req, res) {
    try {
        const { controller, sp_name, payload } = req.body;

        if (!controller || !sp_name) {
            return res.status(400).json({ error: 'Missing controller or sp_name' });
        }

        const ctrl = controllers[controller];
        if (!ctrl) {
            return res.status(404).json({ error: `Controller "${controller}" not found` });
        }

        // Check if the sp_name exists in the controller
        const fn = ctrl[sp_name];
        if (typeof fn !== 'function') {
            return res.status(404).json({ error: `Function "${sp_name}" not found in controller "${controller}"` });
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
