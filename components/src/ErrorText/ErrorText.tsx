interface ErrorTextProps {
  message: string;
}

const ErrorText = ({ message }: ErrorTextProps) => {
  return <div className="text-red-500 text-sm mt-1">{message}</div>;
};

export default ErrorText;
export type { ErrorTextProps };
