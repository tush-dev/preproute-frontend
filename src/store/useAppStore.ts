import { create } from 'zustand'
import type { Question, Subject, SubTopic, Test, Topic, User } from '../types'
import { TOKEN_KEY } from '../api/axiosInstance'

type AppState = {
  token: string
  user: User | null
  currentTest: Test | null
  questions: Question[]
  subjects: Subject[]
  topics: Topic[]
  subTopics: SubTopic[]
  setAuth: (token: string, user: User) => void
  logout: () => void
  setCurrentTest: (test: Test | null) => void
  clearTest: () => void
  setQuestions: (questions: Question[]) => void
  addQuestion: (question: Question) => void
  removeQuestion: (clientId: string) => void
  updateQuestion: (clientId: string, changes: Partial<Question>) => void
  setSubjects: (subjects: Subject[]) => void
  setTopics: (topics: Topic[]) => void
  setSubTopics: (subTopics: SubTopic[]) => void
}

const storedUser = localStorage.getItem('user')

export const useAppStore = create<AppState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY) || '',
  user: storedUser ? JSON.parse(storedUser) : null,
  currentTest: null,
  questions: [],
  subjects: [],
  topics: [],
  subTopics: [],
  setAuth: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem('user')
    set({ token: '', user: null, currentTest: null, questions: [] })
  },
  setCurrentTest: (currentTest) => set({ currentTest }),
  clearTest: () => set({ currentTest: null, questions: [] }),
  setQuestions: (questions) => set({ questions }),
  addQuestion: (question) => set((state) => ({ questions: [...state.questions, question] })),
  removeQuestion: (clientId) =>
    set((state) => ({
      questions: state.questions.filter((question) => question.client_id !== clientId),
    })),
  updateQuestion: (clientId, changes) =>
    set((state) => ({
      questions: state.questions.map((question) =>
        question.client_id === clientId ? { ...question, ...changes } : question,
      ),
    })),
  setSubjects: (subjects) => set({ subjects }),
  setTopics: (topics) => set({ topics }),
  setSubTopics: (subTopics) => set({ subTopics }),
}))
