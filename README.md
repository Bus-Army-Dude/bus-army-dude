# Link in Bio Website

Welcome to the repository for my **Link in Bio** website. This site serves as a centralized hub for all my important links, shoutouts, and updates, including a detailed **Weather Page** for real-time weather information. The site focuses on accessibility, security, and responsive design to ensure a seamless experience across all devices.

The current version of the website is **v1.16.0**

---

## Features

### Home Page

The **Home Page** contains the following sections:

#### 1. **Profile Section**
   - Displays my username, including a bio, profile image.
   - The buttons to take you to all of the other pages of my website (weather, settings, and merch pages)

#### 2. **Connect with Me**
   - Contains links to various social media platforms.
   - Users can click these links, but cannot modify or alter them.

#### 3. **Current President**
   - Shows the current president or leader of the United States of America.
   - **Information Provided**:
       - **Picture:** Shows the photo of the president.
       - **Name:** Shows the First Name, Middle Initial, and Last Name. 
       - **Born:** Shows when the president was born (Month, Day, Year).
       - **Height:** Shows how tall the president is.
       - **Party:** Shows what Political Party the president is (Republican or Democrat)
       - **Presidential Term:** Shows the term of the president (Start date from when they took office icluding the time, then the last date they will leave office including the time).
       - **Vice President:** Shows who the presidents Vice President is.

#### 4. **TikTok, Instagram, YouTube Creator Shoutouts**
   - Lists creators on TikTok, Instagram, and YouTube who I follow or collaborate with.
   - Users can visit their profiles but cannot modify the list of creators.

#### 5. **Useful Links**
   - Displays important links that I want to share with visitors (e.g., personal websites, resources).
   - The links open in a new tab and cannot be edited by users.

#### 6. **Countdown**
   - Shows a countdown timer to a specified event (e.g., product launch or personal event).
      - The countdown is based off the users timezone from there device.
      - Has the following (Year, Month, Day, Hour, Minute, and Second)

#### 7. **Upcoming Events**
   - Displays a list of upcoming events, including details like event names, dates, and locations.
        - The events times and how long till the event starts shows based off the users timezone of there                 devices.
    
#### 8. **Business Information**
   - Displays the owners business information as follows:
        - Business Name
        - Conatact Email
        - The users current timezone
        - Then business hours (the times also match the users timezone differences)
        - then the status (Open/Closed)
        - Holiday Hours (only shows when there is a holiday also affects normal hours. Shows the open and 
        closing times or if the business is closed)
        - Special Hours (only shows when there is a special day also affects normal hours. Shows the open and 
        closing times or if the business is closed)

#### 9. **FAQ**
   - Provides answers to frequently asked questions about me or the website.
   - Only one faq can be open at a time.

#### 10. **Tech Information**
   - Displays the current tech that the owner has and it displays the following:
        - Model
        - Material
        - Storage
        - Battery Capacity
        - Color
        - Price
        - Date released
        - Date Bought
        - OS Version
        - Battery Health (If applicaple)
        - Battery Charge Cyles (If applicaple)
    
#### 11. **Disabilities**
   - Displays the disabilities the owner has.
        - Each disability also is a button that takes the user to the offical website to tell them about the            disability
        - and when the user hover's over the button it has a hover animation.

#### 12. **Version Information**
   - Displays the version info of the website as follows:
        - Version Number
        - Build Number
        - The users current Date and Time
        - The users operating system
        - The users device
        - then when the page will refresh (every 5 minutes)

#### 13. **Notice Information**
   - This website displays the following:
        - Watermark notice
        - Legal Notice
   
---

## Weather Page (Introduced in v1.15.0)

The **Weather Page** was added in version **v1.15.0** and is designed to provide real-time, detailed weather information for any city selected by the user. Below is a comprehensive breakdown of the features on the Weather Page:

### Main Features

1. **Current Conditions**
   - **Temperature**: Displays the current temperature with options to view it in **Celsius (°C)**, **Fahrenheit (°F)**, or **Kelvin (K)**.
   - **Weather Icon**: Shows an icon representing the current weather conditions (e.g., sun, clouds, rain).
   - **Conditions Title**: A text description of the current weather (e.g., Sunny, Cloudy).
   - **Current Date**: Shows the current date at the top of the page.
   - **Location Details**: Displays the selected **City**, **State**, and **Country** under the current conditions.

2. **5-Day Forecast**
   - Provides a 5-day weather forecast, with each day's details including:
     - **Weather Icon**: An icon representing the forecasted conditions.
     - **Temperature**: The forecasted temperature in °C, °F, or K.
     - **Day of the Week**: The name of the day (e.g., Monday, Tuesday).

3. **Today's Highlights**
   - A section providing key weather highlights for the day, including:
     - **Air Quality Index (AQI)**:
       - **PM2.5**
       - **SO2**
       - **NO2**
       - **O3**
     - **Sunrise & Sunset Times**: Displays the times for sunrise and sunset.
     - **Humidity**: Shown on the left, with values in percentage.
     - **Pressure**: Displayed on the right, with units that can be converted between:
       - **mbar**
       - **inHg**
       - **mmHg**
       - **hPa**
       - **kPa**
     - **Feels Like**: Displays the "feels like" temperature with conversion options between **Fahrenheit (°F)**, **Celsius (°C)**, and **Kelvin (K)**.

4. **Today at (Hourly Forecast)**
   - Provides an hourly breakdown of today's weather conditions, displayed in card format. Each card includes:
     - **Time**: The hour (with the option to show in 24-hour or 12-hour format).
     - **Weather Icon**: An icon representing the conditions at that hour.
     - **Temperature**: Temperature for that hour in °C, °F, or K.
     - **Wind Direction & Speed**: The wind direction is shown with an arrow, and the speed can be converted between:
       - **m/s**
       - **mph**
       - **km/h**
       - **knots (kts)**
       - **Beaufort scale**

### Search Bar
   - Located at the top of the page, the **Search Bar** allows users to search for a city by name.
   - Upon searching, the city name, state, and country are displayed under the search result.

### Weather Settings
   - Located in a module, the **Settings** section allows users to control how they want the weather information displayed:
     1. **Conversion Settings**:
        - **Temperature**: Choose between **Celsius**, **Fahrenheit**, or **Kelvin**.
        - **Wind Speed**: Select the unit for wind speed (m/s, mph, km/h, knots, or Beaufort scale).
        - **Pressure**: Choose the unit for pressure (mbar, inHg, mmHg, hPa, kPa).
     2. **Display**:
        - **24-Hour Format**: Currently Disabled and can't be enabled (feature coming soon).
     3. **Privacy**:
        - **Location Services**: When turned off, this option disables the website's ability to fetch the user’s location automatically.

### Home Page Button
   - A **Home Page** button is located outside the settings module, allowing users to return to the main homepage.

---

## Settings Page

The **Settings Page** allows users to adjust appearance and accessibility options, while certain settings are restricted to the owner.

### Appearance Settings
   - **Light/Dark Mode Toggle**: Allows users to switch between light and dark themes.
   - **Text Size Control**: Users can adjust the text size between 12px and 24px, with 16px as the default.

### Accessibility Settings
   - **Focus Outline Toggle**: Enables or disables the focus outline for keyboard navigation.

### Owner-Only Settings
   - **Maintenance Mode**: Allows me to temporarily take the site down for maintenance.
   - **Profile Status**: Displays my status as **Online**, **Offline**, or **Idle**.
   - **Reset to Factory Settings**: Resets all settings to their default values.

---

## Blog Page (Introduced in v1.15.0)

The **Blog Page** was added in version **v1.15.0** and is designed to provide users with a streamlined way to read and explore blog posts. Below is a comprehensive breakdown of the features on the Blog Page:

### Main Features

1. **Category Dropdown**
   - The **Category Dropdown** allows users to filter blog posts by category (e.g., Technology, Health, Business, etc.).

2. **Blog Post Cards**
   - The blog posts are displayed in cards, each containing:
     - **Image**: A thumbnail image representing the post.
     - **Title**: The title of the blog post.
     - **Short Description**: A brief summary of the post.
     - **Posted Time & By**: Displays when the post was made (e.g., "1 day ago") and the author’s name.

3. **Blog Post Modal**
   - When a user clicks on a blog post card, a modal opens with the following structure:
     - **Category**: Displays the category of the blog post.
     - **Title**: The title of the post.
     - **Short Description**: A brief description of the post.
     - **Posted By & Date**: Shows who posted the blog and when (in a relative format like "1 day ago").
     - **Image**: An image associated with the post.
     - **Content**: The full content of the blog post.
     - **Close Button**: A button to close the modal. Users can also press the `Esc` key to close the modal.

4. **Filter by Time**
   - A **Filter by Time** dropdown allows users to filter blog posts by when they were posted:
     - **Anytime**
     - **Past Hour**
     - **Past 24 Hours**
     - **Past Week**
     - **Past Year**

5. **Home Button**
   - A **Home Page** button is located outside the modal, allowing users to return to the main homepage.

---

## Security Features

The website is designed with several security measures to protect content:

- **Copy & Pasting Prevention**: Prevents text copying.
- **Printing Prevention**: Displays a blank screen when attempting to print.
- **Drag and Drop Disabled**: Stops users from dragging content off the site.
- **Text Selection Disabled**: Blocks visitors from selecting text.
- **Right-Click Disabled**: Disables right-click to prevent saving images or accessing developer tools.
- **Image Saving Disabled**: Stops users from downloading images.

---

## Coding Languages & Technologies

This website is built using a combination of **JavaScript**, **CSS**, and **HTML**. Below is the breakdown of language usage:

- **JavaScript**: 59.7%  
   JavaScript powers the interactive elements of the website, such as settings management, dynamic weather updates, and user interface interactions.

- **CSS**: 26.2%  
   CSS controls the visual styling and ensures the website is fully responsive, including support for both light and dark themes and device-specific layouts.

- **HTML**: 14.1%  
   HTML provides the basic structure and content of the site, serving as the backbone of the Home Page, Weather Page, and Settings Page.

---

## Version History

- **v1.16.0**: Introduced the **Admin Portal**, used to manage all the content on the website that only the owner can access
- **v1.15.0**: Introduced the **Weather Page**, including detailed weather conditions, forecasts, and highlights.
- **v1.14.0**: Theme Consistency and performance optimization.
- **v1.13.0**: added the toggle button focus outline, also enhancements.
- **v1.12.0**: added a merch store page.
- **v1.11.0**: added a settings page for dark mode and light modem, font adjustments, and reset to factory settings.
- **v1.10.1**: added a current day highlighted and also enhanced the event module and enhanced the theme.
- **v1.10.0**: added a faq section, added a event calendar, and bug fixes.
- **v1.9.0**: added tiktok creator shoutouts, added a tech information section, added disabilites, version information, and legal and copyright notice.
- **v1.8.0**: added rednote same format as youtube and instagram, and General Enhancements.
- **v1.7.0**: Security enhancements such as preventing media saving and also text copying.
- **v1.6.0**: Bug fixes and added instagram and youtube creator shoutouts and last updated stamps.
- **v1.5.0**: Bug fixes and improvements.

---

## Conclusion

This **Link in Bio** website is a powerful tool for showcasing my links, profiles, and updates. Visitors can interact with certain sections, but only I can modify the content. The new **Weather Page** provides comprehensive weather details, enhancing the user experience with real-time data and customization options.

If you have any feedback or questions, feel free to reach out through the **Connect with Me** section. Thanks for visiting!
