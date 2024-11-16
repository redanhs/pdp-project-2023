function confirmerSuppression() {
    if (confirm("Êtes-vous sûr de vouloir supprimer tous vos repas enregistrés ?")) {
        supprimerTousRepas();
    }
}

function supprimerTousRepas() {
    fetch('/supprimer_tous_repas', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Tous les repas ont été supprimés.");
            window.location.reload();  // Recharger la page pour refléter les changements
        } else {
            alert("Une erreur s'est produite : " + data.error);
        }
    })
    .catch(error => console.error('Erreur lors de la suppression :', error));
}
