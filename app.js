import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './models/index.js'; // Adjust path as per your project structure
import errorHandler from './utils/errorHandler.js';
import authRoutes from './routes/authRoutes.js'; // Import authRoutes
import postRoutes from './routes/postRoutes.js'; // Import postRoutes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS Configuration
const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Adjust this to your frontend URL
  optionsSuccessStatus: 200 // Some legacy browsers (e.g., IE11) choke on 204
};

app.use(cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes); // Use authRoutes for authentication endpoints
app.use('/api/posts', postRoutes); // Use postRoutes for post-related endpoints

// Error handling middleware
app.use(errorHandler);

// Start server
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to sync database:', error);
  });
