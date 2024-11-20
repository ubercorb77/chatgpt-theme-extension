const DEFAULT_VALUES = {
    sliderValue1: 1,
    sliderValue2: 0,
    sliderValue3: 33,
    sliderValue4: "https://i.pinimg.com/originals/6a/ee/ea/6aeeea24e8fd4023a349e354eefa33ed.gif"
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
            cssVar: '--slider-value-4'
        }
    ];

    // Function to update CSS variable in the webpage
    function updateCSSInPage(variable, value) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
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
                valueDisplay.textContent = savedValue;
                console.log(`Loaded ${sliderConfig.storageKey}:`, savedValue);
            } else {
                // If no saved value, save the default
                const defaultValue = DEFAULT_VALUES[sliderConfig.storageKey];
                slider.value = defaultValue;
                valueDisplay.textContent = defaultValue;
                chrome.storage.local.set({ [sliderConfig.storageKey]: defaultValue });
                updateCSSInPage(sliderConfig.cssVar, slider.type === 'text' ? `url("${defaultValue}")` : defaultValue);
                console.log(`Set default ${sliderConfig.storageKey}:`, defaultValue);
            }
        });
        
        // Add event listeners for the slider
        slider.addEventListener(slider.type === 'text' ? 'change' : 'input', function(e) {
            const newValue = this.value;
            const formattedValue = this.type === 'text' ? 
                `url("${newValue}")` : newValue;
            
            // Update display immediately
            valueDisplay.textContent = newValue;
            
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

    // Log initial values
    console.log('Popup opened, getting all stored values...');
    chrome.storage.local.get(null, function(items) {
        console.log('All stored values:', items);
    });
});