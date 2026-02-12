export interface FlashCard {
  id: number;
  front: string;
  back: string;
}

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface LessonContent {
  id: number;
  title: string;
  description: string;
  level: number;
  flashcards: FlashCard[];
  mcqQuestions: MCQQuestion[];
  xp: number;
}

// Helper function to ensure proper string formatting
const formatText = (text: string): string => text;

export const lessonsData: LessonContent[] = [
  {
    id: 1,
    title: "Credit Card Basics",
    description: "Learn what credit cards are and how they work",
    level: 1,
    xp: 50,
    flashcards: [
      {
        id: 1,
        front: "The Real Cost of Interest",
        back: "If you only pay the minimum on a ₹5,000 balance at 20% APR, you'll end up paying over ₹10,000 in interest alone! Always aim to pay the full statement balance."
      },
      {
        id: 2,
        front: "The 30% Utilization Rule",
        back: "Maxing out your card (100% utilization) can drop your credit score by 50+ points instantly. Keep it under 30% for safety, and under 10% for the best score growth."
      },
      {
        id: 3,
        front: "The 'Grace Period' Trap",
        back: "The 20-50 day interest-free grace period only applies if you paid your PREVIOUS statement in full. If you carry debt, new purchases start accruing interest immediately!"
      },
      {
        id: 4,
        front: "Statement Date vs Due Date",
        back: "The Statement Date is when your balance is reported to bureaus. To boost your score, pay your balance down BEFORE the statement date, not just before the due date."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "If you have a credit limit of ₹5,000 and you spend ₹2,000, how much credit do you have left?",
        options: [
          "₹3,000",
          "₹7,000",
          "₹2,000",
          "It depends on your payment history"
        ],
        correctAnswer: 0,
        explanation: "Credit limit (₹5,000) minus current spending (₹2,000) equals remaining credit (₹3,000). Your credit limit is the maximum you can borrow."
      },
      {
        id: 2,
        question: "During the grace period, can you avoid paying interest on new purchases?",
        options: [
          "Yes, if you pay the full balance before the grace period ends",
          "No, interest always applies",
          "Yes, but only for the first 10 days",
          "No, interest applies the day you make the purchase"
        ],
        correctAnswer: 0,
        explanation: "If you pay your full balance during the grace period, you avoid interest charges completely. This is one of the biggest benefits of credit cards when used responsibly."
      }
    ]
  },
  {
    id: 2,
    title: "Understanding Interest Rates",
    description: "Master APR, compound interest, and payment cycles",
    level: 1,
    xp: 75,
    flashcards: [
      {
        id: 1,
        front: "What is APR?",
        back: "APR (Annual Percentage Rate) is the yearly cost of borrowing money expressed as a percentage. It includes the interest rate and any additional fees charged by the lender."
      },
      {
        id: 2,
        front: "What is the difference between APR and interest rate?",
        back: "The interest rate is just the cost of borrowing, while APR includes the interest rate plus any fees (annual fees, closing costs, etc.). APR gives a more complete picture of the true cost."
      },
      {
        id: 3,
        front: "How is compound interest calculated?",
        back: "Compound interest is calculated on both the principal and previously earned interest. The formula is: A = P(1 + r/n)^(nt), where P is principal, r is rate, n is compounding frequency, and t is time."
      },
      {
        id: 4,
        front: "What is a balance transfer?",
        back: "A balance transfer is moving your existing credit card debt from one card to another, typically to a card with a lower APR or promotional 0% APR offer."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "If your credit card has a 20% APR and you carry a ₹1,000 balance for one month, how much interest do you owe?",
        options: [
          "Approximately ₹16.67",
          "Approximately ₹200",
          "Exactly ₹20",
          "It depends on the card issuer"
        ],
        correctAnswer: 0,
        explanation: "APR is annual, so monthly interest = (₹1,000 x 20%) / 12 months = ₹16.67. Credit card interest compounds daily in reality, but this gives the approximate monthly charge."
      },
      {
        id: 2,
        question: "Why is it important to understand APR when choosing a credit card?",
        options: [
          "It determines how much interest you will pay if you carry a balance",
          "It guarantees the card issuer will not charge fees",
          "It ensures you will get cashback rewards",
          "It has no impact on your credit score"
        ],
        correctAnswer: 0,
        explanation: "APR directly affects your interest charges. A lower APR saves you money when you carry a balance. However, if you pay off your balance monthly, APR does not matter."
      }
    ]
  },
  {
    id: 3,
    title: "Credit Score Fundamentals",
    description: "Discover what affects your credit score",
    level: 1,
    xp: 100,
    flashcards: [
      {
        id: 1,
        front: "What is a credit score?",
        back: "A credit score is a three-digit number (typically 300-850) that represents your creditworthiness. It is calculated based on your credit history and used by lenders to assess lending risk."
      },
      {
        id: 2,
        front: "What are the five factors affecting credit scores?",
        back: "Payment history (35%), amounts owed (30%), length of credit history (15%), credit mix (10%), and new credit inquiries (10%)."
      },
      {
        id: 3,
        front: "What is considered a good credit score?",
        back: "Generally, 670-739 is considered good, 740-799 is very good, and 800+ is excellent. Scores below 670 are considered fair to poor."
      },
      {
        id: 4,
        front: "How do hard inquiries affect your credit score?",
        back: "Hard inquiries (when you apply for credit) can lower your score by a few points. Multiple inquiries in a short period may be viewed as risky behavior."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "Which factor has the most significant impact on your credit score?",
        options: [
          "Payment history (35%)",
          "Amounts owed (30%)",
          "Length of credit history (15%)",
          "New credit inquiries (10%)"
        ],
        correctAnswer: 0,
        explanation: "Payment history is the most important factor (35%). Making on-time payments is the single best way to improve and maintain a good credit score."
      },
      {
        id: 2,
        question: "If you have a credit score of 720, which range does it fall into?",
        options: [
          "Excellent (800+)",
          "Very Good (740-799)",
          "Good (670-739)",
          "Fair (580-669)"
        ],
        correctAnswer: 2,
        explanation: "720 falls in the Good range (670-739). This is a solid score that will help you get approved for most credit products at reasonable rates."
      }
    ]
  },
  {
    id: 4,
    title: "Payment Strategies",
    description: "Learn optimal payment methods and timing",
    level: 2,
    xp: 100,
    flashcards: [
      {
        id: 1,
        front: "What is the pay-in-full strategy?",
        back: "The pay-in-full strategy means paying your entire credit card balance before the due date each month. This avoids all interest charges and helps build excellent credit."
      },
      {
        id: 2,
        front: "What is the minimum payment?",
        back: "The minimum payment is the smallest amount your credit card issuer requires you to pay monthly. It typically covers 1-3% of your balance plus any fees and interest charges."
      },
      {
        id: 3,
        front: "Why should you avoid only paying the minimum?",
        back: "Paying only the minimum means most of your payment goes to interest, and the debt takes years to pay off. A ₹5,000 balance at 20% APR could take 25+ years to pay off with minimum payments."
      },
      {
        id: 4,
        front: "What is the debt avalanche method?",
        back: "The debt avalanche method prioritizes paying off debts with the highest interest rates first while making minimum payments on other debts. This saves the most money on interest."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "You have a ₹3,000 credit card balance at 18% APR. If you only make the minimum payment (₹150/month), approximately how long will it take to pay off?",
        options: [
          "20 months",
          "2-3 months",
          "30+ months",
          "5 months"
        ],
        correctAnswer: 2,
        explanation: "With high interest rates, paying only the minimum extends repayment significantly (30+ months). Most of each payment goes to interest rather than principal reduction."
      },
      {
        id: 2,
        question: "What is the best payment strategy to minimize interest charges?",
        options: [
          "Pay only the minimum every month",
          "Pay the full balance before the due date",
          "Make random payments whenever possible",
          "Wait until interest accumulates, then pay"
        ],
        correctAnswer: 1,
        explanation: "Paying the full balance before the due date is the best strategy. It avoids all interest charges and demonstrates responsible credit management."
      }
    ]
  },
  {
    id: 5,
    title: "Rewards Programs",
    description: "Understand cashback, points, and miles",
    level: 2,
    xp: 125,
    flashcards: [
      {
        id: 1,
        front: "What is cashback?",
        back: "Cashback is a reward where you earn a percentage of every rupee spent back as cash. For example, 1% cashback means you get ₹1 back for every ₹100 spent."
      },
      {
        id: 2,
        front: "What are credit card points?",
        back: "Credit card points are reward units earned for spending. Typically, 1 point is earned per dollar spent. Points can be redeemed for travel, merchandise, or cash."
      },
      {
        id: 3,
        front: "What are travel miles?",
        back: "Travel miles are rewards specific to travel credit cards. Each dollar spent earns a certain number of miles. Miles can be redeemed for flights, hotel stays, or upgraded to other rewards."
      },
      {
        id: 4,
        front: "What is the sign-up bonus?",
        back: "A sign-up bonus is a large one-time bonus of points, miles, or cashback offered when you open a new credit card and meet spending requirements (usually within 3-6 months)."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "If a credit card offers 2% cashback on all purchases and you spend ₹10,000 annually, how much cashback do you earn?",
        options: [
          "₹100",
          "₹200",
          "₹500",
          "₹1,000"
        ],
        correctAnswer: 1,
        explanation: "₹10,000 x 2% = ₹200. This is straightforward cashback calculation. Higher spending amounts or higher cashback rates earn more rewards."
      },
      {
        id: 2,
        question: "Should you carry a balance on a rewards credit card to earn more points?",
        options: [
          "Yes, always keep a balance to maximize points",
          "No, never. Interest charges outweigh the rewards earned",
          "Only if the interest rate is very low",
          "It does not matter because points have no value"
        ],
        correctAnswer: 1,
        explanation: "Never carry a balance to earn rewards. Interest charges far exceed any reward value. A ₹5,000 balance at 20% APR costs ₹1,000/year in interest but only earns ~₹50-100 in cashback/points."
      }
    ]
  },
  {
    id: 6,
    title: "Credit Utilization",
    description: "Master the 30% rule and balance management",
    level: 2,
    xp: 100,
    flashcards: [
      {
        id: 1,
        front: "What is credit utilization?",
        back: "Credit utilization is the percentage of your available credit that you are currently using. It is calculated as (Total Balance / Total Credit Limit) x 100."
      },
      {
        id: 2,
        front: "What is the 30% rule?",
        back: "The 30% rule suggests keeping your credit utilization below 30%. This demonstrates responsible credit management and significantly benefits your credit score."
      },
      {
        id: 3,
        front: "How does credit utilization affect your credit score?",
        back: "Credit utilization accounts for 30% of your credit score. Lower utilization (under 30%) is better. Even 0% utilization (no balance) is ideal for credit score purposes."
      },
      {
        id: 4,
        front: "What strategies can reduce credit utilization?",
        back: "Pay down balances, request credit limit increases, spread spending across multiple cards, or become an authorized user on accounts with low utilization."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "If you have three credit cards with limits of ₹5,000 each, and combined balances of ₹2,000, what is your credit utilization?",
        options: [
          "13.3%",
          "40%",
          "33.3%",
          "66.7%"
        ],
        correctAnswer: 0,
        explanation: "Total Limit = ₹15,000, Total Balance = ₹2,000. Utilization = ₹2,000 / ₹15,000 = 13.3%. This is well under the 30% recommended threshold."
      },
      {
        id: 2,
        question: "How can requesting a credit limit increase help your credit score?",
        options: [
          "It allows you to spend more money",
          "It increases your available credit, lowering utilization percentage",
          "It guarantees a higher credit score",
          "It has no effect on credit score"
        ],
        correctAnswer: 1,
        explanation: "A higher credit limit increases your available credit, which lowers your utilization ratio when keeping the same balance. For example, a ₹2,000 balance on a ₹10,000 limit (20%) is better than on a ₹5,000 limit (40%)."
      }
    ]
  },
  {
    id: 7,
    title: "Fees and Charges",
    description: "Identify and avoid unnecessary credit card fees",
    level: 2,
    xp: 75,
    flashcards: [
      {
        id: 1,
        front: "What is an annual fee?",
        back: "An annual fee is a yearly charge by the credit card issuer for maintaining the account. Annual fees can range from ₹0 to ₹500+ and are charged regardless of card usage."
      },
      {
        id: 2,
        front: "What is a late fee?",
        back: "A late fee is charged when you miss your credit card payment due date. Late fees typically range from ₹25-₹35 for first offense and can be ₹35-₹40 for subsequent violations."
      },
      {
        id: 3,
        front: "What is a foreign transaction fee?",
        back: "A foreign transaction fee is charged when you use your card internationally. It is typically 1-3% of the transaction amount and is added to your balance."
      },
      {
        id: 4,
        front: "What is an over-limit fee?",
        back: "An over-limit fee is charged when you exceed your credit limit. Most modern cards decline transactions that would exceed the limit, so this fee is less common now."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "If you miss your credit card payment by 5 days, what typically happens?",
        options: [
          "You face no consequences",
          "A late fee (usually ₹25-₹35) is charged and it may affect your credit score",
          "Your credit card is immediately canceled",
          "The card issuer will call you but will not charge a fee"
        ],
        correctAnswer: 1,
        explanation: "Late payments result in fees and can negatively impact your credit score. A payment 30+ days late creates a negative mark on your credit report."
      },
      {
        id: 2,
        question: "You travel internationally and use your credit card for a ₹1,000 purchase with a 2% foreign transaction fee. What is the total charged?",
        options: [
          "₹1,000",
          "₹1,020",
          "It depends on your credit score",
          "₹1,200"
        ],
        correctAnswer: 1,
        explanation: "₹1,000 + (₹1,000 x 2%) = ₹1,020. Foreign transaction fees add to your total transaction cost. Some travel cards offer 0% foreign transaction fees."
      }
    ]
  },
  {
    id: 8,
    title: "Security Best Practices",
    description: "Protect yourself from fraud and identity theft",
    level: 3,
    xp: 125,
    flashcards: [
      {
        id: 1,
        front: "What should you do if your credit card is lost or stolen?",
        back: "Contact your card issuer immediately to report it lost/stolen. They will freeze the account and send you a new card. Most card issuers offer fraud protection for unauthorized charges."
      },
      {
        id: 2,
        front: "What is EMV technology?",
        back: "EMV (Europay, Mastercard, Visa) is chip technology that creates unique transaction codes for each purchase. It is more secure than magnetic stripe technology as it is harder to counterfeit."
      },
      {
        id: 3,
        front: "What is tokenization?",
        back: "Tokenization replaces your real card number with a unique token during transactions. This way, merchants never see your actual card number, reducing fraud risk."
      },
      {
        id: 4,
        front: "Why should you monitor your credit card statements?",
        back: "Regular monitoring helps you quickly spot unauthorized charges or errors. Most issuers give you 60 days to dispute fraudulent charges."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "You notice a ₹500 unauthorized charge on your credit card statement. What should you do first?",
        options: [
          "Ignore it and pay as normal",
          "Contact your credit card issuer immediately to report fraud",
          "Wait a few days to see if it reverses",
          "Post about it on social media"
        ],
        correctAnswer: 1,
        explanation: "Contact your issuer immediately to report fraud. You have 60 days to dispute most charges, and issuers typically cover fraud under federal law. Quick action protects you."
      },
      {
        id: 2,
        question: "What is the main advantage of using EMV chip cards over magnetic stripe cards?",
        options: [
          "They earn more rewards",
          "They have lower fees",
          "They are more secure and harder to counterfeit",
          "They have faster checkout times"
        ],
        correctAnswer: 2,
        explanation: "EMV creates unique transaction codes making counterfeiting extremely difficult. Magnetic stripe cards only have static data, making them vulnerable to cloning."
      }
    ]
  },
  {
    id: 9,
    title: "Balance Transfers",
    description: "Learn when and how to transfer balances",
    level: 3,
    xp: 150,
    flashcards: [
      {
        id: 1,
        front: "What is a balance transfer?",
        back: "A balance transfer moves your credit card debt from one card to another, typically to a new card with a promotional 0% APR offer or lower interest rate."
      },
      {
        id: 2,
        front: "What is a balance transfer fee?",
        back: "A balance transfer fee is a one-time charge (typically 3-5% of the transferred amount) paid when you move a balance. It is either charged upfront or added to your balance."
      },
      {
        id: 3,
        front: "When is a balance transfer a good idea?",
        back: "Balance transfers work well when: (1) You have high-interest debt, (2) New card has 0% APR for 6-12+ months, (3) Transfer fee is less than interest savings, and (4) You can pay off during promo period."
      },
      {
        id: 4,
        front: "What should you do with the old card after a balance transfer?",
        back: "Keep the old card open to maintain credit history and lower credit utilization. Just avoid making new purchases. Closing old cards can hurt your credit score."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "You have a ₹5,000 balance at 20% APR. A new card offers 0% APR for 12 months with a 3% transfer fee. Is this worthwhile?",
        options: [
          "No, the 3% fee is too expensive",
          "Yes, you save roughly ₹1,000 in interest over 12 months, fee is only ₹150",
          "It depends on the rewards",
          "No, you should pay it off on the old card"
        ],
        correctAnswer: 1,
        explanation: "Current interest would be ~₹1,000 over 12 months. Transfer fee is ₹5,000 x 3% = ₹150. Net savings of ~₹850. Perfect scenario for balance transfer."
      },
      {
        id: 2,
        question: "What is the most important factor when doing a balance transfer?",
        options: [
          "The card's sign-up bonus",
          "Paying off the balance before the 0% APR period ends",
          "The card's rewards rate",
          "Opening multiple balance transfer cards simultaneously"
        ],
        correctAnswer: 1,
        explanation: "If you do not pay off the balance before the promotional period ends, you will face regular APR (often higher than your original card), making the transfer counterproductive."
      }
    ]
  },
  {
    id: 10,
    title: "Advanced Strategies",
    description: "Card stacking, churning, and optimization",
    level: 3,
    xp: 200,
    flashcards: [
      {
        id: 1,
        front: "What is card stacking?",
        back: "Card stacking means using multiple credit cards strategically to maximize rewards. You use cards with the highest rewards for specific categories (groceries, travel, dining, etc.)."
      },
      {
        id: 2,
        front: "What is credit card churning?",
        back: "Card churning is opening new cards specifically to earn sign-up bonuses, then closing them or leaving them dormant. It requires meeting spending minimums to earn bonuses."
      },
      {
        id: 3,
        front: "What are the risks of card churning?",
        back: "Risks include: hard inquiries lowering credit score, paying annual fees, not meeting spending minimums, and damaging the relationship with card issuers."
      },
      {
        id: 4,
        front: "What is a travel rewards strategy?",
        back: "A travel strategy combines a card with high annual points earning, another with 0% foreign transaction fees, and a third for general travel points. This maximizes value per dollar spent."
      }
    ],
    mcqQuestions: [
      {
        id: 1,
        question: "You want to maximize rewards across different spending categories. What is the best approach?",
        options: [
          "Use one card for all purchases",
          "Use multiple cards strategically - each for its highest reward category",
          "Open as many cards as possible",
          "Use whatever card you have first"
        ],
        correctAnswer: 1,
        explanation: "Strategic card stacking optimizes rewards. Use 5% cashback for groceries, 3% for dining, 2% for travel, etc. This maximizes total rewards on your spending."
      },
      {
        id: 2,
        question: "A credit card has a ₹500 annual fee and offers a ₹700 sign-up bonus. You earn ₹800 in rewards annually from spending. Should you keep this card after year one?",
        options: [
          "No, close it immediately",
          "Yes, you earn ₹800 in spending rewards minus ₹500 fee = ₹300 profit",
          "Only if you can meet another sign-up bonus requirement",
          "The decision depends on your credit score"
        ],
        correctAnswer: 1,
        explanation: "Year 1: ₹700 bonus + ₹800 rewards - ₹500 fee = ₹1,000 profit. Year 2+: ₹800 rewards - ₹500 fee = ₹300 annual profit. Keep if the spend value justifies it."
      }
    ]
  }
];
