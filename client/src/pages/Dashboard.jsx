import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { counts } from "../utils/data";
import CountsCard from "../components/cards/CountsCard";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";
import CategoryChart from "../components/cards/CategoryChart";
import AddWorkout from "../components/AddWorkout";
import WorkoutCard from "../components/cards/WorkoutCard";
import { addWorkout, getDashboardDetails, getWorkouts } from "../api";
import { CircularProgress } from "@mui/material";
import { getWeeklyAnalysis } from "../api";
import { Bar } from "react-chartjs-2";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 16px 0;
  overflow-y: auto;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 12px;
`;

const FlexWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 0 8px;
`;

const Title = styled.div`
  padding: 0 8px;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 8px;
`;

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("fittrack-app-token");
      
      // Fetch dashboard data
      const dashboardResponse = await getDashboardDetails(token);
      setData(dashboardResponse.data);
      
      // Fetch today's workouts
      const workoutsResponse = await getWorkouts(token, "");
      setTodaysWorkouts(workoutsResponse?.data?.todaysWorkouts || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const [weeklyRunningData, setWeeklyRunningData] = useState(null);

  const fetchRunningData = async () => {
    try {
      const token = localStorage.getItem("fittrack-app-token");
      const response = await getWeeklyAnalysis(token);
      setWeeklyRunningData(response.data);
    } catch (error) {
      console.error("Error fetching running data:", error);
    }
  };
  
  // Add this to your useEffect to fetch running data when component mounts
  useEffect(() => {
    fetchData();
    fetchRunningData();
  }, []);
  
  // Create a new component for RunningStatsCard (add this above Dashboard component)
  const RunningStatsCard = ({ data }) => {
  if (!data) return null;

  return (
    <div style={{
      padding: "24px",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "14px",
      boxShadow: "1px 6px 20px 0px rgba(0, 150, 255, 0.15)",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: "280px"
    }}>
      <div style={{
        fontWeight: "600",
        fontSize: "16px",
        color: "#2196F3"
      }}>Weekly Running Stats</div>
      
      <div style={{ height: "300px" }}>
        <Bar 
          data={{
            labels: data.map(item => item.day),
            datasets: [{
              label: 'Steps',
              data: data.map(item => item.steps),
              backgroundColor: '#4CAF50',
              borderRadius: 4
            }]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'white'
                }
              },
              y: {
                grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                  color: 'white',
                  callback: function(value) {
                    return value.toLocaleString();
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

  const addNewWorkout = async () => {
    if (!workout.trim()) return;
    
    setButtonLoading(true);
    try {
      const token = localStorage.getItem("fittrack-app-token");
      await addWorkout(token, { workoutString: workout });
      await fetchData(); // Refresh all data
      setWorkout(`#Legs
        -Back Squat
        -5 setsX15 reps
        -30 kg
        -10 min`); // Clear input
    } catch (error) {
      console.error("Error adding workout:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container>
        <Wrapper>
          <Title>Error loading dashboard data</Title>
        </Wrapper>
      </Container>
    );
  }

  return (
    <Container>
      <Wrapper>
        <Title>Dashboard</Title>
        
        {/* Stats Cards */}
        <FlexWrap>
          {counts.map((item) => (
            <CountsCard 
              key={item.name} 
              item={item} 
              data={{
                totalCaloriesBurnt: data.totalCaloriesBurnt || 0,
                totalWorkouts: data.totalWorkouts || 0,
                avgCaloriesBurntPerWorkout: data.avgCaloriesBurntPerWorkout || 0
              }} 
            />
          ))}
        </FlexWrap>
  
        {/* Charts Section - Add RunningStatsCard here */}
        <FlexWrap>
          <WeeklyStatCard data={data} />
          <CategoryChart data={data} />
          <RunningStatsCard data={weeklyRunningData} />
          <AddWorkout
            workout={workout}
            setWorkout={setWorkout}
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>
  
        {/* Recommended Workouts */}
        <Section>
          <Title>Recommended Workouts</Title>
          <CardWrapper>
            {todaysWorkouts.length > 0 ? (
              todaysWorkouts.map((workout) => (
                <WorkoutCard key={workout._id} workout={workout} />
              ))
            ) : (
              <div>No workouts for today</div>
            )}
          </CardWrapper>
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Dashboard;
