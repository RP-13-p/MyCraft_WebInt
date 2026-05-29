document.addEventListener('DOMContentLoaded', () => {

    const fields = {
        username: document.getElementById('set-username'),
        email: document.getElementById('set-email'),
        phone: document.getElementById('set-phone'),
        address: document.getElementById('set-address'),
        company: document.getElementById('set-company'),
        siret: document.getElementById('set-siret'),
        sector: document.getElementById('set-sector'),
        employees: document.getElementById('set-employees')
    };

    const saveBtn = document.getElementById('save-settings-btn');
    const savedMsg = document.getElementById('settings-saved-msg');

    const data = loadData('mycraft_settings', null);
    if (data !== null) {
        for (const name in fields) {
            if (data[name] !== undefined) fields[name].value = data[name];
        }
    }

    saveBtn.addEventListener('click', () => {
        const newData = {
            username: fields.username.value,
            email: fields.email.value,
            phone: fields.phone.value,
            address: fields.address.value,
            company: fields.company.value,
            siret: fields.siret.value,
            sector: fields.sector.value,
            employees: fields.employees.value,
        };

        saveData('mycraft_settings', newData);

        savedMsg.style.display = 'block';
        setTimeout(() => { savedMsg.style.display = 'none'; }, 2500);
    });
});
