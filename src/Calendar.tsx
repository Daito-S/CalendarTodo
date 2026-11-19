import { useState } from "react";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import type { Todo } from "./types";
import TodoItem from "./TodoItem";
import "react-calendar/dist/Calendar.css";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
};

const CalendarView = ({ todos, updateIsDone, remove }: Props) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDayTodos = todos.filter(
    (todo) => todo.deadline && dayjs(todo.deadline).isSame(selectedDate, "day"),
  );

  return (
    <section
      aria-labelledby="calendarHeading"
      className="mb-4 rounded-md border border-slate-300 bg-white p-3 drop-shadow"
    >
      <Calendar
        className="mx-auto w-full max-w-sm border-none text-center"
        // カレンダーの設定
        locale="ja-JP"
        calendarType="iso8601"
        value={selectedDate}
        onClickDay={setSelectedDate}
        tileContent={({ date, view }) => {
          if (view !== "month") {
            return null;
          }

          const taskCount = todos.filter(
            (todo) => todo.deadline && dayjs(todo.deadline).isSame(date, "day"),
          ).length;

          return taskCount > 0 ? (
            <span
              aria-label={`期限のあるタスク ${taskCount} 件`}
              title={`期限のあるタスク ${taskCount} 件`}
              className="mx-auto mt-1 block size-1.5 rounded-full bg-indigo-500"
            />
          ) : null;
        }}
      />
      <h3 className="mt-3 font-bold">
        {dayjs(selectedDate).format("YYYY年M月D日")} のタスク
      </h3>
      {selectedDayTodos.length > 0 ? (
        <div className="mt-2 flex flex-col gap-2">
          {selectedDayTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              updateIsDone={updateIsDone}
              remove={remove}
            />
          ))}
        </div>
      ) : (
        <p className="mt-1 text-sm text-slate-500">
          この日に期限のあるタスクはありません。
        </p>
      )}
    </section>
  );
};

export default CalendarView;