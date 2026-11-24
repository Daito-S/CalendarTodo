import type { Todo } from "./types";
import { v4 as uuid } from "uuid"; // v4 を uuid という名前でインポート

export const initTodos: Todo[] = [
  {
    id: uuid(), // UUID v4 を生成してIDにセット
    name: "今日のタスクを設定する",
    isDone: false,
    priority: 1,
    deadline: new Date(), // 日付はユーザーが初めて開いた日
    icon: "house",
  },
  {
    id: uuid(),
    name: "明日のタスクも設定してみる",
    isDone: false,
    priority: 2,
    deadline: new Date(),
    icon: "book",
  },
  {
    id: uuid(),
    name: "３つのチュートリアルタスクを削除する",
    isDone: false,
    priority: 3,
    deadline: null, // このTodoには期限を設定しない
    icon: "dumbbell",
  },
];