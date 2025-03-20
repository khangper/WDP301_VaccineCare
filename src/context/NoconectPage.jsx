import { useNavigate } from "react-router-dom";

const NoConnectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-500 mb-4">🚫 Không thể kết nối</h1>
        <p className="text-gray-600 mb-6">
          Kết nối mạng có vấn đề hoặc máy chủ không phản hồi. Vui lòng thử lại sau.
        </p>
        <button 
          onClick={() => navigate("/")} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          ⬅ Quay về trang chủ
        </button>
      </div>
    </div>
  );
};

export default NoConnectPage;
