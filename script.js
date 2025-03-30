document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const qrInput = document.getElementById('qr-input');
    const qrSize = document.getElementById('qr-size');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const qrContainer = document.getElementById('qrcode');
    const qrSection = document.getElementById('qrcode-section');
    const downloadOptions = document.getElementById('download-options');
    
    // Event Listeners
    generateBtn.addEventListener('click', generateQRCode);
    clearBtn.addEventListener('click', clearInput);
    qrInput.addEventListener('input', toggleClearButton);
    
    // Initial setup
    toggleClearButton();
    
    // Functions
    function toggleClearButton() {
        clearBtn.style.display = qrInput.value ? 'block' : 'none';
    }
    
    function clearInput() {
        qrInput.value = '';
        qrContainer.innerHTML = '';
        downloadOptions.innerHTML = '';
        qrSection.classList.add('hidden');
        toggleClearButton();
    }
    
    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    function generateQRCode() {
        const input = qrInput.value.trim();
        const size = parseInt(qrSize.value);
        
        // Clear previous QR Code
        qrContainer.innerHTML = "";
        downloadOptions.innerHTML = "";
        
        // Check if the input is empty
        if(input === "") {
            showError("Please enter some text or URL to generate a QR Code.");
            return;
        }
        
        // If input looks like a URL but is not formatted correctly, try to fix it
        if (input.includes('.') && !input.startsWith('http') && !isValidURL(input)) {
            const suggestion = `https://${input}`;
            if (confirm(`Did you mean '${suggestion}'?\nClick OK to use this instead, or Cancel to use your original text.`)) {
                qrInput.value = suggestion;
            }
        }
        
        // Show loading indicator
        qrContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Generating...</div>';
        qrSection.classList.remove('hidden');
        
        // Generate QR Code with slight delay to show loading state
        setTimeout(() => {
            // Options for QR code
            const options = {
                width: size,
                margin: 1,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            };
            
            QRCode.toCanvas(qrInput.value, options, function (error, canvas) {
                if (error) {
                    console.error(error);
                    showError("Error generating QR Code");
                } else {
                    // Clear loading indicator
                    qrContainer.innerHTML = '';
                    
                    // Create an image from the canvas
                    const img = document.createElement('img');
                    img.src = canvas.toDataURL("image/png");
                    img.alt = "QR Code for: " + qrInput.value;
                    
                    // Append the image to the container
                    qrContainer.appendChild(img);
                    
                    // Create download options
                    createDownloadOptions(img.src);
                    
                    // Show the QR code section with animation
                    qrSection.classList.add('show');
                }
            });
        }, 500);
    }
    
    function createDownloadOptions(imgSrc) {
        // PNG download option
        const pngLink = createDownloadLink(imgSrc, 'QRCode.png', 'Download PNG');
        pngLink.innerHTML = '<i class="fas fa-download"></i> Download PNG';
        
        // SVG download option (we'll convert the PNG to SVG)
        const svgLink = createDownloadLink(imgSrc, 'QRCode.svg', 'Download SVG');
        svgLink.innerHTML = '<i class="fas fa-download"></i> Download SVG';
        svgLink.addEventListener('click', function(e) {
            e.preventDefault();
            alert('SVG download is a premium feature in this demo.');
        });
        
        downloadOptions.appendChild(pngLink);
        downloadOptions.appendChild(svgLink);
    }
    
    function createDownloadLink(href, filename, text) {
        const link = document.createElement('a');
        link.className = 'download-btn';
        link.href = href;
        link.download = filename;
        link.textContent = text;
        return link;
    }
    
    function showError(message) {
        qrContainer.innerHTML = `<div class="error"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
        qrSection.classList.remove('hidden');
    }
    
    // Add keyboard shortcut support
    document.addEventListener('keydown', function(e) {
        // Generate QR code when pressing Enter in the input field
        if (e.key === 'Enter' && document.activeElement === qrInput) {
            generateQRCode();
        }
        
        // Clear input when pressing Escape
        if (e.key === 'Escape') {
            clearInput();
        }
    });
});