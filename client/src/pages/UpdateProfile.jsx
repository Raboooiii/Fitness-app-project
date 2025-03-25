// src/pages/UpdateProfile.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getProfile, updateProfile } from "../api";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;

  @media (max-width: 600px) {
    padding: 0px 8px;
    gap: 16px;
  }
`;

const Title = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background-color: transparent;
  color: ${({ theme }) => theme.text_primary};
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Option = styled.option`
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
`;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [fitnessExperience, setFitnessExperience] = useState("");
  const [heightCm, setHeightCm] = useState(0); // Height in centimeters
  const [weight, setWeight] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("fittrack-app-token");
      const response = await getProfile(token);
      setName(response.data.name);
      setEmail(response.data.email);
      setGender(response.data.gender);
      setBodyType(response.data.bodyType);
      setFitnessExperience(response.data.fitnessExperience);
      setHeightCm(response.data.height * 100 || 0); // Convert meters to centimeters
      setWeight(response.data.weight || 0);
    };
    fetchProfile();
  }, []);

    const handleUpdateProfile = async () => {
        if (!emailRegex.test(email)) {
        console.log("Invalid email format:", email); // Debugging log
        alert("Please enter a valid email address");
        return;
        }
    
        console.log("Email is valid:", email); // Debugging log
        setLoading(true);
        const token = localStorage.getItem("fittrack-app-token");
        const heightMeters = heightCm / 100; // Convert centimeters to meters
        try {
        await updateProfile(token, { 
            name,
            email,
            gender,
            bodyType,
            fitnessExperience,
            height: heightMeters, // Save height in meters
            weight,
         });
        alert("Profile updated successfully!");
        navigate("/profile");
        } catch (err) {
        console.error("Error updating profile:", err);
        alert("Failed to update profile. Please try again.");
        } finally {
        setLoading(false);
        }
    };



  return (
    <Container>
      <Wrapper>
        <Title>Update Profile</Title>
        <TextInput
          label="Name"
          placeholder="Enter your name"
          value={name}
          handelChange={(e) => setName(e.target.value)}
        />
        <TextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        handelChange={(e) => setEmail(e.target.value)}
        type="email" // Add type="email"
        />
        <div>
          <label>Gender</label>
          <Select value={gender} onChange={(e) => setGender(e.target.value)}>
            <Option value="">Select Gender</Option>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </div>
        <div>
          <label>
            Body Type{" "}
            <Tooltip
              title={
                <div>
                  <strong>Ectomorph:</strong> Lean and long, with difficulty building muscle.
                  <br />
                  <strong>Mesomorph:</strong> Muscular and well-built, with a high metabolism.
                  <br />
                  <strong>Endomorph:</strong> Big, high body fat, often pear-shaped, with a tendency to store fat.
                </div>
              }
              arrow
            >
              <span style={{ cursor: "pointer" }}>ℹ️</span>
            </Tooltip>
          </label>
          <Select value={bodyType} onChange={(e) => setBodyType(e.target.value)}>
            <Option value="">Select Body Type</Option>
            <Option value="ectomorph">Ectomorph</Option>
            <Option value="mesomorph">Mesomorph</Option>
            <Option value="endomorph">Endomorph</Option>
          </Select>
        </div>
        <div>
          <label>Fitness Experience</label>
          <Select
            value={fitnessExperience}
            onChange={(e) => setFitnessExperience(e.target.value)}
          >
            <Option value="">Select Fitness Experience</Option>
            <Option value="beginner">Beginner</Option>
            <Option value="intermediate">Intermediate</Option>
            <Option value="advanced">Advanced</Option>
          </Select>
        </div>
        <TextInput
          label="Height (cm)"
          placeholder="Enter your height in centimeters"
          value={heightCm}
          handelChange={(e) => setHeightCm(e.target.value)}
        />
        <TextInput
          label="Weight (kg)"
          placeholder="Enter your weight in kilograms"
          value={weight}
          handelChange={(e) => setWeight(e.target.value)}
        />
        <Button
          text="Save Profile"
          onClick={handleUpdateProfile}
          isLoading={loading}
        />
      </Wrapper>
    </Container>
  );
};

export default UpdateProfile;
