import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  serviceService, 
  barberService, 
  appointmentService,
  transactionService 
} from '../../services/firebaseService';

const BookAppointment = () => {
  // Get both userData and currentUser from the context
  const { userData, currentUser } = useAuth(); 
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [bookingData, setBookingData] = useState({
    serviceId: '',
    barberId: '',
    date: '',
    time: '',
    notes: ''
  });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Mock data for demo - replace with actual shop selection
  const currentShopId = 'demo-shop-1';

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const mockServices = [
    { 
      id: 'service-1', 
      name: 'Basic Haircut', 
      price: 50, 
      duration: 30, 
      description: 'Classic haircut with styling' 
    },
    { 
      id: 'service-2', 
      name: 'Haircut & Beard Trim', 
      price: 80, 
      duration: 45, 
      description: 'Complete grooming service' 
    },
    { 
      id: 'service-3', 
      name: 'Hair Wash & Cut', 
      price: 60, 
      duration: 40, 
      description: 'Wash, cut and style' 
    },
    { 
      id: 'service-4', 
      name: 'Full Service', 
      price: 120, 
      duration: 60, 
      description: 'Premium complete service' 
    },
    { 
      id: 'service-5', 
      name: 'Beard Trim Only', 
      price: 30, 
      duration: 20, 
      description: 'Professional beard styling' 
    }
  ];

  const mockBarbers = [
    { 
      id: 'barber-1', 
      name: 'John Doe', 
      rating: 4.8, 
      experience: '5 years', 
      specialty: 'Modern cuts' 
    },
    { 
      id: 'barber-2', 
      name: 'Jane Smith', 
      rating: 4.9, 
      experience: '7 years', 
      specialty: 'Classic styles' 
    },
    { 
      id: 'barber-3', 
      name: 'Mike Johnson', 
      rating: 4.7, 
      experience: '4 years', 
      specialty: 'Beard specialist' 
    }
  ];

  useEffect(() => {
    // For now, use mock data. In production, fetch from Firebase
    setServices(mockServices);
    setBarbers(mockBarbers);
  }, []);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setBookingData({ ...bookingData, serviceId: service.id });
    setStep(2);
  };

  const handleBarberSelect = (barber) => {
    setSelectedBarber(barber);
    setBookingData({ ...bookingData, barberId: barber.id });
    setStep(3);
  };

  const handleDateTimeSelect = () => {
    if (bookingData.date && bookingData.time) {
      setStep(4);
    }
  };

  const handleBookingConfirm = async () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async (paymentMethod) => {
    try {
      setLoading(true);
      
      // Create appointment
      const appointmentData = {
        clientId: currentUser.uid,
        clientName: userData.name,
        barberId: bookingData.barberId,
        barberName: selectedBarber.name,
        serviceId: bookingData.serviceId,
        serviceName: selectedService.name,
        shopId: currentShopId,
        date: bookingData.date,
        time: bookingData.time,
        amount: selectedService.price,
        notes: bookingData.notes,
        paymentMethod: paymentMethod,
        // *** KEY CHANGES FOR CASH PAYMENTS ***
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending', // Payment is not made yet
        status: 'pending',         // Appointment is pending, not confirmed
        createdAt: new Date()
      };
      
      const appointmentId = await appointmentService.createAppointment(appointmentData);
      
      // *** REMOVE TRANSACTION CREATION FOR CASH PAYMENTS ***
      // Transactions will be created by the barber when payment is received
      // For digital payments (when implemented), you might create a transaction here
      if (paymentMethod !== 'cash') {
        // Future: Handle M-Pesa/Card payments here
        console.log('Digital payment logic will be implemented here');
      }
      
      setShowPaymentModal(false);
      setBookingSuccess(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="container mt-4">
        <div className="card bg-info" style={{ color: 'white', textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
          <h1>Booking Pending!</h1>
          <p className="text-lg">Your appointment has been booked. Please arrive on time to pay and confirm your service.</p>
          
          <div className="card mt-4" style={{ color: '#333' }}>
            <h3>Booking Details</h3>
            <div className="grid grid-2 mt-3">
              <div>
                <p><strong>Service:</strong> {selectedService?.name}</p>
                <p><strong>Barber:</strong> {selectedBarber?.name}</p>
                <p><strong>Date:</strong> {bookingData.date}</p>
              </div>
              <div>
                <p><strong>Time:</strong> {bookingData.time}</p>
                <p><strong>Duration:</strong> {selectedService?.duration} minutes</p>
                <p><strong>Total Due:</strong> M{selectedService?.price}</p>
              </div>
            </div>
            <div className="alert alert-warning mt-3">
              <strong>Important:</strong> Your booking is successful, but payment is pending. Please pay at the shop to confirm your appointment.
            </div>
          </div>
          
          <button 
            className="btn btn-secondary btn-lg mt-4"
            onClick={() => window.location.reload()}
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1>Book Your Appointment</h1>
      
      {/* Progress Steps */}
      <div className="flex mb-5" style={{ justifyContent: 'center', gap: '2rem' }}>
        {[1, 2, 3, 4].map((stepNum) => (
          <div 
            key={stepNum}
            className={`flex-center ${step >= stepNum ? 'bg-primary' : 'bg-light'}`}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              color: step >= stepNum ? 'white' : '#666',
              fontWeight: 'bold'
            }}
          >
            {stepNum}
          </div>
        ))}
      </div>

      {/* Step 1: Service Selection */}
      {step === 1 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Select Service</h2>
          </div>
          
          <div className="grid grid-2">
            {services.map((service) => (
              <div 
                key={service.id}
                className="card"
                style={{ 
                  cursor: 'pointer',
                  border: '2px solid #ddd',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleServiceSelect(service)}
                onMouseEnter={(e) => e.target.style.borderColor = '#1976d2'}
                onMouseLeave={(e) => e.target.style.borderColor = '#ddd'}
              >
                <div className="flex-between">
                  <div>
                    <h3>{service.name}</h3>
                    <p className="text-muted">{service.description}</p>
                    <span className="badge badge-primary">{service.duration} min</span>
                  </div>
                  <div className="text-right">
                    <h2 className="text-primary">M{service.price}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Barber Selection */}
      {step === 2 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Select Barber</h2>
            <button className="btn btn-outline btn-sm" onClick={() => setStep(1)}>
              ← Back to Services
            </button>
          </div>
          
          <div className="grid grid-2">
            {barbers.map((barber) => (
              <div 
                key={barber.id}
                className="card"
                style={{ 
                  cursor: 'pointer',
                  border: '2px solid #ddd',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleBarberSelect(barber)}
                onMouseEnter={(e) => e.target.style.borderColor = '#1976d2'}
                onMouseLeave={(e) => e.target.style.borderColor = '#ddd'}
              >
                <div className="flex">
                  <div 
                    className="rounded-full bg-primary flex-center mr-3"
                    style={{ width: '60px', height: '60px', color: 'white', fontSize: '1.5rem' }}
                  >
                    {barber.name.charAt(0)}
                  </div>
                  <div>
                    <h3>{barber.name}</h3>
                    <div className="flex mb-2">
                      <span>⭐ {barber.rating}</span>
                    </div>
                    <p className="text-muted">{barber.experience} • {barber.specialty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Date & Time Selection */}
      {step === 3 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Select Date & Time</h2>
            <button className="btn btn-outline btn-sm" onClick={() => setStep(2)}>
              ← Back to Barbers
            </button>
          </div>
          
          <div className="grid grid-2">
            <div>
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-input"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="form-label">Select Time</label>
              <select
                className="form-select"
                value={bookingData.time}
                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
              >
                <option value="">Choose time...</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Additional Notes (Optional)</label>
            <textarea
              className="form-textarea"
              value={bookingData.notes}
              onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
              placeholder="Any special requests or notes for your barber..."
            />
          </div>
          
          <button
            className="btn btn-primary"
            onClick={handleDateTimeSelect}
            disabled={!bookingData.date || !bookingData.time}
          >
            Continue to Review
          </button>
        </div>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Review Your Booking</h2>
            <button className="btn btn-outline btn-sm" onClick={() => setStep(3)}>
              ← Back to Date/Time
            </button>
          </div>
          
          <div className="grid grid-2">
            <div>
              <h3>Service Details</h3>
              <p><strong>Service:</strong> {selectedService?.name}</p>
              <p><strong>Duration:</strong> {selectedService?.duration} minutes</p>
              <p><strong>Description:</strong> {selectedService?.description}</p>
            </div>
            
            <div>
              <h3>Appointment Details</h3>
              <p><strong>Barber:</strong> {selectedBarber?.name}</p>
              <p><strong>Date:</strong> {bookingData.date}</p>
              <p><strong>Time:</strong> {bookingData.time}</p>
              {bookingData.notes && <p><strong>Notes:</strong> {bookingData.notes}</p>}
            </div>
          </div>
          
          <div className="card bg-light mt-4">
            <div className="flex-between">
              <div>
                <h2>Total Amount</h2>
                <p className="text-muted">Includes M10 platform fee</p>
              </div>
              <h1 className="text-primary">M{selectedService?.price}</h1>
            </div>
          </div>
          
          <button
            className="btn btn-success btn-lg btn-block mt-4"
            onClick={handleBookingConfirm}
          >
            Confirm Booking & Pay
          </button>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal show">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Choose Payment Method</h2>
              <button 
                className="modal-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="alert alert-info">
              Total Amount: <strong>M{selectedService?.price}</strong>
            </div>
            
            <div className="grid grid-2">
              <button
                className="btn btn-success btn-lg"
                onClick={() => handlePayment('cash')}
                disabled={loading}
              >
                💵 Pay Cash at Shop
              </button>
              
              <button
                className="btn btn-primary btn-lg"
                onClick={() => alert('M-Pesa integration coming soon!')}
                disabled={true}
              >
                📱 M-Pesa (Coming Soon)
              </button>
            </div>
            
            <p className="text-sm text-muted mt-3 text-center">
              For now, you can book and pay cash at the shop. Digital payments will be available soon!
            </p>
            
            {loading && (
              <div className="text-center mt-3">
                <div className="spinner"></div>
                <p>Processing your booking...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;