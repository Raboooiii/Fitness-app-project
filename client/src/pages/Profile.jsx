// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getProfile } from "../api";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;

  @media (max-width: 600px) {
    padding: 10px 0px;
  }
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;

  @media (max-width: 600px) {
    padding: 0px 8px;
    gap: 16px;
  }
`;

const PieChartContainer = styled.div`
  width: 100%;
  height: 400px;

  @media (max-width: 600px) {
    height: 300px;
  }
`;

const Title = styled.div`
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Detail = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.text_primary};
`;

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [fitnessExperience, setFitnessExperience] = useState("");
  const [heightCm, setHeightCm] = useState(0); // Height in centimeters
  const [weight, setWeight] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [bmi, setBmi] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("fittrack-app-token");
        const response = await getProfile(token);

        if (response.data) {
          setName(response.data.name);
          setEmail(response.data.email);
          setGender(response.data.gender);
          setBodyType(response.data.bodyType);
          setFitnessExperience(response.data.fitnessExperience);
          setHeightCm(response.data.height * 100 || 0); // Convert meters to centimeters
          setWeight(response.data.weight || 0);
          setTotalDays(response.data.totalDays);
  
          // Calculate BMI
          if (response.data.height > 0 && response.data.weight > 0) {
            const bmiValue = (
              response.data.weight /
              (response.data.height * response.data.height)
            ).toFixed(2);
            setBmi(bmiValue);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  // BMI categories
  const bmiCategories = [
    { id: 0, value: 18.5, label: "Underweight" },
    { id: 1, value: 6.5, label: "Normal Weight" }, // 25 - 18.5 = 6.5
    { id: 2, value: 5, label: "Overweight" }, // 30 - 25 = 5
    { id: 3, value: 10, label: "Obese" }, // Arbitrary value for visualization
  ];

  // Find the user's BMI category
  const userBmiCategory = bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : 3;

  return (
    <Container>
      <Wrapper>
        <Title>Profile</Title>
        <Detail>
          <strong>Name:</strong> {name}
        </Detail>
        <Detail>
          <strong>Email:</strong> {email}
        </Detail>
        <Detail>
          <strong>Gender:</strong> {gender}
        </Detail>
        <Detail>
          <strong>Body Type:</strong> {bodyType}
        </Detail>
        <Detail>
          <strong>Fitness Experience:</strong> {fitnessExperience}
        </Detail>
        <Detail>
          <strong>Height:</strong> {heightCm} cm
        </Detail>
        <Detail>
          <strong>Weight:</strong> {weight} kg
        </Detail>
        <Detail>
          <strong>Total Days Using the App:</strong> {totalDays}
        </Detail>
        {bmi > 0 && (
          <>
            <Detail>
              <strong>BMI:</strong> {bmi}
            </Detail>
            <PieChartContainer>
                <PieChart
                    series={[
                    {
                        data: bmiCategories.map((category, index) => ({
                        ...category,
                        value: index === userBmiCategory ? bmi : category.value,
                        })),
                    },
                    ]}
                    width={400}
                    height={200}
                />
            </PieChartContainer>
          </>
        )}
        <Button
          text="Update Profile"
          onClick={() => navigate("/update-profile")}
        />
      </Wrapper>
    </Container>
  );
};

export default Profile;