import {useState} from "react"

export default function Settings({theme, setTheme, accent, setAccent}) {
     
   function changeTheme() {
      setTheme(t => (t === "dark" ? "light" : "dark"))
   }

   function handleAccentChange(e) {
      setAccent(e.target.value)
   }
   return(
    <div>
       <div className="card">
          <h3 className="card-title">Display Settings</h3>
          <button className="btn-primary" onClick = {changeTheme}>{theme === "dark" ? "Light Mode" : "Dark Mode"}</button>  <br />    
           <select name="" id="" value = {accent} onChange={handleAccentChange} className="btn-primary">
            <option value="green">Green</option>
            <option value="orange">Orange</option>
            <option value="purple">Purple</option>
            <option value="blue">Blue</option>
           </select>
       </div>
    </div>
   )

}