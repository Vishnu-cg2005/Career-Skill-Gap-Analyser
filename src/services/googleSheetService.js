/**
 * Google Sheet Service
 * Handles communication with the Google Apps Script Web App to store user data.
 */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFl-oZP6Z1_FidMImREaQA0xXFNSN3SGJnWYYYJz5Gb5-zPjo6lCy86YdLCGxhelN02g/exec'; // User needs to update this

export const googleSheetService = {
    /**
     * Sends user registration data to Google Sheets
     * @param {Object} userData - { name, mobile, email, password }
     */
    async registerUser(userData) {
        // Validation
        if (!userData.name || !userData.mobile || !userData.email || !userData.password) {
            throw new Error("Missing required fields");
        }

        // Since we are running client-side, we might face CORS issues with Google Apps Script directly.
        // The standard workaround is using 'no-cors' mode, but that prevents reading the response.
        // For this demo, we will use 'application/x-www-form-urlencoded' and fetch.
        // Note: In a real production app, this should go through a backend proxy.

        try {
            // Check if URL is configured
            if (GOOGLE_SCRIPT_URL.includes('YOUR_GOOGLE_APPS_SCRIPT')) {
                console.warn("Google Sheet URL not configured. Simulating success.");
                return { success: true, message: "Simulated registration (URL not set)" };
            }

            const formData = new FormData();
            formData.append('action', 'register');
            formData.append('name', userData.name);
            formData.append('mobile', userData.mobile);
            formData.append('email', userData.email);
            formData.append('password', userData.password); // In real app, hash this!
            formData.append('timestamp', new Date().toISOString());

            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Important: Google Scripts require this for client-side calls
            });

            // Since 'no-cors' returns an opaque response, we assume success if no network error occurred.
            return { success: true };
        } catch (error) {
            console.error("Google Sheet Error:", error);
            throw new Error("Failed to save to Google Sheet");
        }
    }
};
