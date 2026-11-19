import React from "react";

type Props = {
  uncompletedCount: number;
};

const WelcomeMessage = (props: Props) => {
  return (
    <div className="text-blue-700">
      本日の未完了タスク：
      {props.uncompletedCount}個
    </div>
  );
};

export default WelcomeMessage;