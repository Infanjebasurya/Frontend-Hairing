// src/components/Layout/JobInterview/CandidateInterview/AddCandidatePage.jsx
// Thin page wrapper so the /candidate-interviews/add route can render AddCandidate
// as a full-screen dialog with sensible defaults.
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AddCandidate from './AddCandidate';
import { candidateInterviewsApi } from './candidateInterviewsApi';

const AddCandidatePage = () => {
  const navigate = useNavigate();

  return (
    <AddCandidate
      open
      onClose={() => navigate(-1)}
      onSuccess={(msg) => { console.info(msg); navigate(-1); }}
      onError={(msg)  => console.error(msg)}
      apiService={candidateInterviewsApi}
    />
  );
};

export default AddCandidatePage;
