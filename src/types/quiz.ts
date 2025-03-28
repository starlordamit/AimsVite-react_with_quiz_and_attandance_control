export interface QuizWindowResponse {
  msg?: string;
  response: {
    data: {
      now?: string;
      login_time: string;
      start_time: string;
      end_time: string;
    }
  }
}

export interface QuizDetails {
  total_marks: string;
  id: number;
  cdata: {
    subject: string;
    course_name: string;
    instructions: string | null;
    date_formatted: string;
    start_end_time: string;
    academic_session: string;
    end_time_formatted: string;
    login_time_formatted: string;
    start_time_formatted: string;
    debarred_students_count: string;
    exempted_students_count: string;
  };
  unique_code: string;
  login_time: string;
  batch: string;
  section: string;
  faculty_name: string;
  master_course_code: string;
  dept: string;
  list_id: string;
  group: string | null;
  course_id: number;
  batch_id: number;
  semester: number;
  faculty_id: number;
  dept_id: number;
  cf_id: number;
  duration: number;
  login_window: number;
  questions_count: string;
  start_time: string;
  end_time: string;
}

export interface QuizResponse {
  msg?: string;
  response?: {
    data: QuizDetails;
  };
  data?: QuizDetails;
  time_now?: string;
}

export interface QuizQuestion {
  CO: string;
  id: number;
  type: string;
  marks: number;
  options: string[];
  question: string;
  topic_name: string;
  bloom_level: string;
  time_to_solve: number;
  submitted_answer: {
    answer: number;
    answered_on: number;
  } | null;
  multiple_correct: number;
}

export interface QuizQuestions {
  msg: string;
  time_now: string;
  start_time: string;
  end_time: string;
  response: {
    data: QuizQuestion[];
  };
}

export interface SubmitAnswerResponse {
  msg: string;
  time_now: string;
  start_time: string;
  end_time: string;
  response: {
    data: Record<string, never>;
  };
}

export interface QuizSubmitResponse {
  msg: string;
  time_now: string;
  start_time: string;
  end_time: string;
  response: {
    data: Record<string, never>;
  };
}

export type QuizStatus = 'idle' | 'waiting' | 'active' | 'completed' | 'error';