# Projet WebApp

Ce projet est une application web développée en Python utilisant le fichier `webapp.py`.

## Installation

Avant de pouvoir tester ce projet en local, assurez-vous d'avoir les prérequis suivants :

1. **Environnement virtuel (venv) :** Vous devez avoir un environnement virtuel nommé `venv` installé sur votre machine. Si vous ne l'avez pas déjà, vous pouvez créer un nouvel environnement virtuel en utilisant la commande suivante :

    ```bash
    python3 -m venv venv
    ```

2. **Packages nécessaires :** Les packages suivants doivent être installés dans votre environnement virtuel `venv` :

    - flask_sqlalchemy
    - flask
    - sqlite # <- pas sûr pour celui là  
    - sql
    - pandas
    - xlrd

    Vous pouvez installer ces packages en utilisant `pip` depuis votre environnement virtuel :

    ```bash
    source venv/bin/activate
    pip install sql pandas xlrd flask flask_sqlalchemy openpyxl
    ```

## Exécution du Projet

Une fois que vous avez installé l'environnement virtuel et les packages nécessaires, vous pouvez exécuter le projet en suivant ces étapes :

1. Activez votre environnement virtuel `venv` si ce n'est pas déjà fait :

    ```bash
    source venv/bin/activate
    ```

2. Exécutez le fichier `webapp.py` à l'aide de Python :

    ```bash
    python webapp.py
    ```

3. Accédez à l'application dans votre navigateur en ouvrant l'URL suivante : [http://localhost:5000](http://localhost:5000)
