/* ========== font stuff ========== */

// Add this near the start of content.js, before your existing code
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

// Call it immediately
injectFontFace();


/* ========== stored values stuff ========== */

const DEFAULT_VALUES = {
  sliderValue1: 1,
  sliderValue2: 0,
  sliderValue3: 33,
  sliderValue4: "https://i.pinimg.com/originals/6a/ee/ea/6aeeea24e8fd4023a349e354eefa33ed.gif"
};

// Immediately try to load and apply stored values
function applyStoredValues() {
  chrome.storage.local.get(null, function(items) {
      console.log('Content script loading stored values:', items);
      
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
  });
}

// Apply immediately
applyStoredValues();

// Also apply when document is ready (as backup)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyStoredValues);
} else {
  applyStoredValues();
}

// Also apply when document is fully loaded (as backup)
window.addEventListener('load', applyStoredValues);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'UPDATE_CSS') {
      document.documentElement.style.setProperty(request.variable, request.value, 'important');
      console.log(`Content script updated ${request.variable} to ${request.value}`);
  }
});


/* ========== mutation observer stuff ========== */

// claude svg
const newPathData = 'm19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z';
const newViewBox = '0 0 100 100'; // New viewBox value

function textSubs() {
  //console.log("ran textSubs()")
  document.querySelectorAll('div.text-token-text-secondary').forEach(div => {
    if (div.innerHTML.trim().startsWith('ChatGPT')) {
        div.innerHTML = 'claudey' + div.innerHTML.trim().substring(7);
    }

    var innerDiv = div.querySelector('div > div');
    if (innerDiv) {
        innerDiv = innerDiv.querySelector('div > div');
    }
    if (innerDiv && innerDiv.innerHTML.trim().startsWith('ChatGPT can make mistakes')) {
        innerDiv.innerHTML = 'claudey can make mistakes. chrome extension theme made by corbin!';
    }
  });
}

// Function to update SVG elements
function updateSvg(svg) {
    // console.log("ran updateSvg()");

    // Find the <path> element inside the current SVG
    const path = svg.querySelector('path');
    const textElement = svg.querySelector('text');

    if (textElement && textElement.textContent.trim() === 'ChatGPT') {
        if (path) {
            // Set the new 'd' attribute value
            path.setAttribute('d', newPathData);
            // Set the new color
            path.setAttribute('fill', 'hsl(15, 63.1%, 59.6%)');
            // Set the new viewBox attribute value
            svg.setAttribute('viewBox', newViewBox);
        }
    }
}

function processNode(node) {
  // console.log("ran processNode()");
  if (node.tagName === 'SVG' && node.classList.contains('icon-md')) {
      updateSvg(node);
  } else if (node.querySelectorAll) {
      // Check descendants for SVGs
      node.querySelectorAll('svg.icon-md').forEach(svg => updateSvg(svg));
  }
}

function setupMutationObserver() {
  console.log("ran setupMutationObserver()");
  // Create a MutationObserver to watch for changes in the document
  const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        textSubs();
        // Check added nodes
        mutation.addedNodes.forEach(node => {
          processNode(node);
        });
      }
    }
  });

  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Set up the MutationObserver after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM content loaded");
});

setupMutationObserver();

window.addEventListener('load', () => {
  console.log("window loaded");
  //setupMutationObserver();
  
  // Optionally process existing nodes after the observer is set up
  //processNode(document.body);
  console.log("hello");


  // Wait before starting the interval
  setTimeout(() => {
    console.log("starting interval after 5 second delay");

    console.log("yum1");
    textSubs();
    processNode(document.body);

    let count = 1;
    const interval = setInterval(() => {
      // console.log("yum2");
      textSubs();
      processNode(document.body);
      count++;

      if (count >= 50) { // stop after 40 runs (20 seconds)
        clearInterval(interval);
        console.log("stopped interval after 30 seconds");
      }
    }, 500); // run every .5 seconds
  }, 500); // initial .5 second delay

});