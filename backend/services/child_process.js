const { exec } = require('child_process');
const fs = require('fs');

// Print Function
function printRawData(data, printerName) {
    return new Promise((resolve, reject) => {
        const tempFile = './temp_print.txt'; // Temporary file to hold raw data

        // Write the raw ESC/POS data to a temporary file
        fs.writeFileSync(tempFile, data);

        // Command to print the temporary file
        const printCommand = `lp -d ${printerName} ${tempFile}`; // Use `print` on Windows

        // Execute the print command
        exec(printCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error printing: ${stderr}`);
                reject(error);
            } else {
                console.log(`Print job sent: ${stdout}`);
                resolve(stdout);
            }

            // Clean up temporary file
            fs.unlinkSync(tempFile);
        });
    });
}

// Usage Example
const rawData = `
\x1B\x40  // Initialize printer
Store Name\n
Item A      $10.00\n
Item B      $20.00\n
-------------------\n
Total       $30.00\n
\x1B\x64\x02  // Cut paper
`;

printRawData(rawData, 'Your_Printer_Name')
    .then(() => console.log('Print successful!'))
    .catch(err => console.error('Print failed:', err));
