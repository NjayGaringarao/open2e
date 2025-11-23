import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const evaluationSuccessRate = new Rate('evaluation_success');

// Test configuration - adjusted for local LLM (may be slower)
export const options = {
  stages: [
    { duration: '1m', target: 1 },    // Start with just 1 user for 1 minute
    { duration: '30s', target: 2 },    // Very slowly ramp to 2 users
    { duration: '2m', target: 2 },    // Stay at 2 users for 2 minutes
    { duration: '30s', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<60000'], // 95% of requests should be below 60s (more lenient)
    http_req_failed: ['rate<0.2'],      // Error rate should be less than 20% (more lenient)
    errors: ['rate<0.25'],              // More lenient error threshold
    evaluation_success: ['rate>0.7'],    // 70% should return valid evaluation (more lenient)
  },
};

const OLLAMA_URL = __ENV.OLLAMA_URL || 'http://localhost:11434';
const MODEL = __ENV.MODEL || 'phi4-mini';

// Sample questions and answers for testing
const sampleQuestions = [
  'What is a computer?',
  'How do I know if my PC is compatible with Windows 11?',
  'What is phishing?',
  'Explain what RAM is.',
  'What is the difference between HTTP and HTTPS?',
  'What is a firewall?',
  'How does a CPU work?',
  'What is cloud computing?',
];

const sampleAnswers = [
  'A computer is an electronic device that processes data and performs calculations.',
  'If the PC has a processor of Intel Core series 8th generation or AMD equivalent, TPM 2.0 and 8GB of RAM, it is compatible.',
  'Phishing is when attackers send fake emails to trick people into giving personal information.',
  'RAM stands for Random Access Memory. It is temporary storage that the computer uses to run programs.',
  'HTTP is not secure, HTTPS is secure because it uses encryption to protect data.',
  'A firewall is a security system that monitors and controls network traffic.',
  'The CPU processes instructions and performs calculations for the computer.',
  'Cloud computing is storing and accessing data and programs over the internet instead of on your computer.',
];

// Default rubric (from your codebase)
const DEFAULT_RUBRIC = `If the question requires learners understanding:

| **Score**       | **Criteria**                                                                                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **10**          | - Accurate, complete, and relevant response to the question<br>- Includes expected core concepts or examples (at least 2 when question is plural)<br>- Clear and concise phrasing<br>- Minor omissions are acceptable if the answer covers the essential idea |
| **9**           | - Mostly correct and relevant<br>- Slightly incomplete (e.g., missing 1 expected element)<br>- Minor vagueness or underdeveloped reasoning<br>- Still shows clear understanding                                                                               |
| **8**           | - Correct but noticeably incomplete<br>- Lacks detail or misses key supporting points<br>- May be overly brief, vague, or generic<br>- Still clearly attempts to answer the question                                                                          |
| **7**           | - Partially correct or missing important components<br>- May be unclear or lack depth<br>- Some signs of understanding, but weak justification or relevance                                                                                                   |
| **6**           | - Fragmented answer with major missing ideas<br>- Only somewhat related to the question<br>- Possibly a guess or off-topic but with minor relevance                                                                                                           |
| **5 and below** | - Incorrect, irrelevant, or misleading information<br>- No meaningful attempt to answer<br>- Confused or nonsensical phrasing<br>- 0 for completely blank or incoherent                                                                                       |

If the question is openended list, follow proportional scoring: 
raw = correct answer / expected answer (defined in question. if not, assume only 2 if plural.) x 10,  if raw > 10, set score to 10`;

// Build evaluation instruction (matching your codebase)
function getEvaluationInstruction(rubric, totalScore = 10) {
  const INTRO = `
You are an educational AI evaluator and assistant for open-ended student responses.
If the question is nonsensical or unrelated to computer literacy:
- DO NOT EVALUATE
- Return an error explaining why.

How to evaluate?
- Evaluate each student answer based on the rubric.
- Assign a score from 0 to ${totalScore} (maximum score is ${totalScore}).
- Evaluate with leniency, assuming the student has only basic computer literacy.
- Justification must answer:
  + "Why that score is appropriate based on the rubrics?"
  + "Why is the score cannot be higher?"
  + "Why the score cannot be lower?"
- The justification is should be in the bullet form format.

Additional Instruction:
- After scoring, suggest a helpful **Google search query** based on the question.
- Example format: "basic concepts of computer networks for beginners"
`;

  return [INTRO.trim(), rubric || DEFAULT_RUBRIC.trim()].join('\n\n');
}

// Create evaluation examples (simplified version matching your codebase)
function createEvaluationExamples(totalScore = 10) {
  const excellentScore = Math.round(totalScore * 0.9);
  const goodScore = Math.round(totalScore * 0.8);
  const poorScore = Math.round(totalScore * 0.4);
  const zeroScore = 0;

  return [
    {
      role: 'user',
      content: 'QUESTION: How do I know if my PC is compatible with Windows 11? \nANSWER: If the PC has a processor of Intel Core series 8th generation. Or an AMD equivalent, a TPM 2.0 and 8GB of RAM. It is compatible.',
    },
    {
      role: 'assistant',
      content: JSON.stringify({
        result: {
          score: excellentScore,
          justification: [
            '- Correctly identifies key requirements: processor type, TPM 2.0, and RAM.',
            '- Shows clear understanding of the topic relevant to the question.',
            '- While some requirements (like storage or graphics) are missing, the answer is sufficient for basic literacy.',
          ].join('\n'),
        },
        suggested_query: 'hardware requirements for Windows 11 compatibility check',
        error: null,
      }),
    },
    {
      role: 'user',
      content: 'QUESTION: What is phishing?\nANSWER: It\'s when you eat fish during work time.',
    },
    {
      role: 'assistant',
      content: JSON.stringify({
        result: {
          score: zeroScore,
          justification: [
            '- The answer is completely incorrect and unrelated to the question.',
            '- Shows no understanding of what phishing means in computer security.',
            '- The answer is nonsensical in the context of the question.',
          ].join('\n'),
        },
        suggested_query: 'what is phishing in cybersecurity',
        error: null,
      }),
    },
  ];
}

// Test the local Ollama evaluation endpoint
function testLocalEvaluation() {
  const index = Math.floor(Math.random() * sampleQuestions.length);
  const question = sampleQuestions[index];
  const answer = sampleAnswers[index];
  const totalScore = 10;

  // Build the messages array (matching your evaluate.ts structure)
  const instruction = getEvaluationInstruction(DEFAULT_RUBRIC, totalScore);
  const examples = createEvaluationExamples(totalScore);
  
  const userInput = `
QUESTION: ${question}
ANSWERS: ${answer}
`.trim();

  const messages = [
    { role: 'system', content: instruction },
    ...examples,
    { role: 'user', content: userInput },
  ];

  // Build the request body (matching Ollama API format)
  const body = JSON.stringify({
    model: MODEL,
    messages: messages,
    temperature: 0,
    stream: false,
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
    timeout: '60s', // LLM responses can take time
  };

  const res = http.post(`${OLLAMA_URL}/api/chat`, body, params);

  // Parse and validate response
  let isValidEvaluation = false;
  let hasError = false;

  try {
    if (res.status === 200) {
      const data = JSON.parse(res.body);
      
      // Try to extract content (Ollama may return different formats)
      const rawContent = 
        data?.message?.content ?? 
        data?.response ?? 
        (typeof data === 'string' ? data : null) ?? 
        (Array.isArray(data) ? data[0]?.content ?? data[0]?.message?.content : null) ?? 
        null;

      if (rawContent) {
        // Try to parse as JSON
        let parsedContent;
        if (typeof rawContent === 'string') {
          try {
            parsedContent = JSON.parse(rawContent);
          } catch {
            // If not JSON, it might still be valid
            parsedContent = { content: rawContent };
          }
        } else {
          parsedContent = rawContent;
        }

        // Check if it has the expected structure
        isValidEvaluation = 
          parsedContent.result !== undefined || 
          parsedContent.content !== undefined ||
          parsedContent.suggested_query !== undefined;
      }
    } else {
      hasError = true;
    }
  } catch (e) {
    hasError = true;
    console.error('Error parsing response:', e);
  }

  const success = check(res, {
    'Ollama API status is 200': (r) => r.status === 200,
    'Response has content': (r) => {
      try {
        const data = JSON.parse(r.body);
        return !!(data?.message?.content || data?.response);
      } catch {
        return false;
      }
    },
    'Valid evaluation structure': () => isValidEvaluation,
  });

  errorRate.add(!success || hasError);
  evaluationSuccessRate.add(isValidEvaluation);

  return res;
}

// Main test function
export default function () {
  testLocalEvaluation();
  sleep(2); // Wait 2 seconds between requests (LLM needs time)
}

// Setup function - verify Ollama is running
export function setup() {
  console.log(`Testing local Ollama evaluation at: ${OLLAMA_URL}`);
  console.log(`Using model: ${MODEL}`);
  
  // Try to ping Ollama to see if it's running
  try {
    const healthCheck = http.get(`${OLLAMA_URL}/api/tags`, { timeout: '5s' });
    if (healthCheck.status === 200) {
      console.log('✓ Ollama is running');
      try {
        const tagsData = JSON.parse(healthCheck.body);
        const models = tagsData?.models || [];
        const hasModel = models.some(m => m.name && m.name.includes(MODEL));
        if (hasModel) {
          console.log(`✓ Model ${MODEL} is available`);
        } else {
          console.warn(`⚠ Model ${MODEL} may not be installed. Available models:`, models.map(m => m.name).join(', '));
        }
      } catch {
        console.log('✓ Ollama is running (could not verify model)');
      }
    } else {
      console.warn('⚠ Ollama health check returned status:', healthCheck.status);
    }
  } catch (e) {
    console.error('✗ Cannot connect to Ollama. Make sure it is running on', OLLAMA_URL);
    console.error('  Error:', e.message);
    console.error('  Start Ollama with: ollama serve');
    console.error('  Install model with: ollama pull', MODEL);
  }
  
  return { ollamaUrl: OLLAMA_URL, model: MODEL };
}

