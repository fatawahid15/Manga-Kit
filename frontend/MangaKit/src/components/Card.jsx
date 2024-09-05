import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Card({ mangaItem }) {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false);

  console.log(mangaItem);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div
      key={mangaItem.id}
      className={`w-60 h-auto bg-white shadow-md p-4 flex flex-col gap-2 transition-all duration-500 transform ${
        isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        <img
          src={mangaItem.coverUrl}
          alt={mangaItem.title}
          className="object-cover w-full h-full transition-opacity duration-500 hover:opacity-80"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-700 truncate">
            {mangaItem.title}
          </span>
          <p className="text-xs text-gray-900">ID: {mangaItem.id}</p>
        </div>
        <button className="hover:bg-orange-400 text-white font- bg-orange-500 py-2 text-sm trsansition-colors duration-300" onClick={() => navigate(`${mangaItem.id}`)}>
          Read
        </button>
      </div>
    </div>
  );
}
