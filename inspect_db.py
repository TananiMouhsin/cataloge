#!/usr/bin/env python3
import sqlite3

con = sqlite3.connect('catalogue.db')
cur = con.cursor()

tables = ['Commande','Produit','Panier','Stocker','Utilisateurs']
for t in tables:
    try:
        cnt = cur.execute(f'SELECT COUNT(*) FROM {t}').fetchone()[0]
        print(f'{t}:', cnt)
    except Exception as e:
        print(f'{t}: ERR {e}')

try:
    rows = cur.execute('SELECT id_commande,id_users,id_produit,quantite,prix_unitaire,date_commande,statut FROM Commande ORDER BY id_commande DESC LIMIT 5').fetchall()
    print('Sample Commande rows:', rows)
except Exception as e:
    print('Select Commande failed:', e)

con.close()


