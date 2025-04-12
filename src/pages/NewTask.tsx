
import { Layout } from "@/components/layout/Layout";
import { TaskForm } from "@/components/tasks/TaskForm";
import { Button } from "@/components/ui/button";
import { TaskService } from "@/services/api";
import { TaskFormData } from "@/types/task";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewTask = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createTaskMutation = useMutation({
    mutationFn: (data: TaskFormData) => TaskService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa criada com sucesso!");
      navigate("/");
    },
    onError: (error) => {
      console.error("Error creating task:", error);
      toast.error("Erro ao criar tarefa. Tente novamente.");
    },
  });

  const handleSubmit = (data: TaskFormData) => {
    createTaskMutation.mutate(data);
  };

  return (
    <Layout>
      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Nova Tarefa</h1>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <TaskForm 
            onSubmit={handleSubmit}
            isSubmitting={createTaskMutation.isPending}
          />
        </div>
      </div>
    </Layout>
  );
};

export default NewTask;
