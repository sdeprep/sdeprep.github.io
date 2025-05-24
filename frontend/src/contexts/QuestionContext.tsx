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
}

interface QuestionContextType {
    categories: Category[];
    questions: Question[];
    selectedQuestion: Question | null;
    selectQuestion: (question: Question) => void;
    getQuestionsByCategory: (categoryId: string) => Question[];
    getQuestionCode: (questionId: string) => Promise<string>;
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

    const getQuestionCode = async (questionId: string): Promise<string> => {
        try {
            const response = await fetch(`/src/data/questions/${questionId}.py`);
            if (!response.ok) {
                throw new Error(`Failed to load code for ${questionId}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Error loading code for ${questionId}:`, error);
            return `# Error loading code for ${questionId}\n# Please check if the file exists at /src/data/questions/${questionId}.py\n\ndef placeholder():\n    pass`;
        }
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
            getQuestionsByCategory,
            getQuestionCode
        }}>
            {children}
        </QuestionContext.Provider>
    );
}; 