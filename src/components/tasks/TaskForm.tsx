
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Task, TaskFormData } from "@/types/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const taskSchema = z.object({
  name: z.string().min(1, "O nome da tarefa é obrigatório"),
  descricao: z.string().min(1, "A descrição é obrigatória"),
  date: z.date({
    required_error: "Uma data é obrigatória",
  }),
  time: z.string().min(1, "O horário é obrigatório"),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: TaskFormData) => void;
  isSubmitting: boolean;
}

export function TaskForm({ initialData, onSubmit, isSubmitting }: TaskFormProps) {
  const [defaultValues, setDefaultValues] = useState<Partial<TaskFormValues>>({
    name: "",
    descricao: "",
    time: "12:00",
  });

  useEffect(() => {
    if (initialData) {
      const date = new Date(initialData.dataHora);
      setDefaultValues({
        name: initialData.name,
        descricao: initialData.descricao,
        date: date,
        time: format(date, "HH:mm"),
      });
    }
  }, [initialData]);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues,
    values: defaultValues,
  });

  const handleSubmit = (values: TaskFormValues) => {
    const { date, time } = values;
    const [hours, minutes] = time.split(":").map(Number);

    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes);

    const taskData: TaskFormData = {
      name: values.name,
      descricao: values.descricao,
      dataHora: dateTime.toISOString(),
    };

    onSubmit(taskData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Tarefa</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome da tarefa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Digite uma descrição para a tarefa"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Data</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Horário</FormLabel>
                <div className="flex items-center">
                  <FormControl>
                    <Input
                      type="time"
                      {...field}
                      className="w-full"
                      defaultValue="12:00"
                    />
                  </FormControl>
                  <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-purple-500 hover:bg-purple-600" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : initialData ? "Atualizar Tarefa" : "Criar Tarefa"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
