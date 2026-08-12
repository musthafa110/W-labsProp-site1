import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  projectId: "pacific-codex-2jkjx",
  appId: "1:934665843047:web:0a8e097f5934ba139effc2",
  apiKey: "AIzaSyCXDSv-Laz5Uw2qvlGZGQ5wMcWQfUvyL7g",
  authDomain: "pacific-codex-2jkjx.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-proposalforafna-32787309-f3aa-45ba-9ce9-f6a6f3f4df42",
  storageBucket: "pacific-codex-2jkjx.firebasestorage.app",
  messagingSenderId: "934665843047",
  measurementId: "",
  oAuthClientId: "934665843047-8tjekfutt43s2eeuoh7fb9jo8vjmkjfj.apps.googleusercontent.com"
};

let app: any;
let db: any;
let auth: any;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  
  // Safely initialize Firestore with the specified databaseId and long polling options
  if (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== "(default)") {
    try {
      db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
        experimentalAutoDetectLongPolling: true
      }, firebaseConfig.firestoreDatabaseId);
    } catch (e1) {
      console.warn("initializeFirestore with databaseId failed, trying getFirestore with 2 arguments...", e1);
      try {
        db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
      } catch (e2) {
        console.warn("getFirestore with 2 arguments failed, falling back to default getFirestore...", e2);
        db = getFirestore(app);
      }
    }
  } else {
    try {
      db = initializeFirestore(app, {
        experimentalForceLongPolling: true,
        experimentalAutoDetectLongPolling: true
      });
    } catch (e) {
      db = getFirestore(app);
    }
  }

  auth = getAuth(app);
} catch (error) {
  console.error("Firebase initialization failed completely:", error);
  // Create resilient safe fallback Proxy objects to prevent module import crashes
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

