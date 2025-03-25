// src/components/SuccessModal.jsx
import React from 'react';
import styled from 'styled-components';
import { CheckCircle } from '@mui/icons-material';
import Button from './Button';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid ${({ theme }) => theme.primary + 20};
`;

const IconWrapper = styled.div`
  color: ${({ theme }) => theme.green};
  font-size: 72px;
  margin-bottom: 16px;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.text_primary};
  margin-bottom: 16px;
  font-size: 24px;
`;

const Message = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  margin-bottom: 24px;
  font-size: 16px;
`;

const SuccessModal = ({ message, onClose }) => {
  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <IconWrapper>
          <CheckCircle fontSize="inherit" />
        </IconWrapper>
        <Title>Success!</Title>
        <Message>{message}</Message>
        <Button 
          text="Continue" 
          onClick={onClose}
          full
          small
        />
      </ModalContent>
    </ModalBackdrop>
  );
};

export default SuccessModal;