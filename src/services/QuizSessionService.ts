// src/services/QuizSessionService.ts

export type QuizAnswer = {
  variation: string;
  actual_answer_id: number;
  user_answer_id: number | null;
};

type QuizSession = {
  level: string;
  categories: Record<string, QuizAnswer[]>;
};

class QuizSessionService {
  private session: QuizSession | null = null;

  init(level: string, order: string[], categories: any) {
    this.session = {
      level,
      categories: {},
    };

    order.forEach((categoryKey) => {
      this.session!.categories[categoryKey] = categories[categoryKey].map(
        (q: any) => ({
          variation: q.area,
          actual_answer_id: q.correct_answer,
          user_answer_id: null,
        }),
      );
    });

    console.log("✅ Quiz session initialized", this.session);
  }

  recordAnswer(categoryKey: string, variation: string, userAnswerId: number) {
    const category = this.session?.categories[categoryKey];
    if (!category) return;

    const item = category.find((q) => q.variation === variation);
    if (item) {
      item.user_answer_id = userAnswerId;
    }
    console.log("Updated quiz", this.session);
  }

  getSession() {
    return this.session;
  }

  clear() {
    this.session = null;
  }
}

export const quizSessionService = new QuizSessionService();
