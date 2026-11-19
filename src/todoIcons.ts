import {
  faBook,
  faBriefcase,
  faDumbbell,
  faHouse,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import type { TodoIconName } from "./types";

type TodoIconOption = {
  label: string;
  icon: IconDefinition;
};

// アイコンの選択肢を定義
export const todoIconOptions: Record<TodoIconName, TodoIconOption> = {
  ShoppingCart: { label: "買い物", icon: faShoppingCart },
  book: { label: "勉強", icon: faBook },
  briefcase: { label: "仕事", icon: faBriefcase },
  house: { label: "家", icon: faHouse },
  dumbbell: { label: "運動", icon: faDumbbell },
};

// 選択しなかった場合のデフォルトのアイコン
export const defaultTodoIcon: TodoIconName = "briefcase";

export const isTodoIconName = (value: string): value is TodoIconName =>
  Object.prototype.hasOwnProperty.call(todoIconOptions, value);
