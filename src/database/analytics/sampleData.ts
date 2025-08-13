import { openLearnerDatabase } from "../sqlite";
import Database from "@tauri-apps/plugin-sql";

const sampleQuestions = [
  "What is machine learning?",
  "Explain the concept of neural networks",
  "What are the benefits of using React?",
  "How does a database work?",
  "What is the difference between HTTP and HTTPS?",
  "Explain the concept of object-oriented programming",
  "What is version control and why is it important?",
  "How does cloud computing work?",
  "What are the main principles of clean code?",
  "Explain the concept of API design"
];

const sampleAnswers = [
  "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed. It uses algorithms to identify patterns in data and make predictions or decisions based on those patterns.",
  "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) that process information and can learn to recognize patterns, classify data, and make predictions through training on large datasets.",
  "React provides a component-based architecture that makes it easy to build reusable UI components. It uses a virtual DOM for efficient rendering, has a large ecosystem, and enables developers to create interactive user interfaces with declarative code.",
  "A database is an organized collection of structured information stored electronically. It uses a database management system (DBMS) to store, retrieve, and manage data efficiently. Databases can be relational (SQL) or non-relational (NoSQL).",
  "HTTP (Hypertext Transfer Protocol) is unencrypted and sends data in plain text, while HTTPS (HTTP Secure) encrypts data using SSL/TLS certificates. HTTPS provides security, privacy, and data integrity for web communications.",
  "Object-oriented programming is a programming paradigm based on objects that contain data and code. Key principles include encapsulation, inheritance, polymorphism, and abstraction. It promotes code reusability and maintainability.",
  "Version control is a system that tracks changes to files over time. It allows multiple developers to collaborate, maintains a history of changes, enables rollback to previous versions, and helps manage different branches of development.",
  "Cloud computing provides on-demand access to computing resources over the internet. It includes services like storage, processing power, and applications. Users pay only for what they use, and resources can be scaled up or down as needed.",
  "Clean code principles include meaningful names, small functions, single responsibility, DRY (Don't Repeat Yourself), proper formatting, and comprehensive testing. It makes code readable, maintainable, and easier to understand.",
  "API design involves creating interfaces for software applications to communicate. Good API design includes consistent naming, proper HTTP methods, clear documentation, error handling, versioning, and security considerations."
];

const llmModels = ["gpt-4", "gpt-3.5-turbo", "claude-3", "gemini-pro"];

export async function generateSampleData() {
  let db: Database | null = null;
  try {
    db = await openLearnerDatabase();
    
    console.log("Generating sample evaluation data...");
    
    // Clear existing data first
    await db.execute("DELETE FROM evaluation");
    await db.execute("DELETE FROM question");
    
    // Generate sample data for the last 30 days
    const now = new Date();
    const evaluations = [];
    
    for (let i = 0; i < 50; i++) {
      const questionIndex = Math.floor(Math.random() * sampleQuestions.length);
      const answerIndex = Math.floor(Math.random() * sampleAnswers.length);
      const modelIndex = Math.floor(Math.random() * llmModels.length);
      
      // Generate a random date within the last 30 days
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const randomDate = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
      
      // Generate a realistic score (biased towards higher scores)
      const score = Math.floor(Math.random() * 4) + 6; // 6-9 range
      
      const question = sampleQuestions[questionIndex];
      const answer = sampleAnswers[answerIndex];
      const llmModel = llmModels[modelIndex];
      const timestamp = randomDate.toISOString();
      
      evaluations.push({
        question,
        answer,
        score,
        justification: `Sample evaluation with score ${score}/10`,
        llm_model: llmModel,
        timestamp
      });
    }
    
    // Insert questions and evaluations
    for (const evalData of evaluations) {
      // Check if question exists, if not insert it
      const existingQuestion = await db.select<{ id: number }[]>(
        "SELECT id FROM question WHERE content = ?",
        [evalData.question]
      );
      
      let questionId: number;
      if (existingQuestion.length > 0) {
        questionId = existingQuestion[0].id;
      } else {
        await db.execute("INSERT INTO question (content) VALUES (?)", [evalData.question]);
        const lastIdRow = await db.select<{ id: number }[]>("SELECT last_insert_rowid() as id");
        questionId = lastIdRow[0].id;
      }
      
      // Insert evaluation
      await db.execute(
        `INSERT INTO evaluation (question_id, answer, score, justification, llm_model, timestamp)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [questionId, evalData.answer, evalData.score, evalData.justification, evalData.llm_model, evalData.timestamp]
      );
    }
    
    console.log(`Generated ${evaluations.length} sample evaluations`);
    return { success: true, count: evaluations.length };
    
  } catch (error) {
    console.error("Error generating sample data:", error);
    return { success: false, error: `${error}` };
  } finally {
    db?.close();
  }
}
