import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangaAsync, setPage } from "../features/manga/manga-slice";
import Card from "../component/Card";
import { ToastContainer } from "react-toastify";

export default function MangaList() {
  const { manga, loading, error, pagination } = useSelector(
    (state) => state.manga
  );
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentQuery, setCurrentQuery] = useState(""); 

  useEffect(() => {
    dispatch(fetchMangaAsync(currentQuery, pagination.currentPage));
  }, [dispatch, pagination.currentPage, currentQuery]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setPage(1)); 
    setCurrentQuery(searchQuery); 
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage)); 
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black mx-auto" />
          <h2 className="text-gray-900">Loading...</h2>
          <p className="text-gray-900">Santai dulu brok</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex justify-center">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Manga"
              className="input w-full max-w-fit text-gray-700 font-medium bg-white"
            />
            <button
              type="submit"
              className="bg-white text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-orange-400 hover:text-white transition-colors duration-300"
            >
              Search
            </button>
          </form>
        </div>
        <br />
        <div className="flex justify-center text-5xl text-gray-900 font-bold">
          No Manga Found
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="flex justify-center">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Manga"
              className="input w-full max-w-fit text-gray-700 font-medium bg-white"
            />
            <button
              type="submit"
              className="bg-white text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-orange-400 hover:text-white transition-colors duration-300"
            >
              Search
            </button>
          </form>
        </div>
        <br />

        {manga.length > 0 ? (
          <div className="flex flex-col items-center min-h-screen">
            <div className="grid grid-cols-2 gap-6 content-center sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">
              {manga.map((mangaItem) => (
                <Card key={mangaItem.id} mangaItem={mangaItem} />
              ))}
            </div>

            <div className="flex justify-center mt-6">
              <button
                className="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={pagination.currentPage === 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                Previous
              </button>
              <span className="mx-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                className="px-4 py-2 ml-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
              >
                Next
              </button>
            </div>

            <ToastContainer position="top-center" />
          </div>
        ) : (
          <p>No manga available.</p>
        )}
      </div>
    </>
  );
}
