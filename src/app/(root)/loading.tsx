import LoadingSpinner from "@/components/loading-spinner";
const LoadingPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <LoadingSpinner className="size-24" />
    </div>
  );
};

export default LoadingPage;
