const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const discoveryRoutes = require('./routes/discoveryRoutes');
const savedItemsRoutes = require('./routes/savedItemsRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const reportRoutes = require('./routes/reportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const passportRoutes = require('./routes/passportRoutes');
const reelRoutes = require('./routes/reelRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Security & Utility Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'] }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'Dharohar Backend API',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// API Routes (v1)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/saved-items', savedItemsRoutes);
app.use('/api/v1/contributions', contributionRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/passport', passportRoutes);
app.use('/api/v1/reels', reelRoutes);
app.use('/api/v1/utilities', utilityRoutes);
app.use('/api/v1', discoveryRoutes);
app.use('/api/v1', contentRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
