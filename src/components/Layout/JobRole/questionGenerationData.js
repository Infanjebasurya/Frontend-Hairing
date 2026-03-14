export const skillGroups = {
  hard: [
    'Computer Skills',
    'Tools',
    'Frameworks',
    'Programming Languages',
    'Databases',
    'Data Analysis',
    'Software Testing',
    'Cybersecurity',
    'Cloud Computing',
    'Accounting',
    'UI/UX Design',
    'Graphic Design',
    'Machine Operation',
    'Digital Marketing',
    'Foreign Languages',
  ],
  soft: [
    'Communication',
    'Teamwork',
    'Problem-Solving',
    'Time Management',
    'Leadership',
    'Adaptability',
    'Critical Thinking',
    'Creativity',
    'Emotional Intelligence',
    'Decision-Making',
    'Conflict Resolution',
    'Interpersonal Skills',
    'Work Ethic',
  ],
  transferable: [
    'Project Management',
    'Research',
    'Customer Service',
    'Organization',
    'Negotiation',
    'Planning',
    'Presentation Skills',
    'Strategic Thinking',
    'Budgeting',
  ],
};

export const questionTypeDefinitions = [
  {
    value: 'short_answer',
    label: 'Short Answer',
    summary: '1 to 3 line responses for quick competency checks.',
    settings: ['Answer length: 1 to 3 lines', 'Best for precise, role-specific prompts'],
  },
  {
    value: 'theory',
    label: 'Theory',
    summary: 'Conceptual, descriptive, behavioral, situational, hypothetical, and scenario-based prompts.',
    settings: ['Allows conceptual / descriptive / subjective / case-study prompts', 'Diagram support can be requested where needed'],
  },
  {
    value: 'single_correct',
    label: 'Single Correct Answer Type',
    summary: 'MCQ style with one correct option.',
    settings: ['Ask for number of options', 'Best for direct knowledge validation'],
  },
  {
    value: 'multiple_correct',
    label: 'Multiple Correct Answer Type',
    summary: 'Select all that apply with multiple valid choices.',
    settings: ['Ask for number of options', 'Useful for layered skill evaluation'],
  },
  {
    value: 'fill_blanks',
    label: 'Fill in the Blanks',
    summary: 'Structured blanks with controlled answer format.',
    settings: ['Choose number of blanks', 'Answer type can be text, number, formula, or word/phrase'],
  },
  {
    value: 'matching',
    label: 'Matching Type Questions',
    summary: 'Pairing terms, definitions, outputs, examples, symptoms, or answers.',
    settings: ['Choose number of pairs/items', 'Supports terms -> definitions, questions -> answers, functions -> outputs'],
  },
  {
    value: 'sequence',
    label: 'Sequence or Ordering',
    summary: 'Chronological, procedural, priority, or hierarchical ordering.',
    settings: ['Choose number of items', 'Supports chronological, procedural, priority, and hierarchical order'],
  },
  {
    value: 'practical',
    label: 'Practical',
    summary: 'Problem-solving, coding, or hands-on tasks.',
    settings: ['Supports coding and real-world tasks', 'Diagram support can be requested where needed'],
  },
];

export const questionTypeRequirementMap = {
  short_answer: {
    title: 'Short Answer Configuration',
    items: ['Answer length: 1 to 3 lines', 'Best for concise role-specific responses'],
  },
  theory: {
    title: 'Theory Configuration',
    items: [
      'Conceptual / descriptive / subjective',
      'Case study / behavioral / situational / hypothetical / scenario',
      'Diagram can be required where needed',
    ],
  },
  single_correct: {
    title: 'Single Correct Answer Configuration',
    items: ['Ask for number of options', 'Exactly one correct answer'],
  },
  multiple_correct: {
    title: 'Multiple Correct Answer Configuration',
    items: ['Ask for number of options', 'Multiple correct answers allowed'],
  },
  fill_blanks: {
    title: 'Fill in the Blanks Configuration',
    items: [
      'Choose number of blanks',
      'Answer type can be text, number, formula, or word/phrase',
    ],
  },
  matching: {
    title: 'Matching Type Configuration',
    items: [
      'Choose number of pairs/items',
      'Terms -> definitions',
      'Questions -> answers',
      'Symptoms -> diseases',
      'Functions -> outputs',
    ],
  },
  sequence: {
    title: 'Sequence or Ordering Configuration',
    items: [
      'Choose number of items',
      'Chronological / procedural / priority / hierarchical ordering',
    ],
  },
  practical: {
    title: 'Practical Configuration',
    items: [
      'Problem-solving / coding / hands-on task',
      'Diagram can be required where needed',
    ],
  },
};

export const questionBankRows = [
  {
    id: 'QB-1001',
    question: 'Design a reusable React component strategy for a dashboard with role-based access.',
    type: 'Theory',
    difficulty: 'Hard',
    topic: 'React Architecture',
    points: 20,
    updatedAt: 'Updated Mar 12, 2026',
  },
  {
    id: 'QB-1002',
    question: 'Which hook should be used to manage memoized derived values in a performance-heavy component tree?',
    type: 'Single Correct Answer Type',
    difficulty: 'Medium',
    topic: 'React Fundamentals',
    points: 10,
    updatedAt: 'Updated Mar 10, 2026',
  },
  {
    id: 'QB-1003',
    question: 'Match the testing level with the most appropriate example scenario.',
    type: 'Matching Type Questions',
    difficulty: 'Medium',
    topic: 'Software Testing',
    points: 15,
    updatedAt: 'Updated Mar 9, 2026',
  },
  {
    id: 'QB-1004',
    question: 'Arrange the deployment workflow for a cloud-hosted frontend application in the correct order.',
    type: 'Sequence or Ordering',
    difficulty: 'Easy',
    topic: 'Cloud Computing',
    points: 12,
    updatedAt: 'Updated Mar 8, 2026',
  },
  {
    id: 'QB-1005',
    question: 'Write a function to debounce a search input and explain why it improves UX in interviewer workflows.',
    type: 'Practical',
    difficulty: 'Hard',
    topic: 'Problem Solving',
    points: 30,
    updatedAt: 'Updated Mar 7, 2026',
  },
  {
    id: 'QB-1006',
    question: 'Fill in the missing API contract fields needed for secure candidate evaluation payloads.',
    type: 'Fill in the Blanks',
    difficulty: 'Medium',
    topic: 'API Design',
    points: 14,
    updatedAt: 'Updated Mar 5, 2026',
  },
];

export const generatedQuestions = [
  {
    id: 'GQ-1',
    type: 'Short Answer',
    difficulty: 'Easy',
    prompt: 'What is the purpose of a component prop contract in a reusable interview dashboard?',
    details: ['Expected answer length: 1 to 3 lines'],
  },
  {
    id: 'GQ-2',
    type: 'Theory',
    difficulty: 'Hard',
    prompt: 'Explain how you would design a scalable question generation workflow for multiple interviewer roles. Include a scenario where diagram support is required.',
    details: ['Mode: scenario / conceptual / descriptive'],
  },
  {
    id: 'GQ-3',
    type: 'Single Correct Answer Type',
    difficulty: 'Medium',
    prompt: 'Which data structure is most suitable for storing quick lookup question templates by skill?',
    options: ['Array', 'Set', 'Map', 'Queue'],
    details: ['Options configured: 4'],
  },
  {
    id: 'GQ-4',
    type: 'Multiple Correct Answer Type',
    difficulty: 'Medium',
    prompt: 'Select all categories that belong to hard skills in this workflow.',
    options: ['Frameworks', 'Communication', 'Databases', 'Cloud Computing'],
    details: ['Options configured: 4'],
  },
  {
    id: 'GQ-5',
    type: 'Fill in the Blanks',
    difficulty: 'Medium',
    prompt: 'A generated question payload should include ___, ___, and ___.',
    details: ['Blanks: 3', 'Answer type: word/phrase'],
  },
  {
    id: 'GQ-6',
    type: 'Matching Type Questions',
    difficulty: 'Medium',
    prompt: 'Match each content type with the best interview use case.',
    pairs: [
      ['Terms', 'Definitions'],
      ['Questions', 'Answers'],
      ['Functions', 'Outputs'],
    ],
    details: ['Pairs configured: 3'],
  },
  {
    id: 'GQ-7',
    type: 'Sequence or Ordering',
    difficulty: 'Easy',
    prompt: 'Order the interviewer workflow steps for generating and assigning questions.',
    orderedItems: ['Select job details', 'Choose question source', 'Configure type', 'Assign to job ID'],
    details: ['Ordering mode: procedural'],
  },
  {
    id: 'GQ-8',
    type: 'Practical',
    difficulty: 'Hard',
    prompt: 'Build a JSON question object for a frontend role that supports interviewer review, tagging, and assignment to a job ID.',
    details: ['Mode: coding / hands-on task', 'Diagram support: optional'],
  },
];

export const skillTopicOptions = ['All Topics', 'React Architecture', 'React Fundamentals', 'Software Testing', 'Cloud Computing', 'Problem Solving', 'API Design'];
export const difficultyOptions = ['All Levels', 'Easy', 'Medium', 'Hard'];
export const sortOptions = ['Most Recent', 'Highest Points', 'Difficulty'];
