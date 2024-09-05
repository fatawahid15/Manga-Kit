import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function YourProfile({ url }) {
  const [profile, setProfile] = useState({ username: "", bio: "", imgUrl: "" });
  const [bookmarks, setBookmarks] = useState([]);
  const [bio, setBio] = useState("");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  async function fetchProfile() {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${url}/profile/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProfile(data.profile);
      setBio(data.profile.bio);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(mangaId) {
    try {
      await axios.delete(`${url}/bookmark/${mangaId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      fetchBookmark();
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchBookmark() {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${url}/bookmark`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setBookmarks(data.mangas);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateOwnProfile(e) {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        await axios.patch(`${url}/profile/me/img`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const { data } = await axios.put(
        `${url}/profile/me`,
        { username: profile.username, bio },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setProfile(data.profile);
      setFile(null);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteImg() {
    setIsSaving(true);
    try {
      const { data } = await axios.delete(`${url}/profile/me/img`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProfile(data.profile);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSaving(false);
    }
  }

  useEffect(() => {
    fetchProfile();
    fetchBookmark();
  }, []);

  return (
    <>
      <div className="flex justify-center py-10">
        <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-black mx-auto" />
                <h2 className="text-gray-900">Loading...</h2>
                <p className="text-gray-900">Santai dulu brok</p>
              </div>
            </div>
          ) : (
            <>
              <div className="relative w-full h-64 bg-gray-200 rounded-t-lg">
                <div className="absolute top-0 left-0 w-full h-full flex items-center px-10">
                  <div className="flex-shrink-0">
                    <img
                      src={
                        profile.imgUrl
                          ? profile.imgUrl
                          : "https://mangadex.org/img/avatar.png"
                      }
                      alt="Avatar"
                      className="rounded-full w-48 h-48"
                    />
                  </div>
                  <div className="ml-6">
                    <h1 className="text-5xl text-gray-900 font-bold">
                      {profile.username}
                    </h1>
                    <button
                      className="btn btn-sm rounded-none border-none bg-blue-500 text-white mt-4"
                      onClick={() => setShowModal(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-10 py-8">
                <div>
                  <h2 className="text-2xl text-gray-900 font-semibold mb-4">
                    Bio
                  </h2>
                  <p className="text-gray-900 mb-2">
                    {profile.bio ? profile.bio : "This user has no bio"}
                  </p>
                </div>

                <div className="mt-8">
                  <h2 className="text-2xl text-gray-900 font-semibold mb-4">
                    Bookmarked Mangas
                  </h2>
                  {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {bookmarks.map((manga) => (
                        <div
                          key={manga.id}
                          className="bg-gray-100 p-4 rounded-lg shadow-sm"
                        >
                          <img
                            src={
                              manga.coverUrl ||
                              "https://mangadex.org/img/avatar.png"
                            }
                            alt={manga.title}
                            className="rounded-md w-full h-48 object-cover mb-2"
                          />
                          <h3 className="text-lg font-semibold text-gray-800">
                            {manga.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {manga.description.substring(0, 50)}...
                          </p>
                          <div>
                            <button
                              className="btn btn-sm rounded-none border-none bg-orange-500 text-gray-900"
                              onClick={() => navigate(`/${manga.id}`)}
                            >
                              Read
                            </button>
                          </div>{" "}
                          <div>
                            <button
                              className="btn btn-sm rounded-none border-none bg-orange-500 mt-4 text-gray-900"
                              onClick={() => handleDelete(manga.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No bookmarked mangas found.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-none border-none w-1/3 p-8 shadow-lg">
            <h2 className="text-2xl text-gray-900 font-bold mb-4">
              Edit Profile
            </h2>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm text-gray-900 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={profile.username}
                onChange={(e) =>
                  setProfile({ ...profile, username: e.target.value })
                }
                className="border border-gray-300 rounded-none bg-gray-900 text-white p-2 mt-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-sm text-gray-900 font-medium"
              >
                Bio
              </label>
              <textarea
                id="bio"
                className="border border-gray-300 bg-gray-900 text-white rounded-none p-2 w-full"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="file" className="block text-sm font-medium">
                Profile Image
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="border border-gray-300 rounded-md p-2 mt-1 w-full"
              />
            </div>

            {isSaving ? (
              <div className="spinner-border text-blue-500" role="status">
                <span className="sr-only">Saving...</span>
              </div>
            ) : (
              <>
                <div className="mt-4">
                  <button
                    className="btn btn-sm rounded-none border-none bg-red-500 text-white w-full"
                    onClick={deleteImg}
                  >
                    Delete Profile Image
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    className="btn btn-sm rounded-none border-none bg-green-600 text-white w-full"
                    onClick={updateOwnProfile}
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            <div className="mt-4">
              <button
                className="btn btn-sm rounded-none border-none bg-gray-500 text-white w-full"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
