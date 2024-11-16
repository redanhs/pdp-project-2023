window.myChart = null;

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('comparisonForm');
    const nutrientTypeSelector = document.getElementById('nutrientType');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const repas1 = document.getElementById('repas1').value;
        const repas2 = document.getElementById('repas2').value;
        const nutrientType = nutrientTypeSelector.value;

        fetch('/comparer_repas', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ repas1: repas1, repas2: repas2 })
        })
        .then(response => response.json())
        .then(data => {
            updateDetails(data, nutrientType)
            createChart(data, nutrientType);
        })
        .catch(error => console.error('Error:', error));
    });
});


function updateDetails(data, chartType) {
    const detailsDiv = document.getElementById('details');
    let comparisonText = '';

    if (chartType === 'macronutriments') {
        comparisonText += compareNutrient('Calories', data.repas1.calorie, data.repas2.calorie);
        comparisonText += compareNutrient('Protéines', data.repas1.proteine, data.repas2.proteine);
        comparisonText += compareNutrient('Lipides', data.repas1.lipide, data.repas2.lipide);
        comparisonText += compareNutrient('Glucides', data.repas1.glucide, data.repas2.glucide);
    } else if (chartType === 'micronutriments') {
        comparisonText += compareNutrient('Fibres', data.repas1.fibre, data.repas2.fibre);
        comparisonText += compareNutrient('Minéraux', data.repas1.mineraux, data.repas2.mineraux);
        comparisonText += compareNutrient('Vitamines', data.repas1.vitamines, data.repas2.vitamines);
    }
    else {
        comparisonText += compareNutrient('Changement climatique', data.repas1.changement_clim, data.repas2.changement_clim);
        comparisonText += compareNutrient('Appauvrissement de la couche d\'ozone', data.repas1.app_couche_ozone, data.repas2.app_couche_ozone);
        comparisonText += compareNutrient('Rayonnement ionisant', data.repas1.rayons_ion, data.repas2.rayons_ion);
        comparisonText += compareNutrient('Formation de photo-ozone', data.repas1.formation_phot_ozone, data.repas2.formation_phot_ozone);
        comparisonText += compareNutrient('Particules fines', data.repas1.partic_fines, data.repas2.partic_fines);
        comparisonText += compareNutrient('Substances non cancérogènes', data.repas1.sub_non_cancerogenes, data.repas2.sub_non_cancerogenes);
        comparisonText += compareNutrient('Substances cancérigènes', data.repas1.sub_cancerogenes, data.repas2.sub_cancerogenes);
        comparisonText += compareNutrient('Acidification des terres et des eaux', data.repas1.acidificat_terre_eau, data.repas2.acidificat_terre_eau);
        comparisonText += compareNutrient('Eutrophisation des eaux douces', data.repas1.eutroph_eaux_douces, data.repas2.eutroph_eaux_douces);
        comparisonText += compareNutrient('Eutrophisation marine', data.repas1.eutroph_marine, data.repas2.eutroph_marine);
        comparisonText += compareNutrient('Eutrophisation terrestre', data.repas1.eutrop_terrestre, data.repas2.eutrop_terrestre);
        comparisonText += compareNutrient('Écotoxicité pour les écosystèmes aquatiques', data.repas1.ecotox_ecosys_eau, data.repas2.ecotox_ecosys_eau);
        comparisonText += compareNutrient('Utilisation des sols', data.repas1.util_sol, data.repas2.util_sol);
        comparisonText += compareNutrient('Épuisement des ressources en eau', data.repas1.epuis_eau, data.repas2.epuis_eau);
        comparisonText += compareNutrient('Épuisement des ressources énergétiques', data.repas1.epuis_energ, data.repas2.epuis_energ);
        comparisonText += compareNutrient('Épuisement des ressources minérales', data.repas1.epuis_miner, data.repas2.epuis_miner);
    }

    detailsDiv.innerHTML = comparisonText;
}

function compareNutrient(nutrientName, value1, value2) {
    let difference = Math.abs(value1 - value2).toFixed(2);
    let comparisonResult = value1 > value2 
                           ? `Le repas 1 est supérieur au repas 2 en ${nutrientName.toLowerCase()} : <strong>${difference}</strong> de plus (<strong>${value1}</strong> vs ${value2})<br>`
                           : `Le repas 2 est supérieur au repas 1 en ${nutrientName.toLowerCase()} : <strong>${difference}</strong> de plus (<strong>${value2}</strong> vs ${value1})<br>`;

    if(value1 === value2) {
        comparisonResult = `Les repas 1 et 2 ont la même quantité de ${nutrientName.toLowerCase()} : ${value1}<br>`;
    }

    return comparisonResult;
}



function createChart(data, chartType) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (window.myChart) window.myChart.destroy();
    let labels, repas1Data, repas2Data;
    if (chartType === 'macronutriments') {
        labels = ['Protéines', 'Lipides', 'Glucides'];
        repas1Data = [data.repas1.proteine, data.repas1.lipide, data.repas1.glucide];
        repas2Data = [data.repas2.proteine, data.repas2.lipide, data.repas2.glucide];

    } else if (chartType === 'micronutriments') {
        labels = ['Fibre', 'Mineraux', 'Vitamines'];
        repas1Data = [data.repas1.fibre, data.repas1.mineraux, data.repas1.vitamines];
        repas2Data = [data.repas2.fibre, data.repas2.mineraux, data.repas2.vitamines];
    }
    else {
        labels= [
            'Changement climatique',
            'Appauvrissement de la couche d\'ozone',
            'Rayonnement ionisant',
            'Formation de photo-ozone',
            'Particules fines',
            'Substances non cancérogènes',
            'Substances cancérigènes',
            'Acidification des terres et des eaux',
            'Eutrophisation des eaux douces',
            'Eutrophisation marine',
            'Eutrophisation terrestre',
            'Écotoxicité pour les écosystèmes aquatiques',
            'Utilisation des sols',
            'Épuisement des ressources en eau',
            'Épuisement des ressources énergétiques',
            'Épuisement des ressources minérales'
        ]
        
        repas1Data = [
            data.repas1.changement_clim,
            data.repas1.app_couche_ozone,
            data.repas1.rayons_ion,
            data.repas1.formation_phot_ozone,
            data.repas1.partic_fines,
            data.repas1.sub_non_cancerogenes,
            data.repas1.sub_cancerogenes,
            data.repas1.acidificat_terre_eau,
            data.repas1.eutroph_eaux_douces,
            data.repas1.eutroph_marine,
            data.repas1.eutrop_terrestre,
            data.repas1.ecotox_ecosys_eau,
            data.repas1.util_sol,
            data.repas1.epuis_eau,
            data.repas1.epuis_energ,
            data.repas1.epuis_miner
        ]
        
        repas2Data = [
            data.repas2.changement_clim,
            data.repas2.app_couche_ozone,
            data.repas2.rayons_ion,
            data.repas2.formation_phot_ozone,
            data.repas2.partic_fines,
            data.repas2.sub_non_cancerogenes,
            data.repas2.sub_cancerogenes,
            data.repas2.acidificat_terre_eau,
            data.repas2.eutroph_eaux_douces,
            data.repas2.eutroph_marine,
            data.repas2.eutrop_terrestre,
            data.repas2.ecotox_ecosys_eau,
            data.repas2.util_sol,
            data.repas2.epuis_eau,
            data.repas2.epuis_energ,
            data.repas2.epuis_miner
        ]
        
    }


    window.myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Repas 1',
                data: repas1Data,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
            }, {
                label: 'Repas 2',
                data: repas2Data,
                fill: true,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            }]
        },
        options: {
            elements: {
                line: {
                    borderWidth: 3
                }
            },
            scale: {
                angleLines: {
                    display: false
                },
                ticks: {
                    suggestedMin: 50,
                    suggestedMax: 100
                }
            }
        }
    });
}
