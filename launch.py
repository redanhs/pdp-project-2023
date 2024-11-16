import subprocess

commande_1 = "python3 -m venv venv"
commande_2 = "source venv/bin/activate"
commande_3 = "pip install sql pandas xlrd flask flask_sqlalchemy openpyxl"

def executer_commande(commande):
    process = subprocess.Popen(commande, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()

    if process.returncode != 0:
        print(f"Erreur lors de l'exécution de la commande : {error.decode('utf-8')}")
    else:
        print(f"Résultat de la commande : \n{output.decode('utf-8')}")

executer_commande(commande_1)
executer_commande(commande_2)
executer_commande(commande_3)