export interface LearningState {
  loading: boolean;
  error: boolean;
  categories: LearningCategory[];
}

export interface LearningCategory {
  id: number;
  name: string;
  youTube: string | null;
  children: LearningCategory[];
}

export const initialLearningState: LearningState = {
  loading: false,
  error: false,
  categories: [],
};
