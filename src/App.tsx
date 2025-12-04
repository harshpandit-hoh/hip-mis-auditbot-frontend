import { useState } from "react";
import { Chat } from "./Chat";
import Login from "./Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (isAuthenticated) {
    return (
      <div className="App">
        <h1>Hiranandani Industrial Park MIS Bot</h1>
        <Chat />
      </div>
    );
  } else {
    return (
      <div className="App">
        <h2 style={{ fontSize: "2.5rem" }}>
          Hiranandani Industrial Park MIS Bot - Login
        </h2>
        <Login setIsAuthenticated={setIsAuthenticated} />
      </div>
    );
  }
}

export default App;
