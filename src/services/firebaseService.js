import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile 
} from 'firebase/auth';
import { db, auth } from '../config/firebase';

// Authentication Services
export const authService = {
  // Register new user
  async register(email, password, userData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile
      await updateProfile(user, {
        displayName: userData.name
      });
      
      // Save user data to Firestore
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        name: userData.name,
        phone: userData.phone || '',
        role: userData.role || 'client',
        shopId: userData.shopId || null,
        createdAt: serverTimestamp(),
        isActive: true
      });
      
      return user;
    } catch (error) {
      throw error;
    }
  },
  
  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout user
  async logout() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },
  
  // Get user data from Firestore
  async getUserData(uid) {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        return { id: querySnapshot.docs[0].id, ...userData };
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
};

// Shop Services
export const shopService = {
  // Create new shop
  async createShop(shopData) {
    try {
      const docRef = await addDoc(collection(db, 'shops'), {
        ...shopData,
        createdAt: serverTimestamp(),
        isActive: true
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all shops
  async getShops() {
    try {
      const querySnapshot = await getDocs(collection(db, 'shops'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Get shop by ID
  async getShop(shopId) {
    try {
      const docRef = doc(db, 'shops', shopId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  
  // Update shop
  async updateShop(shopId, shopData) {
    try {
      const docRef = doc(db, 'shops', shopId);
      await updateDoc(docRef, {
        ...shopData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }
};

// Service Services
export const serviceService = {
  // Create new service
  async createService(serviceData) {
    try {
      const docRef = await addDoc(collection(db, 'services'), {
        ...serviceData,
        createdAt: serverTimestamp(),
        isActive: true
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },
  
  // Get services by shop
  async getServicesByShop(shopId) {
    try {
      const q = query(
        collection(db, 'services'), 
        where('shopId', '==', shopId),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Update service
  async updateService(serviceId, serviceData) {
    try {
      const docRef = doc(db, 'services', serviceId);
      await updateDoc(docRef, {
        ...serviceData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Delete service
  async deleteService(serviceId) {
    try {
      const docRef = doc(db, 'services', serviceId);
      await updateDoc(docRef, {
        isActive: false,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }
};

// Barber Services
export const barberService = {
  // Get barbers by shop
  async getBarbersByShop(shopId) {
    try {
      const q = query(
        collection(db, 'users'), 
        where('shopId', '==', shopId),
        where('role', '==', 'staff'),
        where('isActive', '==', true)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Update barber profile
  async updateBarberProfile(barberId, profileData) {
    try {
      const docRef = doc(db, 'users', barberId);
      await updateDoc(docRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }
};

// Appointment Services
export const appointmentService = {
  // Create new appointment
  async createAppointment(appointmentData) {
    try {
      const docRef = await addDoc(collection(db, 'appointments'), {
        ...appointmentData,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },
  
  // Get appointments by client
  async getAppointmentsByClient(clientId) {
    try {
      const q = query(
        collection(db, 'appointments'), 
        where('clientId', '==', clientId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Get appointments by barber
  async getAppointmentsByBarber(barberId) {
    try {
      const q = query(
        collection(db, 'appointments'), 
        where('barberId', '==', barberId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Get appointments by shop
  async getAppointmentsByShop(shopId) {
    try {
      const q = query(
        collection(db, 'appointments'), 
        where('shopId', '==', shopId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Update appointment
  async updateAppointment(appointmentId, appointmentData) {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      await updateDoc(docRef, {
        ...appointmentData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Cancel appointment
  async cancelAppointment(appointmentId, reason) {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      await updateDoc(docRef, {
        status: 'cancelled',
        cancellationReason: reason,
        cancelledAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Complete appointment
  async completeAppointment(appointmentId) {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      await updateDoc(docRef, {
        status: 'completed',
        completedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }
};

// Transaction Services
export const transactionService = {
  // Create new transaction
  async createTransaction(transactionData) {
    try {
      const docRef = await addDoc(collection(db, 'transactions'), {
        ...transactionData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },
  
  // Get transactions by shop
  async getTransactionsByShop(shopId) {
    try {
      const q = query(
        collection(db, 'transactions'), 
        where('shopId', '==', shopId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Get transactions by barber
  async getTransactionsByBarber(barberId) {
    try {
      const q = query(
        collection(db, 'transactions'), 
        where('barberId', '==', barberId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }
};

// Expense Services
export const expenseService = {
  // Create new expense
  async createExpense(expenseData) {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), {
        ...expenseData,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },
  
  // Get expenses by barber
  async getExpensesByBarber(barberId) {
    try {
      const q = query(
        collection(db, 'expenses'), 
        where('barberId', '==', barberId),
        orderBy('date', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  },
  
  // Update expense
  async updateExpense(expenseId, expenseData) {
    try {
      const docRef = doc(db, 'expenses', expenseId);
      await updateDoc(docRef, {
        ...expenseData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  },
  
  // Delete expense
  async deleteExpense(expenseId) {
    try {
      const docRef = doc(db, 'expenses', expenseId);
      await deleteDoc(docRef);
    } catch (error) {
      throw error;
    }
  }
};

// Real-time listeners
export const realtimeService = {
  // Listen to appointments changes
  subscribeToAppointments(shopId, callback) {
    const q = query(
      collection(db, 'appointments'),
      where('shopId', '==', shopId),
      orderBy('date', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(appointments);
    });
  },
  
  // Listen to transactions changes
  subscribeToTransactions(shopId, callback) {
    const q = query(
      collection(db, 'transactions'),
      where('shopId', '==', shopId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(transactions);
    });
  }
};