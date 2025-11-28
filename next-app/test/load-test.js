import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp up to 10 users
    { duration: '1m', target: 10 },     // Stay at 10 users
    { duration: '30s', target: 20 },   // Ramp up to 20 users
    { duration: '1m', target: 20 },     // Stay at 20 users
    { duration: '30s', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.05'],    // Error rate should be less than 5%
    errors: ['rate<0.1'],
  },
};

const BASE_URL = __ENV.BACKEND_URL || 'https://open2e.vercel.app';

// Sample data for testing
const sampleQueries = [
  'machine learning',
  'artificial intelligence',
  'web development',
  'data structures',
  'algorithms',
];

const sampleAnswers = [
  'Machine learning is a subset of artificial intelligence that enables systems to learn from data.',
  'Artificial intelligence refers to the simulation of human intelligence in machines.',
  'Web development involves creating websites and web applications using various technologies.',
  'Data structures are ways of organizing and storing data in computer memory.',
  'Algorithms are step-by-step procedures for solving problems or performing tasks.',
];

const sampleQuestions = [
  'What is machine learning?',
  'Explain artificial intelligence.',
  'What is web development?',
  'Describe data structures.',
  'What are algorithms?',
];

const sampleRubrics = [
  'Should explain the concept clearly, mention key applications, and provide examples.',
  'Should cover definition, types, and real-world applications.',
  'Should discuss frontend, backend, and full-stack development.',
  'Should explain common data structures and their use cases.',
  'Should describe algorithm complexity and common algorithm types.',
];

// Test functions for each endpoint
function testArticleAPI() {
  const query = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
  const payload = JSON.stringify({ suggestedQuery: query });
  
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  
  const res = http.post(`${BASE_URL}/api/article/v1`, payload, params);
  
  const success = check(res, {
    'article API status is 200': (r) => r.status === 200,
    'article API has articles': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.articles !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  return res;
}

function testDetectAIAPI() {
  const answer = sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)];
  const payload = JSON.stringify({ answer });
  
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  
  const res = http.post(`${BASE_URL}/api/detectAI/v1`, payload, params);
  
  const success = check(res, {
    'detectAI API status is 200': (r) => r.status === 200,
    'detectAI API has overall_score': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.overall_score !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  return res;
}

function testChatAPI() {
  const conversation = [
    {
      role: 'user',
      content: 'Hello, can you help me with a question?',
    },
    {
      role: 'assistant',
      content: 'Of course! How can I assist you?',
    },
    {
      role: 'user',
      content: sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)],
    },
  ];
  
  const payload = JSON.stringify({ conversation });
  
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  
  const res = http.post(`${BASE_URL}/api/chat/v1`, payload, params);
  
  const success = check(res, {
    'chat API status is 200': (r) => r.status === 200,
    'chat API has reply': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.reply !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  return res;
}

function testEvaluateAPI() {
  const index = Math.floor(Math.random() * sampleQuestions.length);
  const payload = JSON.stringify({
    question: sampleQuestions[index],
    answer: sampleAnswers[index],
    rubric: sampleRubrics[index],
    totalScore: 10,
  });
  
  const params = {
    headers: { 'Content-Type': 'application/json' },
  };
  
  const res = http.post(`${BASE_URL}/api/evaluate/v1`, payload, params);
  
  const success = check(res, {
    'evaluate API status is 200': (r) => r.status === 200,
    'evaluate API has result': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.result !== undefined;
      } catch {
        return false;
      }
    },
  });
  
  errorRate.add(!success);
  return res;
}

// Main test function
export default function () {
  // Randomly test different endpoints to simulate real usage
  const endpoint = Math.random();
  
  if (endpoint < 0.25) {
    testArticleAPI();
  } else if (endpoint < 0.5) {
    testDetectAIAPI();
  } else if (endpoint < 0.75) {
    testChatAPI();
  } else {
    testEvaluateAPI();
  }
  
  sleep(1); // Wait 1 second between requests
}

// Setup function (optional - runs once before the test)
export function setup() {
  console.log(`Starting load test against: ${BASE_URL}`);
  return { baseUrl: BASE_URL };
}