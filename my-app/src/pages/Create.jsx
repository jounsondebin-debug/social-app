import {useState} from "react"
import { supabase } from "../lib/supabaseClient";

export default function Create({setPosts, posts, loadPosts}) {
    
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    const username = userDetails.username;
    const [holderMsgs, setHolderMsgs] = useState(["What would you like to say to the world?", "How has your day been?", "Happy birthday! Maybe. Just a guess.", "Time to make a post!"])

    const [yourPost, setYourPost] = useState({
       text: "",
       id: 0,
       creator: username,
       creatorId: userDetails.userId
    }) 
      
    function handlePostChange(e) {
        setYourPost({
            ...yourPost,
            text: e.target.value
        })
    }

    async function post() {
         if (yourPost.text.trim() === "") return;

   const { error } = await supabase.from("posts").insert({
    text: yourPost.text,
    creator: username,
    creator_id: userDetails.userId,
  });

  if (error) return console.error(error);
  setYourPost({ ...yourPost, text: "" });
  loadPosts();
    }

    return(
        <div className="page">
            <div className="card">
                <h1 className="card-title">Create your post!</h1>
                <div className="create-row">
                    <input className="create-input" type="text" placeholder= {holderMsgs[Math.floor(Math.random() * holderMsgs.length)]} value = {yourPost.text} onChange = {handlePostChange}/>
                    <button className="btn-primary" onClick = {post}>Post!</button> 
                </div>
            </div>
        </div>
    )
}