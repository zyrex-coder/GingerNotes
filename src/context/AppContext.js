import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Auth & Profile states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Student',
    email: 'student@gingernotes.com',
    ocrMode: 'balanced',
    dailyGoal: 4,
    notifications: true,
  });

  const login = (email, password) => {
    setIsLoggedIn(true);
    if (email && email.includes('@')) {
      const part = email.split('@')[0];
      setProfile(prev => ({
        ...prev,
        email,
        name: prev.name === 'Student' ? part.charAt(0).toUpperCase() + part.slice(1) : prev.name
      }));
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsSettingsVisible(false);
  };

  const deleteAccount = () => {
    setIsLoggedIn(false);
    setIsSettingsVisible(false);
    setProfile({
      name: 'Student',
      email: '',
      ocrMode: 'balanced',
      dailyGoal: 4,
      notifications: true,
    });
    setStats({
      notesScanned: 0,
      cardsMastered: 0,
      totalCards: 0,
      quizzesDone: 0,
      streak: 0,
      lastQuizScore: 0,
    });
    setNotes([]);
  };


  const saveSettings = (newProfile) => {
    setProfile(newProfile);
    setIsSettingsVisible(false);
  };

  // Global stats
  const [stats, setStats] = useState({
    notesScanned: 24,
    cardsMastered: 63,
    totalCards: 92,
    quizzesDone: 12,
    streak: 7,
    lastQuizScore: 80,
  });

  // Notes List
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Biology Chapter 7 — Cell Division',
      subject: 'Biology',
      pages: 4,
      time: '2h ago',
      starred: false,
      color: '#3B82F6',
      content: 'Cell division is the process by which a parent cell divides into two or more daughter cells. Cell division usually occurs as part of a larger cell cycle. In eukaryotes, there are two distinct types of cell division: a vegetative division, where each daughter cell is genetically identical to the parent cell (mitosis), and a reproductive cell division, where the number of chromosomes in the daughter cells is reduced by half to produce haploid gametes (meiosis).'
    },
    {
      id: '2',
      title: 'World War II Timeline Notes',
      subject: 'History',
      pages: 6,
      time: 'Yesterday',
      starred: true,
      color: '#8B5CF6',
      content: 'World War II (1939-1945) was a global conflict that involved the vast majority of the world\'s countries. Major alliances were the Axis powers (Germany, Japan, Italy) and the Allies (UK, US, Soviet Union, China). Key milestones include the invasion of Poland (1939), Fall of France (1940), Pearl Harbor (1941), Battle of Stalingrad (1942-1943), D-Day landings (1944), and the atomic bombings of Hiroshima and Nagasaki (1945), leading to Axis surrender.'
    },
    {
      id: '3',
      title: 'Calculus Derivatives & Integrals',
      subject: 'Math',
      pages: 3,
      time: '2 days ago',
      starred: false,
      color: '#10B981',
      content: 'Calculus is the mathematical study of continuous change. Derivatives represent the instantaneous rate of change of a function, defined as the limit of the difference quotient as the interval approaches zero. Integrals represent the accumulation of quantities, such as the area under a curve, and serve as the inverse operation of derivatives, as stated by the Fundamental Theorem of Calculus.'
    },
    {
      id: '4',
      title: 'Python OOP Concepts',
      subject: 'CS',
      pages: 5,
      time: '3 days ago',
      starred: false,
      color: '#F59E0B',
      content: 'Object-Oriented Programming (OOP) in Python is a programming paradigm that uses "objects" to represent data and methods. The four core principles of OOP are:\n1. Encapsulation: Restricting direct access to some of the object\'s components.\n2. Inheritance: Creating new classes that reuse, extend, and modify behavior from parent classes.\n3. Polymorphism: Allowing different classes to be treated as instances of the same superclass.\n4. Abstraction: Hiding complex implementation details and showing only the essential features.'
    }
  ]);

  // Flashcards Decks
  const [decks, setDecks] = useState([
    {
      id: 'bio',
      title: 'Biology',
      total: 24,
      mastered: 18,
      color: '#3B82F6',
      percent: 75,
      cards: [
        { q: 'What is the powerhouse of the cell?', a: 'Mitochondria. It generates most of the cell\'s chemical energy (ATP).' },
        { q: 'What is mitosis?', a: 'A type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.' },
        { q: 'What is the function of Ribosomes?', a: 'They are responsible for protein synthesis by translating genetic codes into amino acid chains.' },
        { q: 'What substance is the cell wall made of in plants?', a: 'Cellulose, a complex carbohydrate.' },
        { q: 'What is photosynthesis?', a: 'The process used by plants and other organisms to convert light energy into chemical energy (glucose).' }
      ]
    },
    {
      id: 'calc',
      title: 'Calculus',
      total: 16,
      mastered: 8,
      color: '#8B5CF6',
      percent: 50,
      cards: [
        { q: 'What is the derivative of sin(x)?', a: 'cos(x)' },
        { q: 'State the Fundamental Theorem of Calculus.', a: 'It establishes a connection between differentiation and integration, showing they are inverse operations.' },
        { q: 'What is the derivative of e^x?', a: 'e^x (it remains unchanged!)' },
        { q: 'What does the derivative of a function represent geometrically?', a: 'The slope of the tangent line to the function\'s graph at a given point.' }
      ]
    },
    {
      id: 'hist',
      title: 'World History',
      total: 32,
      mastered: 25,
      color: '#F59E0B',
      percent: 78,
      cards: [
        { q: 'When did World War II begin?', a: 'September 1, 1939, with Germany\'s invasion of Poland.' },
        { q: 'Who was the first Emperor of Rome?', a: 'Augustus Caesar (formerly Octavian), starting in 27 BC.' },
        { q: 'What was the Magna Carta?', a: 'A royal charter of rights signed by King John of England in 1515, establishing that the king was not above the law.' },
        { q: 'Which civilization built the Machu Picchu?', a: 'The Inca Empire in Peru, during the 15th century.' }
      ]
    },
    {
      id: 'cs',
      title: 'Computer Science',
      total: 20,
      mastered: 12,
      color: '#10B981',
      percent: 60,
      cards: [
        { q: 'What does OOP stand for?', a: 'Object-Oriented Programming.' },
        { q: 'What is an Abstract Data Type (ADT)?', a: 'A mathematical model for data types where the data type is defined by its behavior (operations) rather than its implementation.' },
        { q: 'What is the time complexity of binary search?', a: 'O(log n) where n is the number of elements in the sorted array.' },
        { q: 'Explain recursion in simple terms.', a: 'A programming method where a function calls itself to solve smaller instances of the same problem.' }
      ]
    }
  ]);

  // Quizzes list and details
  const [quizzes, setQuizzes] = useState([
    {
      id: 'q-bio',
      title: 'Cell Biology',
      questionsCount: 10,
      duration: 8,
      difficulty: 'Medium',
      color: '#3B82F6',
      questions: [
        { q: 'Which organelle is responsible for cellular respiration?', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Lysosome'], correct: 1 },
        { q: 'Which division leads to identical daughter cells?', options: ['Meiosis', 'Mitosis', 'Binary Fission', 'Budding'], correct: 1 },
        { q: 'What molecules form the basic structure of the cell membrane?', options: ['Proteins', 'Phospholipids', 'Carbohydrates', 'Nucleic acids'], correct: 1 }
      ]
    },
    {
      id: 'q-hist',
      title: 'World History',
      questionsCount: 15,
      duration: 12,
      difficulty: 'Easy',
      color: '#F59E0B',
      questions: [
        { q: 'In which year did World War II end?', options: ['1918', '1945', '1939', '1950'], correct: 1 },
        { q: 'The ancient city of Carthage was located in which modern country?', options: ['Egypt', 'Italy', 'Tunisia', 'Greece'], correct: 2 },
        { q: 'Who discovered America in 1492?', options: ['Amerigo Vespucci', 'Christopher Columbus', 'Vasco da Gama', 'Ferdinand Magellan'], correct: 1 }
      ]
    },
    {
      id: 'q-calc',
      title: 'Calculus Basics',
      questionsCount: 8,
      duration: 10,
      difficulty: 'Hard',
      color: '#EF4444',
      questions: [
        { q: 'What is the derivative of ln(x)?', options: ['1/x', 'e^x', 'x', '1/x^2'], correct: 0 },
        { q: 'Who is co-credited with inventing Calculus alongside Isaac Newton?', options: ['Rene Descartes', 'Gottfried Wilhelm Leibniz', 'Blaise Pascal', 'Leonhard Euler'], correct: 1 }
      ]
    },
    {
      id: 'q-cs',
      title: 'CS Fundamentals',
      questionsCount: 12,
      duration: 10,
      difficulty: 'Medium',
      color: '#10B981',
      questions: [
        { q: 'Which data structure operates on a Last-In, First-Out (LIFO) basis?', options: ['Queue', 'Stack', 'Array', 'Linked List'], correct: 1 },
        { q: 'What is the base of the hexadecimal number system?', options: ['Base 2', 'Base 8', 'Base 10', 'Base 16'], correct: 3 }
      ]
    }
  ]);

  // AI Chat Messages
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      sender: 'ai',
      text: "Hi! I'm Ginger AI 🌟 Your personal study assistant. I can help you understand concepts, summarize notes, create study plans, or explain anything you're struggling with. What would you like to learn today?",
      time: 'Just now'
    }
  ]);

  // Actions
  const addScannedNote = (note) => {
    const newNote = {
      id: Date.now().toString(),
      starred: false,
      time: 'Just now',
      ...note,
    };
    setNotes(prev => [newNote, ...prev]);
    setStats(prev => ({
      ...prev,
      notesScanned: prev.notesScanned + 1
    }));
  };

  const updateCardMastery = (deckId, newMasteredCount) => {
    setDecks(prev => prev.map(deck => {
      if (deck.id === deckId) {
        const percent = Math.round((newMasteredCount / deck.total) * 100);
        return { ...deck, mastered: newMasteredCount, percent };
      }
      return deck;
    }));

    // Recompute total mastered
    setTimeout(() => {
      setDecks(currentDecks => {
        const masteredSum = currentDecks.reduce((sum, d) => sum + d.mastered, 0);
        const totalSum = currentDecks.reduce((sum, d) => sum + d.total, 0);
        setStats(prev => ({
          ...prev,
          cardsMastered: masteredSum,
          totalCards: totalSum
        }));
        return currentDecks;
      });
    }, 50);
  };

  const createNewDeck = (title, numCards) => {
    const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#06B6D4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newDeck = {
      id: Date.now().toString(),
      title,
      total: numCards,
      mastered: 0,
      color: randomColor,
      percent: 0,
      cards: [
        { q: `What is the core concept of ${title}?`, a: `This is a sample flashcard answer for ${title}. You can edit it later.` },
        { q: `Another basic definition in ${title}?`, a: `This is another dummy answer.` }
      ]
    };
    setDecks(prev => [...prev, newDeck]);
    setStats(prev => ({
      ...prev,
      totalCards: prev.totalCards + numCards
    }));
  };

  const completeQuiz = (score) => {
    setStats(prev => ({
      ...prev,
      quizzesDone: prev.quizzesDone + 1,
      lastQuizScore: score,
      streak: prev.streak + (prev.lastQuizScore < score ? 1 : 0) // award streak increase
    }));
  };

  const addChatMessage = (sender, text) => {
    const newMsg = {
      id: Date.now().toString(),
      sender,
      text,
      time: 'Just now'
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const toggleStarNote = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, starred: !n.starred } : n));
  };

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      profile,
      isSettingsVisible,
      setIsSettingsVisible,
      login,
      logout,
      deleteAccount,
      saveSettings,
      stats,
      notes,
      decks,
      quizzes,
      chatMessages,
      addScannedNote,
      updateCardMastery,
      createNewDeck,
      completeQuiz,
      addChatMessage,
      toggleStarNote
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
