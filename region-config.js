const regionConfiguration = {
  lastUpdatedTime: '2025-03-17 15:38:30',  // Current UTC time

  // All ISO 3166-1 alpha-2 country codes with their default status
  regions: {
    // Africa
    DZ: true,  // Algeria
    AO: true,  // Angola
    BJ: true,  // Benin
    BW: true,  // Botswana
    BF: true,  // Burkina Faso
    BI: true,  // Burundi
    CM: true,  // Cameroon
    CV: true,  // Cape Verde
    CF: true,  // Central African Republic
    TD: true,  // Chad
    KM: true,  // Comoros
    CG: true,  // Congo
    CD: true,  // Congo, Democratic Republic
    CI: true,  // Côte d'Ivoire
    DJ: true,  // Djibouti
    EG: true,  // Egypt
    GQ: true,  // Equatorial Guinea
    ER: true,  // Eritrea
    ET: true,  // Ethiopia
    GA: true,  // Gabon
    GM: true,  // Gambia
    GH: true,  // Ghana
    GN: true,  // Guinea
    GW: true,  // Guinea-Bissau
    KE: true,  // Kenya
    LS: true,  // Lesotho
    LR: true,  // Liberia
    LY: true,  // Libya
    MG: true,  // Madagascar
    MW: true,  // Malawi
    ML: true,  // Mali
    MR: true,  // Mauritania
    MU: true,  // Mauritius
    MA: true,  // Morocco
    MZ: true,  // Mozambique
    NA: true,  // Namibia
    NE: true,  // Niger
    NG: true,  // Nigeria
    RW: true,  // Rwanda
    ST: true,  // Sao Tome and Principe
    SN: true,  // Senegal
    SC: true,  // Seychelles
    SL: true,  // Sierra Leone
    SO: false,  // Somalia (updated to true)
    ZA: true,  // South Africa
    SS: true,  // South Sudan
    SD: true,  // Sudan
    SZ: true,  // Eswatini (formerly Swaziland)
    TZ: true,  // Tanzania
    TG: true,  // Togo
    TN: true,  // Tunisia
    UG: true,  // Uganda
    ZM: true,  // Zambia
    ZW: true,  // Zimbabwe


    // Americas
    AI: true,  // Anguilla
    AG: true,  // Antigua and Barbuda
    AR: true,  // Argentina
    AW: true,  // Aruba
    BS: true,  // Bahamas
    BB: true,  // Barbados
    BZ: true,  // Belize
    BM: true,  // Bermuda
    BO: true,  // Bolivia
    BR: true,  // Brazil
    VG: true,  // British Virgin Islands
    CA: false,  // Canada
    KY: true,  // Cayman Islands
    CL: true,  // Chile
    CO: true,  // Colombia
    CR: true,  // Costa Rica
    CU: true,  // Cuba
    DM: true,  // Dominica
    DO: true,  // Dominican Republic
    EC: true,  // Ecuador
    SV: true,  // El Salvador
    FK: true,  // Falkland Islands
    GF: true,  // French Guiana (French overseas department)
    GL: true,  // Greenland
    GD: true,  // Grenada
    GP: true,  // Guadeloupe (French overseas department)
    GT: true,  // Guatemala
    GY: true,  // Guyana
    HT: true,  // Haiti
    HN: true,  // Honduras
    JM: true,  // Jamaica
    MQ: true,  // Martinique (French overseas department)
    MX: true,  // Mexico
    MS: true,  // Montserrat
    NI: true,  // Nicaragua
    PA: true,  // Panama
    PY: true,  // Paraguay
    PE: true,  // Peru
    PR: true,  // Puerto Rico (U.S. territory)
    BL: true,  // Saint Barthélemy (French overseas collectivity)
    KN: true,  // Saint Kitts and Nevis
    LC: true,  // Saint Lucia
    MF: true,  // Saint Martin (French part)
    PM: true,  // Saint Pierre and Miquelon (French overseas territory)
    VC: true,  // Saint Vincent and the Grenadines
    SR: true,  // Suriname
    TT: true,  // Trinidad and Tobago
    TC: true,  // Turks and Caicos Islands
    US: true,  // United States
    UY: true,  // Uruguay
    VE: true,  // Venezuela
    VI: true,  // U.S. Virgin Islands (U.S. territory)

    // Asia
    AF: false, // Afghanistan
    AM: true,  // Armenia
    AZ: true,  // Azerbaijan
    BH: true,  // Bahrain
    BD: true,  // Bangladesh
    BT: true,  // Bhutan
    BN: true,  // Brunei
    KH: true,  // Cambodia
    CN: true,  // China
    CY: true,  // Cyprus
    GE: true,  // Georgia
    HK: true,  // Hong Kong
    IN: false, // India
    ID: true,  // Indonesia
    IR: false, // Iran
    IQ: true,  // Iraq
    IL: true,  // Israel
    JP: true,  // Japan
    JO: true,  // Jordan
    KZ: true,  // Kazakhstan
    KW: true,  // Kuwait
    KG: false, // Kyrgyzstan
    LA: true,  // Laos
    LB: true,  // Lebanon
    MO: true,  // Macao
    MY: true,  // Malaysia
    MV: true,  // Maldives
    MN: true,  // Mongolia
    MM: true,  // Myanmar
    NP: false, // Nepal
    OM: true,  // Oman
    PK: true,  // Pakistan
    PS: true,  // Palestine
    PH: true,  // Philippines
    QA: true,  // Qatar
    SA: true,  // Saudi Arabia
    SG: true,  // Singapore
    KR: true,  // South Korea
    LK: true,  // Sri Lanka
    SY: true,  // Syria
    TW: true,  // Taiwan
    TJ: true,  // Tajikistan
    TH: true,  // Thailand
    TL: true,  // Timor-Leste
    TR: true,  // Turkey
    TM: false, // Turkmenistan
    AE: true,  // United Arab Emirates
    UZ: false, // Uzbekistan
    VN: true,  // Vietnam
    YE: true,  // Yemen
    KP: true,  // North Korea


    // Europe
    AL: true,  // Albania
    AD: true,  // Andorra
    AT: true,  // Austria
    BY: true,  // Belarus
    BE: true,  // Belgium
    BA: true,  // Bosnia and Herzegovina
    BG: true,  // Bulgaria
    HR: true,  // Croatia
    CZ: true,  // Czech Republic
    DK: true,  // Denmark
    EE: true,  // Estonia
    FO: true,  // Faroe Islands
    FI: true,  // Finland
    FR: true,  // France
    DE: true,  // Germany
    GI: true,  // Gibraltar
    GR: true,  // Greece
    GG: true,  // Guernsey
    HU: true,  // Hungary
    IS: true,  // Iceland
    IE: true,  // Ireland
    IM: true,  // Isle of Man
    IT: true,  // Italy
    JE: true,  // Jersey
    LV: true,  // Latvia
    LI: true,  // Liechtenstein
    LT: true,  // Lithuania
    LU: true,  // Luxembourg
    MT: true,  // Malta
    MD: true,  // Moldova
    MC: true,  // Monaco
    ME: true,  // Montenegro
    NL: true,  // Netherlands
    MK: true,  // North Macedonia
    NO: true,  // Norway
    PL: true,  // Poland
    PT: true,  // Portugal
    RO: true,  // Romania
    RU: true,  // Russia
    SM: true,  // San Marino
    RS: true,  // Serbia
    SK: true,  // Slovakia
    SI: true,  // Slovenia
    ES: true,  // Spain
    SE: true,  // Sweden
    CH: true,  // Switzerland
    UA: true,  // Ukraine
    GB: true,  // United Kingdom
    VA: true,  // Vatican City
    ME: true,  // Montenegro

    // Oceania
    AS: true,  // American Samoa
    AU: true,  // Australia
    CX: true,  // Christmas Island
    CC: true,  // Cocos Islands
    CK: true,  // Cook Islands
    FJ: true,  // Fiji
    PF: true,  // French Polynesia
    GU: true,  // Guam
    KI: true,  // Kiribati
    MH: true,  // Marshall Islands
    FM: true,  // Micronesia
    NR: true,  // Nauru
    NC: true,  // New Caledonia
    NZ: true,  // New Zealand
    NU: true,  // Niue
    NF: true,  // Norfolk Island
    MP: true,  // Northern Mariana Islands
    PW: true,  // Palau
    PG: true,  // Papua New Guinea
    PN: true,  // Pitcairn
    WS: true,  // Samoa
    SB: true,  // Solomon Islands
    TK: true,  // Tokelau
    TO: true,  // Tonga
    TV: true,  // Tuvalu
    UM: true,  // U.S. Minor Outlying Islands
    VU: true,  // Vanuatu
    WF: true,  // Wallis and Futuna
  },

  // Admin functions to manage region availability
  setRegionAvailability(region, isAvailable) {
    if (region in this.regions) {
      this.regions[region] = isAvailable;
      this.saveRegionSettings();
      return true;
    }
    return false;
  },

  // Set availability for multiple regions at once
  setMultipleRegionAvailability(regionSettings) {
    let changes = 0;
    for (const [region, isAvailable] of Object.entries(regionSettings)) {
      if (region in this.regions) {
        this.regions[region] = isAvailable;
        changes++;
      }
    }
    if (changes > 0) {
      this.saveRegionSettings();
    }
    return changes;
  },

  // Save region settings to localStorage
  saveRegionSettings() {
    try {
      localStorage.setItem('regionSettings', JSON.stringify(this.regions));
    } catch (error) {
      console.error('Failed to save region settings:', error);
    }
  },

  // Load region settings from localStorage
  loadRegionSettings() {
    try {
      const savedSettings = localStorage.getItem('regionSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        this.regions = { ...this.regions, ...parsed };
      }
    } catch (error) {
      console.error('Failed to load region settings:', error);
    }
  },

  // Get the region configuration version
  getVersion() {
    return this.lastUpdatedTime;
  },

  // Initialize the configuration
  init() {
    this.loadRegionSettings();
  }
};

// Initialize the configuration when the script loads
document.addEventListener('DOMContentLoaded', () => {
  regionConfiguration.init();
  console.log('Region Configuration Initialized:', regionConfiguration.getVersion());
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = regionConfiguration;
}
