// Function to check if it's a leap year
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// Function to get the day of the year
function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Fact and Quote arrays for 365 (or 366) days
const facts = [
    "Did you know? The longest recorded flight of a chicken is 13 seconds.",
    "A panda’s diet consists of 99% bamboo.",
    "Bananas are berries, but strawberries aren't.",
    "The Eiffel Tower can be 15 cm taller during the summer.",
    "Octopuses have three hearts.",
    // Add 365 or 366 facts here
];

const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It always seems impossible until it's done. - Nelson Mandela",
    // Add 365 or 366 quotes here
];

// Disability Sections (can be expanded with more details for each type)
const disabilities = {
    "Learning Disabilities": [
        "Learning disabilities affect the brain's ability to process information.",
        "Common learning disabilities include dyslexia, dyscalculia, and dysgraphia."
    ],
    "Intellectual Disabilities": [
        "Intellectual disabilities can impact an individual's cognitive abilities and adaptive behavior.",
        "They can be caused by genetic conditions, brain injury, or environmental factors."
    ],
    "Speech Impairments": [
        "Speech impairments can affect the clarity of speech or the ability to produce sounds correctly.",
        "Common speech impairments include stuttering and apraxia of speech."
    ],
    "Visual Impairments": [
        "Visual impairments can range from partial blindness to total blindness.",
        "It affects an individual's ability to see, which can impact daily activities and mobility."
    ],
    "Autism": [
        "Autism is a neurodevelopmental disorder that affects social interactions, communication, and behavior.",
        "Individuals with autism may have unique strengths, such as attention to detail."
    ],
    "Asperger Syndrome": [
        "Asperger syndrome is a form of autism spectrum disorder characterized by challenges in social interaction.",
        "Individuals with Asperger syndrome often have average to above-average intelligence."
    ],
    "Deafness or Hard of Hearing": [
        "Deafness or hearing impairments affect an individual's ability to perceive sounds.",
        "There are different degrees of hearing loss, ranging from mild to profound."
    ],
    "Mental Health Conditions": [
        "Mental health conditions can affect a person's thoughts, emotions, and behaviors.",
        "Common mental health conditions include anxiety disorders, depression, and schizophrenia."
    ],
    "Acquired Brain Injury": [
        "Acquired brain injuries are brain injuries that occur after birth, typically from trauma or illness.",
        "Symptoms can include cognitive, physical, and emotional changes."
    ],
    "Physical Disabilities": [
        "Physical disabilities affect a person's ability to perform physical tasks or movements.",
        "They may be caused by conditions such as paralysis, amputation, or cerebral palsy."
    ],
    "Attention Deficit Hyperactivity Disorder (ADHD)": [
        "ADHD is characterized by inattention, hyperactivity, and impulsivity.",
        "Individuals with ADHD may have difficulty staying focused and managing impulses."
    ],
    "Neurodevelopmental Motor Disorders": [
        "Neurodevelopmental motor disorders affect an individual's movement skills.",
        "Conditions such as cerebral palsy and developmental coordination disorder are examples."
    ]
};

// Function to check if it's a new day
function isNewDay(lastUpdated) {
    const currentDate = new Date();
    return currentDate.toDateString() !== new Date(lastUpdated).toDateString();
}

// Function to update the fact, quote, and disability section for the day
function updateFactQuoteAndDisability() {
    const currentDate = new Date();
    const lastUpdatedDate = localStorage.getItem('lastUpdatedDate');
    
    // If it's a new day, update the content
    if (!lastUpdatedDate || isNewDay(lastUpdatedDate)) {
        const dayOfYear = getDayOfYear(currentDate);
        
        // Adjust for leap year if needed
        const isLeap = isLeapYear(currentDate.getFullYear());
        const totalDays = isLeap ? 366 : 365;

        // Ensure the day of the year is within the bounds of available facts and quotes
        const factOfTheDay = facts[(dayOfYear - 1) % totalDays];
        const quoteOfTheDay = quotes[(dayOfYear - 1) % totalDays];

        // Get a random disability to display
        const disabilityKeys = Object.keys(disabilities);
        const randomDisability = disabilityKeys[Math.floor(Math.random() * disabilityKeys.length)];
        const disabilityFacts = disabilities[randomDisability];

        // Update the HTML content
        document.getElementById("dailyFact").innerText = factOfTheDay;
        document.getElementById("dailyQuote").innerText = quoteOfTheDay;
        document.getElementById("disabilityTitle").innerText = randomDisability;
        document.getElementById("disabilityFacts").innerHTML = disabilityFacts.map(fact => `<li>${fact}</li>`).join("");

        // Store the date so we can update again tomorrow
        localStorage.setItem('lastUpdatedDate', currentDate.toISOString());
    }

    // Display current date
    document.getElementById("currentDate").innerText = currentDate.toLocaleDateString();
}

// Initialize the daily content
updateFactQuoteAndDisability();
