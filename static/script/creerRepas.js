/**
 * Crée un nouveau repas en envoyant les informations au serveur.
 */
function CreerRepas() {
    var nomrepas = document.getElementById('nomrepas').value.trim();
    if (!nomrepas) {
        alert("Veuillez entrer un nom de repas valide.");
        return;
    }
    if (nomrepas.length < 1) {
        alert("Le nom du repas doit contenir au moins 1 caractères.");
        return;
    }
    var formData = new FormData();
    formData.append('nomrepas', nomrepas);

    fetch('/creer_repas', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/resultat?nomrepas=' + encodeURIComponent(nomrepas);
        } else {
            alert(data.message || "Une erreur s'est produite.");
        }
    })
    .catch(error => console.error('Erreur :', error));
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('creerRepasForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
    });
});
