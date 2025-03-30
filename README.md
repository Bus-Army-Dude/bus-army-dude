# Link in Bio Website

Welcome to the repository for my **Link in Bio** website. This site serves as a centralized hub for all my important links, shoutouts, and updates, including a detailed **Weather Page** for real-time weather information. The site focuses on accessibility, security, and responsive design to ensure a seamless experience across all devices.

The current version of the website is **v1.15.0**, with the addition of the new **Weather Page**.

---

## Features

### Home Page

The **Home Page** contains the following sections:

#### 1. **Profile Section**
   - Displays my personal profile information, including a bio, profile image, and my social media links.
   - The links provide direct access to my social media profiles such as Instagram, TikTok, YouTube, and more.

#### 2. **Connect with Me**
   - Contains links to various social media platforms and direct contact options (like email).
   - Users can click these links, but cannot modify or alter them.

#### 3. **Current President**
   - Dynamically shows the current president or leader of the visitor's country, based on location.

#### 4. **TikTok, Instagram, YouTube Creator Shoutouts**
   - Lists creators on TikTok, Instagram, and YouTube who I follow or collaborate with.
   - Users can visit their profiles but cannot modify the list of creators.

#### 5. **Useful Links**
   - Displays important links that I want to share with visitors (e.g., personal websites, resources).
   - The links open in a new tab and cannot be edited by users.

#### 6. **Countdown**
   - Shows a countdown timer to a specified event (e.g., product launch or personal event).

#### 7. **Upcoming Events**
   - Displays a list of upcoming events, including details like event names, dates, and locations.

#### 8. **FAQ**
   - Provides answers to frequently asked questions about me or the website.

#### 9. **Tech Information**
   - Displays technical details about the website's framework and technology stack.

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
        - **24-Hour Format**: Enable or disable 24-hour format for time display.
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

- **JavaScript**: 44.1%  
   JavaScript powers the interactive elements of the website, such as settings management, dynamic weather updates, and user interface interactions.

- **CSS**: 35.6%  
   CSS controls the visual styling and ensures the website is fully responsive, including support for both light and dark themes and device-specific layouts.

- **HTML**: 20.3%  
   HTML provides the basic structure and content of the site, serving as the backbone of the Home Page, Weather Page, and Settings Page.

---

## Version History

- **v1.15.0**: Introduced the **Weather Page**, including detailed weather conditions, forecasts, and highlights.
- **v1.14.0**: Accessibility improvements and minor bug fixes.
- **v1.13.0**: Enhanced security features and performance improvements.
- **v1.12.0**: UI improvements for better mobile responsiveness.

---

## Conclusion

This **Link in Bio** website is a powerful tool for showcasing my links, profiles, and updates. Visitors can interact with certain sections, but only I can modify the content. The new **Weather Page** provides comprehensive weather details, enhancing the user experience with real-time data and customization options.

If you have any feedback or questions, feel free to reach out through the **Connect with Me** section. Thanks for visiting!
