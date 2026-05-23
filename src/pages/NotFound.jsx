import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-7xl font-black text-green-600">404</h1>

      <p className="mt-4 text-2xl font-bold text-slate-800">
        Page Not Found
      </p>

      <p className="mt-2 text-slate-500 text-center max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
      >
        Go Back
      </button>

    </div>
  );
};

export default NotFound;