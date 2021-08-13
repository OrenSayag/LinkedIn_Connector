import logo from './logo.svg';
import React, { useState } from 'react';

import './App.css';
const { ipcRenderer } = window.require('electron')




function App() {


  const [mailOrPhone, setMailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [keyword, setKeyword] = useState("")

  return (
    <div className="App">
      <div className="form">

        <div
        className="mailOrPhone"
        >
          <input
          type="text"
          onChange={(e)=>{setMailOrPhone(e.target.value)}}
          placeholder="Your LinkedIn Login Mail or Phone"
          ></input>
        </div>

        <div
        className="password"
        >
          <input
          type="text"
          onChange={(e)=>{setPassword(e.target.value)}}
          placeholder="Your LinkedIn Login Password"
          ></input>
        </div>

        <div
        className="keyword"
        >
          <input
          type="text"
          onChange={(e)=>{setKeyword(e.target.value)}}
          placeholder="Your LinkedIn Desired Keyword"
          ></input>
        </div>

      </div>

      <button
      onClick={()=>{
        ipcRenderer.send('anything-asynchronous', {password, keyword, mailOrPhone})
        
      }}
      >
      Connect
      </button>
    </div>
  );
}

export default App;
