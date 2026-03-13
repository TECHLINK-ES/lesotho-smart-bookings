# Smart Barber Booking & Payment Management System (SBBPMS)

A comprehensive web application for managing barber shop bookings, payments, and business operations.

## 🚀 Features

### For Clients
- **Easy Booking**: Browse services, select barbers, and book appointments
- **Payment Tracking**: Monitor payment history and receipts
- **Appointment Management**: View, reschedule, or cancel bookings
- **Service Reviews**: Rate and review barber services

### For Staff/Barbers
- **Dashboard Overview**: Daily earnings, appointments, and performance metrics
- **Booking Management**: Confirm, complete, or reschedule appointments
- **Financial Tracking**: Income, expenses, and profit analysis
- **Service Management**: Add and manage service offerings

### For Platform Admins
- **System Overview**: Monitor all shops, users, and transactions
- **Commission Tracking**: Automatic M10 commission per booking
- **Shop Management**: Add, edit, and manage barber shops
- **Analytics**: Platform-wide performance and revenue reports

## 🛠️ Technology Stack

- **Frontend**: React.js with Custom CSS (no Tailwind)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Styling**: Global CSS with modern design system
- **State Management**: React Context API
- **Real-time Updates**: Firebase real-time listeners

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-barber-booking
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   pnpm run build
   ```

## 🔧 Configuration

### Firebase Setup
The application is pre-configured with Firebase:
- **Project ID**: `smart-barber-booking`
- **Authentication**: Email/Password enabled
- **Firestore**: Real-time database for all data
- **Storage**: File uploads and media storage

### Environment Variables
No additional environment variables needed - Firebase config is included.

## 👥 User Roles & Demo Accounts

### Demo Login Credentials:
- **Client**: `client@demo.com` / `demo123`
- **Staff**: `staff@demo.com` / `demo123`
- **Admin**: `admin@demo.com` / `demo123`

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop**: Full-featured desktop interface
- **Touch-Friendly**: Large buttons and easy navigation

## 💳 Payment System

### Current Implementation:
- **Cash Payments**: Fully functional cash payment tracking
- **Transaction Logging**: Complete payment history
- **Commission System**: Automatic M10 commission per booking
- **Financial Reports**: Income, expenses, and profit tracking

### Future Integration:
- **M-Pesa**: Ready for M-Pesa API integration
- **EcoCash**: Prepared for EcoCash payments
- **Card Payments**: Stripe integration ready

## 📊 Database Schema

### Collections:
- `users` - User profiles and authentication
- `shops` - Barber shop information
- `services` - Available services per shop
- `appointments` - Booking records
- `transactions` - Payment and commission records
- `expenses` - Staff expense tracking

## 🚀 Deployment

### Recommended Platforms:
1. **Vercel** (Recommended)
2. **Netlify**
3. **Firebase Hosting**

### Build Command:
```bash
npm run build
```

### Deploy Directory:
```
dist/
```

## 🔒 Security Features

- **Firebase Authentication**: Secure user management
- **Role-Based Access**: Client, Staff, Admin permissions
- **Data Validation**: Input sanitization and validation
- **Protected Routes**: Secure page access control
- **Real-time Security**: Firebase security rules

## 📈 Business Model

- **Commission System**: M10 per successful booking
- **Subscription Plans**: Monthly shop subscriptions
- **Multi-tenant**: Support for multiple barber shops
- **Scalable Architecture**: Ready for growth

## 🛠️ Development

### Project Structure:
```
src/
├── components/          # Reusable UI components
├── pages/              # Page components by role
├── services/           # Firebase service functions
├── contexts/           # React contexts
├── styles/             # Global CSS styles
└── config/             # Configuration files
```

### Adding New Features:
1. Create components in appropriate folders
2. Add Firebase service functions
3. Update navigation and routing
4. Test across all user roles

## 📞 Support

### Common Issues:
- **Build Errors**: Check Node.js version (16+)
- **Firebase Errors**: Verify Firebase configuration
- **Authentication**: Ensure Firebase Auth is enabled
- **Database**: Check Firestore security rules

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

This is a private project. Contact the development team for contribution guidelines.

---

**Smart Barber Booking & Payment Management System** - Streamlining barber shop operations with modern technology.