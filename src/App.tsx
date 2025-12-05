import { useEffect, useState } from "react";
import { Chat } from "./Chat";
import Login from "./Login";
import { checkSession, handleLogout } from "./api";
import { Spinner } from "./components/ui/spinner";
import { IconButton } from "./components";
import { LogOut } from "lucide-react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [triggeredOtp, setTriggeredOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailSaved = localStorage.getItem("email") ?? "";
  useEffect(() => {
    const initAuth = async () => {
      const isValid = await checkSession();
      if (isValid) {
        setIsAuthenticated(true);
      }
      setIsCheckingSession(false);
    };

    initAuth();
  }, []);

  if (isCheckingSession) {
    return (
      <div
        className="App"
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <Spinner />
        <p style={{ fontFamily: "sans-serif" }}>Verifying Session...</p>
      </div>
    );
  } else {
    if (isAuthenticated) {
      return (
        <div className="App">
          <div
            style={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
              width: "100%",
            }}
          >
            <h1 style={{ margin: "auto", marginBottom: "2rem" }}>
              Hiranandani Industrial Park MIS Bot
            </h1>
            <IconButton
              icon={<LogOut style={{ fontSize: ".5rem" }} />}
              loading={isLoading}
              onClick={() => {
                handleLogout(emailSaved, setIsLoading, setIsAuthenticated);
              }}
            />
          </div>
          <Chat isAuthenticated={isAuthenticated} />
        </div>
      );
    } else {
      return (
        <div className="App">
          <h2 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
            Hiranandani Industrial Park MIS Bot
          </h2>
          <h3>Enter your {triggeredOtp ? "OTP" : "Email"} for logging in</h3>
          <Login
            triggeredOtp={triggeredOtp}
            setTriggeredOtp={setTriggeredOtp}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      );
    }
  }
}

export default App;
