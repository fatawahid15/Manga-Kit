import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AskAi from "./AskAi";
import axios from "axios";

export default function NavBar({ url }) {
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const formatAiResponse = (response) => {
    let formattedResponse = response.replace(/\n/g, "<br>");
    formattedResponse = formattedResponse.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );
    return formattedResponse;
  };

  const handleAiSubmit = async (question) => {
    setLoading(true);
    try {
      const res = await axios.post(`${url}/pub/chat`, { question });
      const formattedResponse = formatAiResponse(res.data.answer);
      setAiResponse(formattedResponse);
    } catch (error) {
      console.error("Error submitting AI question", error);
      setAiResponse("Failed to get AI response. Please try again later.");
    }
    setLoading(false);
  };

  const resetAiResponse = () => {
    setAiResponse("");
  };

  return (
    <>
      {token ? (
        <>
          <div className="navbar bg-orange-500">
            <div className="navbar-start">
              <a
                className="btn btn-ghost text-xl text-white"
                onClick={() => navigate("/profile/me")}
              >
                Your Profile
              </a>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <button
                    className="btn btn-ghost text-xl text-white font-medium"
                    onClick={() => setIsAiModalOpen(true)}
                  >
                    Ask Ai
                  </button>
                </li>
                <li>
                  <button
                    className="btn btn-ghost text-xl text-white font-medium"
                    onClick={() => navigate("/")}
                  >
                    Home
                  </button>
                </li>
              </ul>
            </div>
            <div className="navbar-end">
              <button
                className="btn btn-ghost text-xl text-white font-medium"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
          <AskAi
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
            onSubmit={handleAiSubmit}
            aiResponse={aiResponse}
            loading={loading}
            resetAiResponse={resetAiResponse}
          />
        </>
      ) : (
        <>
          <div className="navbar bg-orange-500">
            <div className="navbar-start">
              <a
                className="btn btn-ghost text-xl text-white"
                onClick={() => navigate("/")}
              >
                Home
              </a>
            </div>
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <button
                    className="btn btn-ghost text-xl text-white font-medium"
                    onClick={() => setIsAiModalOpen(true)}
                  >
                    Ask Ai
                  </button>
                </li>
              </ul>
            </div>
            <div className="navbar-end">
              <button
                className="btn btn-ghost text-xl text-white font-medium"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
          <AskAi
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
            onSubmit={handleAiSubmit}
            aiResponse={aiResponse}
            loading={loading}
            resetAiResponse={resetAiResponse}
          />
        </>
      )}
    </>
  );
}
