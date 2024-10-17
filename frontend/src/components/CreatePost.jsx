import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Input } from './ui/input';

const CreatePost = () => {
  const userDetails = useSelector((state) => state.counter.userDetails);
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null); // Update to handle both images and videos
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('media', media); // File input
    formData.append('caption', caption);
    formData.append('author', userDetails.id); // Assuming you have author/user info

    try {
      const response = await axios.post('/api/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data)
      navigate('/');

    } catch (error) {
      console.error('Error creating post:', error);
    }
  };




  return (
    <section aria-labelledby="create-post-title" className="max-w-md mx-auto p-4 text-black bg-white rounded-lg shadow-lg">
      <h1 id="create-post-title" className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
          Caption
        </label>
        <Input
          id="caption"
          type="text"
          placeholder="Enter your caption here"
          className="mb-4 w-full p-3 border rounded-lg text-black outline-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />

        <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
          Image or Video
        </label>
        <Input
          id="media"
          type="file"
          className="mb-4 w-full border rounded-lg"
          name="media"
          onChange={(e) => setMedia(e.target.files[0])}
          accept="image/*,video/*" // Accept both images and videos
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Post
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
