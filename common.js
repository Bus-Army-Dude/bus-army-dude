class ThemeManager {
    constructor() {
        this.settings = this.loadSettings();
        this.initializeThemeColors();
        this.initializeTranslations();
        this.applySettings();
    }

    loadSettings() {
        const defaultSettings = {
            darkMode: true,
            language: 'en',
            fontSize: 16
        };
        return JSON.parse(localStorage.getItem('websiteSettings')) || defaultSettings;
    }

    initializeThemeColors() {
        // Your existing theme colors
        this.darkTheme = {
            '--bg-color': '#1a1a1a',
            '--text-color': '#ffffff',
            '--secondary-text': '#a0a0a0',
            '--border-color': '#333333',
            '--accent-color': '#4CAF50',
            '--content-bg': '#2d2d2d'
        };

        this.lightTheme = {
            '--bg-color': '#ffffff',
            '--text-color': '#000000',
            '--secondary-text': '#666666',
            '--border-color': '#dddddd',
            '--accent-color': '#4CAF50',
            '--content-bg': '#f5f5f5'
        };
    }

    initializeTranslations() {
    this.translations = {
        // English translations
        en: {
            profileSection: {
                title: "Bus Army Dude's",
                currentPresident: "CURRENT PRESIDENT: Trump (2025-2029), Political party: Republican"
            },
            connects: {
                title: "Connect with Me",
                socialMedia: {
                    tiktok: "TikTok",
                    snapchat: "Snapchat",
                    twitter: "X (Twitter)",
                    twitch: "Twitch",
                    facebook: "Facebook",
                    steam: "Steam",
                    discord: "Discord",
                    instagram: "Instagram",
                    threads: "Threads"
                }
            },
            presidentSection: {
                title: "Current U.S. President",
                name: "Donald J. Trump",
                born: "Born: June 14, 1946",
                height: "Height: 6'3\" (190.5 cm)",
                party: "Party: Republican Party",
                term: "Presidential Term: 1/20/25 at 12:00 PM - 1/20/29 at 12:00 PM",
                vicePresident: "Vice President: James David Vance"
            },
            shoutouts: {
                tiktok: "TikTok Creator Shoutouts",
                instagram: "Instagram Creator Shoutouts",
                youtube: "YouTube Creator Shoutouts",
                latest: "My Latest TikTok"
            },
            links: {
                title: "Useful Links",
                merch1: "Merch Store (Printify)",
                merch2: "Merch Store (Fourthwall)",
                discord: "Join the Bus Army Dude's Community Discord Server!",
                bugReport: "Bug Report Form!",
                feedback: "Feedback or Suggestions Form!"
            },
            countdown: {
                title: "Countdown to AFO Braces",
                days: "Days",
                hours: "Hours",
                minutes: "Minutes",
                seconds: "Seconds"
            },
            faq: {
                title: "Frequently Asked Questions",
                q1: "What is Bus Army Dude about?",
                a1: "Bus Army Dude is a platform where I share my social media presence and connect with my community.",
                q2: "How can I contact you?",
                a2: "You can reach me through any of the social media platforms linked above."
            },
            tech: {
                title: "Tech Information",
                specs: {
                    model: "Model",
                    material: "Material",
                    storage: "Storage",
                    batteryCapacity: "Battery Capacity",
                    color: "Color",
                    price: "Price",
                    dateReleased: "Date Released",
                    dateBought: "Date Bought",
                    osVersion: "OS Version",
                    batteryHealth: "Battery Capacity %",
                    chargeCycles: "Battery Charge Cycles"
                },
                devices: {
                    iphone: {
                        name: "iPhone 16 Pro",
                        details: "Model: iPhone 16 Pro\nMaterial: Titanium\nStorage: 128GB\nBattery: 3,582mAh\nColor: Natural Titanium\nPrice: $1,067.49\nReleased: September 20, 2024\nBought: November 08, 2024\nOS: iOS 18.3 (22D60)\nBattery Health: 100%\nCharge Cycles: 117"
                    },
                    watch: {
                        name: "Apple Watch Ultra 2",
                        details: "Model: Apple Watch Ultra 2\nMaterial: Titanium\nStorage: 64GB\nBattery: 564mAh\nColor: Natural Titanium\nPrice: $853.98\nReleased: September 22, 2023\nBought: May 17, 2024\nOS: WatchOS 11.3 (22S5534d)\nBattery Health: 98%"
                    },
                    mac: {
                        name: "2023 Mac Mini M2",
                        details: "Model: Mac Mini M2 2023\nMaterial: Aluminum\nStorage: 256GB SSD\nColor: Grey\nPrice: $742.29\nReleased: January 17, 2023\nBought: May 16, 2024\nOS: macOS Sequoia 15.3 Beta (24D5055b)"
                    }
                }
            },
            disabilities: {
                title: "Disabilities",
                intro: "I have the following disabilities:",
                list: {
                    asd: "Autism Spectrum Disorder (ASD)",
                    adhd: "Attention Deficit Hyperactivity Disorder (ADHD)",
                    anxiety: "Anxiety Disorder",
                    hydrocephalus: "Hydrocephalus",
                    epilepsy: "Epilepsy (Stress Seizures)",
                    ocd: "Obsessive-Compulsive Disorder (OCD)",
                    ptsd: "Post-Traumatic Stress Disorder (PTSD)",
                    toeWalking: "Idiopathic Toe Walking"
                }
            },
            settings: {
                title: "Settings",
                theme: "Theme Settings",
                darkMode: "Dark Mode",
                lightMode: "Light Mode",
                language: "Language Settings",
                save: "Save Changes",
                reset: "Reset to Default"
            },
            footer: {
                version: "Version: v1.10.1",
                build: "Build: 2025.1.23",
                device: "Device: Loading...",
                time: "Current Date and Time: Loading...",
                refresh: "Page refreshing in: 5 minutes",
                copyright: "© 2025 Bus Army Dude. All Rights Reserved.",
                protection: {
                    watermark: "Protected by Watermark",
                    copy: "This content is protected by a watermark. Unauthorized use is prohibited.",
                    legal: "All content and materials on this website are legally protected."
                }
            }
        },
        // Spanish translations
        es: {
            profileSection: {
                title: "Bus Army Dude",
                currentPresident: "PRESIDENTE ACTUAL: Trump (2025-2029), Partido político: Republicano"
            },
            connects: {
                title: "Conéctate Conmigo",
                socialMedia: {
                    tiktok: "TikTok",
                    snapchat: "Snapchat",
                    twitter: "X (Twitter)",
                    twitch: "Twitch",
                    facebook: "Facebook",
                    steam: "Steam",
                    discord: "Discord",
                    instagram: "Instagram",
                    threads: "Threads"
                }
            },
            presidentSection: {
                title: "Presidente Actual de EE.UU.",
                name: "Donald J. Trump",
                born: "Nacimiento: 14 de junio de 1946",
                height: "Altura: 6'3\" (190,5 cm)",
                party: "Partido: Partido Republicano",
                term: "Período Presidencial: 20/01/25 a las 12:00 PM - 20/01/29 a las 12:00 PM",
                vicePresident: "Vicepresidente: James David Vance"
            },
            shoutouts: {
                tiktok: "Menciones de Creadores de TikTok",
                instagram: "Menciones de Creadores de Instagram",
                youtube: "Menciones de Creadores de YouTube",
                latest: "Mi Último TikTok"
            },
            links: {
                title: "Enlaces Útiles",
                merch1: "Tienda de Mercancía (Printify)",
                merch2: "Tienda de Mercancía (Fourthwall)",
                discord: "¡Únete al Servidor de Discord de la Comunidad Bus Army Dude!",
                bugReport: "¡Formulario de Reporte de Errores!",
                feedback: "¡Formulario de Comentarios o Sugerencias!"
            },
            countdown: {
                title: "Cuenta Regresiva para Aparatos AFO",
                days: "Días",
                hours: "Horas",
                minutes: "Minutos",
                seconds: "Segundos"
            },
            faq: {
                title: "Preguntas Frecuentes",
                q1: "¿Qué es Bus Army Dude?",
                a1: "Bus Army Dude es una plataforma donde comparto mi presencia en redes sociales y me conecto con mi comunidad.",
                q2: "¿Cómo puedo contactarte?",
                a2: "Puedes contactarme a través de cualquiera de las plataformas de redes sociales enlazadas arriba."
            },
            tech: {
                title: "Información Técnica",
                specs: {
                    model: "Modelo",
                    material: "Material",
                    storage: "Almacenamiento",
                    batteryCapacity: "Capacidad de Batería",
                    color: "Color",
                    price: "Precio",
                    dateReleased: "Fecha de Lanzamiento",
                    dateBought: "Fecha de Compra",
                    osVersion: "Versión del SO",
                    batteryHealth: "Salud de Batería %",
                    chargeCycles: "Ciclos de Carga"
                },
                devices: {
                    iphone: {
                        name: "iPhone 16 Pro",
                        details: "Modelo: iPhone 16 Pro\nMaterial: Titanio\nAlmacenamiento: 128GB\nBatería: 3.582mAh\nColor: Titanio Natural\nPrecio: $1.067,49\nLanzamiento: 20 de septiembre de 2024\nCompra: 08 de noviembre de 2024\nSO: iOS 18.3 (22D60)\nSalud de Batería: 100%\nCiclos de Carga: 117"
                    },
                    watch: {
                        name: "Apple Watch Ultra 2",
                        details: "Modelo: Apple Watch Ultra 2\nMaterial: Titanio\nAlmacenamiento: 64GB\nBatería: 564mAh\nColor: Titanio Natural\nPrecio: $853,98\nLanzamiento: 22 de septiembre de 2023\nCompra: 17 de mayo de 2024\nSO: WatchOS 11.3 (22S5534d)\nSalud de Batería: 98%"
                    },
                    mac: {
                        name: "Mac Mini M2 2023",
                        details: "Modelo: Mac Mini M2 2023\nMaterial: Aluminio\nAlmacenamiento: 256GB SSD\nColor: Gris\nPrecio: $742,29\nLanzamiento: 17 de enero de 2023\nCompra: 16 de mayo de 2024\nSO: macOS Sequoia 15.3 Beta (24D5055b)"
                    }
                }
            },
            disabilities: {
                title: "Discapacidades",
                intro: "Tengo las siguientes discapacidades:",
                list: {
                    asd: "Trastorno del Espectro Autista (TEA)",
                    adhd: "Trastorno por Déficit de Atención e Hiperactividad (TDAH)",
                    anxiety: "Trastorno de Ansiedad",
                    hydrocephalus: "Hidrocefalia",
                    epilepsy: "Epilepsia (Convulsiones por Estrés)",
                    ocd: "Trastorno Obsesivo Compulsivo (TOC)",
                    ptsd: "Trastorno de Estrés Postraumático (TEPT)",
                    toeWalking: "Marcha de Puntillas Idiopática"
                }
            },
            settings: {
                title: "Configuración",
                theme: "Configuración de Tema",
                darkMode: "Modo Oscuro",
                lightMode: "Modo Claro",
                language: "Configuración de Idioma",
                save: "Guardar Cambios",
                reset: "Restablecer Valores Predeterminados"
            },
            footer: {
                version: "Versión: v1.10.1",
                build: "Compilación: 2025.1.23",
                device: "Dispositivo: Cargando...",
                time: "Fecha y Hora Actual: Cargando...",
                refresh: "La página se actualizará en: 5 minutos",
                copyright: "© 2025 Bus Army Dude. Todos los derechos reservados.",
                protection: {
                    watermark: "Protegido por Marca de Agua",
                    copy: "Este contenido está protegido por una marca de agua. Uso no autorizado prohibido.",
                    legal: "Todo el contenido y materiales en este sitio web están protegidos legalmente."
                }
            }
        },
        // French translations
        fr: {
            profileSection: {
                title: "Bus Army Dude",
                currentPresident: "PRÉSIDENT ACTUEL : Trump (2025-2029), Parti politique : Républicain"
            },
            connects: {
                title: "Suivez-moi",
                socialMedia: {
                    tiktok: "TikTok",
                    snapchat: "Snapchat",
                    twitter: "X (Twitter)",
                    twitch: "Twitch",
                    facebook: "Facebook",
                    steam: "Steam",
                    discord: "Discord",
                    instagram: "Instagram",
                    threads: "Threads"
                }
            },
            presidentSection: {
                title: "Président Actuel des États-Unis",
                name: "Donald J. Trump",
                born: "Né le : 14 juin 1946",
                height: "Taille : 6'3\" (190,5 cm)",
                party: "Parti : Parti Républicain",
                term: "Mandat Présidentiel : 20/01/25 à 12:00 - 20/01/29 à 12:00",
                vicePresident: "Vice-président : James David Vance"
            },
            shoutouts: {
                tiktok: "Mentions des Créateurs TikTok",
                instagram: "Mentions des Créateurs Instagram",
                youtube: "Mentions des Créateurs YouTube",
                latest: "Mon Dernier TikTok"
            },
            links: {
                title: "Liens Utiles",
                merch1: "Boutique de Produits Dérivés (Printify)",
                merch2: "Boutique de Produits Dérivés (Fourthwall)",
                discord: "Rejoignez le Serveur Discord de la Communauté Bus Army Dude !",
                bugReport: "Formulaire de Signalement de Bugs !",
                feedback: "Formulaire de Commentaires ou Suggestions !"
            },
            countdown: {
                title: "Compte à Rebours pour les Attelles AFO",
                days: "Jours",
                hours: "Heures",
                minutes: "Minutes",
                seconds: "Secondes"
            },
            faq: {
                title: "Questions Fréquentes",
                q1: "Qu'est-ce que Bus Army Dude ?",
                a1: "Bus Army Dude est une plateforme où je partage ma présence sur les réseaux sociaux et me connecte avec ma communauté.",
                q2: "Comment puis-je vous contacter ?",
                a2: "Vous pouvez me joindre via n'importe quelle plateforme de médias sociaux listée ci-dessus."
            },
            tech: {
                title: "Informations Techniques",
                specs: {
                    model: "Modèle",
                    material: "Matériau",
                    storage: "Stockage",
                    batteryCapacity: "Capacité de la Batterie",
                    color: "Couleur",
                    price: "Prix",
                    dateReleased: "Date de Sortie",
                    dateBought: "Date d'Achat",
                    osVersion: "Version du Système",
                    batteryHealth: "Santé de la Batterie %",
                    chargeCycles: "Cycles de Charge"
                },
                devices: {
                    iphone: {
                        name: "iPhone 16 Pro",
                        details: "Modèle : iPhone 16 Pro\nMatériau : Titane\nStockage : 128 Go\nBatterie : 3 582 mAh\nCouleur : Titane Naturel\nPrix : 1 067,49 €\nSortie : 20 septembre 2024\nAchat : 08 novembre 2024\nSystème : iOS 18.3 (22D60)\nSanté Batterie : 100 %\nCycles : 117"
                    },
                    watch: {
                        name: "Apple Watch Ultra 2",
                        details: "Modèle : Apple Watch Ultra 2\nMatériau : Titane\nStockage : 64 Go\nBatterie : 564 mAh\nCouleur : Titane Naturel\nPrix : 853,98 €\nSortie : 22 septembre 2023\nAchat : 17 mai 2024\nSystème : WatchOS 11.3 (22S5534d)\nSanté Batterie : 98 %"
                    },
                    mac: {
                        name: "Mac Mini M2 2023",
                        details: "Modèle : Mac Mini M2 2023\nMatériau : Aluminium\nStockage : 256 Go SSD\nCouleur : Gris\nPrix : 742,29 €\nSortie : 17 janvier 2023\nAchat : 16 mai 2024\nSystème : macOS Sequoia 15.3 Beta (24D5055b)"
                    }
                }
            },
            disabilities: {
                title: "Handicaps",
                intro: "J'ai les handicaps suivants :",
                list: {
                    asd: "Trouble du Spectre Autistique (TSA)",
                    adhd: "Trouble du Déficit de l'Attention avec Hyperactivité (TDAH)",
                    anxiety: "Trouble Anxieux",
                    hydrocephalus: "Hydrocéphalie",
                    epilepsy: "Épilepsie (Crises de Stress)",
                    ocd: "Trouble Obsessionnel Compulsif (TOC)",
                    ptsd: "Trouble de Stress Post-Traumatique (TSPT)",
                    toeWalking: "Marche sur la Pointe des Pieds Idiopathique"
                }
            },
            settings: {
                title: "Paramètres",
                theme: "Paramètres du Thème",
                darkMode: "Mode Sombre",
                lightMode: "Mode Clair",
                language: "Paramètres de Langue",
                save: "Enregistrer les Modifications",
                reset: "Réinitialiser par Défaut"
            },
            footer: {
                version: "Version : v1.10.1",
                build: "Build : 2025.1.23",
                device: "Appareil : Chargement...",
                time: "Date et Heure Actuelles : Chargement...",
                refresh: "Actualisation de la page dans : 5 minutes",
                copyright: "© 2025 Bus Army Dude. Tous droits réservés.",
                protection: {
                    watermark: "Protégé par Filigrane",
                    copy: "Ce contenu est protégé par un filigrane. Utilisation non autorisée interdite.",
                    legal: "Tout le contenu et les matériaux de ce site web sont protégés légalement."
                }
            }
        },
        // German translations
        de: {
            profileSection: {
                title: "Bus Army Dude",
                currentPresident: "AKTUELLER PRÄSIDENT: Trump (2025-2029), Politische Partei: Republikaner"
            },
            connects: {
                title: "Folge mir",
                socialMedia: {
                    tiktok: "TikTok",
                    snapchat: "Snapchat",
                    twitter: "X (Twitter)",
                    twitch: "Twitch",
                    facebook: "Facebook",
                    steam: "Steam",
                    discord: "Discord",
                    instagram: "Instagram",
                    threads: "Threads"
                }
            },
            presidentSection: {
                title: "Aktueller US-Präsident",
                name: "Donald J. Trump",
                born: "Geboren: 14. Juni 1946",
                height: "Größe: 6'3\" (190,5 cm)",
                party: "Partei: Republikanische Partei",
                term: "Amtszeit: 20.01.25 um 12:00 Uhr - 20.01.29 um 12:00 Uhr",
                vicePresident: "Vizepräsident: James David Vance"
            },
            shoutouts: {
                tiktok: "TikTok-Creator-Shoutouts",
                instagram: "Instagram-Creator-Shoutouts",
                youtube: "YouTube-Creator-Shoutouts",
                latest: "Mein neuestes TikTok"
            },
            links: {
                title: "Nützliche Links",
                merch1: "Merchandise-Shop (Printify)",
                merch2: "Merchandise-Shop (Fourthwall)",
                discord: "Tritt dem Bus Army Dude Community Discord Server bei!",
                bugReport: "Fehler-Meldeformular!",
                feedback: "Feedback- oder Vorschlagsformular!"
            },
            countdown: {
                title: "Countdown bis AFO-Schienen",
                days: "Tage",
                hours: "Stunden",
                minutes: "Minuten",
                seconds: "Sekunden"
            },
            faq: {
                title: "Häufig gestellte Fragen",
                q1: "Was ist Bus Army Dude?",
                a1: "Bus Army Dude ist eine Plattform, auf der ich meine Social-Media-Präsenz teile und mich mit meiner Community verbinde.",
                q2: "Wie kann ich dich kontaktieren?",
                a2: "Du kannst mich über alle oben verlinkten Social-Media-Plattformen erreichen."
            },
            tech: {
                title: "Technische Informationen",
                specs: {
                    model: "Modell",
                    material: "Material",
                    storage: "Speicher",
                    batteryCapacity: "Akkukapazität",
                    color: "Farbe",
                    price: "Preis",
                    dateReleased: "Erscheinungsdatum",
                    dateBought: "Kaufdatum",
                    osVersion: "Betriebssystemversion",
                    batteryHealth: "Akkugesundheit %",
                    chargeCycles: "Ladezyklen"
                },
                devices: {
                    iphone: {
                        name: "iPhone 16 Pro",
                        details: "Modell: iPhone 16 Pro\nMaterial: Titan\nSpeicher: 128GB\nAkku: 3.582mAh\nFarbe: Natürliches Titan\nPreis: 1.067,49 €\nVeröffentlicht: 20. September 2024\nGekauft: 08. November 2024\nBS: iOS 18.3 (22D60)\nAkkugesundheit: 100%\nLadezyklen: 117"
                    },
                    watch: {
                        name: "Apple Watch Ultra 2",
                        details: "Modell: Apple Watch Ultra 2\nMaterial: Titan\nSpeicher: 64GB\nAkku: 564mAh\nFarbe: Natürliches Titan\nPreis: 853,98 €\nVeröffentlicht: 22. September 2023\nGekauft: 17. Mai 2024\nBS: WatchOS 11.3 (22S5534d)\nAkkugesundheit: 98%"
                    },
                    mac: {
                        name: "Mac Mini M2 2023",
                        details: "Modell: Mac Mini M2 2023\nMaterial: Aluminium\nSpeicher: 256GB SSD\nFarbe: Grau\nPreis: 742,29 €\nVeröffentlicht: 17. Januar 2023\nGekauft: 16. Mai 2024\nBS: macOS Sequoia 15.3 Beta (24D5055b)"
                    }
                }
            },
            disabilities: {
                title: "Behinderungen",
                intro: "Ich habe folgende Behinderungen:",
                list: {
                    asd: "Autismus-Spektrum-Störung (ASS)",
                    adhd: "Aufmerksamkeitsdefizit-/Hyperaktivitätsstörung (ADHS)",
                    anxiety: "Angststörung",
                    hydrocephalus: "Hydrozephalus",
                    epilepsy: "Epilepsie (Stressanfälle)",
                    ocd: "Zwangsstörung (OCD)",
                    ptsd: "Posttraumatische Belastungsstörung (PTBS)",
                    toeWalking: "Idiopathischer Zehenspitzengang"
                }
            },
            settings: {
                title: "Einstellungen",
                theme: "Design-Einstellungen",
                darkMode: "Dunkelmodus",
                lightMode: "Hellmodus",
                language: "Spracheinstellungen",
                save: "Änderungen speichern",
                reset: "Auf Standard zurücksetzen"
            },
            footer: {
                version: "Version: v1.10.1",
                build: "Build: 2025.1.23",
                device: "Gerät: Wird geladen...",
                time: "Aktuelles Datum und Uhrzeit: Wird geladen...",
                refresh: "Seite wird aktualisiert in: 5 Minuten",
                copyright: "© 2025 Bus Army Dude. Alle Rechte vorbehalten.",
                protection: {
                    watermark: "Durch Wasserzeichen geschützt",
                    copy: "Dieser Inhalt ist durch ein Wasserzeichen geschützt. Unbefugte Nutzung ist untersagt.",
                    legal: "Alle Inhalte und Materialien dieser Website sind rechtlich geschützt."
                }
            }
        },
        // Japanese translations
        ja: {
            profileSection: {
                title: "Bus Army Dude",
                currentPresident: "現大統領：トランプ（2025-2029）、所属政党：共和党"
            },
            connects: {
                title: "フォローする",
                socialMedia: {
                    tiktok: "TikTok",
                    snapchat: "Snapchat",
                    twitter: "X (Twitter)",
                    twitch: "Twitch",
                    facebook: "Facebook",
                    steam: "Steam",
                    discord: "Discord",
                    instagram: "Instagram",
                    threads: "Threads"
                }
            },
            presidentSection: {
                title: "現アメリカ合衆国大統領",
                name: "ドナルド・J・トランプ",
                born: "生年月日：1946年6月14日",
                height: "身長：6'3\"（190.5 cm）",
                party: "所属政党：共和党",
                term: "大統領任期：2025年1月20日 12:00 ～ 2029年1月20日 12:00",
                vicePresident: "副大統領：ジェームズ・デービッド・ヴァンス"
            },
            shoutouts: {
                tiktok: "TikTokクリエイター紹介",
                instagram: "Instagramクリエイター紹介",
                youtube: "YouTubeクリエイター紹介",
                latest: "最新のTikTok"
            },
            links: {
                title: "便利なリンク",
                merch1: "グッズストア（Printify）",
                merch2: "グッズストア（Fourthwall）",
                discord: "Bus Army Dudeのコミュニティディスコードサーバーに参加！",
                bugReport: "バグ報告フォーム！",
                feedback: "フィードバック・提案フォーム！"
            },
            countdown: {
                title: "AFO装具まであと",
                days: "日",
                hours: "時間",
                minutes: "分",
                seconds: "秒"
            },
            faq: {
                title: "よくある質問",
                q1: "Bus Army Dudeとは？",
                a1: "Bus Army Dudeは、私のソーシャルメディアでの活動を共有し、コミュニティとつながるプラットフォームです。",
                q2: "連絡方法は？",
                a2: "上記のソーシャルメディアプラットフォームからご連絡いただけます。"
            },
            tech: {
                title: "技術情報",
                specs: {
                    model: "モデル",
                    material: "素材",
                    storage: "ストレージ",
                    batteryCapacity: "バッテリー容量",
                    color: "カラー",
                    price: "価格",
                    dateReleased: "発売日",
                    dateBought: "購入日",
                    osVersion: "OSバージョン",
                    batteryHealth: "バッテリー状態 %",
                    chargeCycles: "充電サイクル"
                },
                devices: {
                    iphone: {
                        name: "iPhone 16 Pro",
                        details: "モデル：iPhone 16 Pro\n素材：チタン\nストレージ：128GB\nバッテリー：3,582mAh\nカラー：ナチュラルチタン\n価格：¥159,800\n発売日：2024年9月20日\n購入日：2024年11月8日\nOS：iOS 18.3（22D60）\nバッテリー状態：100%\n充電サイクル：117"
                    },
                    watch: {
                        name: "Apple Watch Ultra 2",
                        details: "モデル：Apple Watch Ultra 2\n素材：チタン\nストレージ：64GB\nバッテリー：564mAh\nカラー：ナチュラルチタン\n価格：¥127,800\n発売日：2023年9月22日\n購入日：2024年5月17日\nOS：WatchOS 11.3（22S5534d）\nバッテリー状態：98%"
                    },
                    mac: {
                        name: "Mac Mini M2 2023",
                        details: "モデル：Mac Mini M2 2023\n素材：アルミニウム\nストレージ：256GB SSD\nカラー：グレー\n価格：¥111,800\n発売日：2023年1月17日\n購入日：2024年5月16日\nOS：macOS Sequoia 15.3 Beta（24D5055b）"
                    }
                }
            },
            disabilities: {
                title: "障害について",
                intro: "私は以下の障害があります：",
                list: {
                    asd: "自閉症スペクトラム障害（ASD）",
                    adhd: "注意欠陥多動性障害（ADHD）",
                    anxiety: "不安障害",
                    hydrocephalus: "水頭症",
                    epilepsy: "てんかん（ストレス発作）",
                    ocd: "強迫性障害（OCD）",
                    ptsd: "心的外傷後ストレス障害（PTSD）",
                    toeWalking: "特発性つま先歩行"
                }
            },
            settings: {
                title: "設定",
                theme: "テーマ設定",
                darkMode: "ダークモード",
                lightMode: "ライトモード",
                language: "言語設定",
                save: "変更を保存",
                reset: "デフォルトにリセット"
            },
            footer: {
                version: "バージョン：v1.10.1",
                build: "ビルド：2025.1.23",
                device: "デバイス：読み込み中...",
                time: "現在の日時：読み込み中...",
                refresh: "ページ更新まで：5分",
                copyright: "© 2025 Bus Army Dude. 全権利所有。",
                protection: {
                    watermark: "ウォーターマーク保護付き",
                    copy: "このコンテンツはウォーターマークで保護されています。無断使用は禁止されています。",
                    legal: "このウェブサイトのすべてのコンテンツと資料は法的に保護されています。"
                }
            };

    applySettings() {
        this.applyTheme(this.settings.darkMode);
        this.setFontSize(this.settings.fontSize);
        this.translatePage();
    }

    applyTheme(isDark = this.settings.darkMode) {
        const theme = isDark ? this.darkTheme : this.lightTheme;
        Object.entries(theme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
        document.body.classList.toggle('dark-mode', isDark);
        document.body.classList.toggle('light-mode', !isDark);
        this.settings.darkMode = isDark;
        this.saveSettings();
    }

    setFontSize(size) {
        size = Math.min(Math.max(size, 12), 20);
        document.documentElement.style.setProperty('--font-size-base', `${size}px`);
        this.settings.fontSize = size;
        this.saveSettings();
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.settings.language = lang;
            document.documentElement.lang = lang;
            this.saveSettings();
            this.translatePage();
            this.updateDynamicContent();
        }
    }

    formatDateTime(date) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        return new Intl.DateTimeFormat(this.settings.language, options).format(date);
    }

    updateDynamicContent() {
        const currentDateTime = new Date();
        const timeElement = document.querySelector('[data-translate="footer.time"]');
        if (timeElement) {
            const translation = this.getTranslationByKey('footer.time');
            const formattedDate = this.formatDateTime(currentDateTime);
            timeElement.textContent = translation.split(':')[0] + ': ' + formattedDate;
        }
    }

    translatePage() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslationByKey(key);
            
            if (translation) {
                if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    getTranslationByKey(key) {
        const keys = key.split('.');
        let translation = this.translations[this.settings.language];
        
        for (const k of keys) {
            translation = translation?.[k];
            if (!translation) break;
        }
        
        return translation || this.translations['en'][key] || key;
    }

    saveSettings() {
        localStorage.setItem('websiteSettings', JSON.stringify(this.settings));
    }
}

// Initialize theme manager
const themeManager = new ThemeManager();

// Add event listener for language selector
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = themeManager.settings.language;
        languageSelect.addEventListener('change', (e) => {
            themeManager.setLanguage(e.target.value);
        });
    }

    // Update time every minute
    setInterval(() => themeManager.updateDynamicContent(), 60000);
    themeManager.updateDynamicContent(); // Initial update
});
