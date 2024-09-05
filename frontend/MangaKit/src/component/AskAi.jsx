import { useState, useEffect } from "react";

export default function AskAi({
  isOpen,
  onClose,
  onSubmit,
  aiResponse,
  loading,
  resetAiResponse,
}) {
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setQuestion("");
      resetAiResponse();
    }
  }, [isOpen, resetAiResponse]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(question);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box bg-white p-6 rounded shadow-lg">
        <h2 className="font-bold text-gray-900 text-lg mb-4">Ask AI</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask your question..."
            className="input input-bordered bg-gray-900 rounded-none text-white w-full mb-4"
            disabled={loading}
          />

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black mx-auto" />
                <h2 className="text-gray-900">Loading...</h2>
                <p className="text-gray-900">Ainya masih mikir</p>
              </div>
            </div>
          ) : (
            aiResponse && (
              <div className="mt-4 p-6 bg-gray-900 rounded-lg shadow-md">
                <h3 className="font-bold text-lg text-white mb-2">
                  AI Response:
                </h3>
                <p
                  className="text-gray-200 bg-gray-800 p-4 rounded-md border border-gray-700"
                  dangerouslySetInnerHTML={{ __html: aiResponse }}
                />
              </div>
            )
          )}

          <div className="modal-action flex justify-end space-x-2">
            <button
              type="submit"
              className="btn rounded-none border-none bg-green-600 text-white"
              disabled={loading}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn rounded-none border-none bg-red-600 text-white"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
