// 選択するアイコンの名前
export type TodoIconName =
  "ShoppingCart" | "book" | "briefcase"
  | "house" | "dumbbell";

export type Todo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: Date | null;
  icon: TodoIconName;
};