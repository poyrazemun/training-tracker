import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Config değerlerini base64'e çevrilmiş halde saklayalım
const _0x5f2d = [
  'QUl6YVN5QkNsZXNpMkw1TzJxNTFzQkJFUFo4ZUNycl84S1haMmFV',  // apiKey
  'bXktdHJhaW5pbmctdHJhY2tlci00MDE5NS5maXJlYmFzZWFwcC5jb20=',  // authDomain
  'bXktdHJhaW5pbmctdHJhY2tlci00MDE5NQ==',  // projectId
  'bXktdHJhaW5pbmctdHJhY2tlci00MDE5NS5hcHBzcG90LmNvbQ==',  // storageBucket
  'ODU0NzMyMjU5MTM3',  // messagingSenderId
  'MTo4NTQ3MzIyNTkxMzc6d2ViOjFjNTVmN2YzMGRkZTgwNjc5YTZiYzA=',  // appId
  'Ry1MMVpLMVNIMVRS'   // measurementId
];

const firebaseConfig = {
  apiKey: atob(_0x5f2d[0]),
  authDomain: atob(_0x5f2d[1]),
  projectId: atob(_0x5f2d[2]),
  storageBucket: atob(_0x5f2d[3]),
  messagingSenderId: atob(_0x5f2d[4]),
  appId: atob(_0x5f2d[5]),
  measurementId: atob(_0x5f2d[6])
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
export const auth = getAuth(app);

// Export the db instance
export { db };