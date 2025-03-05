import React, { useState } from "react";
import styled from "styled-components";
import TextInput from "./TextInput";
import Button from "./Button";
import { UserSignIn } from "../api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/reducers/userSlice";

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex

const SignIn = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateInputs = () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return false;
    }
  
    // Validate email format
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email); // Debugging log
      alert("Please enter a valid email address");
      return false;
    }
  
    console.log("Email is valid:", email); // Debugging log
    return true;
  };

  const handleSignIn = async () => {
    setLoading(true);
    setButtonDisabled(true);
    // Validate inputs before making the API call
    if (!validateInputs()) {
      setLoading(false); // Reset loading state
      setButtonDisabled(false); // Reset buttonDisabled state
      return;
    }
    if (validateInputs()) {
      try {
        const response = await UserSignIn({ email, password });
        if (response && response.data) {
          dispatch(loginSuccess(response.data));
          alert("Login Success");
        } else {
          alert("Invalid response from server");
        }
      } catch (err) {
        console.error("SignIn Error:", err);
        alert(err.response?.data?.message || "An error occurred during sign-in");
      } finally {
        setLoading(false);
        setButtonDisabled(false);
      }
    }
  };  

  return (
    <Container>
      <div>
        <Title>Welcome to Oadra 👋</Title>
        <Span>Please login with your details here</Span>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: "column",
        }}
      >
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          handelChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          password
          value={password}
          handelChange={(e) => setPassword(e.target.value)}
        />
        <Button
          text="SignIn"
          onClick={handleSignIn}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
      </div>
    </Container>
  );
};

export default SignIn;