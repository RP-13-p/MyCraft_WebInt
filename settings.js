// settings.js
// Handles the Settings page.
// On page load  : fill the form fields with data saved in localStorage.
// On save click : read all fields and save them to localStorage.

document.addEventListener('DOMContentLoaded', () => {

    // Get all text fields and put them in one object to avoid repetition
    const fields = {
        username:  document.getElementById('set-username'),
        email:     document.getElementById('set-email'),
        phone:     document.getElementById('set-phone'),
        address:   document.getElementById('set-address'),
        company:   document.getElementById('set-company'),
        siret:     document.getElementById('set-siret'),
        sector:    document.getElementById('set-sector'),
        employees: document.getElementById('set-employees')
    };

    // Checkboxes from the Preferences section
    const checkEmail = document.getElementById('email-notifications');
    const checkSms   = document.getElementById('sms-notifications');
    const checkNews  = document.getElementById('news');

    const saveBtn  = document.getElementById('save-settings-btn');
    const savedMsg = document.getElementById('settings-saved-msg');

    // 1) On page load: read saved data from localStorage (if it exists)
    const data = loadData('mycraft_settings', null);
    if (data !== null) {
        // For each text field, if a saved value exists we display it
        for (const name in fields) {
            if (data[name] !== undefined) {
                fields[name].value = data[name];
            }
        }
        checkEmail.checked = data.notifEmail;
        checkSms.checked   = data.notifSms;
        checkNews.checked  = data.notifNews;
    }

    // 2) On save click: build an object with all values and save it
    saveBtn.addEventListener('click', () => {
        const newData = {
            username:   fields.username.value,
            email:      fields.email.value,
            phone:      fields.phone.value,
            address:    fields.address.value,
            company:    fields.company.value,
            siret:      fields.siret.value,
            sector:     fields.sector.value,
            employees:  fields.employees.value,
            notifEmail: checkEmail.checked,
            notifSms:   checkSms.checked,
            notifNews:  checkNews.checked
        };

        saveData('mycraft_settings', newData);

        // Show a small confirmation message, then hide it after 2.5 seconds
        savedMsg.style.display = 'block';
        setTimeout(() => {
            savedMsg.style.display = 'none';
        }, 2500);
    });

});
