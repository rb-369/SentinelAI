const { CYBER_SUPPORT_CENTERS, OFFICIAL_PORTALS } = require("../data/cyberSupportData");

const normalize = (value) => (value || "").toLowerCase().trim();

const findSupportCenter = (location) => {
  const normalizedLocation = normalize(location);
  if (!normalizedLocation) return null;

  const exact = CYBER_SUPPORT_CENTERS.find((center) => normalize(center.city) === normalizedLocation);
  if (exact) return exact;

  const partial = CYBER_SUPPORT_CENTERS.find((center) => normalizedLocation.includes(normalize(center.city)));
  if (partial) return partial;

  return CYBER_SUPPORT_CENTERS[0];
};

exports.getCyberSupport = async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: "location is required" });
    }

    const center = findSupportCenter(location);
    const complaintSteps = [
      "Take screenshots of the suspicious message, URL, or transaction details.",
      "File a complaint immediately on https://cybercrime.gov.in.",
      "Call 1930 for urgent financial fraud blocking support.",
      "Submit all evidence, including timestamps and account details, to cyber police.",
      "Follow up with complaint ID and keep your bank informed.",
    ];

    return res.json({
      success: true,
      data: {
        location,
        nearestSupport: center,
        officialPortals: OFFICIAL_PORTALS,
        complaintSteps,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAvoidanceGuide = async (req, res) => {
  try {
    return res.json({
      success: true,
      data: {
        title: "How To Avoid Phishing, Fraud, and AI Prompt Attacks",
        sections: [
          {
            heading: "Before You Click",
            tips: [
              "Hover over links and verify the real domain before opening.",
              "Never trust urgent account suspension messages without independent verification.",
              "Type official websites manually instead of clicking embedded links.",
            ],
          },
          {
            heading: "Email and Message Safety",
            tips: [
              "Check sender domain spelling and suspicious reply-to addresses.",
              "Do not share OTP, passwords, or Aadhaar details over chat or email.",
              "If a message creates fear or urgency, pause and verify through official channels.",
            ],
          },
          {
            heading: "AI Prompt Safety",
            tips: [
              "Reject prompts asking to ignore safety rules or reveal secrets.",
              "Do not paste credentials, private data, or tokens into untrusted chat prompts.",
              "Use role-based access and auditing for enterprise AI assistants.",
            ],
          },
          {
            heading: "If Already Affected",
            tips: [
              "Immediately change compromised passwords and enable multi-factor authentication.",
              "Block cards/accounts if financial fraud is suspected.",
              "Report incident to cybercrime portal and local cyber police with evidence.",
            ],
          },
        ],
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
