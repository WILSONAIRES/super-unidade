import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore';
import { bancoPerguntas } from './quiz.js';

const firebaseConfig = {
  apiKey: "AIzaSyBTs2VmmLeM8COIwVHP9j0wWLct625pagE",
  authDomain: "super-unidade-a3059.firebaseapp.com",
  projectId: "super-unidade-a3059",
  storageBucket: "super-unidade-a3059.firebasestorage.app",
  messagingSenderId: "220923010648",
  appId: "1:220923010648:web:5a157e1395f1653492742d",
  measurementId: "G-DWH4HCPSWR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const sync = async () => {
  console.log(`[Deploy Sync] Sincronizando ${bancoPerguntas.length} perguntas locais com o Firebase Firestore...`);
  try {
    const qCol = collection(db, 'questions');
    const batch = writeBatch(db);
    
    bancoPerguntas.forEach((q) => {
      const docRef = doc(qCol, `q_${q.id}`);
      batch.set(docRef, q);
    });
    
    await batch.commit();
    console.log("✅ [Deploy Sync] Banco de perguntas sincronizado com sucesso no Firebase!");
  } catch (error) {
    console.error("❌ [Deploy Sync] Erro ao sincronizar perguntas:", error);
    process.exit(1);
  }
  process.exit(0);
};

sync();
