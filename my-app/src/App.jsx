import {useState, useEffect, use} from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Create from "./pages/Create"
import Settings from "./pages/Settings"
import { supabase } from "./lib/supabaseClient";
function App() {

  const [posts, setPosts] = useState([]);

  async function loadPosts() {
    const { data, error } = await supabase.from("posts").select("*").order("created_at");
    if (error) return console.error(error);
    setPosts(data.map(p => ({ ...p, creatorId: p.creator_id, comments: [] })));
  }

  useEffect(() => {
    loadPosts();
  }, []);

  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark"
  })
  
  const [accent, setAccent] = useState(() => {
    return localStorage.getItem("accent") || "green"
  })

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    localStorage.setItem("accent", accent)
  }, [accent])


  
   useEffect(() => {
       document.documentElement.dataset.theme = theme;
       localStorage.setItem("theme", theme)
   }, [theme])

   function addComment(postId, text) {
      
     const userDetails = JSON.parse(localStorage.getItem("userDetails"))  || {}

     setPosts(prev => prev.map((post) => {
       if(post.id === postId) {
         return {
            ...post,
         comments: [
          ...(post.comments || []),
          {
            id: crypto.randomUUID(),
            text: text,
            creator: userDetails.username
          }
         ]
         } 
       } else {
        return post;
       }
     }))
   }
   
  async function deletePost(postId) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  if (error) return console.error(error);

  setPosts(prev => prev.filter(post => post.id !== postId));
}

async function poke(postId, pokes) {
  const { error } = await supabase
    .from("posts")
    .update({ pokes: (pokes ?? 0) + 1 })
    .eq("id", postId);
  if (error) return console.error(error);

  setPosts(prev => prev.map(post =>
    post.id === postId ? { ...post, pokes: (pokes ?? 0) + 1 } : post
  ));
}

  async function like(postId, likes, liked) {
  const newLikes = (likes ?? 0) + (liked === "likes" ? 1 : -1);

  const { error } = await supabase
    .from("posts")
    .update({ likes: newLikes })
    .eq("id", postId);
  if (error) return console.error(error);

  setPosts(prev => prev.map(post =>
    post.id === postId
      ? { ...post, likes: newLikes, liked: liked === "likes" ? "liked" : "disliked" }
      : post
  ));
}

  return (
   <BrowserRouter>
      <nav className="navbar">
        <div className="nav-links">
          <Link className="nav-link" to = "/">Home</Link> {" "}
          <Link className="nav-link" to = "/profile">Profile</Link> {" "}
          <Link className="nav-link" to = "/create">Create</Link> {" "}
          <Link className="nav-link" to = "/settings">Settings</Link>
          
        </div>
      </nav>
      <div className="main">
        <Routes>
           <Route path = "/" element = {<Home posts={posts} addComment={addComment} like = {like} poke ={poke} deleteFunc={deletePost}/>}/>  
           <Route path = "/profile" element = {<Profile posts={posts}/>}/>  
           <Route path = "/create" element = {<Create setPosts={setPosts} posts = {posts} loadPosts={loadPosts}/>}/> 
           <Route path = "/settings" element = {<Settings theme = {theme} setTheme={setTheme} accent={accent} setAccent={setAccent}/>}></Route> 
        </Routes>
      </div>
   </BrowserRouter>
  )
}

export default App