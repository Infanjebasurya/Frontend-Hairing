// src/components/Layout/JobInterview/CandidateInterview/CandidateDetailsPage/components/InterviewRounds/InterviewRounds.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Badge,
  Chip,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating as MuiRating,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon,
  CalendarToday as CalendarIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Edit as EditIcon,
  Feedback as FeedbackIcon,
  Star as StarIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  FormatListBulleted as FormatListBulletedIcon,
  TextFields as TextFieldsIcon,
  ConnectWithoutContact as ConnectWithoutContactIcon,
  AutoAwesome as AutoAwesomeIcon,
  Add as AddIcon,
  DeleteOutline as DeleteOutlineIcon,
} from '@mui/icons-material';

const emptyRoundForm = (roundNumber = 1) => ({
  roundName: '',
  roundNumber,
  interviewer: '',
  isSelfAssigned: false,
  status: 'Scheduled',
  scheduledAt: '',
  roundFeedback: 'not yet scheduled',
  rating: 0,
  questionsJson: '[]',
});

const toDateTimeInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

const InterviewRounds = ({
  rounds = [],
  expandedRound,
  onExpandRound,
  onSubmitFeedback,
  candidateId,
  onCreateRound,
  scheduleRoundRequest = 0,
  onGetRound,
  onUpdateRound,
  onDeleteRound,
}) => {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [newFeedback, setNewFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [roundDialogOpen, setRoundDialogOpen] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [roundForm, setRoundForm] = useState(emptyRoundForm(1));
  const [roundSaving, setRoundSaving] = useState(false);
  const [roundError, setRoundError] = useState('');
  const [roundToDelete, setRoundToDelete] = useState(null);
  const [roundDeleting, setRoundDeleting] = useState(false);

  useEffect(() => {
    if (scheduleRoundRequest > 0) {
      const nextRoundNumber = rounds.reduce(
        (max, round) => Math.max(max, Number(round.roundNumber) || 0),
        0
      ) + 1;
      setEditingRound(null);
      setRoundForm(emptyRoundForm(nextRoundNumber));
      setRoundError('');
      setRoundDialogOpen(true);
    }
  // Intentionally trigger only when the parent requests scheduling. Including
  // `rounds` would reopen the dialog after every successful refresh.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleRoundRequest]);

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'success',
      'Scheduled': 'primary',
      'Pending Feedback': 'warning',
      'Cancelled': 'error',
      'Rescheduled': 'info',
      'Did Not Attend': 'default',
    };
    return colors[status] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      'Completed': <CheckCircleIcon />,
      'Scheduled': <ScheduleIcon />,
      'Pending Feedback': <AccessTimeIcon />,
      'Cancelled': <CancelIcon />,
      'Rescheduled': <CalendarIcon />,
    };
    return icons[status] || <HourglassEmptyIcon />;
  };

  // Get question icon
  const getQuestionIcon = (type) => {
    const icons = {
      'theory': <PsychologyIcon color="primary" fontSize="small" />,
      'programming': <CodeIcon color="primary" fontSize="small" />,
      'single': <FormatListBulletedIcon color="primary" fontSize="small" />,
      'multiple': <FormatListBulletedIcon color="primary" fontSize="small" />,
      'fill': <TextFieldsIcon color="primary" fontSize="small" />,
      'matching': <ConnectWithoutContactIcon color="primary" fontSize="small" />,
      'practical': <AutoAwesomeIcon color="primary" fontSize="small" />,
    };
    return icons[type] || <FormatListBulletedIcon color="primary" fontSize="small" />;
  };

  // Render question content based on type
  const renderQuestionContent = (question, roundStatus) => {
    // Don't show content for these statuses
    if (['Scheduled', 'Rescheduled', 'Cancelled', 'Did Not Attend'].includes(roundStatus)) {
      return (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <AccessTimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            No interview content available for {roundStatus.toLowerCase()} rounds
          </Typography>
        </Box>
      );
    }

    switch (question.type) {
      case 'theory':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Theory Answer
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {question.answer || 'No answer provided yet'}
              </Typography>
            </Paper>
          </Box>
        );

      case 'programming':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Programming Solution ({question.language || 'Code'})
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'rgb(30, 30, 30)', borderRadius: 1, fontFamily: 'monospace', overflow: 'auto' }}>
              <Typography variant="body2" color="common.white" sx={{ whiteSpace: 'pre-line' }}>
                {question.answer || '// No solution provided yet'}
              </Typography>
            </Paper>
          </Box>
        );

      case 'single':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Single Choice Answer
            </Typography>
            <RadioGroup value={question.answer || ''}>
              {question.options?.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  value={option}
                  control={<Radio />}
                  label={option}
                  disabled
                />
              ))}
            </RadioGroup>
          </Box>
        );

      case 'multiple':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Multiple Choice Answer
            </Typography>
            <FormGroup>
              {question.options?.map((option, idx) => (
                <FormControlLabel
                  key={idx}
                  control={
                    <Checkbox
                      checked={question.answer?.includes(option) || false}
                      disabled
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          </Box>
        );

      case 'fill':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Fill in the Blanks
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {question.answer || 'No answer provided'}
              </Typography>
            </Paper>
          </Box>
        );

      case 'matching':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Matching Type Answer
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {question.answer || 'No matching provided'}
              </Typography>
            </Paper>
          </Box>
        );

      case 'practical':
        return (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Practical/Scenario-based Answer
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                {question.answer || 'No practical answer provided'}
              </Typography>
            </Paper>
          </Box>
        );

      default:
        return (
          <Paper sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2">{question.answer || 'No answer provided'}</Typography>
          </Paper>
        );
    }
  };

  // Handle open feedback dialog
  const handleOpenFeedbackDialog = (round) => {
    setSelectedRound(round);
    setNewFeedback(round.feedback || '');
    setRating(round.rating || 0);
    setFeedbackDialogOpen(true);
  };

  // Handle submit feedback
  const handleSubmitFeedback = () => {
    if (selectedRound && onSubmitFeedback) {
      onSubmitFeedback({
        ...selectedRound,
        feedback: newFeedback,
        rating: rating
      });
    }
    setFeedbackDialogOpen(false);
    setNewFeedback('');
    setRating(0);
    setSelectedRound(null);
  };

  // Check if round should show questions
  const shouldShowQuestions = (roundStatus) => {
    return ['Pending Feedback', 'Completed'].includes(roundStatus);
  };

  // Check if round should show feedback
  const shouldShowFeedback = (roundStatus) => {
    return roundStatus === 'Completed';
  };

  const openCreateRound = () => {
    const nextRoundNumber = rounds.reduce((max, round) => Math.max(max, Number(round.roundNumber) || 0), 0) + 1;
    setEditingRound(null);
    setRoundForm(emptyRoundForm(nextRoundNumber));
    setRoundError('');
    setRoundDialogOpen(true);
  };

  const openEditRound = async (round) => {
    let selectedRound = round;
    try {
      if (onGetRound && round.id) selectedRound = await onGetRound(round.id);
    } catch (error) {
      setRoundError(error.message || 'Unable to load interview round.');
      return;
    }

    setEditingRound(selectedRound);
    setRoundForm({
      roundName: selectedRound.roundName || '',
      roundNumber: selectedRound.roundNumber || 1,
      interviewer: selectedRound.interviewer || '',
      isSelfAssigned: Boolean(selectedRound.isSelfAssigned),
      status: selectedRound.status || 'Pending Feedback',
      scheduledAt: toDateTimeInput(selectedRound.scheduledAt),
      roundFeedback: selectedRound.feedback || selectedRound.notes || '',
      rating: selectedRound.rating || 0,
      questionsJson: JSON.stringify(selectedRound.rawQuestionsSet || [], null, 2),
    });
    setRoundError('');
    setRoundDialogOpen(true);
  };

  const handleRoundFieldChange = (event) => {
    const { name, value } = event.target;
    setRoundForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoundSubmit = async () => {
    let questionsSet;
    try {
      questionsSet = roundForm.questionsJson.trim() ? JSON.parse(roundForm.questionsJson) : [];
    } catch {
      setRoundError('Questions JSON is not valid. Please provide a valid JSON array or object.');
      return;
    }

    if (!Array.isArray(questionsSet)) questionsSet = [questionsSet];
    if (!roundForm.roundName.trim()) {
      setRoundError('Round name is required.');
      return;
    }

    if (!roundForm.isSelfAssigned && !/^[a-f\d]{24}$/i.test(String(roundForm.interviewer).trim())) {
      setRoundError('Enter a valid 24-character interviewer ID, or select Self assigned.');
      return;
    }

    if (!questionsSet.length) {
      setRoundError('At least one question is required in Questions Set JSON.');
      return;
    }

    const invalidQuestion = questionsSet.find((question) => {
      if (!question || typeof question !== 'object' || !question.questionType) return true;
      const questionData = question[question.questionType];
      return !questionData || typeof questionData !== 'object' || !String(questionData.question || '').trim();
    });
    if (invalidQuestion) {
      setRoundError('Questions Set JSON must contain a valid questionType and question text.');
      return;
    }

    const payload = {
      ...roundForm,
      candidateId,
      roundNumber: Number(roundForm.roundNumber) || 1,
      rating: Number(roundForm.rating) || 0,
      scheduledAt: roundForm.scheduledAt ? new Date(roundForm.scheduledAt).toISOString() : null,
      questionsSet,
    };

    try {
      setRoundSaving(true);
      if (editingRound) {
        await onUpdateRound(editingRound.id, payload);
      } else {
        await onCreateRound(payload);
      }
      setRoundDialogOpen(false);
    } catch (error) {
      setRoundError(error.message || 'Unable to save interview round.');
    } finally {
      setRoundSaving(false);
    }
  };

  const handleDeleteRound = async () => {
    if (!roundToDelete) return;
    try {
      setRoundDeleting(true);
      await onDeleteRound(roundToDelete.id);
      setRoundToDelete(null);
    } catch (error) {
      setRoundError(error.message || 'Unable to delete interview round.');
    } finally {
      setRoundDeleting(false);
    }
  };

  return (
    <>
      <Paper
        sx={{
          p: { xs: 2.5, sm: 3 },
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 18px 48px rgba(0,0,0,0.22)'
            : '0 18px 48px rgba(15,23,42,0.08)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h5" fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssessmentIcon />
            Interview Rounds
          </Typography>
          {onCreateRound && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreateRound}>
              Add Round
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {rounds.map((round) => (
            <Accordion
              key={round.roundNumber}
              expanded={expandedRound === round.roundNumber}
              onChange={() => onExpandRound(expandedRound === round.roundNumber ? null : round.roundNumber)}
              sx={{
                borderRadius: '16px !important',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: 'background.paper',
                  '&.Mui-expanded': {
                    bgcolor: 'action.hover',
                  },
                  minHeight: 72,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', flexWrap: 'wrap' }}>
                  <Badge
                    badgeContent={round.roundNumber}
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: getStatusColor(round.status) + '.main',
                      }}
                    >
                      {getStatusIcon(round.status)}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flex: 1, minWidth: { xs: '200px', sm: 'auto' } }}>
                    <Typography variant="subtitle1" fontWeight="600">
                      {round.roundName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {round.date} • {round.duration} • Interviewer: {round.interviewer}
                    </Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(round.status)}
                    label={round.status}
                    color={getStatusColor(round.status)}
                    size="small"
                    sx={{ fontWeight: 500, mx: { xs: 0, sm: 1 } }}
                  />
                  {round.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                      <Typography variant="body2" fontWeight="600">
                        {round.rating}/5
                      </Typography>
                    </Box>
                  )}
                  {(onUpdateRound || onDeleteRound) && (
                    <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(event) => event.stopPropagation()}>
                      {onUpdateRound && (
                        <Button size="small" startIcon={<EditIcon />} onClick={() => openEditRound(round)}>
                          Edit
                        </Button>
                      )}
                      {onDeleteRound && (
                        <Button size="small" color="error" startIcon={<DeleteOutlineIcon />} onClick={() => setRoundToDelete(round)}>
                          Delete
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 2, bgcolor: 'background.default' }}>
                {/* Round Notes */}
                {round.notes && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EditIcon fontSize="small" />
                      Interviewer Notes
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2">{round.notes}</Typography>
                    </Paper>
                  </Box>
                )}

                {/* Questions Section - Only show for Pending Feedback and Completed */}
                {shouldShowQuestions(round.status) && round.questions?.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <AssessmentIcon fontSize="small" />
                      Interview Questions & Answers
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {round.questions.map((question, qIndex) => (
                        <Card key={question.id || qIndex} variant="outlined" sx={{ borderRadius: 3 }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              {getQuestionIcon(question.type)}
                              <Typography variant="subtitle2" fontWeight="600">
                                Question {qIndex + 1}
                              </Typography>
                              <Chip 
                                label={question.type.charAt(0).toUpperCase() + question.type.slice(1)} 
                                size="small" 
                                variant="outlined"
                              />
                            </Box>
                            
                            <Typography variant="body1" paragraph sx={{ fontWeight: 500, color: 'text.primary', mb: 2 }}>
                              {question.question}
                            </Typography>
                            
                            {renderQuestionContent(question, round.status)}
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Feedback Section - Only show for Completed */}
                {shouldShowFeedback(round.status) && round.feedback && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FeedbackIcon fontSize="small" />
                      Interviewer Feedback
                    </Typography>
                    <Alert severity="success" sx={{ borderRadius: 1 }}>
                      <Typography variant="body2">{round.feedback}</Typography>
                      {round.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <StarIcon sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
                          <Typography variant="body2" fontWeight="600">
                            Rating: {round.rating}/5
                          </Typography>
                        </Box>
                      )}
                    </Alert>
                  </Box>
                )}

                {/* No Content Message for certain statuses */}
                {['Scheduled', 'Rescheduled', 'Cancelled', 'Did Not Attend'].includes(round.status) && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <AccessTimeIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      No interview content available for {round.status.toLowerCase()} rounds
                    </Typography>
                  </Box>
                )}

                {/* Pending Feedback Action */}
                {round.status === 'Pending Feedback' && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button
                      variant="contained"
                      startIcon={<FeedbackIcon />}
                      onClick={() => handleOpenFeedbackDialog(round)}
                      fullWidth
                    >
                      Submit Feedback for Round {round.roundNumber}
                    </Button>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>

      <Dialog open={roundDialogOpen} onClose={() => !roundSaving && setRoundDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingRound ? 'Update Interview Round' : 'Add Interview Round'}</DialogTitle>
        <DialogContent dividers>
          {roundError && <Alert severity="error" sx={{ mb: 2 }}>{roundError}</Alert>}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 1 }}>
            <TextField label="Round Name" name="roundName" value={roundForm.roundName} onChange={handleRoundFieldChange} required />
            <TextField label="Round Number" name="roundNumber" type="number" value={roundForm.roundNumber} onChange={handleRoundFieldChange} required />
            <TextField label="Interviewer ID" name="interviewer" value={roundForm.interviewer} onChange={handleRoundFieldChange} helperText="Use the backend interviewer ID" />
            <TextField select label="Status" name="status" value={roundForm.status} onChange={handleRoundFieldChange}>
              {['Scheduled', 'Pending Feedback', 'Completed', 'Cancelled', 'Rescheduled', 'Did Not Attend'].map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <TextField label="Scheduled At" name="scheduledAt" type="datetime-local" value={roundForm.scheduledAt} onChange={handleRoundFieldChange} InputLabelProps={{ shrink: true }} />
            <TextField label="Rating" name="rating" type="number" inputProps={{ min: 0, max: 5, step: 0.5 }} value={roundForm.rating} onChange={handleRoundFieldChange} />
            <FormControlLabel
              control={<Checkbox checked={roundForm.isSelfAssigned} onChange={(event) => setRoundForm((prev) => ({ ...prev, isSelfAssigned: event.target.checked }))} />}
              label="Self assigned"
            />
            <TextField label="Round Feedback" name="roundFeedback" value={roundForm.roundFeedback} onChange={handleRoundFieldChange} multiline minRows={2} />
          </Box>
          <TextField
            label="Questions Set JSON"
            value={roundForm.questionsJson}
            onChange={(event) => setRoundForm((prev) => ({ ...prev, questionsJson: event.target.value }))}
            multiline
            minRows={10}
            fullWidth
            sx={{ mt: 2 }}
            helperText="Paste a JSON array using the candidate-rounds questionsSet format."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoundDialogOpen(false)} disabled={roundSaving}>Cancel</Button>
          <Button onClick={handleRoundSubmit} variant="contained" disabled={roundSaving}>
            {roundSaving ? 'Saving...' : editingRound ? 'Update Round' : 'Save Round'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(roundToDelete)} onClose={() => !roundDeleting && setRoundToDelete(null)}>
        <DialogTitle>Delete interview round?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This will permanently remove {roundToDelete?.roundName || 'this round'} and its questions from the candidate.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoundToDelete(null)} disabled={roundDeleting}>Cancel</Button>
          <Button onClick={handleDeleteRound} variant="contained" color="error" disabled={roundDeleting}>
            {roundDeleting ? 'Deleting...' : 'Delete Round'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onClose={() => setFeedbackDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Submit Feedback for {selectedRound?.roundName}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Add your feedback and ratings for this interview round.
          </Typography>
          
          <TextField
            autoFocus
            margin="dense"
            label="Feedback Summary"
            fullWidth
            multiline
            rows={4}
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            placeholder="Enter detailed feedback about the candidate's performance..."
            sx={{ mb: 3 }}
          />
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Overall Round Rating
            </Typography>
            <MuiRating 
              value={rating} 
              onChange={(_, value) => setRating(value)} 
              size="large" 
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitFeedback} variant="contained">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

InterviewRounds.defaultProps = {
  rounds: [],
  expandedRound: null,
  onExpandRound: () => {},
  onSubmitFeedback: () => {},
};

export default InterviewRounds;
