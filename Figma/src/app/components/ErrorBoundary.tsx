import { useRouteError, isRouteErrorResponse } from "react-router";

export default function ErrorBoundary() {
  const error = useRouteError();
  
  let errorMessage: string;
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-2">Something went wrong.</p>
        <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
        <a 
          href="/" 
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-block transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}