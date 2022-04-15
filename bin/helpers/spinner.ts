import ora from "ora";

export const spinnerInstance = (text: string) => {
  return ora({
    text: text,
    spinner: "arc",
  });
};
