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

// Helper function to fetch the top 10 high scores from Firestore
export const getTopHighScores = async () => {
  try {
    const scoresCol = collection(db, 'high_scores');
    // Para evitar a necessidade de criar um "Índice Composto" manualmente no console do Firebase,
    // ordenamos apenas por 'score' na consulta e fazemos o desempate por 'timestamp' no JavaScript local.
    const q = query(scoresCol, orderBy('score', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push(doc.data());
    });
    
    // Desempate de pontuações iguais usando o timestamp (quem fez primeiro fica acima)
    scores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return (a.timestamp || 0) - (b.timestamp || 0);
    });

    return scores;
  } catch (error) {
    console.error("Erro ao buscar pontuações globais no Firebase:", error);
    return [];
  }
};

// Sync questions from Firebase, uploading/updating core questions to keep them up to date with code changes
export const syncQuestionsFromFirebase = async (localQuestions) => {
  try {
    const qCol = collection(db, 'questions');
    
    // Auto-sincroniza as perguntas padrão locais com o Firebase para corrigir digitações e erros
    const batch = writeBatch(db);
    localQuestions.forEach((q) => {
      // Usamos IDs previsíveis como 'q_40' para evitar duplicados e permitir atualizações
      const docRef = doc(qCol, `q_${q.id}`);
      batch.set(docRef, q);
    });
    await batch.commit();
    console.log("Banco de perguntas padrão sincronizado com o Firebase!");
    
    // Busca todas as perguntas atualizadas direto do Firebase (incluindo as novas criadas pelo console)
    const snapshot = await getDocs(qCol);
    const firebaseQuestions = [];
    snapshot.forEach((doc) => {
      firebaseQuestions.push(doc.data());
    });
    
    // Ordena as perguntas por ID para manter a estrutura
    firebaseQuestions.sort((a, b) => a.id - b.id);
    return firebaseQuestions;
  } catch (error) {
    console.error("Erro ao sincronizar perguntas com Firebase:", error);
    return localQuestions; // Retorna o fallback local em caso de erro de rede
  }
};
