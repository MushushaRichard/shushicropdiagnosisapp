let diagnosisHistory = [];
let userSettings = {
    notifications: true,
    language: 'English'
};

function showHome() {
    hideAllScreens();
    document.getElementById('homeScreen').style.display = 'block';
}

function showDiagnoseScreen() {
    hideAllScreens();
    document.getElementById('diagnoseScreen').style.display = 'block';
}

function showHistoryScreen() {
    hideAllScreens();
    document.getElementById('historyScreen').style.display = 'block';
    displayHistory();
}

function showSettingsScreen() {
    hideAllScreens();
    document.getElementById('settingsScreen').style.display = 'block';
    displayDynamicSettings();
}

function showProfileScreen() {
    hideAllScreens();
    document.getElementById('profileScreen').style.display = 'block';
    displayUserProfile();
}

function showAboutScreen() {
    hideAllScreens();
    document.getElementById('aboutScreen').style.display = 'block';
}

function hideAllScreens() {
    const screens = ['homeScreen', 'diagnoseScreen', 'historyScreen', 'settingsScreen', 'profileScreen', 'aboutScreen'];
    screens.forEach(screen => {
        document.getElementById(screen).style.display = 'none';
    });
}

function diagnose() {
    const selectedCrop = document.getElementById('cropSelect').value;

    // Simulated backend diagnosis using Axios.
    axios.post('/api/diagnose', { crop: selectedCrop, image: document.getElementById('imageInput').value })
        .then(response => {
            const { result, details } = response.data;
            const randomResult = result || (Math.random() < 0.5 ? 'Healthy Crop' : 'Crop Disease Detected');
            
            // Add the diagnosis result to the history
            diagnosisHistory.unshift(randomResult);

            displayResult(randomResult, details);
            showHistoryScreen();

            // Display notification
            if (userSettings.notifications) {
                displayNotification(randomResult);
            }
        })
        .catch(error => {
            alert('Diagnosis failed. Please try again.');
        });
}

function displayResult(result, details) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = `
        <strong>Result:</strong> ${result}<br>
        <strong>Details:</strong> ${details || 'No additional details available'}
    `;
    resultContainer.style.color = result === 'Healthy Crop' ? '#4CAF50' : '#D32F2F'; /* Green or Red */
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (diagnosisHistory.length === 0) {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = 'No history available.';
        historyList.appendChild(listItem);
    } else {
        diagnosisHistory.forEach(diagnosis => {
            const listItem = document.createElement('li');
            listItem.className = 'list-group-item';
            listItem.textContent = diagnosis;
            historyList.appendChild(listItem);
        });
    }
}

function displayDynamicSettings() {
    const dynamicSettingsContainer = document.getElementById('dynamicSettings');
    dynamicSettingsContainer.innerHTML = '';

    Object.keys(userSettings).forEach(setting => {
        const settingItem = document.createElement('div');
        settingItem.className = 'form-check';
        settingItem.innerHTML = `
            <input class="form-check-input" type="checkbox" id="${setting}" ${userSettings[setting] ? 'checked' : ''}>
            <label class="form-check-label" for="${setting}">${setting.charAt(0).toUpperCase() + setting.slice(1)}</label>
        `;

        settingItem.querySelector('input').addEventListener('change', () => {
            userSettings[setting] = !userSettings[setting];
        });

        dynamicSettingsContainer.appendChild(settingItem);
    });
}

function displayUserProfile() {
    const userProfileContainer = document.getElementById('userProfile');
    userProfileContainer.innerHTML = '';

    const profileItem = document.createElement('div');
    profileItem.innerHTML = `
        <p><strong>Username:</strong> demoUser</p>
        <p><strong>Email:</strong> demo@example.com</p>
        <p><strong>Role:</strong> Standard User</p>
    `;

    userProfileContainer.appendChild(profileItem);
}

function displayNotification(message) {
    const alertContainer = document.getElementById('notificationAlert');
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.textContent = `Diagnosis Result: ${message}`;
    alertContainer.appendChild(alert);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
