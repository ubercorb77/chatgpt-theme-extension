/* ==== for popup folder ==== */

// add this inside your DOMContentLoaded event listener
const folderButton = document.querySelector('.folder-button');
folderButton.addEventListener('click', () => {
    folderButton.parentElement.classList.toggle('collapsed');
});

// optionally start collapsed 
document.querySelector('.folder').classList.add('collapsed');


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
    claudeyEnabled: false
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
            updateCSSInPage(sliderConfig.cssVar, formattedValue);
            
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

        // reset claudey
        chrome.storage.local.set({ claudeyEnabled: DEFAULT_VALUES.claudeyEnabled });
        updateToggleButton(DEFAULT_VALUES.claudeyEnabled);
        chrome.tabs.query({
            url: [
                "https://chatgpt.com/*",
                "https://chat.openai.com/*",
                "https://chat.com/*"
            ]
        }, function (tabs) {
            if (!tabs[0]?.id) return;
            chrome.tabs.sendMessage(tabs[0].id, {
                type: 'TOGGLE_REPLACEMENTS',
                enabled: DEFAULT_VALUES.claudeyEnabled
            });
        });
        
        console.log('Reset all values to defaults');
    });


    /* ========== Claudey toggle button ========== */

    const toggleButton = document.getElementById('toggleButton');

    // load initial state
    chrome.storage.local.get(['claudeyEnabled'], function(result) {
        const enabled = result.claudeyEnabled ?? DEFAULT_VALUES.claudeyEnabled;
        updateToggleButton(enabled);
    });

    function updateToggleButton(enabled) {
        toggleButton.textContent = enabled ? 'enabled' : 'disabled';
        toggleButton.classList.toggle('disabled', !enabled);
    }

    toggleButton.addEventListener('click', function() {
        chrome.storage.local.get(['claudeyEnabled'], function(result) {
            const currentlyEnabled = result.claudeyEnabled ?? DEFAULT_VALUES.claudeyEnabled;
            const newEnabled = !currentlyEnabled;
            
            // update storage
            chrome.storage.local.set({ claudeyEnabled: newEnabled });
            
            // update button appearance
            updateToggleButton(newEnabled);
            
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
                    type: 'TOGGLE_REPLACEMENTS',
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