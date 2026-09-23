// src/components/Layout/JobInterview/CandidateInterview/CandidateDetailsPage/CandidateService.js
import {
  getOrgCandidates,
} from '../../../../../services/orgCandidateService';

// Kept for the legacy resume/cover-letter demo helpers below. Candidate data
// itself is loaded only through /org-candidates via the shared API client.
const API_BASE_URL = 'https://discretion-innovations-intl-gas.trycloudflare.com/api';

// Or use relative path if your API is on same origin:
// const API_BASE_URL = '/api';

// Or use window location if you want dynamic base URL:
// const API_BASE_URL = window.location.origin + '/api';

export const getCandidateById = async (candidateId) => {
  try {
    // This deployment does not expose GET /org-candidates/:id (it returns
    // 404), while the collection endpoint is available. Resolve the real
    // record from the collection so opening details does not generate a
    // failed request first.
    const collectionResult = await getOrgCandidates({ limit: 1000, page: 0 });
    if (collectionResult.success) {
      const candidate = collectionResult.data.find((item) =>
        String(item.id) === String(candidateId) || String(item.candidateId) === String(candidateId)
      );
      if (candidate) return candidate;
    }

    // Keep a useful error if the candidate is not present in the collection.
    // Do not call the known-missing single-candidate route as a fallback.
    throw new Error(collectionResult.error || `Candidate ${candidateId} was not found`);
  } catch (error) {
    console.error('Error fetching organization candidate:', error);
    throw error;
  }
};

export const downloadResume = async (candidateId) => {
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || 'demo-token';
    
    // For demo purposes, create a mock PDF
    if (!API_BASE_URL.includes('localhost:3000')) {
      console.log('Mock download: Resume for candidate', candidateId);
      // Create a mock PDF blob
      const mockContent = `Resume for Candidate ${candidateId}\n\nName: Alice Johnson\nPosition: Senior Software Engineer`;
      const blob = new Blob([mockContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${candidateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true, filename: `resume_${candidateId}.pdf` };
    }
    
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/resume`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download resume: ${response.status}`);
    }
    
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `resume_${candidateId}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error downloading resume:', error);
    
    // Fallback: create a mock download
    const mockContent = `Resume for Candidate ${candidateId}`;
    const blob = new Blob([mockContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${candidateId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true, filename: `resume_${candidateId}.txt` };
  }
};

export const downloadCoverLetter = async (candidateId) => {
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || 'demo-token';
    
    // For demo purposes
    if (!API_BASE_URL.includes('localhost:3000')) {
      console.log('Mock download: Cover letter for candidate', candidateId);
      const mockContent = `Cover Letter for Candidate ${candidateId}\n\nDear Hiring Manager,\n\nI am writing to apply...`;
      const blob = new Blob([mockContent], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover_letter_${candidateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true, filename: `cover_letter_${candidateId}.pdf` };
    }
    
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/cover-letter`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download cover letter: ${response.status}`);
    }
    
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `cover_letter_${candidateId}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Error downloading cover letter:', error);
    
    // Fallback mock download
    const mockContent = `Cover Letter for Candidate ${candidateId}`;
    const blob = new Blob([mockContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover_letter_${candidateId}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { success: true, filename: `cover_letter_${candidateId}.txt` };
  }
};

export const submitFeedback = async (candidateId, roundId, feedback, rating) => {
  try {
    const token = localStorage.getItem('authToken') || localStorage.getItem('token') || 'demo-token';
    
    // For demo, just log and return success
    if (!API_BASE_URL.includes('localhost:3000')) {
      console.log('Mock feedback submission:', { candidateId, roundId, feedback, rating });
      return {
        success: true,
        message: 'Feedback submitted successfully (demo mode)',
        submittedAt: new Date().toISOString()
      };
    }
    
    const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/rounds/${roundId}/feedback`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        feedback, 
        rating,
        submittedAt: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to submit feedback: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting feedback:', error);
    
    // Return mock success for demo
    return {
      success: true,
      message: 'Feedback submitted (demo mode due to error)',
      submittedAt: new Date().toISOString()
    };
  }
};

// Mock data for development/testing
export const getMockCandidateData = (candidateId = 'candidate_001') => {
  return {
    id: candidateId,
    candidate_id: candidateId.toUpperCase(),
    job_id: 'JOB001',
    name: 'Alice Johnson',
    email: 'alicejohnson@example.com',
    phone: '+1 (555) 123-4567',
    applied_role: 'Senior Software Engineer',
    status: 'In Progress',
    experience: '8 years',
    location: 'San Francisco, CA',
    source: 'LinkedIn',
    availability: 'Immediate',
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'TypeScript', 'MongoDB'],
    
    attachments: {
      resume: '/api/resume/' + candidateId + '.pdf',
      cover_letter: '/api/cover-letter/' + candidateId + '.pdf'
    },
    
    internal_questions: [
      {
        id: 'iq1',
        question: "Tell me about a challenging project you've worked on and how you overcome obstacles.",
        answer: "I led a team to migrate our legacy monolithic system to microservices architecture. The main challenges were...",
        interviewer_notes: "Candidate demonstrated excellent problem-solving skills and good collaboration approach.",
        rating: 4
      },
      {
        id: 'iq2',
        question: "How do you handle conflicting priorities?",
        answer: "I use a priority matrix to categorize tasks based on urgency and importance. I also maintain clear communication with stakeholders...",
        interviewer_notes: "Provided a structured approach with good real-world examples.",
        rating: 5
      },
      {
        id: 'iq3',
        question: "Describe your experience with agile methodologies.",
        answer: "I have 5 years of experience working in Scrum teams. I've served as both developer and scrum master...",
        interviewer_notes: "Strong agile background, understands ceremonies well.",
        rating: 4
      }
    ],
    
    interview_rounds: [
      {
        round_number: 1,
        round_name: "Initial Screening",
        date: "2023-10-20",
        duration: "30 mins",
        interviewer_name: "John Doe",
        status: "Completed",
        rating: 4.5,
        interviewer_notes: "Good cultural fit, strong communication skills, enthusiastic about the role.",
        feedback: "Candidate shows excellent communication skills and is a good cultural fit for our team. Recommended for next round.",
        questions: [
          {
            id: 'q1-1',
            type: 'theory',
            question: "Why are you interested in this position?",
            answer: "I'm excited about the opportunity to work on your scaling challenges and contribute to the microservices transition...",
            rating: 5
          }
        ]
      },
      {
        round_number: 2,
        round_name: "Technical Interview - Round 2",
        date: "2023-10-26",
        duration: "60 mins",
        interviewer_name: "Jane Smith",
        status: "Pending Feedback",
        questions: [
          {
            id: 'q2-1',
            type: 'theory',
            question: "Explain the difference between SQL and NoSQL databases and when you would use each.",
            answer: "SQL databases are relational databases with structured schemas, ideal for complex queries and transactions. NoSQL databases are non-relational, offering flexibility and scalability for unstructured data. Use SQL for financial systems, NoSQL for real-time analytics.",
            rating: 5
          },
          {
            id: 'q2-2',
            type: 'programming',
            question: "Write a function in Python to reverse a linked list.",
            answer: "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\ndef reverse_linked_list(head):\n    prev = None\n    current = head\n    while current:\n        next_node = current.next\n        current.next = prev\n        prev = current\n        current = next_node\n    return prev\n\n# Time Complexity: O(n)\n# Space Complexity: O(1)",
            language: 'Python',
            rating: 4
          },
          {
            id: 'q2-3',
            type: 'single',
            question: "Which design pattern is most appropriate for creating objects without specifying the exact class?",
            options: [
              "Singleton Pattern",
              "Factory Pattern", 
              "Observer Pattern",
              "Adapter Pattern"
            ],
            answer: "Factory Pattern",
            rating: 5
          },
          {
            id: 'q2-4',
            type: 'multiple',
            question: "Which of the following are advantages of using React?",
            options: [
              "Virtual DOM for performance",
              "Component-based architecture",
              "Built-in state management",
              "Strong typing system",
              "Large ecosystem and community"
            ],
            answer: ["Virtual DOM for performance", "Component-based architecture", "Large ecosystem and community"],
            rating: 4
          }
        ]
      },
      {
        round_number: 3,
        round_name: "Hiring Manager Interview",
        date: "2023-11-02",
        duration: "45 mins",
        interviewer_name: "Mark Davis",
        status: "Scheduled",
        questions: [
          {
            id: 'q3-1',
            type: 'theory',
            question: "Where do you see yourself in five years?",
            answer: "",
            rating: null
          },
          {
            id: 'q3-2',
            type: 'theory',
            question: "What motivates you in a professional setting?",
            answer: "",
            rating: null
          },
          {
            id: 'q3-3',
            type: 'theory',
            question: "Describe your ideal team environment.",
            answer: "",
            rating: null
          }
        ]
      },
      {
        round_number: 4,
        round_name: "System Design Interview",
        date: "2023-11-09",
        duration: "90 mins",
        interviewer_name: "Sarah Chen",
        status: "Rescheduled",
        questions: []
      }
    ]
  };
};

// Simple version without process.env checks
export const getCandidateByIdSimple = async (candidateId) => {
  // Always return mock data for now
  return getMockCandidateData(candidateId);
};
