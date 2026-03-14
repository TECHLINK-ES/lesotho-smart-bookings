const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
require('dotenv').config();

const errorHandler = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();

// 1. Security HTTP Headers (OWASP: Security Misconfiguration)
app.use(helmet());

// 2. Rate Limiting (OWASP: Identification and Authentication Failures)
// Limits repeated requests to public APIs (Prevents Brute Force / DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api/auth', limiter); // Apply strictly to auth routes (Login/Register)

// 3. Data Sanitization against XSS (OWASP: Injection)
// Cleans req.body of malicious script tags
app.use(xss());

// 4. Prevent Parameter Pollution (OWASP: Injection)
// Prevents duplicate query parameters (e.g., ?sort=price&sort=age)
app.use(hpp());

// 5. Body Parser
// Limit body size to prevent payload overflow attacks
app.use(express.json({ limit: '10kb' }));

// 6. Enable CORS
app.use(cors());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/shops/:shopId/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/expenses', expenseRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error Handler Middleware (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});