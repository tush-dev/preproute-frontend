export interface User {
  userId: string
  token?: string
  name?: string
  role?: string
}

export interface Subject {
  id: string
  name: string
}

export interface Topic {
  id: string
  name: string
  subject_id: string
}

export interface SubTopic {
  id: string
  name: string
  topic_id: string
}

export interface Test {
  id: string
  name: string
  type: string
  subject: string
  topics: string[]
  sub_topics: string[]
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  difficulty: string
  total_time: number
  total_marks: number
  total_questions: number
  status: string | null
  created_at: string
  questions?: string[]
}

export interface Question {
  id?: string
  client_id?: string
  type: string
  question: string
  option1: string
  option2: string
  option3: string
  option4: string
  correct_option: string
  explanation?: string
  difficulty?: string
  test_id: string
  subject?: string
  topic?: string
  sub_topic?: string
  media_url?: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export type TestFormValues = {
  name: string
  type: string
  subject: string
  topics: string[]
  sub_topics: string[]
  difficulty: 'easy' | 'medium' | 'hard'
  total_time: number
  total_marks: number
  total_questions: number
  correct_marks: number
  wrong_marks: number
  unattempt_marks: number
  status?: string | null
}
