import json
from flask import Flask, jsonify, render_template, request, session, redirect, url_for 
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, Float, create_engine, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship
import pandas as pd
import sys
import logging
import time
from flask import session as flask_session
from sqlalchemy.orm import declarative_base
from sqlalchemy import Boolean
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from flask import redirect, url_for
import logging
from sqlalchemy.exc import IntegrityError


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///basedonnee.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['REMEMBER_COOKIE_SECURE'] = True

app.secret_key = 'your_very_secret_key_here123856'

logging.basicConfig(level=logging.DEBUG)
engine = create_engine('sqlite:///basedonnee.db', echo=True)
Base = declarative_base()

class Utilisateur(Base):
    __tablename__ = 'Utilisateur'
    id = Column(Integer, primary_key=True)
    nom = Column(String, nullable=False)
    prenom = Column(String, nullable=False)
    repas = Column(String, nullable=False)

class Repas(Base):
    __tablename__ = 'Repas'
    id = Column(Integer, primary_key=True)
    consommé = Column(Boolean)
    nom = Column(String)
    date = Column(DateTime, default=datetime.now)
    utilisateur_nom = Column(Integer, ForeignKey('Utilisateur.nom'))


class Calendrier(Base):
    __tablename__ = 'Calendrier'
    id = Column(Integer, primary_key=True)
    date = Column(DateTime, default=datetime.now)
    repas_name = Column(String, ForeignKey('Repas.nom'))
    utilisateur_id = Column(Integer, ForeignKey('Utilisateur.id'))


class TypeAliment(Base):
    __tablename__ = 'TypeAliment'
    id = Column(Integer, primary_key=True)
    nom = Column(String)

class CompositionRepas(Base):
    __tablename__ = 'CompositionRepas'
    repas_nom = Column(String, ForeignKey('Repas.nom'), primary_key=True)
    aliment_id = Column(Integer, ForeignKey('Aliment.id'), primary_key=True)
    quantite = Column(Float, default=1.0)



class Aliment(Base):
    __tablename__ = 'Aliment'
    id = Column(Integer, primary_key=True)
    nom = Column(String)
    calories = Column(Float)
    proteines = Column(Float)
    lipides = Column(Float)
    glucides = Column(Float)
    fibres = Column(Float)
    mineraux = Column(Float)
    vitamines = Column(Float)
    score_EF = Column(Float)
    vitamines = Column(Float)
    changement_clim = Column(Float)
    app_couche_ozone = Column(Float)
    rayons_ion = Column(Float)
    formation_phot_ozone = Column(Float)
    partic_fines = Column(Float)
    sub_non_cancerogenes = Column(Float)
    sub_cancerogenes = Column(Float)
    acidificat_terre_eau = Column(Float)
    eutroph_eaux_douces = Column(Float)
    eutroph_marine = Column(Float)
    eutrop_terrestre = Column(Float)
    ecotox_ecosys_eau = Column(Float)
    util_sol = Column(Float)
    epuis_eau = Column(Float)
    epuis_energ = Column(Float)
    epuis_miner = Column(Float)
    type_aliment_id = Column(Integer, ForeignKey('TypeAliment.id'))
    type_aliment_nom = Column(String, ForeignKey('TypeAliment.nom'))

Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()
repasComplets = []

def isNumber(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

def replace_comma(s):
    if isinstance(s, float):
        return s
    if isinstance(s, str):
        if ((s == 'nan') or (s == '-')):
            return -1.0
        if (s.__contains__('<')):
            return replace_comma(s.replace("< ",""))
        if (s == 'traces'):
            return 0.0
        return float(s.replace(',', '.'))
    return 1.0 

def load_data_from_excel():
    cpt = 0
    session.query(Aliment).delete()
    session.query(TypeAliment).delete()
    session.commit()

    df = pd.read_excel('TableCiqual.xls')

    DonnéesEnv = [-1] * 100000
    df2 = pd.read_excel('AGRIBALYSE3.1.1_produits_alimentaires.xlsx', sheet_name='Synthese')
    
    iterator = df2.iterrows()
    next(iterator)
    next(iterator)
    
    for _,row in iterator:
        DonnéesEnv[int(row[1])] = row
    
    for _,row in df.iterrows():
        aliment = Aliment(
            nom=row['alim_nom_fr'],
            calories=replace_comma(row[10]),
            proteines=replace_comma(row[14]),
            lipides=replace_comma(row[17]),
            glucides=replace_comma(row[16]),
            fibres=replace_comma(row[26]),
            mineraux=replace_comma(row[50]),
            vitamines=replace_comma(row[64]),
            score_EF = renvoyer_val(DonnéesEnv,row[6],1),
            changement_clim = renvoyer_val(DonnéesEnv,row[6],2),
            app_couche_ozone = renvoyer_val(DonnéesEnv,row[6],3),
            rayons_ion = renvoyer_val(DonnéesEnv,row[6],4),
            formation_phot_ozone = renvoyer_val(DonnéesEnv,row[6],5),
            partic_fines = renvoyer_val(DonnéesEnv,row[6],6),
            sub_non_cancerogenes = renvoyer_val(DonnéesEnv,row[6],7),
            sub_cancerogenes = renvoyer_val(DonnéesEnv,row[6],8),
            acidificat_terre_eau = renvoyer_val(DonnéesEnv,row[6],9),
            eutroph_eaux_douces = renvoyer_val(DonnéesEnv,row[6],10),
            eutroph_marine = renvoyer_val(DonnéesEnv,row[6],11),
            eutrop_terrestre = renvoyer_val(DonnéesEnv,row[6],12),
            ecotox_ecosys_eau = renvoyer_val(DonnéesEnv,row[6],13),
            util_sol = renvoyer_val(DonnéesEnv,row[6],14),
            epuis_eau = renvoyer_val(DonnéesEnv,row[6],15),
            epuis_energ = renvoyer_val(DonnéesEnv,row[6],16),
            epuis_miner = renvoyer_val(DonnéesEnv,row[6],17),
            id = cpt
        )
        cpt += 1
        type_aliment = TypeAliment(nom=str(row[4]))
        aliment.type_aliment_nom = type_aliment.nom

        session.add(aliment)
        session.add(type_aliment)

    session.commit()

def renvoyer_val(DonnéesEnv,ind,select):
    if isinstance(DonnéesEnv[ind], int):
        return -1
    else:
        v = 'Unnamed: '+str(select+11)
        return replace_comma(DonnéesEnv[ind].loc[v])

@app.route('/type_aliments')
def type_aliments():
    repas_choisi = request.args.get('repas')
    types_aliments = session.query(TypeAliment.nom).distinct().order_by(TypeAliment.nom).all()
    print(types_aliments)
    return render_template('type_aliments.html', types_aliments=types_aliments)


@app.route("/")
def index():
    return render_template('index.html')

@app.route('/creer_repas', methods=['GET', 'POST'])
def creer_repas():
    if request.method == 'POST':
        nom_repas = request.form.get('nomrepas') 
        if nom_repas:
            repas_existant = session.query(Repas).filter_by(nom=nom_repas).first()
            if repas_existant:
                return jsonify({'success': False, 'message': 'Un repas avec ce nom existe déjà'}), 409
            else:
                return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Nom de repas invalide'}), 400
    else:
        return render_template('creer_repas.html')



@app.route("/hello/<name>")
def hello_name(name):
    data= "<b>Hello "+name+"</b>. Nous sommes le " + time.strftime("%d/%m/%Y")
    return data

@app.route('/sauvegarder_repas', methods=['POST'])
def sauvegarder_repas():
    data = request.get_json()
    print('\n'*20)
    print(data)
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400

    try:
        repas_data = data['repas']
        consomme = data['consomme']
        date_consommation = data.get('dateConsommation') 
        username = data.get('username', 'invité') 

        if not consomme and not date_consommation: 
            return jsonify({'success': False, 'error': 'Date de consommation requise'}), 400

        utilisateur = session.query(Utilisateur).filter_by(nom=username).first()
        if not utilisateur:
            utilisateur = Utilisateur(nom=username, prenom="", repas=repas_data['nom'])
            session.add(utilisateur)
            session.commit()

        calendrier_date = datetime.now() if consomme else datetime.strptime(date_consommation, '%Y-%m-%d')
        calendrier = Calendrier(repas_name=repas_data['nom'], date=calendrier_date, utilisateur_id=utilisateur.id)
        repas = Repas(nom=repas_data['nom'], consommé=consomme, utilisateur_nom=username)

        session.add(calendrier)
        session.add(repas)

        for aliment in repas_data['aliments']:
            quantite = float(aliment.get('quantite', 1.0))
            repas_nom = repas_data["nom"]
            if not repas_nom:
                raise ValueError("repas_nom est requis")

            aliment_id = aliment['id']
            existing_entry = session.query(CompositionRepas).filter_by(repas_nom=repas_nom, aliment_id=aliment_id).first()
            if existing_entry:
                existing_entry.quantite += quantite
            else:
                new_compo = CompositionRepas(repas_nom=repas_nom, aliment_id=aliment_id, quantite=quantite)
                session.add(new_compo)

        session.commit()
        return jsonify({'success': True})

    except Exception as e:
        session.rollback()
        logging.error(f"Erreur lors de la sauvegarde du repas: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/calendrier')
def calendrier():
    repas_utilisateur = session.query(Calendrier).filter_by(utilisateur_id=1).all()

    repas_json = []
    for repas in repas_utilisateur:
        repas_json.append({
            'nom': repas.repas_name,
            'date': repas.date.strftime('%Y-%m-%d'),
        })
    
    return render_template('calendrier.html', repas_utilisateur=repas_json)
    
@app.route('/ajouter_aliment/<int:repas_id>', methods=['POST'])
def ajouter_aliment(repas_id):
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400

    try:
        nom_aliment = data.get('nom_aliment')
        quantite = data.get('quantite')

        repas = session.query(Repas).get(repas_id)

        if not repas:
            return jsonify({'success': False, 'error': 'Repas not found'}), 404

        aliment = session.query(Aliment).filter_by(nom=nom_aliment).first()

        if not aliment:
            return jsonify({'success': False, 'error': 'Aliment not found'}), 404

        nouvelle_composition = CompositionRepas(
            repas_nom=repas.nom,
            aliment_id=aliment.id,
            quantite=quantite
        )

        session.add(nouvelle_composition)
        session.commit()

        return jsonify({'success': True})

    except Exception as e:
        session.rollback()
        logging.error(f"Erreur lors de l'ajout de l'aliment au repas : {str(e)}")
        return jsonify({'error': str(e)}), 500

def supprimer_aliment_de_la_base_de_donnees(repas_name, aliment_id):
    try:
        composition_repas = session.query(CompositionRepas).filter(CompositionRepas.repas_nom == repas_name).all()
        print(composition_repas)

        for composition in composition_repas:
            if composition.aliment_id == aliment_id:
                session.delete(composition)
                session.commit()
                print(f"Aliment {aliment_id} supprimé du repas {repas_name}.")
                return True

        print(f"Impossible de trouver l'aliment {aliment_id} dans le repas {repas_name}.")
        return False

    except IntegrityError:
        session.rollback()
        print("Erreur lors de la suppression de l'aliment de la base de données.")
        return False


@app.route('/supprimer_aliment/<string:repas_name>/<int:aliment_id>', methods=['GET'])
def supprimer_aliment(repas_name, aliment_id):
    print(f"Suppression de l'aliment {aliment_id} du repas {repas_name}")
    if supprimer_aliment_de_la_base_de_donnees(repas_name, aliment_id):
        return redirect(url_for('editer_repas'))
    else:
        return jsonify({'error': 'Une erreur s\'est produite lors de la suppression de l\'aliment.'}), 500


@app.route('/editer_repas', methods=['GET'])
def editer_repas():
    if 'repasComplets' not in flask_session:
        flask_session['repasComplets'] = []

    repas = session.query(Repas).all()

    repas_info = []

    for repas_item in repas:
        if not repas_item.consommé:
            repas_aliments = session.query(Aliment).join(CompositionRepas, CompositionRepas.aliment_id == Aliment.id)\
                .filter(CompositionRepas.repas_nom == repas_item.nom).all()
            repas_info.append({
                'repas': repas_item,
                'aliments': repas_aliments
            })

    return render_template('editer_repas.html', repas_info=repas_info)


@app.route('/user_repas', methods=['GET'])
def user_repas():
    utilisateurs = session.query(Utilisateur).all()

    return render_template('user_repas.html', utilisateurs=utilisateurs)


@app.route('/user_repas/<utilisateur_id>', methods=['GET'])
def user_repas_details(utilisateur_id):
    utilisateur = session.query(Utilisateur).filter_by(id=utilisateur_id).first()
    if not utilisateur:
        return "Utilisateur non trouvé", 404

    repas = session.query(Repas).filter_by(utilisateur_nom=utilisateur.nom).all()
    repas_info = []

    for repas_item in repas:
        repas_aliments = session.query(Aliment).join(CompositionRepas, CompositionRepas.aliment_id == Aliment.id)\
            .filter(CompositionRepas.repas_nom == repas_item.nom).all()
        repas_info.append({
            'repas': repas_item,
            'aliments': repas_aliments
        })

    return render_template('repas_utilisateur.html', repas_info=repas_info)



@app.route('/supprimer_tous_repas', methods=['POST'])
def supprimer_tous_repas():
    try:
        session.query(Repas).delete()
        session.commit()
        return jsonify({'success': True})
    except Exception as e:
        session.rollback()
        return jsonify({'success': False, 'error': str(e)})




def convert_good_format(value, index):
    return value[index][0] if value else 0


def add_accumulateur_repas(list_aliment_quantite):
    total = {
        'calorie': 0,
        'proteine': 0,
        'lipide': 0,
        'glucide': 0,
        'fibre': 0,
        'mineraux': 0,
        'vitamines': 0,
        'score_EF': 0,
        'changement_clim': 0,
        'app_couche_ozone': 0,
        'rayons_ion': 0,
        'formation_phot_ozone': 0,
        'partic_fines': 0,
        'sub_non_cancerogenes': 0,
        'sub_cancerogenes': 0,
        'acidificat_terre_eau': 0,
        'eutroph_eaux_douces': 0,
        'eutroph_marine': 0,
        'eutrop_terrestre': 0,
        'ecotox_ecosys_eau': 0,
        'util_sol': 0,
        'epuis_eau': 0,
        'epuis_energ': 0,
        'epuis_miner': 0
    }

    for alimentId, quantite in list_aliment_quantite:  
        aliment = session.query(Aliment).filter(Aliment.id == alimentId).one_or_none()
        print('\n' * 10)
        print(quantite)
        if aliment:
            
            total['calorie'] += aliment.calories * (quantite / 100) if aliment.calories is not None and aliment.calories != -1 else 0
            total['lipide'] += aliment.lipides * (quantite / 100) if aliment.lipides is not None and aliment.lipides != -1 else 0
            total['glucide'] += aliment.glucides * (quantite / 100) if aliment.glucides is not None and aliment.glucides != -1 else 0
            total['proteine'] += aliment.proteines * (quantite / 100) if aliment.proteines is not None and aliment.proteines != -1 else 0
            total['fibre'] += aliment.fibres * (quantite / 100) if aliment.fibres is not None and aliment.fibres != -1 else 0
            total['mineraux'] += aliment.mineraux * (quantite / 100) if aliment.mineraux is not None and aliment.mineraux != -1 else 0
            total['vitamines'] += aliment.vitamines * (quantite / 100) if aliment.vitamines is not None and aliment.vitamines != -1 else 0
            total['score_EF'] += aliment.score_EF * (quantite / 100) if aliment.score_EF is not None and aliment.score_EF != -1 else 0
            total['changement_clim'] += aliment.changement_clim * (quantite / 100) if aliment.changement_clim is not None and aliment.changement_clim != -1 else 0
            total['app_couche_ozone'] += aliment.app_couche_ozone * (quantite / 100) if aliment.app_couche_ozone is not None and aliment.app_couche_ozone != -1 else 0
            total['rayons_ion'] += aliment.rayons_ion * (quantite / 100) if aliment.rayons_ion is not None and aliment.rayons_ion != -1 else 0
            total['formation_phot_ozone'] += aliment.formation_phot_ozone * (quantite / 100) if aliment.formation_phot_ozone is not None and aliment.formation_phot_ozone != -1 else 0
            total['partic_fines'] += aliment.partic_fines * (quantite / 100) if aliment.partic_fines is not None and aliment.partic_fines != -1 else 0
            total['sub_non_cancerogenes'] += aliment.sub_non_cancerogenes * (quantite / 100) if aliment.sub_non_cancerogenes is not None and aliment.sub_non_cancerogenes != -1 else 0
            total['sub_cancerogenes'] += aliment.sub_cancerogenes * (quantite / 100) if aliment.sub_cancerogenes is not None and aliment.sub_cancerogenes != -1 else 0
            total['acidificat_terre_eau'] += aliment.acidificat_terre_eau * (quantite / 100) if aliment.acidificat_terre_eau is not None and aliment.acidificat_terre_eau != -1 else 0
            total['eutroph_eaux_douces'] += aliment.eutroph_eaux_douces * (quantite / 100) if aliment.eutroph_eaux_douces is not None and aliment.eutroph_eaux_douces != -1 else 0
            total['eutroph_marine'] += aliment.eutroph_marine * (quantite / 100) if aliment.eutroph_marine is not None and aliment.eutroph_marine != -1 else 0
            total['eutrop_terrestre'] += aliment.eutrop_terrestre * (quantite / 100) if aliment.eutrop_terrestre is not None and aliment.eutrop_terrestre != -1 else 0
            total['ecotox_ecosys_eau'] += aliment.ecotox_ecosys_eau * (quantite / 100) if aliment.ecotox_ecosys_eau is not None and aliment.ecotox_ecosys_eau != -1 else 0
            total['util_sol'] += aliment.util_sol * (quantite / 100) if aliment.util_sol is not None and aliment.util_sol != -1 else 0
            total['epuis_eau'] += aliment.epuis_eau * (quantite / 100) if aliment.epuis_eau is not None and aliment.epuis_eau != -1 else 0
            total['epuis_energ'] += aliment.epuis_energ * (quantite / 100) if aliment.epuis_energ is not None and aliment.epuis_energ != -1 else 0
            total['epuis_miner'] += aliment.epuis_miner * (quantite / 100) if aliment.epuis_miner is not None and aliment.epuis_miner != -1 else 0
    for key in total:
        total[key] = round(total[key], 3)
    return total

    
@app.route('/comparer_repas', methods=['GET', 'POST'])
def comparer_repas():
    if 'repasComplets' not in flask_session:
        flask_session['repasComplets'] = []

    repasComplets = session.query(Repas).distinct(Repas.nom).all()
    repasComplets_manipulable = [repas.nom for repas in session.query(Repas.nom).distinct().all()]

    if request.method == 'POST':
        data = request.get_json()
        nom_repas1 = data['repas1']
        nom_repas2 = data['repas2']

        repas1 = next((repas for repas in repasComplets_manipulable if repas == nom_repas1), None)
        repas2 = next((repas for repas in repasComplets_manipulable if repas == nom_repas2), None)
        
        list_alimentId_quantite_repas1 = [(composition.aliment_id, composition.quantite) for composition in session.query(CompositionRepas).filter(CompositionRepas.repas_nom == repas1).all()]
        list_alimentId_quantite_repas2 = [(composition.aliment_id, composition.quantite) for composition in session.query(CompositionRepas).filter(CompositionRepas.repas_nom == repas2).all()]

        liste_info_repas1 = add_accumulateur_repas(list_alimentId_quantite_repas1)
        liste_info_repas2 = add_accumulateur_repas(list_alimentId_quantite_repas2)

        print("\n\n\n\n\n\n\nREPAS 1 : ", liste_info_repas1)
        print("\n\n\n\n\n\n\nREPAS 2 : ", liste_info_repas2)
        return jsonify({'repas1': liste_info_repas1, 'repas2': liste_info_repas2})

    else:
        return render_template('comparaison.html', repasComplets=repasComplets)


@app.route('/get_repas')
def get_repas():
    repasComplets = [repas.nom for repas in session.query(Repas.nom).distinct().all()]
    return jsonify(repasComplets)



@app.route('/resultat', methods=['GET', 'POST'])
def creation_repas():
    if request.method == 'POST':
        data = request.get_json()
        print(data)
        return jsonify({'success': True})
    else:
        repas_choisi = request.args.get('repas')
        types_aliments = session.query(TypeAliment.nom).distinct().order_by(TypeAliment.nom).all()
        print(types_aliments)
        return render_template('resultat.html', types_aliments=types_aliments)


@app.route('/get_aliments', methods=['POST'])
def get_aliments():
    type_aliment = request.form.get('type_aliment')
    if type_aliment == "Tous":
        aliments = session.query(Aliment).order_by(Aliment.nom).all()
    else:
        aliments = session.query(Aliment).filter(Aliment.type_aliment_nom == type_aliment).order_by(Aliment.nom).all()
    aliments_json = [{'nom': aliment.nom} for aliment in aliments]
    return jsonify(aliments_json)



@app.route('/get_aliment_details', methods=['POST'])
def get_aliment_details():
    nom_aliment = request.form.get('nom_aliment')
    aliment = session.query(Aliment).filter_by(nom=nom_aliment).first()
    if aliment:
        return jsonify({
            'id': aliment.id,
            'nom': aliment.nom,
            'calories': aliment.calories if aliment.calories else -1,
            'proteines': aliment.proteines if aliment.proteines else -1,
            'glucides': aliment.glucides if aliment.glucides else -1,
            'lipides': aliment.lipides if aliment.lipides else -1,
            'score_EF': aliment.score_EF if aliment.score_EF else -1,
            'fibres': aliment.fibres if aliment.fibres else -1,
            'mineraux': aliment.mineraux if aliment.mineraux else -1,
            'vitamines': aliment.vitamines if aliment.vitamines else -1,
        })
    else:
        session.rollback()
        return jsonify({'error': 'Aliment non trouvé'}), 404


if __name__ == '__main__':
    with app.app_context():
        load_data_from_excel()
    app.run(debug=True, host='0.0.0.0', port='5000')
