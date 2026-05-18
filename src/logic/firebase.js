import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, writeBatch, doc } from 'firebase/firestore';

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

// Sync questions from Firebase, uploading them if Firestore is empty
export const syncQuestionsFromFirebase = async (localQuestions) => {
  try {
    const qCol = collection(db, 'questions');
    const snapshot = await getDocs(qCol);
    
    // If database is empty, let's self-populate it with the 75 local questions!
    if (snapshot.empty) {
      console.log("Banco de perguntas vazio no Firebase. Populando automaticamente...");
      const batch = writeBatch(db);
      
      localQuestions.forEach((q) => {
        // Use document ID as the question ID to avoid duplicates
        const docRef = doc(qCol, `q_${q.id}`);
        batch.set(docRef, q);
      });
      
      await batch.commit();
      console.log("Banco de perguntas populado no Firebase com sucesso!");
      return localQuestions;
    }
    
    // Retrieve and format questions from Firebase
    const firebaseQuestions = [];
    snapshot.forEach((doc) => {
      firebaseQuestions.push(doc.data());
    });
    
    // Sort them by id to keep them structured
    firebaseQuestions.sort((a, b) => a.id - b.id);
    return firebaseQuestions;
  } catch (error) {
    console.error("Erro ao sincronizar perguntas com Firebase:", error);
    return localQuestions; // Return local fallback if anything fails
  }
};
