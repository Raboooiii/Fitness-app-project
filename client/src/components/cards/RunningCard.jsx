// src/components/cards/RunningCard.jsx
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  flex: 1;
  min-width: 200px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.text_primary + 20};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 1px 6px 20px 0px ${({ theme }) => theme.primary + 15};
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Value = styled.div`
  font-weight: 600;
  font-size: 32px;
  display: flex;
  align-items: end;
  gap: 8px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const Unit = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

const Icon = styled.div`
  font-size: 24px;
  margin-top: 8px;
`;

const RunningCard = ({ title, value, unit, icon }) => {
  return (
    <Card>
      <Title>{title}</Title>
      <Value>
        {value}
        <Unit>{unit}</Unit>
      </Value>
      <Icon>{icon}</Icon>
    </Card>
  );
};

export default RunningCard;