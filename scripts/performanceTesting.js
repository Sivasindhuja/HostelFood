import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

// 1. Load or Generate Dynamic Data 
const feedbackData = new SharedArray('student feedback', function () {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = ['Breakfast', 'Lunch', 'Dinner'];
  const data = [];
  
  for (let i = 0; i < 100; i++) {
    data.push({
      day: days[Math.floor(Math.random() * days.length)],
      time: times[Math.floor(Math.random() * times.length)],
      rating: Math.floor(Math.random() * 5) + 1, // Random rating 1-5
      suggestion: `Test suggestion ${i}: The food quality was ${Math.random() > 0.5 ? 'good' : 'average'}.`
    });
  }
  return data;
});

export const options = {
  stages: [
    { duration: '1m', target: 20 }, // Ramp up to 20 users [cite: 7, 25]
    { duration: '3m', target: 20 }, // Stay at 20 users [cite: 5, 25]
    { duration: '1m', target: 0 },  // Ramp down [cite: 7, 26]
  ],
  thresholds: {
    http_req_duration: ['p(99)<200'], // 99% of requests must be < 200ms [cite: 6, 30]
  },
};

export default function () {
  const url = 'https://your-api-host.com/feedback'; // Use your hosted API URL [cite: 23]
  const randomFeedback = feedbackData[Math.floor(Math.random() * feedbackData.length)];
  
  const payload = JSON.stringify(randomFeedback);
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.MY_TOKEN}`, // Pass token via environment variable [cite: 43, 111]
    },
  };

  const res = http.post(url, payload, params);

  // Verify response [cite: 29, 32]
  check(res, {
    'is status 200': (r) => r.status === 200,
    'has id returned': (r) => r.json().id !== undefined,
  });

  sleep(1); // Simulate real user think-time 
}