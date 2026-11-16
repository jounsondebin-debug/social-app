import { useState } from "react";

export default function Home({ posts, addComment, like, poke, deleteFunc }) {
  const [currentId, setCurrentId] = useState(0);
  const [comment, setComment] = useState("");
  const currentPost = posts[currentId];
  const userDetails = JSON.parse(localStorage.getItem('userDetails'))
  

  function changePost(dir) {
    if (dir === "left") setCurrentId(c => c - 1);
    else if (dir === "right") setCurrentId(c => c + 1);
  }

  function handleComment() {
    if (comment.trim() !== "") {
      addComment(currentPost.id, comment);
      setComment("");
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="card-title">Posts</h1>

        {!currentPost ? (
          <h1 className="empty">No posts yet...</h1>
        ) : (
          <>
            <div className="post" onClick = {() => {
                poke(currentPost.id, currentPost.pokes)
            }}>
              <div className="post-header">
              <h1 className="post-text">{currentPost.text}</h1>
              {currentPost.creatorId === userDetails.userId && (<button className="del-btn" onClick = {() => {
                deleteFunc(currentPost.id)
                if(currentId) {
                  setCurrentId(i => i - 1)
                }
              }}>X</button>)}
              </div> 
              <div className="creator">
              <p className="post-creator">Created by: {currentPost.creator}!</p> 
              <img className = "post-pfp" src={userDetails.pfp} alt="" />
              </div>
              <div className="post-stats">
                <h3>Likes: {currentPost.likes}</h3>
                <h3>Pokes: {currentPost.pokes}</h3>
              </div>
               <div className="post-nav">
                <button className="btn-primary" onClick = {() => {
                    like(currentPost.id, currentPost.likes, "likes")
                }} disabled = {currentPost.liked === "liked"}>Like</button> {" "}
                <button className="btn-primary" onClick = {() => {
                    like(currentPost.id, currentPost.likes, "dislikes")
                }} disabled = {currentPost.liked === "disliked"}>Dislike</button>
               </div>
            </div>

            <div className="comments">
              <h3 className="card-title">Comments</h3>
              {(currentPost.comments || []).map(c => (
                <div className="comment" key={c.id}>
                  <span className="comment-creator">{c.creator}:</span> {c.text}
                </div>
              ))}
            </div>

            {/* write a comment */}
            <div className="create-row">
              <input
                type="text"
                className="create-input"
                placeholder="Post a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
              <button className="btn-primary" onClick={handleComment}>
                Comment
              </button>
            </div>
          </>
        )}

        <div className="post-nav">
          <button className="arrow-btn" onClick={() => changePost("left")} disabled={currentId === 0}>{"<"}</button>
          <button className="arrow-btn" onClick={() => changePost("right")} disabled={currentId >= posts.length - 1}>{">"}</button>
        </div>
      </div>
    </div>
  );
}