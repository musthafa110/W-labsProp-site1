import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import defaultConfig from "../../firebase-applet-config.json";

const firebaseConfig = defaultConfig;

let app: any;
let db: any;
let auth: any;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  const databaseId = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)"
    ? firebaseConfig.firestoreDatabaseId
    : undefined;

  // Initialize Firestore with experimentalAutoDetectLongPolling for iframe sandboxes
  try {
    if (databaseId) {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true
      }, databaseId);
    } else {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true
      });
    }
  } catch (e1) {
    try {
      db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    } catch (e2) {
      console.warn("Falling back to default getFirestore", e2);
      db = getFirestore(app);
    }
  }

  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization failed:", error);
  const fallbackHandler = {
    get: (target: any, prop: string) => {
      return (...args: any[]) => {
        console.error(`Firebase is uninitialized. Call to ${prop} aborted.`);
        return Promise.resolve({
          docs: [],
          forEach: () => {},
          data: () => ({})
        });
      };
    }
  };
  db = new Proxy({}, fallbackHandler);
  auth = new Proxy({}, fallbackHandler);
}

export { app, db, auth };


