
import { Layout } from "@/components/layout/Layout";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import { TaskService } from "@/services/api";
import { Task, TaskFormData } from "@/types/task";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const taskId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: task, isLoading } = useQuery<Task>({
    queryKey: ["task", taskId],
    queryFn: () => TaskService.getById(taskId),
    enabled: !!taskId && !isNaN(taskId),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: TaskFormData) => TaskService.update(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      toast.success("Tarefa atualizada com sucesso!");
      navigate("/");
    },
    onError: (error) => {
      console.error("Error updating task:", error);
      toast.error("Erro ao atualizar tarefa. Tente novamente.");
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    updateTaskMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>
      </Layout>
    );
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-red-500">Tarefa não encontrada</h2>
          <Button variant="outline" className="mt-4" asChild>
            <Link to="/">Voltar para a lista</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Editar Tarefa</h1>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <TaskForm 
            initialData={task}
            onSubmit={handleSubmit}
            isSubmitting={updateTaskMutation.isPending}
          />
        </div>
      </div>
    </Layout>
  );
};

export default EditTask;
