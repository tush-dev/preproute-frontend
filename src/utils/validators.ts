import { z } from 'zod'

export const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
})

export const testSchema = z.object({
  name: z.string().min(1, 'Test name is required'),
  type: z.string().min(1, 'Type is required'),
  subject: z.string().min(1, 'Subject is required'),
  topics: z.array(z.string()).min(1, 'Select at least one topic'),
  sub_topics: z.array(z.string()),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  total_time: z.coerce.number().min(1, 'Duration is required'),
  total_marks: z.coerce.number().min(1, 'Total marks is required'),
  total_questions: z.coerce.number().min(1, 'Question count is required'),
  correct_marks: z.coerce.number(),
  wrong_marks: z.coerce.number(),
  unattempt_marks: z.coerce.number(),
  status: z.string().nullable().optional(),
})

export type LoginValues = z.infer<typeof loginSchema>
export type CreateTestValues = z.infer<typeof testSchema>
