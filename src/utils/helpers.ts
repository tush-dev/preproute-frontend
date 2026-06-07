import type { Question, SubTopic, TestFormValues, Topic } from '../types'

export const fallbackSubjects = [
  { id: 'english', name: 'English' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'science', name: 'Science' },
]

export const fallbackTopics: Topic[] = [
  { id: 'grammar', name: 'Grammar', subject_id: 'english' },
  { id: 'writing', name: 'Writing', subject_id: 'english' },
  { id: 'algebra', name: 'Algebra', subject_id: 'mathematics' },
  { id: 'physics', name: 'Physics', subject_id: 'science' },
]

export const fallbackSubTopics: SubTopic[] = [
  { id: 'application', name: 'Application', topic_id: 'grammar' },
  { id: 'composition', name: 'Composition', topic_id: 'writing' },
  { id: 'linear-equations', name: 'Linear Equations', topic_id: 'algebra' },
  { id: 'motion', name: 'Motion', topic_id: 'physics' },
]

export const defaultTestValues: TestFormValues = {
  name: '',
  type: 'chapterwise',
  subject: '',
  topics: [],
  sub_topics: [],
  difficulty: 'easy',
  total_time: 60,
  total_marks: 250,
  total_questions: 50,
  correct_marks: 5,
  wrong_marks: -1,
  unattempt_marks: 0,
  status: 'draft',
}

export const makeQuestion = (testId = ''): Question => ({
  client_id: crypto.randomUUID(),
  type: 'mcq',
  question: '',
  option1: '',
  option2: '',
  option3: '',
  option4: '',
  correct_option: 'option2',
  explanation: '',
  difficulty: 'easy',
  test_id: testId,
  topic: '',
  sub_topic: '',
  media_url: '',
})

export const titleCase = (value = '') => value.charAt(0).toUpperCase() + value.slice(1)

export const formatDate = (date?: string) => {
  if (!date) return 'Today'
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}
