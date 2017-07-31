// Saves options to storage.
function saveOptions() {
  const query = {
    imageType: document.getElementById('image').value
  };
  function callback() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(() => {
      status.textContent = '';
    }, 1000);
  }

  if (window.browser) {
    // Firefox uses a promise based API.
    browser.storage.sync.set(query).then(callback);
  } else {
    // Chrome uses callbacks.
    chrome.storage.sync.set(query, callback);
  }
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  const query = {imageType: 'D531106'};
  function callback(items) {
    document.getElementById('image').value = items.imageType;
  }

  if (window.browser) {
    // Firefox uses a promise based API.
    browser.storage.sync.get(query).then(callback);
  } else {
    // Chrome uses callbacks.
    chrome.storage.sync.get(query, callback);
  };
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
