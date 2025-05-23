import React, { createContext, useContext, useState, useEffect } from 'react';

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

const defaultQuestions: Question[] = [
    {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        code: `"""
Given an array of integers nums and an integer target,
return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution,
and you may not use the same element twice.
You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
"""

def twoSum(nums, target):
    pass # Your code here`
    },
    {
        id: 'reverse-string',
        title: 'Reverse String',
        difficulty: 'Easy',
        code: `"""
Write a function that reverses a string. The input string is given as an array of characters s.
You must do this by modifying the input array in-place with O(1) extra memory.

Example 1:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]
"""

def reverseString(s):
    pass # Your code here`
    },
    {
        id: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        code: `"""
Given a string s containing just the characters '(', ')', '{', '}', '[' and ']',
determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example 1:
Input: s = "()"
Output: true
"""

def isValid(s):
    pass # Your code here`
    },
    {
        id: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        code: `"""
Given an array of intervals where intervals[i] = [starti, endi],
merge all overlapping intervals, and return an array of the non-overlapping
intervals that cover all the intervals in the input.

Example 1:
Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
"""

def merge(intervals):
    pass # Your code here`
    },
    {
        id: 'longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        code: `"""
Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
"""

def lengthOfLongestSubstring(s):
    pass # Your code here`
    }
];

export const QuestionProvider: React.FC<QuestionProviderProps> = ({ children }) => {
    const [questions] = useState<Question[]>(defaultQuestions);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(() => {
        // Initialize from localStorage or default to first question
        const savedQuestionId = localStorage.getItem('selectedQuestionId');
        if (savedQuestionId) {
            const found = defaultQuestions.find(q => q.id === savedQuestionId);
            return found || defaultQuestions[0];
        }
        return defaultQuestions[0];
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