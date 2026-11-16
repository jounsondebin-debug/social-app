import {useState, useEffect, use} from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router";
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Create from "./pages/Create"
import Settings from "./pages/Settings"
function App() {
  
  const [posts, setPosts] = useState(() => {
   const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [
      
    ]
})
  
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
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);
  
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
   
   function deletePost(postId) {
      setPosts(prev => prev.filter(post => {
          return postId !== post.id;
      }))
   }

  function poke(postId, pokes) {
     setPosts(prev => prev.map((post) => {
        if(postId === post.id) {
          return {
            ...post,
            pokes: pokes + 1
          }
        } return post;
     }))
  }

   function like(postId, likes, liked) {
      
     setPosts(prev => prev.map((post) => {
        if(postId === post.id && liked === "likes") {
          return {
            ...post, 
            liked: "liked",
            likes: likes + 1
          }
        } else if(postId === post.id && liked === "dislikes") {
           return {
            ...post, 
            liked: "disliked",
            likes: likes - 1
           }
        } else {
          return post
        }
     }))

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
           <Route path = "/create" element = {<Create setPosts={setPosts} posts = {posts}/>}/> 
           <Route path = "/settings" element = {<Settings theme = {theme} setTheme={setTheme} accent={accent} setAccent={setAccent}/>}></Route> 
        </Routes>
      </div>
   </BrowserRouter>
  )
}

export default App