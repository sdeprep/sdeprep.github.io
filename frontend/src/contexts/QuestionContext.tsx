import React, { createContext, useContext, useState, useEffect } from 'react';
import questionsData from '../data/questions.json';

interface Question {
    id: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    code: string;
}

interface QuestionContextType {
    questions: Question[];
    selectedQuestion: Question | null;
    selectQuestion: (question: Question) => void;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

export const useQuestions = () => {
    const context = useContext(QuestionContext);
    if (context === undefined) {
        throw new Error('useQuestions must be used within a QuestionProvider');
    }
    return context;
};

interface QuestionProviderProps {
    children: React.ReactNode;
}

export const QuestionProvider: React.FC<QuestionProviderProps> = ({ children }) => {
    const [questions] = useState<Question[]>(questionsData.questions as Question[]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(() => {
        // Initialize from localStorage or default to first question
        const savedQuestionId = localStorage.getItem('selectedQuestionId');
        if (savedQuestionId) {
            const found = (questionsData.questions as Question[]).find(q => q.id === savedQuestionId);
            return found || (questionsData.questions as Question[])[0];
        }
        return (questionsData.questions as Question[])[0];
    });

    const selectQuestion = (question: Question) => {
        setSelectedQuestion(question);
    };

    useEffect(() => {
        // Save selected question to localStorage
        if (selectedQuestion) {
            localStorage.setItem('selectedQuestionId', selectedQuestion.id);
        }
    }, [selectedQuestion]);

    return (
        <QuestionContext.Provider value={{ questions, selectedQuestion, selectQuestion }}>
            {children}
        </QuestionContext.Provider>
    );
}; 