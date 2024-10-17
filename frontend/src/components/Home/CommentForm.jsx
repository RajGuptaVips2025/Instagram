// CommentForm.js
import { useState } from 'react';

const CommentForm = ({ postId, handleCommentSubmit }) => {
  const [comment, setComment] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    handleCommentSubmit(e, postId, comment);
    setComment(''); // Clear comment after submission
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center pt-2 px-1 pb-4">
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm"
      />
      <button
        type="submit"
        className={`text-blue-500 font-semibold text-sm ${!comment.trim() && 'hidden'}`}
        disabled={!comment.trim()}
      >
        Post
      </button>
    </form>
  );
};

export default CommentForm;
