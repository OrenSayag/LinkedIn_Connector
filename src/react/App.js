import logo from './logo.svg';
import React, { useEffect, useState } from 'react';

import '../App.css';
const { ipcRenderer } = window.require('electron')




function App() {

//   ipcRenderer.on('message', (event, arg) => {
    
// });

useEffect(() => {
  ipcRenderer.on('message', function(event, data){ // When the message is received...
    // console.log(data);
    setMessage(data.msg);
    // setMessages([...messages, data.msg])
    // messages.shift(data.msg)
  });
  ipcRenderer.on('restart', function(event, data){ // When the message is received...
    ipcRenderer.send('anything-asynchronous', {password, keyword, mailOrPhone})
    
  });
  ipcRenderer.on('countup', function(event, data){ // When the message is received...
    setCounter(counter+1)
    counter++
    
  });
}, [])

  const [mailOrPhone, setMailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [keyword, setKeyword] = useState("")
  const [message, setMessage] = useState("")
  let [counter, setCounter] = useState(0)

  return (
    <div className="App">

    <div
    className="header"
    >
    <div
    className="page-title"
    >LinkedIn Connector</div>
  <div
  className="app-desc"
  >
    This is an app that sends LinkedIn connection requests, targeting people filtered by a keywoard. Enjoy!
  </div>
  
    </div>

      <div className="form">

        <div
        className="mailOrPhone input-field"
        >
          <div
          className="title"
          >LinkdeIn Login Mail or Phone</div>
          <input
          type="text"
          value={mailOrPhone}
          onChange={(e)=>{setMailOrPhone(e.target.value)}}
          placeholder="Your LinkedIn Login Mail or Phone"
          ></input>
        </div>

        <div
        className="password input-field"
        >
          <div
          className="title"
          >LinkedIn Login Password</div>
          <input
          type="password"
          value={password}
          onChange={(e)=>{setPassword(e.target.value)}}
          placeholder="Your LinkedIn Login Password"
          ></input>
        </div>

        <div
        className="keyword input-field"
        >
          <div
          className="title"
          >Desired Connection Keyword</div>
          <input
          type="text"
          value={keyword}
          onChange={(e)=>{setKeyword(e.target.value)}}
          placeholder="Desired Connection Keyword"
          ></input>
        </div>

      </div>

      <div
      className="event"
      >
      {
        message
      }
    </div>
      <button
      onClick={()=>{
        // messages = []
        ipcRenderer.send('anything-asynchronous', {password, keyword, mailOrPhone})
        
      }}
      >
      Connect
      </button>

      <div
  className="info">
    This app is using google chrome, if you don't have it, the app won't work.
  </div>

  {/* <div
  className={"chrome-input"}
  >
    Connect button doesn't work? It's probably because your chrome installation path is different than the default. <br />
    You cant contact me at orensayag500@gmail.com or on LinkedIn Oren Sayag and I'll show you how to find the path. <br />
    If you know how to do it: <br />
    <input
    type="text"
    placeholder="Enter Chrome path"
    ></input>

  </div> */}

      {/* <div
      className="log"
      >
        {messages.map((m, i)=><div key={i}>{m}</div>)}

      </div> */}

      <div
      className="counter"
      >
        <div
        className="text"
        >Connection requests sent in this session: </div>
        <div
        className="num"
        >{counter}</div>
      </div>


    </div>
  );
}

export default App;
