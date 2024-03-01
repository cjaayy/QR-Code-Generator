document.getElementById('generate-btn').addEventListener('click', function() {
    var qrInput = document.getElementById('qr-input').value;
    var qrContainer = document.getElementById('qrcode');
    
    // Clear previous QR Code and download link
    qrContainer.innerHTML = "";

    // Check if the input is empty
    if(qrInput.trim() === "") {
        alert("Please enter some URL Link to generate a QR Code.");
        return;
    }

    // Generate QR Code
    QRCode.toCanvas(qrInput, { width: 200 }, function (error, canvas) {
        if (error) {
            console.error(error);
            alert("Error generating QR Code");
        } else {
            // Create an image from the canvas
            var img = document.createElement('img');
            img.src = canvas.toDataURL("image/png");
            
            // Append the image to the container
            qrContainer.appendChild(img);
            
            // Create a download link
            var downloadLink = document.createElement('a');
            downloadLink.innerHTML = 'Download QR Code';
            downloadLink.href = img.src;
            downloadLink.download = 'QRCode.png';
            downloadLink.style.display = 'block';
            downloadLink.style.marginTop = '20px';
            downloadLink.style.textDecoration = 'none';
            downloadLink.style.backgroundColor = '#007bff';
            downloadLink.style.color = 'white';
            downloadLink.style.padding = '10px 20px';
            downloadLink.style.borderRadius = '4px';

            qrContainer.appendChild(downloadLink);
        }
    });
});
