function detectDetailedDevice() {
    const parser = new UAParser();
    const result = parser.getResult();
    const osName = result.os.name;
    const osVersion = result.os.version;
    const deviceInfo = `${osName} ${osVersion}`;

    // Display the detected OS and version
    document.querySelector('.device-info').innerHTML = `OS Name: ${osName}, OS Version: ${osVersion}`;
    
    // Log result to the console
    console.log(deviceInfo);
}

// Call the function to detect the OS version
detectDetailedDevice();
