// empty line

/* ========== font stuff ========== */

function injectFontFace() {
    const fontUrl = chrome.runtime.getURL('Noto_Serif_KR/NotoSerifKR-VariableFont_wght.ttf');
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
          font-family: 'Noto Serif KR';
          src: url('${fontUrl}') format('truetype');
      }
  `;
    document.head.appendChild(style);
}

injectFontFace();


/* ========== stored values stuff ========== */

/**
 * this function is immediately invoked
 * and is used to apply the stored values to the page
 */
function applyStoredValues() {
    chrome.storage.local.get(null, function (items) {
        // console.log('Content script loading stored values:', items);

        // Apply each stored value
        if (items.sliderValue1 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-1', items.sliderValue1, 'important');
        }
        if (items.sliderValue2 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-2', items.sliderValue2, 'important');
        }
        if (items.sliderValue3 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-3', items.sliderValue3, 'important');
        }
        if (items.sliderValue4 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-4', `url("${items.sliderValue4}")`, 'important');
        }
        if (items.sliderValue5 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-5', items.sliderValue5, 'important');
        }
        if (items.sliderValue6 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-6', items.sliderValue6, 'important');
        }
        if (items.sliderValue7 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-7', items.sliderValue7, 'important');
        }
        if (items.sliderValue8 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-8', items.sliderValue8, 'important');
        }
        if (items.sliderValue9 !== undefined) {
            document.documentElement.style.setProperty('--slider-value-9', items.sliderValue9, 'important');
        }
    });
}

// call above function immediately, and also we have two backups to call it again
applyStoredValues();

function DOMLoadedFunction() {
    console.log("DOM loaded");
    applyStoredValues();
}
function windowLoadedFunction() {
    console.log("Window loaded");
    applyStoredValues();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyStoredValues);
} else {
    applyStoredValues();
}
window.addEventListener('load', applyStoredValues);



/* ========== claudey name stuff ========== */

let claudeyNameEnabled = false;
let claudeyName = "aria";
// load default state
chrome.storage.local.get(['claudeyNameEnabled'], function (result) {
    claudeyNameEnabled = result.claudeyNameEnabled ?? false;
});
chrome.storage.local.get(['sliderClaudeyName'], function (result) {
    claudeyName = result.sliderClaudeyName ?? "aria";
});

/* ========== claudey svg stuff ========== */
let claudeySvgEnabled = false;
let newPathData = 'M72.434 193.066c1.172-15.715 6.653-40.211 12.612-54.63 42.099-101.852 262.2 39.955 157.477 122.827-16.963 13.422-49.866 20.916-71.508 12.552-29.581-11.437-68.191-95.138-26.041-115.398 39.258-18.873 84.606 15.498 75.01 57.066-15.658 67.822-96.915-39.055-36.64-17.895m-38.041 52.306c73.242 115.547 228.76-6.983 168.351-95.078';
let newViewBox = '50 50 300 300';
let iconColor = '#ff916b';
let iconFill = false;
let strokeWidth = 24;
let strokeOpacity = 0.9;
let strokeLinecap = 'round';
let strokeLinejoin = 'round';
chrome.storage.local.get(['claudeySvgEnabled'], function (result) {
    claudeySvgEnabled = result.claudeySvgEnabled ?? false;
});
chrome.storage.local.get(['sliderClaudeySvgPath'], function (result) {
    newPathData = result.claudeySvgEnabled ?? 'M72.434 193.066c1.172-15.715 6.653-40.211 12.612-54.63 42.099-101.852 262.2 39.955 157.477 122.827-16.963 13.422-49.866 20.916-71.508 12.552-29.581-11.437-68.191-95.138-26.041-115.398 39.258-18.873 84.606 15.498 75.01 57.066-15.658 67.822-96.915-39.055-36.64-17.895m-38.041 52.306c73.242 115.547 228.76-6.983 168.351-95.078';
});
chrome.storage.local.get(['sliderClaudeySvgViewbox'], function (result) {
    newViewBox = result.claudeySvgEnabled ?? '50 50 300 300';
});
chrome.storage.local.get(['sliderClaudeySvgColor'], function (result) {
    iconColor = result.claudeySvgEnabled ?? '#ff916b';
});
chrome.storage.local.get(['sliderClaudeySvgFill'], function (result) {
    iconFill = result.claudeySvgEnabled ?? false;
});
chrome.storage.local.get(['sliderClaudeySvgStrokeWidth'], function (result) {
    strokeWidth = result.claudeySvgEnabled ?? 24;
});
chrome.storage.local.get(['sliderClaudeySvgStrokeOpacity'], function (result) {
    strokeOpacity = result.claudeySvgEnabled ?? 0.9;
});
chrome.storage.local.get(['sliderClaudeySvgStrokeLinecap'], function (result) {
    strokeLinecap = result.claudeySvgEnabled ?? 'round';
});
chrome.storage.local.get(['sliderClaudeySvgStrokeLinejoin'], function (result) {
    strokeLinejoin = result.claudeySvgEnabled ?? 'round';
});



/* ========== message listener ========== */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    /* ========== update css listener ========== */
    if (request.type === 'UPDATE_CSS') {
        document.documentElement.style.setProperty(request.variable, request.value, 'important');
        // console.log(`Content script updated ${request.variable} to ${request.value}`);
    }

    /* ========== claudey name button listener ========== */
    if (request.type === 'TOGGLE_NAME_REPLACEMENTS') {
        if (claudeyNameEnabled === request.enabled) return; // this line is so we don't unnecessarily do the below code after we press the reset button

        claudeyNameEnabled = request.enabled;
        // revert changes if disabled
        if (!claudeyNameEnabled) {
            // you might want to add code here to revert the changes
            // like changing "claudey" back to "ChatGPT"

            // or just reload the page
            // location.reload();

            // or just make an alert for the user to reload the page
            alert("pls reload page to see changes");
        } else {
            // apply claudey name
            textSubs();
        }
    }

    /* ========== claudey svg button listener ========== */
    if (request.type === 'TOGGLE_SVG_REPLACEMENTS') {
        if (claudeyNameEnabled === request.enabled) return; // this line is so we don't unnecessarily do the below code after we press the reset button

        claudeyNameEnabled = request.enabled;
        // revert changes if disabled
        if (!claudeyNameEnabled) {
            // you might want to add code here to revert the changes
            // like changing "claudey" back to "ChatGPT"

            // or just reload the page
            // location.reload();

            // or just make an alert for the user to reload the page
            alert("pls reload page to see changes");
        } else {
            // apply claudey svg
            processNode(document.body);
        }
    }
});


/* ========== some data for claudey replacements ========== */

// claude svg
// const newPathData = 'm19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z';
// const newViewBox = '0 0 100 100';
// const iconColor = 'hsl(15, 63.1%, 59.6%)';
// const iconFill = true;
// const claudeyName = 'claudey';

// galaxy svg
// const newPathData = 'M72.434 193.066c1.172-15.715 6.653-40.211 12.612-54.63 42.099-101.852 262.2 39.955 157.477 122.827-16.963 13.422-49.866 20.916-71.508 12.552-29.581-11.437-68.191-95.138-26.041-115.398 39.258-18.873 84.606 15.498 75.01 57.066-15.658 67.822-96.915-39.055-36.64-17.895m-38.041 52.306c73.242 115.547 228.76-6.983 168.351-95.078';
// const newViewBox = '50 50 300 300';
// const iconColor = 'hsl(15, 63.1%, 59.6%)';
// const iconFill = false;
// const strokeWidth = '24';
// const strokeOpacity = '0.9';
// const strokeLinecap = 'round';
// const strokeLinejoin = 'round';

// const claudeySvgEnabled = true;


/* ========== helper functions for claudey replacements (text & icon) ========== */

/**
 * this function replaces:
 * - "ChatGPT 4o" with "claudey 4o"
 * - "ChatGPT can make mistakes [...]" with "claudey can make mistakes [...]"
 * 
 * this function is called:
 * - in the initial replacements loop for X seconds
 * - when claudey replacements is toggled on
 * - when a mutation is observed
 * 
 * the logic is so bad but it's simple enough to fix later
 * and also cheap enough to not be a problem rn
 */
function textSubs() {
    if (!claudeyNameEnabled) return;

    document.querySelectorAll('button[data-testid="model-switcher-dropdown-button"] > div').forEach(div => {
        if (div && div.innerHTML.trim().startsWith('ChatGPT') && div.innerHTML.trim().length > 8) {
            // `&& div.innerHTML.trim().length > 8` is here because sometimes it loads with only "ChatGPT " and then changes to "ChatGPT"<span>4o</span> after a fraction of a second ... which is interesting

            // console.log("div: ", div);
            // console.log("div children: ", div.children);
            // console.log("original innerHTML:", '"' + div.innerHTML + '"');
            div.innerHTML = claudeyName + div.innerHTML.trim().substring(7);
            // console.log("changed innerHTML: ", '"' + div.innerHTML + '"');
        }
    });

    document.querySelectorAll('div.text-token-text-secondary').forEach(div => {
        var innerDiv = div.querySelector('div > div');
        if (innerDiv) {
            innerDiv = innerDiv.querySelector('div > div');
        }
        if (innerDiv && innerDiv.innerHTML.trim().startsWith('ChatGPT can make mistakes')) {
            innerDiv.innerHTML = claudeyName + ' can make mistakes. chrome extension theme made by corbin!';
        }
    });
}

/**
 * this function updates an svg element
 * this is called in processNode()
 * @param {SVGElement} svg the svg element to update
 */
function updateSvg(svg) {
    if (!claudeySvgEnabled) return;

    // Find the <path> element inside the current SVG
    const path = svg.querySelector('path');
    const textElement = svg.querySelector('text');

    if (textElement && textElement.textContent.trim() === 'ChatGPT') {
        if (path) {
            path.setAttribute('d', newPathData);
            svg.setAttribute('viewBox', newViewBox);

            if (iconFill) {
                path.setAttribute('fill', iconColor);
            } else {
                path.setAttribute('fill', 'none');  // no fill!
            }

            path.setAttribute('stroke', iconColor);
            path.setAttribute('stroke-width', strokeWidth.toString());
            path.setAttribute('stroke-opacity', strokeOpacity.toString());
            path.setAttribute('stroke-linecap', strokeLinecap);
            path.setAttribute('stroke-linejoin', strokeLinejoin);
        }
    }
}

/**
 * this function processes a node to update its SVGs
 * @param {Node} node the node to process
 */
function processNode(node) {
    if (!claudeySvgEnabled) return;

    if (node.tagName === 'SVG' && node.classList.contains('icon-md')) {
        updateSvg(node);
    } else if (node.querySelectorAll) {
        // Check descendants for SVGs
        node.querySelectorAll('svg.icon-md').forEach(svg => updateSvg(svg));
    }
}


/* ========== mutation observer for claudey replacements (text & icon) ========== */

function setupMutationObserver() {
    // console.log("ran setupMutationObserver()");
    // Create a MutationObserver to watch for changes in the document
    const observer = new MutationObserver(mutationsList => {
        textSubs();
        for (const mutation of mutationsList) {
            // Check for added nodes so we can do text & icon replacements
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    processNode(node);
                });
            }

            // Check attribute changes for the model switcher dropdown button
            // (we only need to do this when claudey text replacements are enabled,
            //    because otherwise it automatically works)
            if (!claudeyNameEnabled) { continue; }
            if (mutation.type === 'attributes' &&
                mutation.attributeName === 'aria-label' &&
                mutation.target.matches('[data-testid="model-switcher-dropdown-button"]')) {

                const newLabel = mutation.target.getAttribute('aria-label');
                // console.log("model switcher aria-label changed to:", newLabel);

                const ariaLabel = mutation.target.getAttribute('aria-label');

                // extract model name using regex (⋆｡✧)
                const match = ariaLabel.match(/Model selector, current model is (.*)/);
                if (match) {
                    const modelName = match[1];
                    // console.log("model changed to:", modelName);

                    // make sure we only update span inside this specific button (◕‿◕✿)
                    const button = mutation.target;  // this is our button with data-testid
                    const span = button.querySelector('span.text-token-text-secondary');
                    if (span && span.closest('[data-testid="model-switcher-dropdown-button"]') === button) {
                        span.innerHTML = modelName;
                    }
                }
            }
        } // end for (const mutation of mutationsList) {...}
    }); // end new MutationObserver(...)

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true,

        attributes: true,
        attributeFilter: ['aria-label']
    });
}

setupMutationObserver();


/* ========== initial claudey replacements (text & icon) ========== */

let initialDelay = 250;
let intervalDelay = 250;
let timeLimit = 10000;
window.addEventListener('load', () => {
    // console.log("window loaded");
    // setupMutationObserver();

    // Optionally process existing nodes after the observer is set up
    // processNode(document.body);
    // console.log("hello");

    // Wait before starting the interval
    setTimeout(() => {
        // console.log("starting interval after 5 second delay");

        textSubs();
        processNode(document.body);
        applyStoredValues();

        let count = 1;
        const interval = setInterval(() => {
            // console.log("yum2");
            textSubs();
            processNode(document.body);
            applyStoredValues();
            count++;

            if (count >= timeLimit) { // stop after __ milliseconds
                clearInterval(interval);
                // console.log(`stopped interval after ${timeLimit / 1000} seconds`);
            }
        }, intervalDelay); // delay of __ seconds inbetween each run
    }, initialDelay); // initial delay of __ seconds before first run

});