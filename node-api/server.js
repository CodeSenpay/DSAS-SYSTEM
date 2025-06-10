import express from 'express';
import cors from 'cors'; // Import cors
import router from './routes.js';
const app = express();

app.use(cors()); // Enable CORS
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
app.use(express.json());
app.use('/', router);

app.listen(3000, () =>
    console.log('🚀 Express server running at http://localhost:3000/')
);
