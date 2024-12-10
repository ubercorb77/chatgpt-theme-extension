/* ==== for popup folder ==== */

// add this inside your DOMContentLoaded event listener
const folderButtons = document.querySelectorAll('.folder-button');

for (let button of folderButtons) {
    button.addEventListener('click', () => {
        button.parentElement.classList.toggle('collapsed');
    });

    // start collapsed
    button.parentElement.classList.add('collapsed');
}


/* ==== actual functionality starts here ==== */

const DEFAULT_VALUES = {
    sliderValue1: 0.8,
    sliderValue2: 0,
    sliderValue3: 33,
    sliderValue4: "https://i.pinimg.com/originals/6a/ee/ea/6aeeea24e8fd4023a349e354eefa33ed.gif",
    sliderValue5: "Noto Serif KR",
    sliderValue6: 0.75,
    sliderValue7: 0,
    sliderValue8: 0.6,
    sliderValue9: 0.4,

    claudeyNameEnabled: true,
    sliderClaudeyName: "aria",

    claudeySvgEnabled: true,
    sliderClaudeySvgPath: "M72.434 193.066c1.172-15.715 6.653-40.211 12.612-54.63 42.099-101.852 262.2 39.955 157.477 122.827-16.963 13.422-49.866 20.916-71.508 12.552-29.581-11.437-68.191-95.138-26.041-115.398 39.258-18.873 84.606 15.498 75.01 57.066-15.658 67.822-96.915-39.055-36.64-17.895m-38.041 52.306c73.242 115.547 228.76-6.983 168.351-95.078",
    sliderClaudeySvgViewbox: "50 50 300 300",
    sliderClaudeySvgColor: "#ff906b",
    sliderClaudeySvgFill: false,
    sliderClaudeySvgStrokeWidth: 24,
    sliderClaudeySvgStrokeOpacity: 0.9,
    sliderClaudeySvgStrokeLinecap: "round",
    sliderClaudeySvgStrokeLinejoin: "round"
};

document.addEventListener('DOMContentLoaded', function() {
    const sliders = [
        {
            id: 'slider1',
            valueId: 'value1',
            storageKey: 'sliderValue1',
            cssVar: '--slider-value-1'
        },
        {
            id: 'slider2',
            valueId: 'value2',
            storageKey: 'sliderValue2',
            cssVar: '--slider-value-2'
        },
        {
            id: 'slider3',
            valueId: 'value3',
            storageKey: 'sliderValue3',
            cssVar: '--slider-value-3'
        },
        {
            id: 'input4',
            valueId: 'value4',
            storageKey: 'sliderValue4',
            cssVar: '--slider-value-4',
            isUrl: true
        },
        {
            id: 'input5',
            valueId: 'value5',
            storageKey: 'sliderValue5',
            cssVar: '--slider-value-5',
            isUrl: false /* we actually don't need the "isUrl: false" here or in the other entries, because undefined is falsy */
        },
        {
            id: 'slider6',
            valueId: 'value6',
            storageKey: 'sliderValue6',
            cssVar: '--slider-value-6'
        },
        {
            id: 'slider7',
            valueId: 'value7',
            storageKey: 'sliderValue7',
            cssVar: '--slider-value-7'
        },
        {
            id: 'slider8',
            valueId: 'value8',
            storageKey: 'sliderValue8',
            cssVar: '--slider-value-8'
        },
        {
            id: 'slider9',
            valueId: 'value9',
            storageKey: 'sliderValue9',
            cssVar: '--slider-value-9'
        },
        {
            id: 'input-claudey-name', // id of the input element
            storageKey: 'sliderClaudeyName', // key to store the value in chrome storage
        },
        {
            id: 'input-claudey-svg-path',
            storageKey: 'sliderClaudeySvgPath'
        },
        {
            id: 'input-claudey-svg-viewbox',
            storageKey: 'sliderClaudeySvgViewbox'
        },
        {
            id: 'input-claudey-svg-color',
            storageKey: 'sliderClaudeySvgColor'
        },
        {
            id: 'input-claudey-svg-fill',
            storageKey: 'sliderClaudeySvgFill'
        },
        {
            id: 'input-claudey-svg-width',
            storageKey: 'sliderClaudeySvgStrokeWidth'
        },
        {
            id: 'input-claudey-svg-opacity',
            storageKey: 'sliderClaudeySvgStrokeOpacity'
        },
        {
            id: 'input-claudey-svg-linecap',
            storageKey: 'sliderClaudeySvgStrokeLinecap'
        },
        {
            id: 'input-claudey-svg-linejoin',
            storageKey: 'sliderClaudeySvgStrokeLinejoin'
        }
    ];

    // Function to update CSS variable in the webpage
    function updateCSSInPage(variable, value) {
        chrome.tabs.query({
            url: [
                "https://chatgpt.com/*",
                "https://chat.openai.com/*",
                "https://chat.com/*"
            ]
        }, function(tabs) {
            if (!tabs[0]?.id) return;
            
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'UPDATE_CSS',
                variable: variable,
                value: value
            });
        });
    }

    // Initialize all sliders from storage
    sliders.forEach(sliderConfig => {
        const slider = document.getElementById(sliderConfig.id);
        const valueDisplay = document.getElementById(sliderConfig.valueId);
        
        // Load saved value from storage
        chrome.storage.local.get([sliderConfig.storageKey], function(result) {
            const savedValue = result[sliderConfig.storageKey];
            if (savedValue !== undefined) {
                slider.value = savedValue;
                if (valueDisplay) {
                    valueDisplay.textContent = savedValue;
                }
                console.log(`Loaded ${sliderConfig.storageKey}:`, savedValue);
            } else {
                // If no saved value, save the default
                const defaultValue = DEFAULT_VALUES[sliderConfig.storageKey];
                slider.value = defaultValue;
                if (valueDisplay) {
                    valueDisplay.textContent = defaultValue;
                }
                chrome.storage.local.set({ [sliderConfig.storageKey]: defaultValue });
                updateCSSInPage(sliderConfig.cssVar, 
                    sliderConfig.isUrl ? `url("${defaultValue}")` : defaultValue);
                console.log(`Set default ${sliderConfig.storageKey}:`, defaultValue);
            }
        });
        
        // Add event listeners for the slider
        slider.addEventListener(slider.type === 'text' ? 'change' : 'input', function(e) {
            const newValue = this.value;
            const formattedValue = sliderConfig.isUrl ?
                `url("${newValue}")` : newValue;
            
            // Update display immediately
            if (valueDisplay) {
                valueDisplay.textContent = newValue;
            }
            
            // Update CSS variable in the page
            if (sliderConfig.cssVar) {
                updateCSSInPage(sliderConfig.cssVar, formattedValue);
            }
            
            // Log the change
            console.log(`${sliderConfig.id} changed to:`, newValue);
            
            // Save to storage (save the raw URL, not the formatted version)
            chrome.storage.local.set({ 
                [sliderConfig.storageKey]: newValue 
            }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error saving to storage:', chrome.runtime.lastError);
                } else {
                    console.log(`Saved ${sliderConfig.storageKey}:`, newValue);
                }
            });
            
            // Print all current values
            chrome.storage.local.get(null, function(items) {
                console.log('All current stored values:', items);
            });
        });
    });


    /* ========== Reset button ========== */

    const resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', function() {
        // reset each slider to default value
        sliders.forEach(sliderConfig => {
            const slider = document.getElementById(sliderConfig.id);
            const valueDisplay = document.getElementById(sliderConfig.valueId);
            const defaultValue = DEFAULT_VALUES[sliderConfig.storageKey];
            
            // update ui
            slider.value = defaultValue;
            if (valueDisplay) {
                valueDisplay.textContent = defaultValue;
            }

            // update css in page
            updateCSSInPage(sliderConfig.cssVar, 
                sliderConfig.isUrl ? `url("${defaultValue}")` : defaultValue);
            
            // save to storage
            chrome.storage.local.set({ [sliderConfig.storageKey]: defaultValue });
        });

        // reset claudey name
        chrome.storage.local.set({ claudeyNameEnabled: DEFAULT_VALUES.claudeyNameEnabled });
        updateToggleButtonClaudeyName(DEFAULT_VALUES.claudeyNameEnabled);
        chrome.tabs.query({
            url: [
                "https://chatgpt.com/*",
                "https://chat.openai.com/*",
                "https://chat.com/*"
            ]
        }, function (tabs) {
            if (!tabs[0]?.id) return;
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'TOGGLE_NAME_REPLACEMENTS',
                enabled: DEFAULT_VALUES.claudeyNameEnabled
            });
        });
        // TODO: also reset the input value

        // reset claudey svg
        chrome.storage.local.set({ claudeySvgEnabled: DEFAULT_VALUES.claudeySvgEnabled });
        updateToggleButtonClaudeySvg(DEFAULT_VALUES.claudeySvgEnabled);
        chrome.tabs.query({
            url: [
                "https://chatgpt.com/*",
                "https://chat.openai.com/*",
                "https://chat.com/*"
            ]
        }, function (tabs) {
            if (!tabs[0]?.id) return;
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'TOGGLE_SVG_REPLACEMENTS',
                enabled: DEFAULT_VALUES.claudeySvgEnabled
            });
        });
        // TODO: also reset the input values
        
        console.log('Reset all values to defaults');
    });


    /* ========== Claudey name toggle button ========== */

    const toggleButtonClaudeyName = document.getElementById('toggleButtonClaudeyName');

    // load initial state
    chrome.storage.local.get(['claudeyNameEnabled'], function(result) {
        const enabled = result.claudeyNameEnabled ?? DEFAULT_VALUES.claudeyNameEnabled;
        updateToggleButtonClaudeyName(enabled);
    });

    function updateToggleButtonClaudeyName(enabled) {
        toggleButtonClaudeyName.textContent = enabled ? 'on' : 'off';
        toggleButtonClaudeyName.classList.toggle('disabled', !enabled);
    }

    toggleButtonClaudeyName.addEventListener('click', function() {
        chrome.storage.local.get(['claudeyNameEnabled'], function(result) {
            const currentlyEnabled = result.claudeyNameEnabled ?? DEFAULT_VALUES.claudeyNameEnabled;
            const newEnabled = !currentlyEnabled;
            
            // update storage
            chrome.storage.local.set({ claudeyNameEnabled: newEnabled });
            
            // update button appearance
            updateToggleButtonClaudeyName(newEnabled);
            
            // tell content script
            chrome.tabs.query({
                url: [
                    "https://chatgpt.com/*",
                    "https://chat.openai.com/*",
                    "https://chat.com/*"
                ]
            }, function(tabs) {
                if (!tabs[0]?.id) return;
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'TOGGLE_NAME_REPLACEMENTS',
                    enabled: newEnabled
                });
            });
        });
    });


    /* ========== Claudey svg toggle button ========== */

    const toggleButtonClaudeySvg = document.getElementById('toggleButtonClaudeySvg');

    // load initial state
    chrome.storage.local.get(['claudeySvgEnabled'], function(result) {
        const enabled = result.claudeySvgEnabled ?? DEFAULT_VALUES.claudeyNameEnabled;
        updateToggleButtonClaudeySvg(enabled);
    });

    function updateToggleButtonClaudeySvg(enabled) {
        toggleButtonClaudeySvg.textContent = enabled ? 'on' : 'off';
        toggleButtonClaudeySvg.classList.toggle('disabled', !enabled);
    }

    toggleButtonClaudeySvg.addEventListener('click', function() {
        chrome.storage.local.get(['claudeySvgEnabled'], function(result) {
            const currentlyEnabled = result.claudeySvgEnabled ?? DEFAULT_VALUES.claudeyNameEnabled;
            const newEnabled = !currentlyEnabled;
            
            // update storage
            chrome.storage.local.set({ claudeySvgEnabled: newEnabled });
            
            // update button appearance
            updateToggleButtonClaudeySvg(newEnabled);
            
            // tell content script
            chrome.tabs.query({
                url: [
                    "https://chatgpt.com/*",
                    "https://chat.openai.com/*",
                    "https://chat.com/*"
                ]
            }, function(tabs) {
                if (!tabs[0]?.id) return;
                chrome.tabs.sendMessage(tabs[0].id, {
                    type: 'TOGGLE_SVG_REPLACEMENTS',
                    enabled: newEnabled
                });
            });
        });
    });

    /* ========== stored values ========== */
    console.log('Popup opened, getting all stored values...');
    chrome.storage.local.get(null, function(items) {
        console.log('All stored values:', items);
    });
});

// you have found an easter egg! 🥚 congrats!!! :)))))