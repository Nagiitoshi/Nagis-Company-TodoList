
export interface Task {
  id?: number;
  name: string;
  descriptionTask: string;
  tasksLocalDateTime: string; // ISO string format
}

export type TaskFormData = Omit<Task, "id">;
