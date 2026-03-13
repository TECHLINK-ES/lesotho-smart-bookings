// src/scripts/setupFirestore.js
import admin from 'firebase-admin';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load service account key securely
const serviceAccountPath = join(__dirname, 'serviceAccountKey.json');
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupFirestore() {
  console.log('🚀 Starting Firestore structure setup (non-user collections)...');

  try {
    // ===== 1. Create a sample shop =====
    const shopRef = await db.collection('shops').add({
      name: 'Demo Barber Shop',
      location: 'Maseru, Lesotho',
      contact: '+266 123 4567',
      email: 'demo@barbershop.com',
      ownerName: 'Likano Alphonce Mbobo',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const shopId = shopRef.id;
    console.log('✅ Created shop:', shopId);

    // ===== 2. Create sample services =====
    const services = [
      { name: 'Haircut', price: 60, duration: 30, shopId },
      { name: 'Beard Trim', price: 40, duration: 20, shopId },
      { name: 'Hair & Beard Combo', price: 90, duration: 45, shopId }
    ];

    for (const service of services) {
      await db.collection('services').add({
        ...service,
        isActive: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    console.log('✅ Created services');

    // ===== 3. Create sample appointment (placeholders) =====
    await db.collection('appointments').add({
      clientId: 'CLIENT_UID_PLACEHOLDER',
      barberId: 'STAFF_UID_PLACEHOLDER',
      shopId,
      serviceId: 'SERVICE_ID_PLACEHOLDER',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      time: '10:00',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // ===== 4. Create sample transaction =====
    await db.collection('transactions').add({
      shopId,
      barberId: 'STAFF_UID_PLACEHOLDER',
      amount: 90,
      method: 'cash',
      status: 'completed',
      type: 'payment',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // ===== 5. Create sample expense =====
    await db.collection('expenses').add({
      barberId: 'STAFF_UID_PLACEHOLDER',
      shopId,
      description: 'Barber Scissors',
      amount: 250,
      category: 'equipment',
      date: new Date(),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('\n🎉 Firestore structure setup complete!');
    console.log('💡 Next steps:');
    console.log('   - Create real users in Firebase Auth');
    console.log('   - (Optional) Update placeholder UIDs in appointments');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }

  process.exit(0);
}

// Run it
setupFirestore();