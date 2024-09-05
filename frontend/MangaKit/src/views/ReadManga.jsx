import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ReadManga({ url }) {
  const { id } = useParams();
  const [manga, setManga] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 
  const [showScrollButton, setShowScrollButton] = useState(false);

  async function fetchManga() {
    try {
      const { data } = await axios.get(`${url}/manga/chapter/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setManga(data); 
      setLoading(false); 
    } catch (error) {
      setError(error.message); 
      setLoading(false); 
    }
  }

  useEffect(() => {
    fetchManga();
  }, [id]);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return  <div className="flex justify-center py-10">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black mx-auto" />
      <h2 className="text-gray-900">Loading...</h2>
      <p className="text-gray-900">Sabar dulu ya cinta</p>
    </div>
  </div>
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className=" min-h-screen flex justify-center items-center p-4">
      {manga ? (
        <>
          {manga.imgUrls && manga.imgUrls.length > 0 ? (
            <div className="flex flex-col items-center">
              {manga.imgUrls.map((rm, index) => (
                <img
                  key={index}
                  src={rm}
                  alt={`manga-page-${index}`}
                  className="w-full max-w-3xl object-contain"
                />
              ))}
            </div>
          ) : (
            <p className="text-white">No images found for this manga.</p>
          )}
        </>
      ) : (
        <p className="text-white">Manga not found</p>
      )}

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-orange-500 text-white p-3 rounded-none border-none shadow-lg hover:bg-orange-600 transition duration-300"
        >
          ↑ Top
        </button>
      )}
    </div>
  );
}
