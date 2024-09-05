import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MangaDetail({ url }) {
  const { id } = useParams();
  const [manga, setManga] = useState("");
  const [chapters, setChapters] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalChapters, setTotalChapters] = useState(0);
  const navigate = useNavigate();

  // Fetch Manga Details
  async function fetchManga() {
    try {
      const { data } = await axios.get(`${url}/manga/title/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setManga(data.manga);
    } catch (error) {
      console.log(error);
    }
  }

  // Fetch Manga Chapters
  async function fetchChapters() {
    try {
      const { data } = await axios.get(`${url}/manga/title/${id}/chapters`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        params: {
          page,
          limit,
        },
      });
      setChapters(data.chapters);
      setTotalChapters(data.totalChapters);
    } catch (error) {
      console.log(error);
    }
  }

  // Add Bookmark function
  async function addBookmark() {
    try {
      await axios.post(
        `${url}/bookmark`,
        { mangaId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Notify user of success
      toast.success("Manga bookmarked successfully!");
    } catch (error) {
      // Handle specific backend error
      if (error.response && error.response.data.name === "AE") {
        toast.error("This manga is already bookmarked.");
      } else {
        toast.error("Failed to bookmark manga.");
      }
    }
  }

  useEffect(() => {
    fetchManga();
    fetchChapters();
  }, [page]);

  const totalPages = Math.ceil(totalChapters / limit);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (!manga) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <ToastContainer />
      <div className="container mx-auto p-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="w-64 h-96">
              <img
                src={manga.coverImage}
                alt={manga.title}
                className="shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h1 className="text-4xl text-gray-900 font-bold">{manga.title}</h1>
            <button
              className="btn border-none shadow-sm rounded-none bg-orange-500 px-4 py-2 text-lg text-gray-900 hover:bg-orange-400 hover:text-white"
              onClick={addBookmark} // Attach addBookmark function to the button
            >
              Bookmark
            </button>

            <div className="flex space-x-4 items-center">
              <p className="text-gray-900 font-medium text-xl">
                {manga.authors?.join(", ")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {manga.genres?.map((mg) => (
                <span
                  key={mg}
                  className="px-2 py-2 text-gray-900 text-lg font-semibold badge border-none rounded-none bg-orange-500"
                >
                  {mg}
                </span>
              ))}
            </div>

            <div className="flex space-x-6 text-lg font-medium text-gray-900">
              <div>
                <span>Age Rating: {manga.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-lg font-semibold text-gray-900">
            {manga.description}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Chapters</h2>
          </div>
          <div className="mt-4">
            <div className="flex flex-col space-y-2">
              {chapters.map((cp) => (
                <div
                  key={cp.id}
                  className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg mb-4"
                >
                  <div>
                    <p className="text-lg text-gray-900 font-semibold">
                      Chapter {cp.chapter}: {cp.title}
                    </p>
                    <p className="text-sm text-gray-900">
                      {cp.volume ? `Volume ${cp.volume}` : "No Volume"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-900">
                      {formatDistanceToNow(new Date(cp.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <button
                      className="btn btn-primary text-sm py-2 px-4 rounded-none bg-orange-500 text-white hover:bg-orange-400 border-none transition-colors duration-300"
                      onClick={() => navigate(`/chapter/${cp.id}`)}
                    >
                      Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className="btn px-4 py-2 bg-orange-500 border-none rounded-none text-gray-900"
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <input
            type="number"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            placeholder="Search Manga"
            className="input w-full max-w-fit text-gray-700 font-medium bg-white"
          />
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="btn px-4 py-2 bg-orange-500 border-none rounded-none text-gray-900"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
