// src/pages/SetupProfile.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "../api";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { Tooltip } from "@mui/material";

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

const SetupProfile = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [fitnessExperience, setFitnessExperience] = useState("");
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSetupProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("fittrack-app-token");
    await updateProfile(token, { gender, bodyType, fitnessExperience, height, weight });
    setLoading(false);
    navigate("/profile");
  };

  return (
    <Container>
      <Wrapper>
        <Title>Setup Your Profile</Title>
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
          label="Height (m)"
          placeholder="Enter your height in centimeters"
          value={height}
          handelChange={(e) => setHeight(e.target.value)}
        />
        <TextInput
          label="Weight (kg)"
          placeholder="Enter your weight in kilograms"
          value={weight}
          handelChange={(e) => setWeight(e.target.value)}
        />
        <Button
          text="Save Profile"
          onClick={handleSetupProfile}
          isLoading={loading}
        />
      </Wrapper>
    </Container>
  );
};

export default SetupProfile;
