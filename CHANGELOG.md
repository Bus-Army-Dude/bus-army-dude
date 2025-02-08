# Changelog

All notable changes from v1.5.0 to v1.11.0 are documented in this file.  
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.5.0] (Initial Release)

### 🎉 What's New
**Added**
- **Dark Mode Default:** Dark mode is now the default and cannot be turned off by users, ensuring a unified visual experience across the platform.
- **Centered Footer:** The footer is now centered and styled with a sleek design for better balance and readability.
- **Copyright Protection Notices:**  
  New footer text sections:
  - "Copying and pasting is disabled on this website."
  - "This repository is protected by copyright laws. You may not clone, fork, or redistribute this repository in any form. Unauthorized use of the repository may result in legal action."  
  These notices are highlighted with a red background and white text for clarity and emphasis.
- **UI/UX Styling Update:**  
  - **Dark Gray Background:** The entire website now features a dark gray background paired with high-contrast, easy-to-read text for improved accessibility.

### 🚀 Improvements
- **Mobile Responsiveness:** Adjusted product category displays to ensure smooth scrolling and no content cut-off on smaller devices.
- **Footer Alignment:** Improved footer layout and alignment for all screen sizes, ensuring it remains centered on all devices.

### 🐛 Bug Fixes
- **Footer Text Overflow:** Resolved a minor text overflow issue with the copyright and legal notices.

### 🔜 Known Issues
- **Dark Mode Default:** Some users may encounter minor display issues with certain text or visual elements due to the forced dark mode. A fix addressing these issues is expected in the next release.

---

## [v1.5.1] - January 2025

### Dark Mode Permanency
- **What Changed:** Dark mode is now permanently enabled across the website. Users will no longer have the option to switch to light mode.
- **Reason:** To create a consistent and modern user experience, especially in low-light environments.
- **Impact:** The website will always render in dark mode, ensuring ease of reading and navigation without theme toggling.

### Last Updated Timestamp for TikTok Creator Shoutouts
- **What Changed:** Introduced a new "Last Updated" timestamp directly under the TikTok Creator Shoutouts section.
- **Reason:** To provide transparency on when follower counts or related data were last refreshed by the owner.
- **How It Works:**  
  - The timestamp is displayed in a 12-hour format (e.g., 03:30 PM) and automatically adjusts to the user's local timezone.
  - It is manually updated by the owner whenever changes occur.
- **Impact:** Users can verify that the data is current and understand when the information was last refreshed.

---

## [v1.6.0] - January 6, 2025

### **Bug Fix:** Dark Mode Default Issue
- **What Changed:** Resolved the bug that prevented Dark Mode from being set as the permanent default.
- **Reason:** To ensure that Dark Mode remains the only available theme.
- **Impact:** All users now consistently experience the website in Dark Mode without unexpected theme changes.
- **How It Works:** The Dark Mode settings have been hardcoded into the core CSS and JavaScript, and the option to toggle to Light Mode has been completely removed.

### **New Feature:** Instagram Creator Shoutouts
- **What Changed:** Added a dedicated section for Instagram Creator Shoutouts.
- **Reason:** To allow the website owner to manually select and showcase featured Instagram creators.
- **Impact:** Visitors can now view highlighted Instagram creators with direct links to their profiles.

---

## [v1.7.0] - December 20, 2024

### New Features and Improvements

#### AI-Based Security Enhancements
- **Screenshot Prevention (Blur Effect)**
  - **What Changed:** Implemented a mechanism that detects screenshot attempts and applies a blur effect across the page.
  - **Reason:** To prevent users from capturing sensitive or copyrighted content.
  - **Impact:** Screenshots taken will display a blurred page, protecting the content.
  - **How It Works:** On detection (via PrintScreen or touch gestures), JavaScript applies a temporary blur.

- **Prevent Media Saving (Images/Videos)**
  - **What Changed:** Disabled right-click, touch drag actions, and saved media functionality.
  - **Reason:** To stop users from saving images and videos from the website.
  - **Impact:** Media content cannot be downloaded or saved directly.
  - **How It Works:** Specific event handlers disable interactions like right-clicking and dragging.

- **Text Copying and Selection Disabled**
  - **What Changed:** Disabled text selection, copying, cutting, and pasting site-wide.
  - **Reason:** To prevent unauthorized copying of the website’s content.
  - **Impact:** Users are unable to copy any text from the site.
  - **How It Works:** CSS and JavaScript prevent text selection and clipboard actions.

- **Prevent Printing**
  - **What Changed:** Disabled print functionality for the webpage.
  - **Reason:** To protect content from being printed.
  - **Impact:** Users cannot use standard print commands (e.g., Ctrl+P) to print the page.
  - **How It Works:** Print styles and JavaScript disable printing.

- **Prevent Screenshot (Using PrintScreen Key)**
  - **What Changed:** Disabled functionality for the PrintScreen key.
  - **Reason:** To further protect the website’s content.
  - **Impact:** Key presses for screenshots are blocked.
  - **How It Works:** JavaScript listens for and blocks the PrintScreen key event.

- **Disable Right-Click Menu**
  - **What Changed:** Completely disabled the right-click context menu.
  - **Reason:** To prevent users from accessing options to save or copy content.
  - **Impact:** Right-click actions are intercepted and prevented.
  - **How It Works:** JavaScript prevents default right-click behavior.

- **Disable Dragging Images**
  - **What Changed:** Disabled image dragging.
  - **Reason:** To prevent users from saving images by dragging them.
  - **Impact:** Images cannot be dragged out of the browser.
  - **How It Works:** Drag events are disabled via JavaScript.

- **Prevent Media from Being Clicked**
  - **What Changed:** Blocked click events on media files.
  - **Reason:** To prevent opening or saving media via click interactions.
  - **Impact:** Media files are non-interactive in terms of saving or enlarging.
  - **How It Works:** Click events on media elements are disabled with JavaScript.

#### General Enhancements
- **Improved Mobile Compatibility:** Fixed scrolling issues on mobile devices.
- **Optimized Performance:** Enhanced AI feature performance for smoother interactions.

#### Bug Fixes
- **Fixed Scroll Lock on Mobile:** Resolved issues that restricted scrolling on mobile devices.

---

## [v1.8.0] - Release Date Not Specified

### New Features and Improvements

#### Creator Shoutouts Enhancements
- **Red Note Creator Shoutouts**
  - **What Changed:** Added support for Red Note Creator Shoutouts featuring creator names and fan counts.
  - **Reason:** To include another layer of creator promotion.
  - **Impact:** Red Note creators now appear above Instagram Shoutouts.
  - **How It Works:** The list displays names with fan counts and includes a verification checkmark.

- **Verification Checkmark**
  - **What Changed:** Introduced a custom verification checkmark for Red Note creators.
  - **Reason:** To visually distinguish verified creators.
  - **Impact:** Verified creators display a rednotecheck icon next to their usernames.
  - **How It Works:** The checkmark is dynamically added to verified accounts.

- **Instagram and YouTube Enhancements**
  - **What Changed:** Added follower and subscriber counts for Instagram and YouTube creators.
  - **Reason:** To provide more detailed creator statistics.
  - **Impact:** Detailed counts are now visible next to each creator’s name.
  - **How It Works:** Counts are dynamically fetched and displayed.

- **Profile Pictures**
  - **What Changed:** Added profile pictures for creators on the shoutouts page.
  - **Reason:** To improve visual appeal.
  - **Impact:** Creators’ profile pictures are now displayed alongside their information.
  - **How It Works:** Profile images are pulled from APIs or provided manually.

#### General Enhancements
- **Improved Shoutouts Page Layout:** Enhanced layout for better organization and readability of creator information.

---

## [v1.9.0] - Release Date Not Specified

### What's Changed

1. **TikTok Creator Shoutouts Section**
   - **Description:** Added a section for TikTok Creator Shoutouts displaying profile pictures, names, verification checkmarks, follower counts, and profile links.
   - **Reason:** To provide dynamic TikTok creator details based on regional availability.
   - **Impact:** Creator information updates dynamically based on whether TikTok is available in the user's region.
   - **How It Works:** Creators are shown in a grid format; if TikTok is unavailable in a region, a custom message is displayed.

2. **Weather Section Added**
   - **Description:** Introduced a live weather section that displays current weather based on the user’s location.
   - **Reason:** To give users quick access to real-time weather updates.
   - **Impact:** Users can view weather information without leaving the site.
   - **How It Works:** Geolocation is used to fetch and display dynamic weather data.

3. **Tech Information Section**
   - **Description:** Added a section that provides detailed technical specifications for products (e.g., iPhone 16 Pro, Apple Watch Ultra 2, Mac Mini M2).
   - **Reason:** To highlight key tech products and provide detailed information.
   - **Impact:** Users can easily access important technical details.
   - **How It Works:** Technical specifications are displayed in a clean, organized format.

4. **Disabilities Section**
   - **Description:** Added a section with links to resources explaining specific disabilities.
   - **Reason:** To raise awareness and provide helpful accessibility resources.
   - **Impact:** Users can access external resources about disabilities directly from the site.
   - **How It Works:** Contains external links that open in new tabs.

5. **Version Information Section**
   - **Description:** Displays build number, device details, current date/time, and a page refresh timer.
   - **Reason:** To provide transparency about system and version details.
   - **Impact:** Enhances user awareness of the site's technical status.
   - **How It Works:** Session details are updated dynamically on page refresh.

6. **Legal and Copyright Notices**
   - **Description:** Added footer notices regarding copyright protection and usage restrictions.
   - **Reason:** To protect content and deter unauthorized usage.
   - **Impact:** Unauthorized cloning, forking, or redistribution is discouraged.
   - **How It Works:** Notices are displayed with a red background and white text for emphasis.

---

## [v1.10.0] - Release Date Not Specified

### What Changed

1. **FAQ Section**
   - **Added:** A dedicated FAQ section addressing common questions about the website, content, and technical details.
   - **Reason:** To provide quick answers to frequently asked questions and reduce direct support requests.
   - **Impact:** Visitors can find solutions without leaving the site.
   - **How It Works:** A static page with expandable Q&A items.

2. **Event Calendar for Live Streams and Updates**
   - **Added:** A dynamic event calendar displaying important dates for live streams, events, and website updates (including time, date, and links).
   - **Reason:** To keep users informed about upcoming events.
   - **Impact:** Users have a clear overview of scheduled events.
   - **How It Works:** The calendar loads events dynamically; clicking on a date opens a modal with event details.

#### Bugs Encountered
1. **Calendar Display Bug**
   - **Issue:** On initial page load, only navigation buttons and days of the week were visible until user interaction.
   - **Fix:** Corrected the load process to display the full calendar immediately.
2. **Mobile Responsiveness**
   - **Issue:** The days of the week were getting cut off on mobile devices.
   - **Fix:** Adjusted layout to ensure full visibility across all screen sizes.
3. **Text Blending in Event Modal**
   - **Issue:** Event details in the modal were hard to read due to text blending with the background.
   - **Fix:** Enhanced styling of the modal for better contrast and readability.

---

## [v1.10.1] - Release Date Not Specified

### What Changed

1. **Current Day Highlighting in Calendar**
   - **Added:** A feature to automatically highlight the current day based on the user's local timezone.
   - **Reason:** To provide a clear visual cue of the current date.
   - **Impact:** Users can easily identify the current day.
   - **How It Works:** The current day is highlighted with distinct styling that updates based on the user's timezone.

2. **Enhanced Event Modal**
   - **Added:** Refined design and functionality of the event modal for improved interaction.
   - **Reason:** To offer a cleaner, more accessible view of event details.
   - **Impact:** Users now experience a more polished modal with improved readability.
   - **How It Works:** Updated typography, spacing, and contrast within the modal.

3. **Calendar Event Indicators**
   - **Improved:** Made event indicators more visible on the calendar.
   - **Reason:** To ensure that dates with events are easily identifiable.
   - **Impact:** Navigation is smoother with clearly marked event days.
   - **How It Works:** Adjusted logic to correctly place visual indicators on calendar days.

4. **Theme Consistency Across Sections**
   - **Changed:** Updated all sections to match the unified website theme.
   - **Reason:** To maintain a cohesive look and feel across the site.
   - **Impact:** The FAQ, event calendar, and modals now have a consistent design.
   - **How It Works:** Visual elements such as colors, buttons, and fonts have been standardized.

#### Bugs Encountered
1. **Event Indicator Display Issue**
   - **Issue:** Event indicators were not always appearing on the correct days.
   - **Fix:** Adjusted the logic to correctly display indicators.
2. **Calendar Navigation Issue**
   - **Issue:** The event modal sometimes failed to show events correctly when navigating between months.
   - **Fix:** Ensured proper event display during calendar navigation.
3. **Mobile Display Issue**
   - **Issue:** Calendar layout misaligned on smaller screens.
   - **Fix:** Refined layout adjustments for full responsiveness.

---

## [v1.11.0] - Release Date Not Specified

### What Changed

1. **Settings Page Overhaul**
   - **Added:** A new settings page layout divided into sections for Appearance, Accessibility, and Danger Zone.
   - **Reason:** To improve organization and usability.
   - **Impact:** Users can more easily find and adjust settings.
   - **How It Works:** The settings page is restructured with clear, modern sections inspired by Apple’s design aesthetics.

2. **Dark Mode Improvements**
   - **Improved:** Enhanced dark mode styling across the entire site for better readability and consistency.
   - **Reason:** To ensure a cohesive dark mode experience.
   - **Impact:** Users will enjoy a visually appealing and uniform dark mode.
   - **How It Works:** Adjustments were made to color schemes, contrast, and element styling.

3. **Light/Dark Mode Toggle**
   - **Added:** An option on the settings page to toggle between light and dark modes.
   - **Reason:** To provide users with the flexibility to choose their preferred theme.
   - **Impact:** Users can now switch themes according to their preference.
   - **How It Works:** A toggle switch in the settings allows seamless switching between themes.

4. **Font Size Adjustment**
   - **Added:** An option under Accessibility in the settings page to adjust the font size.
   - **Reason:** To allow users to customize text size for better readability.
   - **Impact:** Users can increase or decrease font size as needed.
   - **How It Works:** Font size controls dynamically adjust text on the site.

5. **Reset to Factory Settings**
   - **Added:** A Reset to Factory Settings option in the Danger Zone section.
   - **Reason:** To let users easily revert all settings to their default values.
   - **Impact:** Users can reset their custom settings with one click.
   - **How It Works:** The reset button clears all changes and restores default configurations.

6. **Countdown Timer Enhancements**
   - **Improved:** Enhanced centering and alignment of the countdown timer.
   - **Reason:** To improve visual appeal and readability.
   - **Impact:** Users experience a more polished, user-friendly countdown timer.
   - **How It Works:** CSS adjustments ensure proper alignment and responsiveness.

7. **Theme Consistency Across Sections**
   - **Changed:** Updated all website sections to conform to the unified theme.
   - **Reason:** To create a cohesive design across all pages.
   - **Impact:** Consistent visual style is now maintained throughout the site.
   - **How It Works:** Standardized colors, buttons, and fonts are applied site-wide.

8. **Responsive Design Improvements**
   - **Improved:** Enhanced the website’s responsiveness for mobile, tablet, and desktop devices.
   - **Reason:** To ensure a seamless user experience across all devices.
   - **Impact:** The website adapts perfectly to different screen sizes.
   - **How It Works:** CSS and layout adjustments optimize responsiveness.

9. **Settings Page Access Button**
   - **Added:** A button in the top profile section linking directly to the settings page.
   - **Reason:** To provide quick and easy access to settings.
   - **Impact:** Users can navigate to the settings page directly from their profile.
   - **How It Works:** The button is prominently placed in the top profile section and redirects on click.
