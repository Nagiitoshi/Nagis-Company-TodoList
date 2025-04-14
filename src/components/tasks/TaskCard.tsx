import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Task } from "@/types/task";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  // Verificar se task.dataHora é uma data válida
  const taskDate = new Date(task.tasksLocalDateTime);
  const isValidDate = !isNaN(taskDate.getTime());

  // Se não for uma data válida, usar um fallback
  const formattedDate = isValidDate ? format(taskDate, "PPP", { locale: pt }) : "Data inválida";
  const formattedTime = isValidDate ? format(taskDate, "HH:mm") : "Hora inválida";

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{task.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span>{formattedDate}</span>
          <Clock className="h-4 w-4 ml-2" />
          <span>{formattedTime}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{task.descriptionTask}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/edit/${task.id}`}>
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Link>
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => task.id && onDelete(task.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
}

