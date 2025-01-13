async function updateName(event) {
    event.preventDefault();
    const nameInput = document.getElementById('naam').value;

    if (!nameInput) {
        alert('Naam mag niet leeg zijn.');
        return;
    }

    try {
        const response = await fetch('/edit-name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${encodeURIComponent(nameInput)}`,
        });

        if (!response.ok) {
            throw new Error('Fout bij het wijzigen van de naam.');
        }

        const data = await response.json();
        alert(`Naam succesvol gewijzigd naar: ${data.userName}`);

        // Redirect naar de indexpagina na succesvolle wijziging van de naam
        window.location.href = 'index.html';
    } catch (error) {
        console.error(error);
        alert('Er is een fout opgetreden.');
    }
}