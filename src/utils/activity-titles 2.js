// Title templates with placeholders:
// {distance} - distance in km
// {type} - activity type (Run, Ride, etc.)
// {time} - duration in minutes
// {elevation} - elevation gain in meters

export const activityTitles = [
  "I thought they said 'rest day' not 'stress day' 😅",
  "My workout was so intense, even my sweat is sweating 💦",
  "Just did a plank. I now understand why buildings need strong foundations 🏗️",
  "Dear Abs, we'll meet one day. Sincerely, Pizza Lover 🍕",
  "I'm in a committed relationship with my foam roller 🤸‍♂️",
  "My muscles are like 'Oh, you remember us now?' 💪",
  "I don't sweat, I leak awesomeness 🌟",
  "Today's workout sponsored by caffeine and determination ☕",
  "My fitness goal: become strong enough to open all the jars 🫙",
  "I'm not out of shape, I'm just storing energy for winter 🐻",
  "Just did burpees. Pretty sure they were invented by a supervillain 😈",
  "My workout playlist is longer than my actual workout 🎵",
  "I flex so hard, my selfies take themselves 📸",
  "Just finished leg day. Walking is now optional 🦿",
  "My protein shake brings all the gains to the yard 🥤",
  "I'm not lazy, I'm on energy-saving mode 🔋",
  "Warning: May spontaneously talk about fitness 🗣️",
  "My workout buddy is my inner voice saying 'one more rep' 🧘‍♂️",
  "I run because I really like eating 🏃‍♂️",
  "My muscles are confused but they'll thank me later 🤔",
  "Just did yoga. Namaste in bed next time 🧘‍♀️",
  "My idea of a balanced diet is a cookie in each hand 🍪",
  "I thought HIIT was a typo for HIT. Big mistake. 🥵",
  "My workout face looks like I'm solving calculus 🤓",
  "I don't need a gym, I carry emotional baggage 🎒",
  "Just did cardio. Heart said yes, legs said maybe tomorrow 💓",
  "My fitness journey is powered by spite and coffee ⚡",
  "I flex when I walk past windows too 🪟",
  "My workout routine is like my coffee - strong and intense ☕",
  "Just finished exercising. Time to exercise my right to nap 😴"
];

// Counter to keep track of which title was last used
let titleIndex = 0;

export const getNextTitle = () => {
  const title = activityTitles[titleIndex];
  titleIndex = (titleIndex + 1) % activityTitles.length; // Reset to 0 when we reach the end
  return title;
};

// Function to format the title with actual values
export const formatTitle = (template, activity) => {
  // Since we're using static jokes now, we don't need to format anything
  return template;
}; 