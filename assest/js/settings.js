// settings.js
export const Settings = {
    // Default settings
    defaults: {
        units: {
            temperature: 'celsius',
            speed: 'ms',
            pressure: 'hpa'
        },
        display: {
            theme: 'dark',
            time24: false
        },
        privacy: {
            location: true
        }
    },

    // Unit Converters
    converters: {
        temperature: {
            celsius: {
                fahrenheit: (c) => (c * 9/5) + 32,
                kelvin: (c) => c + 273.15
            },
            fahrenheit: {
                celsius: (f) => (f - 32) * 5/9,
                kelvin: (f) => (f + 459.67) * 5/9
            },
            kelvin: {
                celsius: (k) => k - 273.15,
                fahrenheit: (k) => (k * 9/5) - 459.67
            }
        },
        speed: {
            ms: {
                mph: (ms) => ms * 2.237,
                kph: (ms) => ms * 3.6,
                knots: (ms) => ms * 1.944,
                beaufort: (ms) => {
                    const beaufortScale = [0.5,1.5,3.3,5.5,7.9,10.7,13.8,17.1,20.7,24.4,28.4,32.6];
                    return beaufortScale.findIndex(v => ms <= v);
                }
            },
            mph: {
                ms: (mph) => mph / 2.237,
                kph: (mph) => mph * 1.609,
                knots: (mph) => mph * 0.869
            },
            kph: {
                ms: (kph) => kph / 3.6,
                mph: (kph) => kph / 1.609,
                knots: (kph) => kph / 1.852
            },
            knots: {
                ms: (knots) => knots / 1.944,
                mph: (knots) => knots / 0.869,
                kph: (knots) => knots * 1.852
            }
        },
        pressure: {
            hpa: {
                inhg: (hpa) => hpa * 0.02953,
                mmhg: (hpa) => hpa * 0.75006
            },
            inhg: {
                hpa: (inhg) => inhg / 0.02953,
                mmhg: (inhg) => inhg * 25.4
            },
            mmhg: {
                hpa: (mmhg) => mmhg / 0.75006,
                inhg: (mmhg) => mmhg / 25.4
            }
        }
    },

    // Current settings
    current: null,

    // Initialize settings
    init() {
        const saved = localStorage.getItem('weather-settings');
        this.current = saved ? JSON.parse(saved) : {...this.defaults};
        this.applySettings();
    },

    // Save settings
    save() {
        localStorage.setItem('weather-settings', JSON.stringify(this.current));
        this.applySettings();
    },

    // Apply settings
    applySettings() {
        document.documentElement.setAttribute('data-theme', this.current.display.theme);
        // Add more visual settings here
    },

    // Convert units
    convert(value, type, from, to) {
        if (from === to) return value;
        
        const converter = this.converters[type];
        if (!converter) return value;

        if (to === 'beaufort' && type === 'speed') {
            return converter.ms.beaufort(
                from === 'ms' ? value : converter[from].ms(value)
            );
        }

        return converter[from][to](value);
    },

    // Format values
    format(value, type, unit) {
        switch(type) {
            case 'temperature':
                return `${Math.round(value)}${unit === 'celsius' ? '°C' : unit === 'fahrenheit' ? '°F' : 'K'}`;
            case 'speed':
                if (unit === 'beaufort') return `Beaufort ${value}`;
                return `${value.toFixed(1)} ${unit}`;
            case 'pressure':
                return `${Math.round(value)} ${unit}`;
            default:
                return value;
        }
    }
};
