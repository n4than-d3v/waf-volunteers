export interface AdminLearningState {
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

export interface CreateLearningCategoryCommand {
  name: string;
  parentId: number | null;
  youTube: string | null;
}

export const initialAdminLearningState: AdminLearningState = {
  loading: false,
  error: false,
  categories: [],
};
