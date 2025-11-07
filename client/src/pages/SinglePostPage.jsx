import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/apiClient';
import useApi from '../hooks/useApi';

const getImageUrl = (path) => {
  if (!path) return '';
  // Normalize both local and remote images
  return path.startsWith('http')
    ? path
    : `http://localhost:5000${path.replace(/^\/?src/, '')}`;
};

export default function SinglePostPage() {
  const { id } = useParams();
  const { loading, error, request } = useApi();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState({ authorName: '', body: '' });

  useEffect(() => {
    if (!id) return; // Prevent request if ID is missing
    const fetchPost = async () => {
      try {
        const data = await request(() => api.get(`/posts/${id}`));
        setPost(data);
      } catch (err) {
        console.error('Error fetching post:', err);
      }
    };
    fetchPost();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const data = await request(() =>
        api.post(`/posts/${id}/comments`, comment)
      );
      setPost(data);
      setComment({ authorName: '', body: '' });
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  if (loading) return <div className="container p-6">Loading...</div>;
  if (error) return <div className="container p-6 text-red-600">{error}</div>;
  if (!post) return <div className="container p-6">Not found</div>;

  return (
    <div className="container max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <Link to="/" className="text-indigo-600 hover:underline">
        ← Back
      </Link>

      <h1 className="text-2xl font-bold my-4">{post.title}</h1>

      {post.featuredImage && (
        <img
          src={getImageUrl(post.featuredImage)}
          alt={post.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
      )}

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      ></div>

      <h3 className="mt-6 font-semibold text-lg">Comments</h3>
      <ul className="space-y-2 mt-2">
        {post.comments?.length ? (
          post.comments.map((c, i) => (
            <li key={i} className="border rounded p-2">
              <b>{c.authorName}</b>: {c.body}
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-sm">No comments yet.</li>
        )}
      </ul>

      <form onSubmit={handleComment} className="mt-4 space-y-2">
        <input
          required
          placeholder="Your name"
          value={comment.authorName}
          onChange={(e) =>
            setComment({ ...comment, authorName: e.target.value })
          }
          className="w-full border px-3 py-2 rounded"
        />
        <textarea
          required
          placeholder="Comment"
          value={comment.body}
          onChange={(e) => setComment({ ...comment, body: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
}
