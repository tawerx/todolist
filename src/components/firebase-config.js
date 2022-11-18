import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCTv2ToFYpEWgRM3vYNEs2fnwXvDQLMvVw',
  authDomain: 'todolist-513fa.firebaseapp.com',
  projectId: 'todolist-513fa',
  storageBucket: 'todolist-513fa.appspot.com',
  messagingSenderId: '987677921604',
  appId: '1:987677921604:web:f7315d9a828a7fda838711',
  measurementId: 'G-8Y1LRLQ8ZE',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const tasksCollectionRef = collection(db, 'tasks');
export const storage = getStorage();
