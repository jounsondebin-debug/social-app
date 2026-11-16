import {useState} from "react"

export default function Create({setPosts, posts}) {
    
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
    const username = userDetails.username;

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

    function post() {
        if(yourPost.text.trim() !== "") {
            setPosts(p => [...p, {
                  id: crypto.randomUUID(),
                 text: yourPost.text,
                 creator: username,
                 likes: 0,
                 comments: [],
                 liked: "",
                 pokes: 0,
                 creatorId: userDetails.userId
            }])
            yourPost.text = ""
        } else {
            yourPost.text = ""
            return;
        }
    }

    return(
        <div className="page">
            <div className="card">
                <h1 className="card-title">Create your post!</h1>
                <div className="create-row">
                    <input className="create-input" type="text" placeholder="What would you like to say to the world...." value = {yourPost.text} onChange = {handlePostChange}/>
                    <button className="btn-primary" onClick = {post}>Post!</button>
                </div>
            </div>
        </div>
    )
}