import api from './axiosInstance'
import type { ApiResponse, Question, Subject, SubTopic, Test, TestFormValues, Topic } from '../types'

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data

export const login = async (userId: string, password: string) =>
  unwrap<{ token: string; user: { userId?: string; name?: string; role?: string } }>(
    await api.post('/auth/login', { userId, password }),
  )

export const getSubjects = async () => unwrap<Subject[]>(await api.get('/subjects'))

export const getTopicsBySubject = async (subjectId: string) =>
  unwrap<Topic[]>(await api.get(`/topics/subject/${subjectId}`))

export const getSubTopicsByTopics = async (topicIds: string[]) =>
  unwrap<SubTopic[]>(await api.post('/sub-topics/multi-topics', { topicIds }))

export const getAllTests = async () => unwrap<Test[]>(await api.get('/tests'))

export const getTestById = async (id: string) => unwrap<Test>(await api.get(`/tests/${id}`))

export const createTest = async (data: TestFormValues) =>
  unwrap<Test>(await api.post('/tests', data))

export const updateTest = async (id: string, data: Partial<TestFormValues> | Record<string, unknown>) =>
  unwrap<Test>(await api.put(`/tests/${id}`, data))

export const bulkCreateQuestions = async (questions: Question[]) =>
  unwrap<Question[]>(await api.post('/questions/bulk', { questions }))

export const fetchBulkQuestions = async (question_ids: string[]) =>
  unwrap<Question[]>(await api.post('/questions/fetchBulk', { question_ids }))

export const publishTest = async (
  test: Test,
  options: { status?: string; publish_at?: string; live_until?: string } = {},
) => {
  const status = options.status || 'live'
  const payload = {
    status,
    ...(options.publish_at ? { scheduled_date: options.publish_at } : {}),
    ...(options.live_until ? { expiry_date: options.live_until } : {}),
  }
  return updateTest(test.id, payload)
}
