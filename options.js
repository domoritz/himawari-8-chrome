// Saves options to chrome.storage.local.
function saveOptions() {
  var imageType = document.getElementById('image').value;
  chrome.storage.local.set({
    imageType: imageType
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.local.get({
    imageType: 'D531106'
  }, function(items) {
    document.getElementById('image').value = items.imageType;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
