import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

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
export const db = getFirestore(app);

// Helper function to save a high score to Firestore
export const saveHighScore = async (playerScore) => {
  try {
    const scoresCol = collection(db, 'high_scores');
    await addDoc(scoresCol, {
      name: playerScore.name,
      club: playerScore.club,
      score: playerScore.score,
      date: new Date().toLocaleDateString('pt-BR'),
      timestamp: Date.now() // to track absolute order for sorting tiebreakers
    });
  } catch (error) {
    console.error("Erro ao salvar pontuação global no Firebase:", error);
  }
};

// Helper function to fetch the top 5 high scores from Firestore
export const getTopHighScores = async () => {
  try {
    const scoresCol = collection(db, 'high_scores');
    const q = query(scoresCol, orderBy('score', 'desc'), orderBy('timestamp', 'asc'), limit(5));
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push(doc.data());
    });
    return scores;
  } catch (error) {
    console.error("Erro ao buscar pontuações globais no Firebase:", error);
    return [];
  }
};
