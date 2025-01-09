// Facts "On This Day" (365 entries, 1 per day)
const facts = [
  "On This Day (Jan 1): The first-ever Rose Bowl football game is played in Pasadena, California in 1902.",
  "On This Day (Jan 2): Georgia is admitted to the United States as the 4th state in 1788.",
  // Add more facts for each day of the year...
];

// Motivational and Disability-related Quotes (grouped by disability types)
const disabilityQuotes = {
  autism: [
    "Autism: 'Autism is not a disability, it’s a different ability.'",
    "Autism: 'I see people with autism as a bright rainbow with many hues.'",
    // Add more Autism quotes...
  ],
  adhd: [
    "ADHD: 'ADHD is not about knowing what to do but about doing what you know.'",
    "ADHD: 'Focus on progress, not perfection.'",
    // Add more ADHD quotes...
  ],
  anxiety: [
    "Anxiety: 'You are stronger than your anxiety, even on the days it feels overwhelming.'",
    "Anxiety: 'Your anxiety is lying to you.'",
    // Add more Anxiety quotes...
  ],
  depression: [
    "Depression: 'Even the darkest night will end, and the sun will rise.'",
    "Depression: 'Your struggle today will make you stronger tomorrow.'",
    // Add more Depression quotes...
  ],
  ptsd: [
    "PTSD: 'Your trauma does not define you, it is your strength to keep moving that does.'",
    "PTSD: 'Healing takes time, and asking for help is a brave step.'",
    // Add more PTSD quotes...
  ],
  ocd: [
    "OCD: 'OCD is a challenge, not a choice.'",
    "OCD: 'Embrace your unique mind, even with its quirks.'",
    // Add more OCD quotes...
  ],
  bipolar: [
    "Bipolar Disorder: 'Bipolar disorder is not a weakness, it’s just a part of the journey.'",
    "Bipolar Disorder: 'You are not your highs or lows, you are the balance in between.'",
    // Add more Bipolar Disorder quotes...
  ],
  learningDisabilities: [
    "Learning Disabilities: 'Dyslexia doesn’t define you. It gives you a unique way to view the world.'",
    "Learning Disabilities: 'Everyone learns differently. Embrace your strengths.'",
    // Add more Learning Disabilities quotes...
  ],
  epilepsy: [
    "Epilepsy: 'You are not defined by your seizures, you are defined by your resilience.'",
    "Epilepsy: 'Strength is not the absence of seizures, but the courage to live despite them.'",
    // Add more Epilepsy quotes...
  ],
  physicalDisabilities: [
    "Physical Disability: 'Your strength is seen in how you adapt, not in what you can’t do.'",
    "Physical Disability: 'Your wheelchair, crutches, or braces don’t define you, your spirit does.'",
    // Add more Physical Disabilities quotes...
  ],
  chronicIllness: [
    "Chronic Illness: 'Even on the hardest days, your perseverance shines.'",
    "Chronic Illness: 'Fibromyalgia is a part of you, but it doesn’t define all of you.'",
    // Add more Chronic Illness quotes...
  ],
  hearingImpairment: [
    "Hearing Impairment: 'Your voice is strong even when it’s quiet.'",
    "Hearing Impairment: 'The world needs to listen more than speak.'",
    // Add more Hearing Impairment quotes...
  ],
  visualImpairment: [
    "Visual Impairment: 'Vision loss doesn’t dim your light; it brightens your perspective.'",
    "Visual Impairment: 'True vision comes from within.'",
    // Add more Visual Impairment quotes...
  ],
  speechImpairment: [
    "Speech Impairment: 'The power of your words is not in how they are spoken but in their meaning.'",
    "Speech Impairment: 'Everyone has a voice. Let yours be heard in your own way.'",
    // Add more Speech Impairment quotes...
  ]
  // Add more categories for other disabilities...
};

// Function to check if a year is a leap year
function isLeapYear(year) {
  return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

// Function to get the daily index, considering leap years
function getDailyIndex() {
  const startDate = new Date('2025-01-01'); // Starting date (January 1, 2025)
  const currentDate = new Date();

  // Calculate the number of days between the two dates
  const timeDifference = currentDate - startDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Adjust for leap years
  let leapYearAdjustment = 0;

  // Count leap years between start date and current date
  for (let year = 2025; year <= currentDate.getFullYear(); year++) {
    if (isLeapYear(year)) {
      leapYearAdjustment += 1;
    }
  }

  // Account for leap years and loop every 365 or 366 days
  const totalDays = daysDifference + leapYearAdjustment;
  return totalDays % 365; // Loop every 365 days (ignoring Feb 29 after this)
}

// Function to get today's fact
function getTodaysFact() {
  const index = getDailyIndex();
  return facts[index];
}

// Function to get a random quote from all disability categories
function getRandomDisabilityQuote() {
  const categories = Object.values(disabilityQuotes);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const randomQuote = randomCategory[Math.floor(Math.random() * randomCategory.length)];
  return randomQuote;
}

// Function to get today's date and time based on user's timezone
function getTodaysDate() {
  const currentDate = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZoneName: 'short' };
  return currentDate.toLocaleDateString('en-US', options);
}

// Display the date, fact, and quote
document.getElementById('currentDate').innerText = getTodaysDate();
document.getElementById('dailyFact').innerText = getTodaysFact();
document.getElementById('dailyQuote').innerText = getRandomDisabilityQuote();
