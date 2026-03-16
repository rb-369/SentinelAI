// Sample scan history shown in the Recent Scans list
export const recentScans = [
  {
    id: '1',
    target: 'suspicious-paypal-verify.com',
    type: 'URL', score: 94, category: 'Phishing',
    time: '2 min ago', verdict: 'malicious',
    details: [
      'Domain registered less than 7 days ago',
      'SSL certificate mismatch detected',
      'Mimics PayPal brand identity',
      'Redirects to credential harvesting form',
    ],
  },
  {
    id: '2',
    target: 'fake-amazon-security.net',
    type: 'URL', score: 87, category: 'Brand impersonation',
    time: '15 min ago', verdict: 'malicious',
    details: [
      'Spoofs Amazon security page layout',
      'Requests login credentials and OTP',
      'Hosted on bulletproof hosting provider',
    ],
  },
  {
    id: '3',
    target: 'legitimate-company.com',
    type: 'URL', score: 4, category: 'Clean',
    time: '32 min ago', verdict: 'safe',
    details: [
      'Domain age: 8 years',
      'Valid HTTPS certificate from trusted CA',
      'No known threat indicators found',
    ],
  },
  {
    id: '4',
    target: 'win-free-iphone.click',
    type: 'URL', score: 91, category: 'Scam',
    time: '1 hr ago', verdict: 'malicious',
    details: [
      'Common prize-scam pattern detected',
      'Domain registered anonymously',
      'Leads to survey data harvesting page',
    ],
  },
  {
    id: '5',
    target: 'Your account has been suspended…',
    type: 'Email', score: 78, category: 'Phishing',
    time: '2 hr ago', verdict: 'malicious',
    details: [
      'High urgency language detected',
      'Spoofed sender domain',
      'Contains malicious link in body',
    ],
  },
  {
    id: '6',
    target: 'update-your-bank-details.info',
    type: 'URL', score: 96, category: 'Phishing',
    time: '3 hr ago', verdict: 'malicious',
    details: [
      'Typosquat of major bank domain',
      'Requests card number and CVV',
      'IP address located in high-risk region',
    ],
  },
]