
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { TaskService } from "@/services/api";
import { Task } from "@/types/task";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { TaskCard } from "@/components/tasks/TaskCard";

const Index = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: TaskService.getAll,
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => TaskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa excluída com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast.error("Erro ao excluir tarefa. Tente novamente.");
    },
  });

  const handleDeleteTask = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Minhas Tarefas</h1>
          <Button asChild className="bg-purple-500 hover:bg-purple-600">
            <Link to="/new">
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-500">
              Nenhuma tarefa encontrada
            </h2>
            <p className="text-gray-400 mt-2">
              Crie sua primeira tarefa clicando no botão acima
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task: Task) => (
              <TaskCard key={task.id} task={task} onDelete={handleDeleteTask} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
