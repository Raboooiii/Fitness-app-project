// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getProfile } from "../api";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";
import { Card, CardContent, Typography, Grid, Avatar } from "@mui/material";
import {
  Person,
  Email,
  Male,
  FitnessCenter,
  Height,
  MonitorWeight,
  CalendarToday,
  Info
} from "@mui/icons-material";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 16px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1000px;
  padding: 0 16px;
`;

const Title = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 600;
  margin-bottom: 20px;
`;

const ProfileCard = styled(Card)`
  background: ${({ theme }) => theme.card} !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text_primary} !important;
  height: 100%;
`;

const CardTitle = styled(Typography)`
  font-size: 16px !important;
  font-weight: 600 !important;
  margin-bottom: 12px !important;
  color: ${({ theme }) => theme.primary} !important;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const DetailLabel = styled(Typography)`
  font-weight: 500 !important;
  min-width: 100px;
  font-size: 14px !important;
  color: ${({ theme }) => theme.text_secondary} !important;
`;

const DetailValue = styled(Typography)`
  font-weight: 600 !important;
  font-size: 14px !important;
  word-break: break-word;
`;

const ProfileAvatar = styled(Avatar)`
  width: 80px !important;
  height: 80px !important;
  margin: 0 auto 12px !important;
  background: ${({ theme }) => theme.primary} !important;
`;

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    gender: "",
    bodyType: "",
    fitnessExperience: "",
    height: 0,
    weight: 0,
    totalDays: 0,
    img: ""
  });
  const [bmi, setBmi] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("fittrack-app-token");
        const response = await getProfile(token);

        if (response.data) {
          setProfile({
            name: response.data.name,
            email: response.data.email,
            gender: response.data.gender,
            bodyType: response.data.bodyType,
            fitnessExperience: response.data.fitnessExperience,
            height: response.data.height * 100 || 0,
            weight: response.data.weight || 0,
            totalDays: response.data.totalDays,
            img: response.data.img
          });

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

  const bmiCategories = [
    { id: 0, value: 18.5, label: "Underweight" },
    { id: 1, value: 6.5, label: "Normal Weight" },
    { id: 2, value: 5, label: "Overweight" },
    { id: 3, value: 10, label: "Obese" },
  ];

  const userBmiCategory = bmi < 18.5 ? 0 : bmi < 25 ? 1 : bmi < 30 ? 2 : 3;

  return (
    <Container>
      <Wrapper>
        <Title>My Profile</Title>
        
        <Grid container spacing={2}>
          {/* Personal Info Card - Made slightly larger */}
          <Grid item xs={12} md={5}>
            <ProfileCard>
              <CardContent>
                <ProfileAvatar src={profile.img}>
                  {profile.name.charAt(0)}
                </ProfileAvatar>
                <CardTitle>
                  <Person /> Personal Info
                </CardTitle>
                
                <DetailItem>
                  <DetailLabel variant="body1">Name:</DetailLabel>
                  <DetailValue variant="body1">{profile.name}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel variant="body1">Email:</DetailLabel>
                  <DetailValue variant="body1">{profile.email}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel variant="body1">Member for:</DetailLabel>
                  <DetailValue variant="body1">
                    {profile.totalDays} days
                  </DetailValue>
                </DetailItem>
              </CardContent>
            </ProfileCard>
          </Grid>

          {/* Fitness Details Card */}
          <Grid item xs={12} md={3.5}>
            <ProfileCard>
              <CardContent>
                <CardTitle>
                  <FitnessCenter /> Fitness Details
                </CardTitle>
                
                <DetailItem>
                  <DetailLabel variant="body1">
                    <Male /> Gender:
                  </DetailLabel>
                  <DetailValue variant="body1">
                    {profile.gender || "Not specified"}
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel variant="body1">
                    <Info /> Body Type:
                  </DetailLabel>
                  <DetailValue variant="body1">
                    {profile.bodyType || "Not specified"}
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel variant="body1">
                    <FitnessCenter /> Experience:
                  </DetailLabel>
                  <DetailValue variant="body1">
                    {profile.fitnessExperience || "Not specified"}
                  </DetailValue>
                </DetailItem>
              </CardContent>
            </ProfileCard>
          </Grid>

          {/* Physical Stats Card */}
          <Grid item xs={12} md={3.5}>
            <ProfileCard>
              <CardContent>
                <CardTitle>
                  <Height /> Physical Stats
                </CardTitle>
                
                <DetailItem>
                  <DetailLabel variant="body1">
                    <Height /> Height:
                  </DetailLabel>
                  <DetailValue variant="body1">
                    {profile.height} cm
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel variant="body1">
                    <MonitorWeight /> Weight:
                  </DetailLabel>
                  <DetailValue variant="body1">
                    {profile.weight} kg
                  </DetailValue>
                </DetailItem>
                
                {bmi > 0 && (
                  <DetailItem>
                    <DetailLabel variant="body1">
                      <Info /> BMI:
                    </DetailLabel>
                    <DetailValue variant="body1">
                      {bmi} ({bmiCategories[userBmiCategory].label})
                    </DetailValue>
                  </DetailItem>
                )}
              </CardContent>
            </ProfileCard>
          </Grid>

          {/* BMI Visualization Card */}
          {bmi > 0 && (
            <Grid item xs={12}>
              <ProfileCard>
                <CardContent>
                  <CardTitle>
                    <Info /> BMI Analysis
                  </CardTitle>
                  <div style={{ height: "250px" }}>
                    <PieChart
                      series={[
                        {
                          data: bmiCategories.map((category, index) => ({
                            ...category,
                            value: index === userBmiCategory ? bmi : category.value,
                          })),
                        },
                      ]}
                      width={600}
                      height={250}
                      sx={{
                        "& .MuiChartsAxis-tickLabel": {
                          fill: "white",
                        },
                        "& .MuiChartsLegend-series text": {
                          fill: "white",
                        },
                      }}
                    />
                  </div>
                </CardContent>
              </ProfileCard>
            </Grid>
          )}
        </Grid>

        <div style={{ marginTop: "16px", textAlign: "center" }}>
        <Button
          text="Update Profile"
          onClick={() => navigate("/update-profile")}
          small // Added small prop to make button smaller
          style={{ 
            padding: "0px 8px", // Reduced padding
            fontSize: "14px" // Smaller font size
          }}
        />
      </div>
      </Wrapper>
    </Container>
  );
};

export default Profile;
