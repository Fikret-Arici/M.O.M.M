export type QuestionType =
  | 'long_text'
  | 'short_answer'
  | 'multiple_choice'
  | 'example_based'
  | 'interview_question'

export type Difficulty = 'easy' | 'medium' | 'hard'

export type ProgressStatus = 'new' | 'learning' | 'memorized'

export type ConfidenceLevel = 0 | 1 | 2 | 3

export interface Topic {
  id: string
  user_id: string
  title: string
  description: string | null
  category: string | null
  order_index: number
  created_at: string
}

export interface Question {
  id: string
  topic_id: string
  question_text: string
  answer_text: string
  interview_answer: string | null
  question_type: QuestionType
  options: string[] | null
  correct_option: number | null
  difficulty: Difficulty
  order_index: number
  created_at: string
}

export interface StudyProgress {
  id: string
  user_id: string
  question_id: string
  status: ProgressStatus
  confidence_level: ConfidenceLevel
  last_reviewed_at: string
  next_review_at: string
  review_count: number
}

export interface TopicWithStats extends Topic {
  question_count: number
  memorized_count: number
  learning_count: number
  new_count: number
  progress_percentage: number
}

export interface QuestionWithProgress extends Question {
  progress?: StudyProgress | null
}

export interface DashboardStats {
  total_topics: number
  total_questions: number
  memorized_questions: number
  learning_questions: number
  due_for_review: number
}
