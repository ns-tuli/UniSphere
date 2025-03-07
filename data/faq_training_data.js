const faqTrainingData = {
  general: {
    university: [
      {
        question: "What is UniSphere?",
        answer: "UniSphere is an all-in-one university management platform that integrates various campus services including cafeteria management, transportation tracking, class schedules, navigation, and more. It aims to enhance the campus experience for students, faculty, and staff."
      },
      {
        question: "How do I access UniSphere?",
        answer: "You can access UniSphere through your web browser at our official website or download our mobile app. Login with your university credentials (student ID/email and password) to access all features."
      },
      {
        question: "Who can use UniSphere?",
        answer: "UniSphere is available to all university members including students, faculty, staff, and administrators. Different user roles have access to different features based on their needs and permissions."
      }
    ],
    
    technical: [
      {
        question: "What should I do if I can't log in?",
        answer: "If you're having trouble logging in: 1) Check if your credentials are correct, 2) Clear your browser cache, 3) Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge), 4) Contact the IT helpdesk if the issue persists."
      },
      {
        question: "How do I reset my password?",
        answer: "Click on the 'Forgot Password' link on the login page. Enter your university email address to receive a password reset link. Follow the instructions in the email to create a new password."
      },
      {
        question: "Which browsers are supported?",
        answer: "UniSphere supports the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated and enable JavaScript."
      }
    ]
  },

  features: {
    cafeteria: [
      {
        question: "How do I view the cafeteria menu?",
        answer: "Access the cafeteria section from the main dashboard. You can view daily menus, nutritional information, pricing, and real-time availability. You can also filter by dietary preferences and set meal notifications."
      },
      {
        question: "Can I pre-order meals?",
        answer: "Yes, you can pre-order meals up to a week in advance. Go to the cafeteria section, select your desired items, choose pickup time, and complete the payment process."
      },
      {
        question: "How do I check my meal balance?",
        answer: "Your meal balance is displayed on your dashboard and in the cafeteria section. You can view transaction history, add funds, and set low balance alerts."
      }
    ],

    transportation: [
      {
        question: "How do I track campus buses?",
        answer: "Use the transportation module to see real-time bus locations, estimated arrival times, and route information. You can also set notifications for your preferred routes."
      },
      {
        question: "What are the bus operating hours?",
        answer: "Campus buses typically operate from 6:00 AM to 11:00 PM on weekdays, and 8:00 AM to 8:00 PM on weekends. Schedule variations occur during holidays and special events."
      },
      {
        question: "Can I report issues with bus service?",
        answer: "Yes, use the 'Report Issue' button in the transportation module to report delays, overcrowding, or other concerns. Include relevant details like bus number and location."
      }
    ],

    navigation: [
      {
        question: "How accurate is the campus navigation?",
        answer: "Our campus navigation system is updated regularly and provides accuracy within 5-10 meters. It uses a combination of GPS, WiFi positioning, and building blueprints for indoor-outdoor navigation."
      },
      {
        question: "Does the AR navigation work indoors?",
        answer: "Yes, AR navigation works both indoors and outdoors in supported buildings. Indoor navigation requires WiFi connection and may have reduced accuracy in some areas."
      },
      {
        question: "How do I find specific rooms or facilities?",
        answer: "Use the search function in the navigation module. Enter room number, building name, or facility type. The system will show the shortest route and estimated walking time."
      }
    ],

    academics: [
      {
        question: "How do I view my class schedule?",
        answer: "Your class schedule is displayed on the dashboard and in the academics section. You can view it by day, week, or month, and set reminders for classes."
      },
      {
        question: "Can I get notifications for class changes?",
        answer: "Yes, enable notifications in your settings to receive alerts about class cancellations, room changes, or other academic announcements."
      },
      {
        question: "How do I contact my professors?",
        answer: "Faculty contact information is available in the academics section. Click on a course to see instructor details and office hours, or use the messaging feature."
      }
    ]
  },

  security: {
    privacy: [
      {
        question: "How is my data protected?",
        answer: "UniSphere uses end-to-end encryption for all sensitive data. We follow industry-standard security protocols and regularly update our security measures. Your data is stored securely and never shared with third parties."
      },
      {
        question: "Who can see my personal information?",
        answer: "Only authorized university personnel can access your personal information on a need-to-know basis. You can control privacy settings for your profile information."
      },
      {
        question: "How long is my data retained?",
        answer: "Academic records are retained according to university policy. Personal data can be deleted upon request after graduation or leaving the university, except for essential academic records."
      }
    ],

    reporting: [
      {
        question: "How do I report a security concern?",
        answer: "Use the 'Report Security Issue' feature in the settings menu. For immediate assistance, use the emergency contact button or contact campus security directly."
      },
      {
        question: "What should I do if I notice suspicious activity?",
        answer: "Report suspicious activity immediately through the security reporting feature or contact campus security. Include any relevant details, photos, or location information."
      }
    ]
  },

  support: {
    help: [
      {
        question: "How do I get help with UniSphere?",
        answer: "Access the help center from the menu for guides and FAQs. For personalized support, use the chat feature or submit a support ticket. Technical support is available 24/7."
      },
      {
        question: "Can I suggest new features?",
        answer: "Yes, use the feedback form in the settings menu to suggest new features or improvements. We regularly review user feedback for platform enhancements."
      }
    ],

    feedback: [
      {
        question: "How do I provide feedback?",
        answer: "Use the feedback option in the settings menu. You can rate features, report issues, or suggest improvements. Regular surveys are also conducted for user feedback."
      },
      {
        question: "How long does it take to get a response to feedback?",
        answer: "We typically respond to feedback within 24-48 hours. Critical issues are prioritized and addressed more quickly. You'll receive notifications about the status of your feedback."
      }
    ]
  }
};

const chatbotPrompts = {
  greeting: [
    "Hello! How can I help you with UniSphere today?",
    "Welcome to UniSphere support! What can I assist you with?",
    "Hi there! I'm your UniSphere assistant. What questions do you have?"
  ],
  
  clarification: [
    "Could you please provide more details about your question?",
    "I'm not sure I understood completely. Could you rephrase that?",
    "Would you like me to explain any specific part in more detail?"
  ],
  
  farewell: [
    "Is there anything else I can help you with?",
    "Don't hesitate to ask if you have more questions!",
    "Thank you for using UniSphere support. Have a great day!"
  ]
};

const generateResponse = (question) => {
  // Function to generate contextual responses based on user input
  // This can be expanded with more sophisticated matching algorithms
};

const faqData = {
  faqTrainingData,
  chatbotPrompts,
  generateResponse
};

export default faqData;
