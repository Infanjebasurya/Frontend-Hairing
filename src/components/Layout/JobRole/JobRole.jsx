import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { JobRoleProvider } from './JobRoleContext';
import FilterQuestionsCleanPage from './pages/FilterQuestionsCleanPage';
import OverviewPage from './pages/OverviewPage';
import QuestionBankPage from './pages/QuestionBankPage';
import QuestionSettingsPage from './pages/QuestionSettingsPage';
import QuestionTypePage from './pages/QuestionTypePage';
import ReviewQuestionsCleanPage from './pages/ReviewQuestionsCleanPage';

const JobRole = () => {
  return (
    <JobRoleProvider>
      <Routes>
        <Route index element={<OverviewPage />} />
        <Route path="settings" element={<QuestionSettingsPage />} />
        <Route path="types" element={<QuestionTypePage />} />
        <Route path="question-bank" element={<QuestionBankPage />} />
        <Route path="filter" element={<FilterQuestionsCleanPage />} />
        <Route path="review" element={<ReviewQuestionsCleanPage />} />
        <Route path="*" element={<Navigate to="/job-role" replace />} />
      </Routes>
    </JobRoleProvider>
  );
};

export default JobRole;
