// Firestore database connection and utilities
import * as admin from 'firebase-admin';

let db: admin.firestore.Firestore | null = null;

export function getFirestore() {
  if (!db && admin.apps.length > 0) {
    db = admin.firestore();
  }
  return db;
}

export { admin };
