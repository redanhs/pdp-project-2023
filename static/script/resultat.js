var repasComplet ;

/**
 * Affiche les détails de l'aliment sélectionné dans l'élément input.
 */
function afficherDetails() {
    var inputElement = document.getElementById("inputAliment");
    var selectedValue = inputElement.value.trim();
    var detailsElement = document.getElementById("detailsAliment");

    if (!selectedValue) {
        detailsElement.innerHTML = "<br>Veuillez sélectionner un aliment pour voir les détails.";
        return;
    }


    fetch('/get_aliment_details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nom_aliment=${encodeURIComponent(selectedValue)}`
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Réponse du réseau non OK');
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            detailsElement.innerHTML = "<br>Aucun détail disponible pour cet aliment.";
        } else {
            detailsElement.innerHTML = `<br>Valeur nutritive pour 100g/100ml:<br>Nom : ${data.nom}
                <br>Calories : ${data.calories == -1 ? "Valeur non indiquée(comptabilisé comme 0)" : data.calories + " kcal"}
                <br>Protéines : ${data.proteines == -1 ? "Valeur non indiquée(comptabilisé comme 0)" : data.proteines + " g"}
                <br>Glucides : ${data.glucides == -1 ? "Valeur non indiquée(comptabilisé comme 0)" : data.glucides + " g"}
                <br>Lipides : ${data.lipides == -1 ? "Valeur non indiquée(comptabilisé comme 0)" : data.lipides + " g"}
                <br>Score EF : ${data.score_EF == -1 ? "Valeur non indiquée(comptabilisé comme 0)" : data.score_EF}
                <br>Fibres : ${data.fibres == -1 ? "Valeur non indiquée(comptabilisé comme 0)" : data.fibres+ " g" } 
                <br>Mineraux : ${data.mineraux == -1 ? "Valeur non indiquée(comptabilisé comme 0)" : data.mineraux + " g"}
                <br>Vitamines : ${data.vitamines == -1 ? "Valeur non indiquée(comptabilisé comme 0)" : data.vitamines + " g"}<br>`;
        }
    })
    .catch(error => {
        alert(error);
        console.error('Erreur lors de la récupération des détails de l\'aliment :', error);
        detailsElement.innerHTML = "<br>Erreur de chargement des détails.";
    });
}


/**
 * Vérifie si la valeur sélectionnée nécessite un encodage particulier.
 * @param {string} selectedValue - La valeur sélectionnée.
 * @returns {boolean} - Vrai si l'encodage est nécessaire, sinon faux.
 */
function test_besoin_encode(selectedValue){
    var t = '"';
    return selectedValue.includes(t);
}

/**
 * Traite les détails de l'aliment en fonction de la quantité entrée.
 * @param {Object} details - Les détails de l'aliment.
 * @param {number} quantite - La quantité entrée par l'utilisateur.
 * @returns {Object} - Les détails de l'aliment mis à jour.
 */
function traiterQuantite(details, quantite){
    details.id = details.id == -1 ? details.id : details.id;
    details.calories = details.calories == -1.0 ? 0 : +(details.calories * (quantite/100)).toFixed(3);
    details.proteines = details.proteines == -1.0 ? 0 : +(details.proteines * (quantite/100)).toFixed(3);
    details.glucides = details.glucides == -1.0 ? 0 : +(details.glucides * (quantite/100)).toFixed(3);
    details.lipides = details.lipides == -1.0 ? 0 : +(details.lipides * (quantite/100)).toFixed(3);
    details.fibres = details.fibres == -1.0 ? 0 : +(details.fibres * (quantite/100)).toFixed(3);
    details.mineraux = details.mineraux == -1.0 ? 0 : +(details.mineraux * (quantite/100)).toFixed(3);
    details.vitamines = details.vitamines == -1.0 ? 0 : +(details.vitamines * (quantite/100)).toFixed(3);
    details.score_EF = details.score_EF == -1.0 ? 0 : +(details.score_EF * (quantite/100)).toFixed(3);
    details.quantite = quantite;
    return details;
}


/**
 * Met à jour l'objet repasComplet avec les données reçues du serveur.
 * @param {Object} response - Les données reçues du serveur.
 */
function afficherRepasComplet(response) {
    repasComplet += response;
    afficherRepas();
}

/**
 * Envoie les informations du repas complet au serveur pour sauvegarde.
 */
function sauvegarderRepas() {
    var username = prompt("Veuillez entrer votre nom d'utilisateur:", "invité");
    if (!username) {
        username = "invité";
    }
    var consomme = document.getElementById("repasConsomme").checked;
    var dateConsommation = document.getElementById("dateConsommation").value;
    if (!consomme && !dateConsommation) {
        alert("Vous devez fournir une date de consommation si le repas n'a pas été consommé.");
        return;
    }
    var data = {
        repas: repasComplet,
        consomme: consomme,
        dateConsommation: dateConsommation,
        username: username
    };
    fetch('/sauvegarder_repas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Le repas a été enregistré avec succès.");
            window.location.href = '/';
        } else {
            alert("Une erreur s'est produite lors de l'enregistrement du repas : Verifiez que vous avez bien ajouté un aliment au repas." + data.error);
        }
    });
}



function filtrerAlimentsParType() {
    const type = document.getElementById('typesAliments').value;
    const dataList = document.getElementById('datalistAliments');
    const input = document.getElementById('inputAliment');
    const formData = new FormData();
    formData.append('type_aliment', type);

    fetch('/get_aliments', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(aliments => {
        dataList.innerHTML = '';
        aliments.forEach(aliment => {
            const option = document.createElement('option');
            option.value = aliment.nom;
            dataList.appendChild(option);
        });
        input.setAttribute('list', dataList.id);
    })
    .catch(error => console.error('Erreur lors de la récupération des aliments :', error));
}






/**
 * Ajoute l'aliment sélectionné au repas en cours de création.
 */
function ajouterAuRepas() {
    var inputElement = document.getElementById("inputAliment");
    var selectedValue = inputElement.value.trim();
    var quantiteElement = document.getElementById("quantite");
    var quantite = parseFloat(quantiteElement.value); // Convertir en float ici
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);
    var keys = Array.from(params.keys());
    var lastKey = keys[keys.length - 1];
    var nomRepas = params.get(lastKey);

    if (!selectedValue || isNaN(quantite)) {
        alert('Veuillez sélectionner un aliment valide et indiquer une quantité.');
        return;
    }

    if (quantite <= 0) {
        alert('La quantité doit être supérieure à zéro.');
        return;
    }

    fetch('/get_aliment_details', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `nom_aliment=${encodeURIComponent(selectedValue)}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Erreur lors de la récupération des détails de l\'aliment :', data.error);
            return;
        }

        data = traiterQuantite(data, quantite);
        if (!repasComplet) {
            repasComplet = { nom: nomRepas, aliments: [] };
        }
        repasComplet.aliments.push(data);
        afficherRepas();
    })
    .catch(error => {
        console.error('Échec de la récupération des détails de l\'aliment :', error);
    });
}


/**
 * Affiche les détails du repas complet actuel.
 */
/**
 * Affiche les détails du repas complet actuel et calcule les totaux nutritionnels.
 */
/**
 * Affiche les totaux nutritionnels du repas et détaille ensuite chaque aliment.
 */
function afficherRepas() {
    var repasElement = document.getElementById("repas");
    let totalCalories = 0, totalProteines = 0, totalGlucides = 0, totalLipides = 0, totalFibres = 0, totalMineraux = 0, totalVitamines = 0, totalScoreEF = 0;

    repasComplet.aliments.forEach(aliment => {
        totalCalories += aliment.calories;
        totalProteines += aliment.proteines;
        totalGlucides += aliment.glucides;
        totalLipides += aliment.lipides;
        totalFibres += aliment.fibres;
        totalMineraux += aliment.mineraux;
        totalVitamines += aliment.vitamines;
        totalScoreEF += aliment.score_EF;
    });

    let totalContent = `<h2>Mon Repas : ${repasComplet.nom}</h2>
        <h3>Total Nutritionnel du Repas:</h3>
        Calories: ${totalCalories} kcal<br>
        Protéines: ${totalProteines} g<br>
        Glucides: ${totalGlucides} g<br>
        Lipides: ${totalLipides} g<br>
        Fibres: ${totalFibres} g<br>
        Minéraux: ${totalMineraux} g<br>
        Vitamines: ${totalVitamines} g<br>
        Score EF Total: ${totalScoreEF}<br><br>`;

    repasComplet.aliments.forEach((aliment, index) => {
        totalContent += `<div>${index + 1}. Nom : ${aliment.nom}
            , Calories : ${aliment.calories} kcal
            , Protéines : ${aliment.proteines} g
            , Glucides : ${aliment.glucides} g
            , Lipides : ${aliment.lipides} g
            , Fibres : ${aliment.fibres} g
            , Minéraux : ${aliment.mineraux}
            , Vitamines : ${aliment.vitamines}
            , Score EF : ${aliment.score_EF}
            <button onclick="supprimerAliment(${index})">Supprimer</button>
            </div><br>`;
    });

    repasElement.innerHTML = totalContent;
}

function supprimerAliment(index) {
    repasComplet.aliments.splice(index, 1);
    afficherRepas();
}




/**
 * Gère l'affichage des valeurs nutritionnelles non indiquées.
 * @param {Object} nutriments - Les valeurs nutritionnelles du repas.
 * @returns {string} - Le résumé des valeurs nutritionnelles.
 */
function gestion_valeurs_non_indiquees(nutriments) {
    let resume = "<h3> TOTAL REPAS : </h3>";
        Object.keys(nutriments).forEach(key => {
            const { sum, count, nonInd } = nutriments[key];
            const unit = key === "calories" ? "kcal" : "g";
            if (count === 0) {
                resume += `${key[0].toUpperCase() + key.slice(1)} : valeur non indiquée<br>`;
            } else {
                resume += `${key[0].toUpperCase() + key.slice(1)} : ${sum} ${unit}`;
                if (nonInd > 0) {
                    resume += ` (${nonInd} valeurs non indiquées)`;
                }
                resume += `<br>`;
            }
        });

        Object.keys(indicateur).forEach(key => {
            const { sum, count, nonInd } = indicateur[key];
            const unit = key === "calories" ? "kcal" : "g";
            if (count === 0) {
                resume += `${key[0].toUpperCase() + key.slice(1)} : valeur non indiquée<br>`;
            } else {
                resume += `${key[0].toUpperCase() + key.slice(1)} : ${sum} ${unit}`;
                if (nonInd > 0) {
                    resume += ` (${nonInd} valeurs non indiquées)`;
                }
                resume += `<br>`;
            }
        });

    return resume;
}


function choisirTypeAliment() {
    var selectedType = document.getElementById('typesAliments').value;
    fetch('/get_aliments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `resultat=${encodeURIComponent(selectedType)}`
    })
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('aliments');
            select.innerHTML = '';
            data.forEach(aliment => {
                const option = document.createElement('option');
                option.value = aliment.id;
                option.textContent = aliment.nom;
                select.appendChild(option);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des aliments :', error));
}


document.getElementById('ajouterRepas').addEventListener('click', function () {
    window.location.href = 'resultat?ajouter=true';
});
document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('enregistrer_repas_btn');
    submitButton.addEventListener('click', function (event) {
        event.preventDefault();
        sauvegarderRepas();
    });

    const typesAlimentsSelect = document.getElementById('typesAliments');
    typesAlimentsSelect.addEventListener('change', function () {
        filtrerAlimentsParType();
    });

    chargerTypesAliments();
});
