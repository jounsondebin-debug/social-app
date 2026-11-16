import {useState, useEffect} from "react"

export default function Profile({posts}) {
   
   const [userDetails, setUserDetails] = useState(() => {
  const saved = JSON.parse(localStorage.getItem("userDetails"));
  if (saved) {
    return saved.userId ? saved : { ...saved, userId: crypto.randomUUID() };
  }
  return { username: "", age: 0, gender: "", userId: crypto.randomUUID() };
});

   useEffect(() => {
    localStorage.setItem("userDetails", JSON.stringify(userDetails))
   }, [userDetails])

    const yourPosts = posts.filter(post => {
        return post.creatorId === userDetails.userId
    })
   
    function handlePfpChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    setUserDetails({ ...userDetails, pfp: reader.result });
  };
  reader.readAsDataURL(file);
}

   function handleUserNameChange(e) {
      setUserDetails({
        ...userDetails,
        username: e.target.value
      })
   }
   function handleAgeChange(e) {
      setUserDetails({
        ...userDetails,
        age: e.target.value
      })
   }
    function handleGenderChange(e) {
      setUserDetails({
        ...userDetails,
        gender: e.target.value
      })
   }

   return(
    <>
     <div className="page">
      <div className="card">
       <h1 className="card-title">This is your account!</h1>
       <div className="pfp-section">
  {userDetails.pfp ? (
    <img className="pfp" src={userDetails.pfp} alt="Profile picture" />
  ) : (
    <div className="pfp pfp-empty">No photo</div>
  )}
  <input type="file" accept="image/*" onChange={handlePfpChange}/>
</div>
       <div className="profile-info">
        <h2 className="info-row">Username: {userDetails.username}</h2>
        <h2 className="info-row">Age: {userDetails.age}</h2>
        <h2 className="info-row">Gender: {userDetails.gender ? userDetails.gender === "M" ? "Male" : "Female" : ""}</h2>
       </div>
      </div>
       <div className="profile-body">
        <div className="card">
         <h1 className="card-title"> Fill out your details!</h1>
         <div className="form-row">
           <label className="form-label" htmlFor="">Username: </label> 
           <input className="form-input" type="text" value = {userDetails.username} onChange = {handleUserNameChange}/> 
         </div> 
          <div className="form-row">
           <label className="form-label" htmlFor="">Age: </label> 
           <input className="form-input" type="number" value = {userDetails.age} onChange = {handleAgeChange}/> 
         </div> 
         <div className="form-row">
             <label className="form-label" htmlFor="">Gender:</label>
             <select className="form-input" name="" id="" value = {userDetails.gender} onChange={handleGenderChange}>
                 <option value="">Prefer Not to Say</option>
                 <option value="M">M</option>
                 <option value="F">F</option>
             </select>
         </div>
         <div className="form-row">
             <label htmlFor="" className="form-label">User ID:</label>
             <input type="text" readOnly className="form-input" value = {userDetails.userId}/>
         </div>
        </div>
        <div className="card">
            <h1 className="card-title">Posts:</h1>
            <div>
                <ul className="post-list">
                   {yourPosts.map((post, key)=> {
                      return <li className="post-list-item" key = {key}>{post.text}</li>
                   })}
                   
                </ul>
            </div>
        </div>
       </div>
     </div>
    </>
   )

}