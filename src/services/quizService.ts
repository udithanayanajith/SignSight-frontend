import { BACKEND_BASE_URI } from "../config/CONFIG";

export interface QuizAnswer {
  variation: string;
  actual_answer_id: string;
  user_answer_id: string;
}

export interface QuizResultPayload {
  level: string;
  category_one: QuizAnswer[];
  category_two: QuizAnswer[];
  category_three?: QuizAnswer[];
  category_four?: QuizAnswer[];
}

export const submitQuizResults = async (
  payload: QuizResultPayload
): Promise<any> => {
  try {
    const response = await fetch(`${BACKEND_BASE_URI}/api/quiz-results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to submit quiz results:", error);
    throw error;
  }
};
