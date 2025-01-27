// globalSettings.js
class GlobalSettings {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            language: 'en',
            fontSize: 16
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    init() {
        this.applyDarkMode(this.settings.darkMode);
        this.applyFontSize(this.settings.fontSize);
        this.applyLanguage(this.settings.language);

        window.addEventListener('storage', (e) => {
            if (e.key === 'websiteSettings') {
                this.settings = JSON.parse(e.newValue);
                this.applyAllSettings();
            }
        });
    }

    getTranslations() {
        return {
            en: {
                // Header and Profile
                "settings": "Settings",
                "profileTitle": "Bus Army Dude's Profile",
                "currentPresident": "CURRENT PRESIDENT: Trump (2025-2029), Political party: Republican",
                
                // Settings Page
                "darkMode": "Dark Mode",
                "darkModeDesc": "Switch between light and dark theme",
                "language": "Language",
                "languageDesc": "Choose your preferred language",
                "fontSize": "Font Size",
                "fontSizeDesc": "Adjust text size",
                "backToProfile": "← Back to Profile",
                
                // Social Links
                "connectWithMe": "Connect with Me",
                "tiktok": "TikTok",
                "snapchat": "Snapchat",
                "twitter": "X (Twitter)",
                "twitch": "Twitch",
                "facebook": "Facebook",
                "steam": "Steam",
                "discord": "Discord",
                "instagram": "Instagram",
                "threads": "Threads",

                // Useful Links
                "usefulLinks": "Useful Links",
                "merchStore": "Merch Store (Printify)",
                "merchStoreFourthwall": "Merch Store (Fourthwall)",
                "discordServer": "Join the Bus Army Dude's Community Discord Server!",
                "bugReport": "Bug Report Form!",
                "feedback": "Feedback or Suggestions Form!",

                // Current President Section
                "presidentTitle": "Current U.S. President",
                "presidentName": "Donald J. Trump",
                "born": "Born",
                "height": "Height",
                "party": "Party",
                "presidentialTerm": "Presidential Term",
                "vicePresident": "Vice President",

                // Sections
                "tiktokShoutouts": "TikTok Creator Shoutouts",
                "instagramShoutouts": "Instagram Creator Shoutouts",
                "youtubeShoutouts": "YouTube Creator Shoutouts",
                "latestTiktok": "My Latest TikTok",
                "techInfo": "Tech Information",
                "disabilities": "Disabilities",

                // Version Info
                "versionInfo": "Version Information",
                "version": "Version",
                "build": "Build",
                "deviceInfo": "Device Info",
                "currentDateTime": "Current Date and Time",
                "pageRefresh": "Page refreshing in",

                // Footer
                "copyright": "© 2025 Bus Army Dude. All Rights Reserved."
            },
            es: {
                // Header and Profile
                "settings": "Ajustes",
                "profileTitle": "Perfil de Bus Army Dude",
                "currentPresident": "PRESIDENTE ACTUAL: Trump (2025-2029), Partido político: Republicano",
                
                // Settings Page
                "darkMode": "Modo Oscuro",
                "darkModeDesc": "Cambiar entre tema claro y oscuro",
                "language": "Idioma",
                "languageDesc": "Elige tu idioma preferido",
                "fontSize": "Tamaño de Texto",
                "fontSizeDesc": "Ajustar tamaño del texto",
                "backToProfile": "← Volver al Perfil",
                
                // Social Links
                "connectWithMe": "Conecta Conmigo",
                "tiktok": "TikTok",
                "snapchat": "Snapchat",
                "twitter": "X (Twitter)",
                "twitch": "Twitch",
                "facebook": "Facebook",
                "steam": "Steam",
                "discord": "Discord",
                "instagram": "Instagram",
                "threads": "Threads",

                // Useful Links
                "usefulLinks": "Enlaces Útiles",
                "merchStore": "Tienda de Mercancía (Printify)",
                "merchStoreFourthwall": "Tienda de Mercancía (Fourthwall)",
                "discordServer": "¡Únete al Servidor de Discord de Bus Army Dude!",
                "bugReport": "¡Formulario de Reporte de Errores!",
                "feedback": "¡Formulario de Comentarios o Sugerencias!",

                // Current President Section
                "presidentTitle": "Presidente Actual de EE.UU.",
                "presidentName": "Donald J. Trump",
                "born": "Nacido",
                "height": "Altura",
                "party": "Partido",
                "presidentialTerm": "Período Presidencial",
                "vicePresident": "Vicepresidente",

                // Sections
                "tiktokShoutouts": "Menciones de Creadores de TikTok",
                "instagramShoutouts": "Menciones de Creadores de Instagram",
                "youtubeShoutouts": "Menciones de Creadores de YouTube",
                "latestTiktok": "Mi Último TikTok",
                "techInfo": "Información Técnica",
                "disabilities": "Discapacidades",

                // Version Info
                "versionInfo": "Información de Versión",
                "version": "Versión",
                "build": "Compilación",
                "deviceInfo": "Información del Dispositivo",
                "currentDateTime": "Fecha y Hora Actual",
                "pageRefresh": "La página se actualizará en",

                // Footer
                "copyright": "© 2025 Bus Army Dude. Todos los Derechos Reservados."
            },
            fr: {
                // Header and Profile
                "settings": "Paramètres",
                "profileTitle": "Profil de Bus Army Dude",
                "currentPresident": "PRÉSIDENT ACTUEL : Trump (2025-2029), Parti politique : Républicain",
                
                // Settings Page
                "darkMode": "Mode Sombre",
                "darkModeDesc": "Basculer entre thème clair et sombre",
                "language": "Langue",
                "languageDesc": "Choisissez votre langue préférée",
                "fontSize": "Taille de Police",
                "fontSizeDesc": "Ajuster la taille du texte",
                "backToProfile": "← Retour au Profil",
                
                // Social Links
                "connectWithMe": "Connectez-vous avec Moi",
                "tiktok": "TikTok",
                "snapchat": "Snapchat",
                "twitter": "X (Twitter)",
                "twitch": "Twitch",
                "facebook": "Facebook",
                "steam": "Steam",
                "discord": "Discord",
                "instagram": "Instagram",
                "threads": "Threads",

                // Useful Links
                "usefulLinks": "Liens Utiles",
                "merchStore": "Boutique de Marchandises (Printify)",
                "merchStoreFourthwall": "Boutique de Marchandises (Fourthwall)",
                "discordServer": "Rejoignez le Serveur Discord de Bus Army Dude !",
                "bugReport": "Formulaire de Rapport de Bug !",
                "feedback": "Formulaire de Retour ou Suggestions !",

                // Current President Section
                "presidentTitle": "Président Actuel des États-Unis",
                "presidentName": "Donald J. Trump",
                "born": "Né le",
                "height": "Taille",
                "party": "Parti",
                "presidentialTerm": "Mandat Présidentiel",
                "vicePresident": "Vice-président",

                // Sections
                "tiktokShoutouts": "Mentions des Créateurs TikTok",
                "instagramShoutouts": "Mentions des Créateurs Instagram",
                "youtubeShoutouts": "Mentions des Créateurs YouTube",
                "latestTiktok": "Mon Dernier TikTok",
                "techInfo": "Informations Techniques",
                "disabilities": "Handicaps",

                // Version Info
                "versionInfo": "Informations de Version",
                "version": "Version",
                "build": "Build",
                "deviceInfo": "Info Appareil",
                "currentDateTime": "Date et Heure Actuelles",
                "pageRefresh": "Actualisation de la page dans",

                // Footer
                "copyright": "© 2025 Bus Army Dude. Tous Droits Réservés."
            },
            de: {
                // Header and Profile
                "settings": "Einstellungen",
                "profileTitle": "Bus Army Dude's Profil",
                "currentPresident": "AKTUELLER PRÄSIDENT: Trump (2025-2029), Politische Partei: Republikaner",
                
                // Settings Page
                "darkMode": "Dunkelmodus",
                "darkModeDesc": "Zwischen hellem und dunklem Design wechseln",
                "language": "Sprache",
                "languageDesc": "Wählen Sie Ihre bevorzugte Sprache",
                "fontSize": "Schriftgröße",
                "fontSizeDesc": "Textgröße anpassen",
                "backToProfile": "← Zurück zum Profil",
                
                // Social Links
                "connectWithMe": "Verbinde Dich mit Mir",
                "tiktok": "TikTok",
                "snapchat": "Snapchat",
                "twitter": "X (Twitter)",
                "twitch": "Twitch",
                "facebook": "Facebook",
                "steam": "Steam",
                "discord": "Discord",
                "instagram": "Instagram",
                "threads": "Threads",

                // Useful Links
                "usefulLinks": "Nützliche Links",
                "merchStore": "Merchandise-Shop (Printify)",
                "merchStoreFourthwall": "Merchandise-Shop (Fourthwall)",
                "discordServer": "Tritt dem Bus Army Dude's Discord Server bei!",
                "bugReport": "Fehlerbericht-Formular!",
                "feedback": "Feedback- oder Vorschlagsformular!",

                // Current President Section
                "presidentTitle": "Aktueller US-Präsident",
                "presidentName": "Donald J. Trump",
                "born": "Geboren",
                "height": "Größe",
                "party": "Partei",
                "presidentialTerm": "Präsidentschaftszeit",
                "vicePresident": "Vizepräsident",

                // Sections
                "tiktokShoutouts": "TikTok Creator Shoutouts",
                "instagramShoutouts": "Instagram Creator Shoutouts",
                "youtubeShoutouts": "YouTube Creator Shoutouts",
                "latestTiktok": "Mein Neuestes TikTok",
                "techInfo": "Technische Informationen",
                "disabilities": "Behinderungen",

                // Version Info
                "versionInfo": "Versionsinformationen",
                "version": "Version",
                "build": "Build",
                "deviceInfo": "Geräteinformation",
                "currentDateTime": "Aktuelles Datum und Uhrzeit",
                "pageRefresh": "Seite wird aktualisiert in",

                // Footer
                "copyright": "© 2025 Bus Army Dude. Alle Rechte vorbehalten."
            }
        };
    }

    applyAllSettings() {
        this.applyDarkMode(this.settings.darkMode);
        this.applyFontSize(this.settings.fontSize);
        this.applyLanguage(this.settings.language);
    }

    applyDarkMode(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    applyFontSize(size) {
        size = Math.min(Math.max(size, 12), 20);
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        document.body.style.fontSize = `${size}px`;
        this.settings.fontSize = size;
        this.saveSettings();
    }

    applyLanguage(lang) {
        this.settings.language = lang;
        this.saveSettings();
        this.translatePage(lang);
    }

    translatePage(lang) {
        const translations = this.getTranslations();
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }
}

// Initialize global settings
const globalSettings = new GlobalSettings();
