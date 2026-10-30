import os

# Headers de sécurité à ajouter
security_meta = '''  <!-- Security Headers -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
  <meta http-equiv="X-Frame-Options" content="DENY" />
  <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
  <meta name="format-detection" content="telephone=no" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: *.google.com *.googleapis.com *.gstatic.com *.youtube.com *.doubleclick.net; img-src 'self' https: data:; font-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: *.google.com *.googleapis.com *.gstatic.com *.youtube.com *.doubleclick.net; style-src 'self' 'unsafe-inline' https: *.googleapis.com; frame-src 'self' https: *.youtube.com;" />
'''

def add_security_headers():
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith('.html'):
                path = os.path.join(root, file)
                try:
                    with open(path, 'r', encoding='utf-8') as f:
                        content = f.read()

                    # Vérifier si les headers sont déjà présents
                    if 'X-Content-Type-Options' in content:
                        print(f"Headers déjà présents dans {path}")
                        continue

                    # Trouver la position après <head> ou après les premières balises meta
                    head_end = content.find('</head>')
                    if head_end == -1:
                        print(f"Pas de balise </head> trouvée dans {path}")
                        continue

                    # Insérer les headers avant </head>
                    new_content = content[:head_end] + security_meta + '\n' + content[head_end:]

                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)

                    print(f"Headers de sécurité ajoutés à {path}")
                except Exception as e:
                    print(f"Erreur avec {path}: {e}")

if __name__ == '__main__':
    add_security_headers()
    print("Terminé !")
