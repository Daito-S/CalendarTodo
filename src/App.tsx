import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { Todo, TodoIconName } from "./types";
import { initTodos } from "./initTodos";
import {
  defaultTodoIcon,
  isTodoIconName,
  todoIconOptions,
} from "./todoIcons";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import CalendarView from "./Calendar";
import { v4 as uuid } from "uuid";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const localStorageKey = "TodoApp";

type StoredTodo = {
  id: string;
  name: string;
  isDone: boolean;
  priority: number;
  deadline: string | null;
  icon: TodoIconName;
};

const loadTodos = (): Todo[] => {
  const todoJsonStr = localStorage.getItem(localStorageKey);
  if (todoJsonStr === null) {
    return initTodos;
  }

  const storedTodos: StoredTodo[] = JSON.parse(todoJsonStr);
  return storedTodos.map((todo) => {
    const icon = todo.icon !== null && todo.icon !== undefined ? todo.icon : "";
    return {
      ...todo,
      // 期限をnullかDateに変換
      deadline: todo.deadline === null ? null : new Date(todo.deadline),
      // アイコンが不正な値の場合はデフォルトのアイコンに置き換える
      icon: isTodoIconName(icon) ? icon : defaultTodoIcon,
    };
  });
};

const getTodoNameError = (name: string): string => {
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 32) {
    return "前後の空白を除いて、2文字以上、32文字以内で入力してください";
  }
  return "";
};

const App = () => {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  
  const [newTodoIcon, setNewTodoIcon] =
    useState<TodoIconName>(defaultTodoIcon);
  const [isNameTouched, setIsNameTouched] = useState(false);

  // タスクの数を計算する
  const uncompletedCount = todos.filter(
    (todo) => !todo.isDone && todo.deadline !== null && dayjs(todo.deadline).isSame(dayjs(), "day")
  ).length;
  const completedCount = todos.filter((todo) => todo.isDone).length;

  const newTodoNameError = getTodoNameError(newTodoName);
  const isNewTodoNameInvalid = newTodoNameError !== "";
  const showNewTodoNameError = isNameTouched && isNewTodoNameInvalid;

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(todos));
  }, [todos]);

  const updateNewTodoName = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoName(e.target.value);
    setIsNameTouched(true);
  };

  const updateNewTodoPriority = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateNewTodoIcon = (e: ChangeEvent<HTMLInputElement>) => {
    const iconName = e.target.value;
    if (isTodoIconName(iconName)) {
      setNewTodoIcon(iconName);
    }
  };

  const updateDeadline = (e: ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const addNewTodo = () => {
    if (isNewTodoNameInvalid) {
      setIsNameTouched(true);
      return;
    }

    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName.trim(),
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
      icon: newTodoIcon,
    };
    setTodos((currentTodos) => [...currentTodos, newTodo]);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setNewTodoIcon(defaultTodoIcon);
    setIsNameTouched(false);
  };

  const updateIsDone = (id: string, value: boolean) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isDone: value };
        } else {
          return todo;
        }
      }),
    );
  };

  const removeCompletedTodos = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.isDone));
  };

  const remove = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">CalendarTodo</h1>
      <div className="mb-4">
        <WelcomeMessage
          uncompletedCount={uncompletedCount}
        />
      </div>
      <CalendarView 
        todos={todos}
        updateIsDone={updateIsDone}
        remove={remove}
      />

      <section
        aria-labelledby="calendarHeading"
        className="mb-4 rounded-md border border-slate-300 bg-white p-3 drop-shadow"
      >
        <h2 id="newTodoHeading" className="text-lg font-bold">
            期限のないタスク
        </h2>
        {/* 期限なしの物だけ表示 */}
        <TodoList todos={todos.filter((todo) => !todo.deadline)} updateIsDone={updateIsDone} remove={remove} />
      </section>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={removeCompletedTodos}
          disabled={completedCount === 0}
          className={twMerge(
            "mt-4 cursor-pointer rounded-md px-3 py-1 font-medium",
            "bg-rose-500 text-white hover:bg-rose-600",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-rose-500",
          )}
        >
          完了済みのタスクを削除
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addNewTodo();
        }}
        aria-labelledby="newTodoHeading"
        className="mt-4 space-y-2 rounded-md border border-slate-300 bg-white p-3 drop-shadow"
      >
        <h2 id="newTodoHeading" className="text-lg font-bold">
          新しいタスクの追加
        </h2>

        <div>
          <div className="flex items-center space-x-2">
            <label className="font-bold" htmlFor="newTodoName">
              名前
            </label>
            <input
              id="newTodoName"
              name="todoName"
              type="text"
              required
              value={newTodoName}
              onChange={updateNewTodoName}
              aria-invalid={showNewTodoNameError}
              aria-describedby={
                showNewTodoNameError ? "newTodoNameError" : undefined
              }
              className={twMerge(
                "min-w-0 grow rounded-md border border-gray-300 p-2",
                showNewTodoNameError && "border-red-500 outline-red-500",
              )}
              placeholder="2文字以上、32文字以内で入力してください"
            />
          </div>
          {showNewTodoNameError && (
            <div
              id="newTodoNameError"
              aria-live="polite"
              className="ml-10 flex items-center space-x-1 text-sm font-medium text-red-500"
            >
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="mr-0.5"
              />
              <div>{newTodoNameError}</div>
            </div>
          )}
        </div>

        <fieldset>
          <legend className="mb-1 font-bold">優先度</legend>
          <div className="flex gap-5">
            {[1, 2, 3].map((value) => (
              <label key={value} className="flex items-center space-x-1">
                <input
                  id={`priority-${value}`}
                  name="priorityGroup"
                  type="radio"
                  value={value}
                  checked={newTodoPriority === value}
                  onChange={updateNewTodoPriority}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* ラジオボタンでアイコンを選択 */}
        <fieldset>
          <legend className="mb-1 font-bold">
            アイコン
          </legend>
          <div className="flex gap-2">
            {Object.keys(todoIconOptions).map((name) => {
              if (!isTodoIconName(name)) {
                return null;
              }

              const option = todoIconOptions[name];
              return (
                <label
                  key={name}
                  className="cursor-pointer rounded-md"
                  title={option.label}
                >
                  <input
                    type="radio"
                    name="todoIcon"
                    value={name}
                    checked={newTodoIcon === name}
                    onChange={updateNewTodoIcon}
                    className="peer sr-only"
                  />
                  <span className="flex size-10 items-center justify-center rounded-md border border-slate-300 text-slate-600 peer-checked:border-indigo-500 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 peer-focus-visible:outline-2 peer-focus-visible:outline-indigo-500">
                    <FontAwesomeIcon icon={option.icon} aria-hidden="true" />
                  </span>
                  <span className="sr-only">{option.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex flex-wrap items-center gap-2">
          <label className="font-bold" htmlFor="deadline">
            期限
          </label>
          <input
            type="datetime-local"
            id="deadline"
            name="deadline"
            value={
              newTodoDeadline
                ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                : ""
            }
            onChange={updateDeadline}
            className="max-w-full min-w-0 rounded-md border border-gray-300 px-2 py-0.5"
          />
        </div>

        <div className="mt-4 flex justify-center">
          <button
            type="submit"
            disabled={isNewTodoNameInvalid}
            className={twMerge(
              "cursor-pointer rounded-md px-3 py-1",
              "bg-indigo-500 font-bold text-white hover:bg-indigo-600",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-500",
            )}
          >
            追加
          </button>
        </div>
      </form>
    </div>
  );
};

export default App;