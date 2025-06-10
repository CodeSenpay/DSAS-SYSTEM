// controllers/sampleController.js

function samplesp(payload, req, res) {
    // Replace with real logic, DB calls, etc.
    console.log('payload:', payload);
    res.json({ message: `Called samplesp with "${payload}"` });
}

function otherFunction(payload) {
    // Optional: additional functions 
    return { info: `otherFunction got ${payload}` };
}

export { samplesp, otherFunction };
