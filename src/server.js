import express from 'express';
import dotenv from 'dotenv';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());

app.use('/webhook', messageRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

app.listen(port, () => {
  console.log(`Nistula webhook backend running on port ${port}`);
});
