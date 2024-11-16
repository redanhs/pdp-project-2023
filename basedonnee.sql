DROP TABLE IF EXISTS Aliment;
DROP TABLE IF EXISTS TypeAliment;
DROP TABLE IF EXISTS Repas;
DROP TABLE IF EXISTS Utilisateur;
DROP TABLE IF EXISTS Calendrier;

CREATE TABLE TypeAliment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL
);

CREATE TABLE Aliment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    calories FLOAT,
    proteines FLOAT,
    lipides FLOAT,
    glucides FLOAT,
    fibres FLOAT,
    mineraux FLOAT,
    vitamines FLOAT,
    score_EF FLOAT,
    changement_clim FLOAT,
    app_couche_ozone FLOAT,
    rayons_ion FLOAT,
    formation_phot_ozone FLOAT,
    partic_fines FLOAT,
    sub_non_cancerogenes FLOAT,
    sub_cancerogenes FLOAT,
    acidificat_terre_eau FLOAT,
    eutroph_eaux_douces FLOAT,
    eutroph_marine FLOAT,
    eutrop_terrestre FLOAT,
    ecotox_ecosys_eau FLOAT,
    util_sol FLOAT,
    epuis_eau FLOAT,
    epuis_energ FLOAT,
    epuis_miner FLOAT,
    type_aliment_id INTEGER NOT NULL,
    FOREIGN KEY(type_aliment_id) REFERENCES TypeAliment(id)
);

CREATE TABLE Utilisateur (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT NOT NULL,
    repas TEXT NOT NULL,
);

CREATE TABLE Repas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    consommé BOOLEAN,
    nom TEXT NOT NULL,
    utilisateur_nom INTEGER NOT NULL,
    FOREIGN KEY(utilisateur_nom) REFERENCES Utilisateur(nom)
);

CREATE TABLE CompositionRepas (
    repas_id INTEGER,
    aliment_id INTEGER,
    PRIMARY KEY (repas_id, aliment_id),
    FOREIGN KEY(repas_id) REFERENCES Repas(id),
    FOREIGN KEY(aliment_id) REFERENCES Aliment(id)
);

CREATE TABLE Calendrier (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date DATE NOT NULL,
    repas_id INTEGER,
    utilisateur_id INTEGER,
    FOREIGN KEY(repas_id) REFERENCES Repas(id),
    FOREIGN KEY(utilisateur_id) REFERENCES Utilisateur(id)
);
