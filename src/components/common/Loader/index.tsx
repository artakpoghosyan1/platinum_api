import { FC } from "react";

interface Props {
  fullScreen?: boolean;
  size?: "small" | "medium" | "large";
  color?: string;
}

const Loader: FC<Props> = ({
  fullScreen,
  size = "large",
  color = "border-primary",
}) => {
  return (
    <div
      className={`flex ${fullScreen && "h-screen bg-white dark:bg-black"} items-center justify-center`}
    >
      <div
        className={`${size === "large" ? "h-16 w-16 border-4" : size === "medium" ? "h-10 w-10 border-2" : "h-5 w-5 border"} ${color} animate-spin rounded-full border-solid border-t-transparent`}
      />
    </div>
  );
};

export default Loader;
