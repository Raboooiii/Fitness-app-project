import React, { useEffect, useState } from "react";
import styled from "styled-components";
import WorkoutCard from "../components/cards/WorkoutCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers";
import { getWorkouts, addWorkout, getDashboardDetails } from "../api";
import { CircularProgress } from "@mui/material";
import AddWorkout from "../components/AddWorkout";
import WeeklyStatCard from "../components/cards/WeeklyStatCard";

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

const CalendarCard = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 12px;
  box-shadow: 1px 4px 12px 0px ${({ theme }) => theme.primary + 15};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CalendarTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.primary};
`;

const CompactWeeklyStatCard = styled(WeeklyStatCard)`
  min-height: 300px;
`;

const CompactAddWorkout = styled(AddWorkout)`
  min-height: 300px;
`;

const Workouts = () => {
  const [loading, setLoading] = useState(false);
  const [weeklyData, setWeeklyData] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [todaysWorkouts, setTodaysWorkouts] = useState([]);
  const [workout, setWorkout] = useState(`#Legs
-Back Squat
-5 setsX15 reps
-30 kg
-10 min`);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchWeeklyData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("fittrack-app-token");
      const response = await getDashboardDetails(token);
      setWeeklyData(response.data);
    } catch (error) {
      console.error("Error fetching weekly data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTodaysWorkout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("fittrack-app-token");
      const dateStr = `${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`;
      const response = await getWorkouts(token, dateStr ? `?date=${dateStr}` : "");
      setTodaysWorkouts(response?.data?.todaysWorkouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNewWorkout = async () => {
    setButtonLoading(true);
    try {
      const token = localStorage.getItem("fittrack-app-token");
      await addWorkout(token, { workoutString: workout });
      await fetchWeeklyData();
      await getTodaysWorkout();
      setWorkout(`#Legs
-Back Squat
-5 setsX15 reps
-30 kg
-10 min`);
    } catch (error) {
      console.error("Error adding workout:", error);
    } finally {
      setButtonLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(new Date(date.$y, date.$M, date.$D));
  };

  useEffect(() => {
    fetchWeeklyData();
    getTodaysWorkout();
  }, [selectedDate]);

  return (
    <Container>
      <Wrapper>
        <Title>Workouts</Title>
        <FlexWrap>
          <CalendarCard>
            <CalendarTitle>Select Date</CalendarTitle>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                onChange={handleDateChange}
                sx={{
                  "& .MuiPickersCalendarHeader-label": {
                    fontSize: "0.875rem",
                    color: "white",
                  },
                  "& .MuiPickersDay-root": {
                    width: 28,
                    height: 28,
                    fontSize: "0.75rem",
                    color: "white",
                  },
                  "& .MuiPickersDay-today": {
                    borderColor: "white",
                  },
                }}
              />
            </LocalizationProvider>
          </CalendarCard>

          {weeklyData && <CompactWeeklyStatCard data={weeklyData} />}

          <CompactAddWorkout
            workout={workout}
            setWorkout={setWorkout}
            addNewWorkout={addNewWorkout}
            buttonLoading={buttonLoading}
          />
        </FlexWrap>

        <Section>
          <Title>Selected Day Workouts</Title>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <CardWrapper>
              {todaysWorkouts.map((workout) => (
                <WorkoutCard key={workout._id} workout={workout} />
              ))}
            </CardWrapper>
          )}
        </Section>
      </Wrapper>
    </Container>
  );
};

export default Workouts;
