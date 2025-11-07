import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiClient";
import useApi from "../hooks/useApi";
import { AuthContext } from "../context/AuthContext";

const getImageUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http")
    ? path
    : `http://localhost:5000${path.replace("/src", "")}`;
};

export default function PostsPage() {
  const { loading, error, request } = useApi();
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });

  // form state (create/edit)
  const empty = { _id: null, title: "", content: "", categories: "", featuredImage: null };
  const [form, setForm] = useState(empty);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);

  const fetchPosts = async () => {
    const data = await request(() =>
      api.get("/posts", { params: { q, page, limit: 6 } })
    );
    setPosts(data.posts);
    setMeta({ page: data.page, pages: data.pages, total: data.total });
  };

  useEffect(() => {
    fetchPosts();
  }, [q, page]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await request(() => api.delete(`/posts/${id}`));
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const resetForm = () => {
    setForm(empty);
    setIsEditing(false);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("content", form.content);
    if (form.categories)
      fd.append("categories", form.categories.split(",").map((s) => s.trim()));
    if (file) fd.append("featuredImage", file);

    if (isEditing) {
      const data = await request(() => api.put(`/posts/${form._id}`, fd));
      setPosts((prev) => prev.map((p) => (p._id === data._id ? data : p)));
    } else {
      const data = await request(() => api.post("/posts", fd));
      setPosts((prev) => [data, ...prev]);
    }
    resetForm();
  };

  return (
    <div className="container mx-auto px-4">
      {/* Search + count */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search posts..."
          className="border rounded px-3 py-2 w-full md:w-1/3"
        />
        <div className="text-sm text-gray-600">Total: {meta.total}</div>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {/* Posts list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow flex gap-4">
            <div className="w-28 h-24 overflow-hidden rounded-md bg-gray-100">
              {p.featuredImage ? (
                <img
                  src={getImageUrl(p.featuredImage)}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-2 text-xs text-gray-400">No image</div>
              )}
            </div>

            <div className="flex-1">
              <Link
                to={`/posts/${p._id}`}
                className="text-lg font-semibold text-indigo-600 hover:underline"
              >
                {p.title}
              </Link>

              <p
                className="text-sm text-gray-600 line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: p.content || "<i>No content</i>",
                }}
              ></p>

              {user && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setForm({
                        _id: p._id,
                        title: p.title,
                        content: p.content,
                        categories: (p.categories || [])
                          .map((c) => c._id)
                          .join(","),
                      });
                      setIsEditing(true);
                    }}
                    className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">
          {meta.page} / {meta.pages}
        </span>
        <button
          disabled={page >= meta.pages}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Create/Edit Form */}
      <div className="mt-8 bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">
          {isEditing ? "Edit Post" : "Create Post"}
        </h3>

        {!user && (
          <div className="text-sm text-gray-600 mb-2">
            You must be logged in to create posts.{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Login
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            required
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Content"
            className="w-full border px-3 py-2 h-28 rounded"
          ></textarea>
          <input
            value={form.categories}
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
            placeholder="Category IDs (comma separated)"
            className="w-full border px-3 py-2 rounded"
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <div className="flex gap-2">
            <button
              disabled={!user}
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {isEditing ? "Save" : "Create"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
