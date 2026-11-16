import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import { supabase } from "./lib/supabaseClient";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import Settings from "./pages/Settings";

function App() {
  const [posts, setPosts] = useState([]);

  async function loadPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*, comments(*)")
      .order("created_at");

    if (error) return console.error(error);

    setPosts(prev =>
      data.map(p => ({
        ...p,
        creatorId: p.creator_id,
        comments: [...(p.comments || [])].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        ),
        liked: prev.find(old => old.id === p.id)?.liked || "",
      }))
    );
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem("accent") || "green";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    localStorage.setItem("accent", accent);
  }, [accent]);

  async function addComment(postId, text) {
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      text: text,
      creator: userDetails.username,
      creator_id: userDetails.userId,
    });
    if (error) return console.error(error);

    loadPosts();
  }

  async function deletePost(postId) {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) return console.error(error);

    setPosts(prev => prev.filter(post => post.id !== postId));
  }

  async function poke(postId, pokes) {
    const newPokes = (pokes ?? 0) + 1;

    const { error } = await supabase
      .from("posts")
      .update({ pokes: newPokes })
      .eq("id", postId);
    if (error) return console.error(error);

    setPosts(prev =>
      prev.map(post => (post.id === postId ? { ...post, pokes: newPokes } : post))
    );
  }

  async function like(postId, likes, liked) {
    const newLikes = (likes ?? 0) + (liked === "likes" ? 1 : -1);

    const { error } = await supabase
      .from("posts")
      .update({ likes: newLikes })
      .eq("id", postId);
    if (error) return console.error(error);

    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, likes: newLikes, liked: liked === "likes" ? "liked" : "disliked" }
          : post
      )
    );
  }

  return (
    <BrowserRouter>
      <nav className="navbar">
        <div className="nav-links">
          <Link className="nav-link" to="/">Home</Link>
          <Link className="nav-link" to="/profile">Profile</Link>
          <Link className="nav-link" to="/create">Create</Link>
          <Link className="nav-link" to="/settings">Settings</Link>
        </div>
      </nav>

      <div className="main">
        <Routes>
          <Route
            path="/"
            element={<Home posts={posts} addComment={addComment} like={like} poke={poke} deleteFunc={deletePost} />}
          />
          <Route path="/profile" element={<Profile posts={posts} />} />
          <Route
            path="/create"
            element={<Create setPosts={setPosts} posts={posts} loadPosts={loadPosts} />}
          />
          <Route
            path="/settings"
            element={<Settings theme={theme} setTheme={setTheme} accent={accent} setAccent={setAccent} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;