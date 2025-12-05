import type React from "react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (!baseUrl) {
  throw new Error("VITE_API_BASE_URL is not defined in your .env file.");
}

const triggerEmailOtp = async (
  emailInput: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setTriggeredOtp: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!emailInput) {
    alert("Please enter a valid email address");
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${baseUrl}/auth/trigger-mail`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
      }),
    });

    const result = await response.json();

    if (result.status && result.data?.success) {
      localStorage.setItem("email", emailInput);
      setTriggeredOtp(true);
      console.log("OTP Sent:", result.data.otp);
    } else {
      alert(result.message || "Failed to send OTP");
    }
  } catch (error) {
    console.error("Error triggering OTP:", error);
    alert("Something went wrong. Please check your connection.");
  } finally {
    setIsLoading(false);
  }
};

const verifyOTP = async (
  otpInput: string,
  emailInput: string,
  props: { setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>> },
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (!otpInput) {
    alert("Please enter the OTP");
    return;
  }

  setIsLoading(true);

  try {
    const response = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput,
        otp: Number(otpInput),
      }),
    });

    const result = await response.json();

    if (result.status) {
      props.setIsAuthenticated(true);
    } else {
      alert(result.message || "Invalid OTP. Please try again.");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    alert("Something went wrong verifying the OTP.");
  } finally {
    setIsLoading(false);
  }
};

const handleLogout = async (
  emailSaved: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setIsLoading(true);
  try {
    const response = await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailSaved,
      }),
    });

    const result = await response.json();

    if (result.status) {
      setIsAuthenticated(false);
      window.location.reload();
    } else {
      alert(result.message || "Unable to log out.");
      setIsAuthenticated(false);
      window.location.reload();
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    alert("Something went wrong verifying the OTP.");
  } finally {
    setIsLoading(false);
  }
};

const checkSession = async (): Promise<boolean> => {
  const savedEmail = localStorage.getItem("email");
  if (!savedEmail) return false;

  try {
    const response = await fetch(`${baseUrl}/auth/verify-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: savedEmail }),
    });

    const result = await response.json();
    return result.status === true;
  } catch (error) {
    console.error("Error checking session:", error);
    return false;
  }
};

export { triggerEmailOtp, verifyOTP, checkSession, handleLogout };
