const express = require('express');
const cors = require('cors');
require('dotenv').config();

const errorHandler = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
// const appointmentRoutes = require('./routes/appointmentRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/shops/:shopId/services', serviceRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/expenses', expenseRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});