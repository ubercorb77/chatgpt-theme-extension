// popup.js
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
            // Don't call updateCSSInPage here anymore -- idk why this is needed btw. im black boxing this
            // updateCSSInPage(sliderConfig.cssVar, savedValue);
            console.log(`Loaded ${sliderConfig.storageKey}:`, savedValue);
        } else if (slider.type !== 'text') { // idk Exactly why this else-if-nottext is needed instead of just else, but it works! and i'll black box this for now.
            // If no saved value, save the default
            chrome.storage.local.set({ [sliderConfig.storageKey]: slider.value });
            valueDisplay.textContent = slider.value;
            updateCSSInPage(sliderConfig.cssVar, slider.value);
            console.log(`Set default ${sliderConfig.storageKey}:`, slider.value);
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