import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMangaAsync } from "../features/manga/manga-slice";
import Card from "../component/card";

export default function MangaList() {
  const { manga, loading, error } = useSelector((state) => state.manga);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchMangaAsync()); // Initially fetch without a search query
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    dispatch(fetchMangaAsync(searchQuery)); // Trigger API call with the search query
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
        {/* Manga grid */}
        {manga.length > 0 ? (
          <div className="grid grid-cols-7 gap-6">
            {manga.map((mangaItem) => (
              <Card key={mangaItem.id} mangaItem={mangaItem} />
            ))}
          </div>
        ) : (
          <p>No manga available.</p>
        )}
      </div>
    </>
  );
}
