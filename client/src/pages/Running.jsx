import React, { useState } from "react";
import styled from "styled-components";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


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
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 0px 16px;
`;

const SyncButton = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  align-self: flex-start;

  &:hover {
    background-color: ${({ theme }) => theme.primaryDark};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.text_secondary};
    cursor: not-allowed;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const ProgressCard = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 10px;
  padding: 20px;
  width: 220px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProgressCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    ${({ color }) => color} ${({ progress }) => progress * 3.6}deg,
    ${({ theme }) => theme.bgLight} 0deg
  );
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    width: 90px;
    height: 90px;
    background: ${({ theme }) => theme.card};
    border-radius: 50%;
  }
`;

const ProgressText = styled.div`
  position: relative;
  z-index: 1;
  font-size: 24px;
  font-weight: bold;
  color: ${({ color }) => color};
`;

const MetricTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 5px;
  text-transform: capitalize;
`;

const MetricValue = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 15px;
`;

const TargetInput = styled.input`
  width: 80px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  text-align: center;
  margin-top: 5px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const LastUpdated = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 10px;
  text-align: center;
  padding: 10px;
  background: ${({ theme }) => theme.bgLight};
  border-radius: 5px;
`;

const DirectoryInfo = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 10px;
  text-align: center;
`;

const ChartContainer = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 350px;
  width: 100%;
`;

const ChartTitle = styled.h2`
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 20px;
  text-align: center;
`;

const Running = () => {
  const [stepData, setStepData] = useState(() => {
    const savedData = localStorage.getItem("stepData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        ...parsedData,
        weeklyData: parsedData.weeklyData || []
      };
    }
    return {
      steps: 0,
      distance: 0,
      calories: 0,
      lastUpdated: "No data yet",
      weeklyData: []
    };
  });

  const [targets, setTargets] = useState(() => {
    const savedTargets = localStorage.getItem("stepTargets");
    return savedTargets
      ? JSON.parse(savedTargets)
      : {
          steps: 10000,
          distance: 5,
          calories: 500,
        };
  });

  const [loading, setLoading] = useState(false);
  const [directoryHandle, setDirectoryHandle] = useState(null);
  const [directoryPath, setDirectoryPath] = useState("");

  const progressColors = {
    steps: "#4CAF50",
    distance: "#2196F3",
    calories: "#FF5722"
  };

  const requestDirectoryAccess = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      setDirectoryHandle(handle);
      
      if (handle.name && handle.kind === 'directory') {
        setDirectoryPath(handle.name);
      }
      
      return handle;
    } catch (err) {
      console.error("Error accessing directory:", err);
      alert("Directory access was denied. Please try again.");
      return null;
    }
  };

  const getLatestFile = async (dirHandle) => {
    const files = [];
    
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && 
          (entry.name.endsWith('.csv') || entry.name.endsWith('.xlsx'))) {
        const file = await entry.getFile();
        files.push({
          handle: entry,
          file,
          name: entry.name,
          lastModified: file.lastModified
        });
      }
    }
    
    if (files.length === 0) {
      throw new Error("No CSV or Excel files found in the directory");
    }
    
    files.sort((a, b) => b.lastModified - a.lastModified);
    
    return files[0].file;
  };

  const processFile = async (file) => {
    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
        header: ["Year", "Month", "Day", "Steps", "Km", "kcal", "Duration"],
        range: 0
      }).filter(row => row.Year && !isNaN(row.Steps));

      // Get only steps data for weekly analysis
      const weeklyData = jsonData.slice(-7).map(entry => ({
        date: `${String(entry.Month).padStart(2, '0')}/${String(entry.Day).padStart(2, '0')}`,
        steps: Number(entry.Steps)
      }));

      const latestEntry = jsonData[jsonData.length - 1];
      if (!latestEntry?.Steps) throw new Error("No valid step data found");

      const dateStr = `${latestEntry.Year}-${String(latestEntry.Month).padStart(2, '0')}-${String(latestEntry.Day).padStart(2, '0')}`;
      
      const newData = {
        steps: Number(latestEntry.Steps),
        distance: Number(latestEntry.Km || 0),
        calories: Number(latestEntry.kcal || 0),
        lastUpdated: dateStr,
        weeklyData: weeklyData || []
      };

      setStepData(newData);
      localStorage.setItem("stepData", JSON.stringify(newData));
    } catch (err) {
      console.error("Processing failed:", err);
      alert(`Error: ${err.message}\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncClick = async () => {
    try {
      let handle = directoryHandle;
      if (!handle) {
        handle = await requestDirectoryAccess();
        if (!handle) return;
      }

      const latestFile = await getLatestFile(handle);
      await processFile(latestFile);
    } catch (err) {
      console.error("Error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await processFile(file);
  };

  const handleTargetChange = (type, value) => {
    const newTargets = {
      ...targets,
      [type]: Math.max(1, Number(value) || 0)
    };
    setTargets(newTargets);
    localStorage.setItem("stepTargets", JSON.stringify(newTargets));
  };

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const progress = {
    steps: calculateProgress(stepData.steps, targets.steps),
    distance: calculateProgress(stepData.distance, targets.distance),
    calories: calculateProgress(stepData.calories, targets.calories)
  };

  // Prepare data for the bar chart with only steps data
  const chartData = {
    labels: stepData.weeklyData.map(entry => entry.date),
    datasets: [
      {
        label: 'Steps',
        data: stepData.weeklyData.map(entry => entry.steps),
        backgroundColor: progressColors.steps,
        borderRadius: 4,
        barThickness: 20 // Make bars thinner
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff', // White legend text
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' // Light grid lines
        },
        ticks: {
          color: '#ffffff' // White axis text
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' // Light grid lines
        },
        ticks: {
          color: '#ffffff', // White axis text
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  return (
    <Container>
      <Wrapper>
        <h1>Step Tracking</h1>
        
        <SyncButton 
          onClick={handleSyncClick}
          disabled={loading}
        >
          {loading ? "Processing..." : "Sync Now"}
        </SyncButton>

        {directoryPath && (
          <DirectoryInfo>
            Currently watching: {directoryPath}
          </DirectoryInfo>
        )}

        <HiddenFileInput
          id="fileInput"
          type="file"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileUpload}
        />

        <CardWrapper>
          {['steps', 'distance', 'calories'].map((type) => (
            <ProgressCard key={type}>
              <MetricTitle>
                {type === 'kcal' ? 'Calories' : type}
              </MetricTitle>
              <MetricValue>
                {stepData[type].toLocaleString()} / {targets[type].toLocaleString()}
              </MetricValue>
              
              <ProgressCircle 
                progress={progress[type]} 
                color={progressColors[type]}
              >
                <ProgressText color={progressColors[type]}>
                  {progress[type]}%
                </ProgressText>
              </ProgressCircle>
              
              <TargetInput
                type="number"
                value={targets[type]}
                onChange={(e) => handleTargetChange(type, e.target.value)}
                min="1"
              />
            </ProgressCard>
          ))}
        </CardWrapper>
        
        <LastUpdated>
          Last updated: {stepData.lastUpdated}
        </LastUpdated>

        {stepData.weeklyData.length > 0 && (
          <ChartContainer>
            <ChartTitle>Weekly Steps</ChartTitle>
            <div style={{ height: '280px' }}>
              <Bar 
                data={chartData} 
                options={chartOptions}
                height={280}
              />
            </div>
          </ChartContainer>
        )}
      </Wrapper>
    </Container>
  );
};

export default Running;