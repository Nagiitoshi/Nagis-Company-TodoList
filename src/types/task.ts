
export interface Task {
  id?: number;
  name: string;
  descricao: string;
  dataHora: string; // ISO string format
}

export type TaskFormData = Omit<Task, "id">;
