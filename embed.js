(function() {
    // Create container for the widget
    const container = document.createElement('div');
    container.className = 'bloodgroup-predictor-container';
    container.style.width = '100%';
    container.style.maxWidth = '800px';
    container.style.margin = '0 auto';
    container.style.fontFamily = 'Arial, sans-serif';
    
    // Create iframe to load the widget
    const iframe = document.createElement('iframe');
    
    // Set iframe attributes
    iframe.src = 'https://yourusername.github.io/bloodgroup-predictor/';  // Replace with your actual GitHub Pages URL
    iframe.width = '100%';
    iframe.height = '800px';  // Adjust as needed based on your widget's content
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.scrolling = 'no';
    iframe.frameBorder = '0';
    iframe.allowTransparency = 'true';
    
    // Add resize message listener to make iframe responsive
    window.addEventListener('message', function(event) {
        // Verify the sender of the message
        if (event.origin !== 'https://yourusername.github.io') {
            return;
        }
        
        // If message contains height information, resize iframe
        if (event.data && event.data.type === 'resize' && event.data.height) {
            iframe.height = event.data.height + 'px';
        }
    }, false);
    
    // Add iframe to container
    container.appendChild(iframe);
    
    // Insert container where the script tag is
    document.currentScript.parentNode.insertBefore(container, document.currentScript);
    
    // Add message to resizer script within iframe
    window.addEventListener('load', function() {
        setTimeout(function() {
            iframe.contentWindow.postMessage('getHeight', 'https://yourusername.github.io');
        }, 1000);
    });
})();
