import { useState, type Dispatch, type SetStateAction } from "react";
import { triggerEmailOtp, verifyOTP } from "./api";
import { Button, EmailInput, InputOTP } from "./components";

function Login(props: {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  triggeredOtp: boolean;
  setTriggeredOtp: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [emailInput, setEmailInput] = useState(
    localStorage.getItem("email") ?? ""
  );
  const [otpInput, setOtpInput] = useState("");
  const { triggeredOtp, setTriggeredOtp, isLoading, setIsLoading } = props;
  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            height: "60vh",
            marginBottom: "auto",
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
            <EmailInput
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              disabled={isLoading || triggeredOtp}
              showIcon={triggeredOtp}
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
                <InputOTP
                  value={otpInput}
                  onChange={setOtpInput}
                  disabled={isLoading}
                />
              </div>
              <Button
                loading={isLoading}
                onClick={() =>
                  verifyOTP(otpInput, emailInput, props, setIsLoading)
                }
                disabled={isLoading || !emailInput || !otpInput}
                buttonText={isLoading ? "Verifying..." : "Verify OTP"}
              />
            </>
          ) : (
            <>
              <Button
                loading={isLoading}
                onClick={() =>
                  triggerEmailOtp(emailInput, setIsLoading, setTriggeredOtp)
                }
                disabled={isLoading || !emailInput}
                buttonText={isLoading ? "Sending..." : "Send OTP"}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
