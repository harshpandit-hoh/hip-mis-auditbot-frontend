import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

function Login(props: {
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
}) {
  const [emailInput, setEmailInput] = useState(
    localStorage.getItem("email") ?? ""
  );
  const [otpInput, setOtpInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [triggeredOtp, setTriggeredOtp] = useState(false);

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerEmailOtp = async () => {
    if (!emailInput) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3004/api/auth/trigger-mail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput,
          }),
        }
      );

      const result = await response.json();

      // Based on your sample response: { status: true, data: { success: true ... } }
      if (result.status && result.data?.success) {
        // Success
        localStorage.setItem("email", emailInput);
        setTriggeredOtp(true);

        // Note: Your API returns the OTP in the response (result.data.otp).
        // Usually, you don't show this to the user, but for debugging:
        console.log("OTP Sent:", result.data.otp);
      } else {
        // Handle API level errors (e.g. invalid email format)
        alert(result.message || "Failed to send OTP");
      }
    } catch (error) {
      // Handle Network errors
      console.error("Error triggering OTP:", error);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpInput) {
      alert("Please enter the OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3004/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailInput,
            otp: Number(otpInput), // Ensuring OTP is a number based on your cURL example (573466)
          }),
        }
      );

      const result = await response.json();

      // Assuming standard success response format like: { status: true, ... }
      // You may need to adjust this check based on your actual verify API response structure
      if (result.status) {
        // Success: Set authenticated state
        props.setIsAuthenticated(true);
      } else {
        // Handle failure (wrong OTP, expired, etc.)
        alert(result.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Something went wrong verifying the OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async () => {
    // We grab the email directly from storage to ensure we check the persisted user
    const savedEmail = localStorage.getItem("email");

    if (!savedEmail) {
      return; // No saved email, user must log in manually
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3004/api/auth/verify-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: savedEmail,
          }),
        }
      );

      const result = await response.json();

      // If status is true, the token is valid -> Auto Login
      if (result.status) {
        props.setIsAuthenticated(true);
      } else {
        // Token invalid/expired: Silent fail, let user log in manually
        // Optional: clear invalid email if you want: localStorage.removeItem("email");
        console.log("Session expired or invalid, please login again.");
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem" /* Adjusted gap to look tighter */,
          height: "80vh",
          fontFamily: "sans-serif",
          transition: "opacity 0.5s",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label htmlFor="email" style={{ textAlign: "left" }}>
            Email Address
          </label>
          <input
            type="text"
            className="mui-input"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter your Email Address"
            disabled={isLoading || triggeredOtp}
          />
        </div>

        {triggeredOtp ? (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <label htmlFor="otp" style={{ textAlign: "left" }}>
                OTP
              </label>
              <input
                type="text"
                className="mui-input"
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter your OTP"
                disabled={isLoading}
              />
            </div>
            <button
              className="mui-btn"
              onClick={verifyOTP}
              disabled={isLoading}
            >
              {isLoading ? "VERIFYING..." : "VERIFY OTP"}
            </button>
          </>
        ) : (
          <>
            <button
              className="mui-btn"
              onClick={triggerEmailOtp}
              disabled={isLoading}
            >
              {isLoading ? "SENDING..." : "SEND OTP"}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Login;
