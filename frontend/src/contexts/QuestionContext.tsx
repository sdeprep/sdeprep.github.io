import React, { createContext, useContext, useState, useEffect } from 'react';
import questionsData from '../data/questions.json';

interface Category {
    id: string;
    name: string;
    description: string;
}

interface Question {
    id: string;
    title: string;
    category: string;
    code: string;
}

interface QuestionContextType {
    categories: Category[];
    questions: Question[];
    selectedQuestion: Question | null;
    selectQuestion: (question: Question) => void;
    getQuestionsByCategory: (categoryId: string) => Question[];
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
    const [categories] = useState<Category[]>(questionsData.categories as Category[]);

    // Flatten the nested questions structure into a single array
    const allQuestions = Object.values(questionsData.questions).flat() as Question[];
    const [questions] = useState<Question[]>(allQuestions);

    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(() => {
        // Initialize from localStorage or default to first question
        const savedQuestionId = localStorage.getItem('selectedQuestionId');
        if (savedQuestionId) {
            const found = allQuestions.find(q => q.id === savedQuestionId);
            return found || allQuestions[0];
        }
        return allQuestions[0];
    });

    const selectQuestion = (question: Question) => {
        setSelectedQuestion(question);
    };

    const getQuestionsByCategory = (categoryId: string): Question[] => {
        return questions.filter(question => question.category === categoryId);
    };

    useEffect(() => {
        // Save selected question to localStorage
        if (selectedQuestion) {
            localStorage.setItem('selectedQuestionId', selectedQuestion.id);
        }
    }, [selectedQuestion]);

    return (
        <QuestionContext.Provider value={{
            categories,
            questions,
            selectedQuestion,
            selectQuestion,
            getQuestionsByCategory
        }}>
            {children}
        </QuestionContext.Provider>
    );
}; 