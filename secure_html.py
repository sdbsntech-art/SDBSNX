import os

# Script de sécurité DÉSACTIVÉ - Permet l'utilisation des DevTools
security_js = """
<script>
// Sécurité DÉSACTIVÉE - Permet le développement et le débogage
// Les protections anti-plagiat sont conservées si nécessaire
</script>
"""

for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith('.html'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            # Supprime tout le vieux script de sécurité si présent
            content = content.replace(
                "document.body.innerHTML = '<h1 style=\"color:red;text-align:center;margin-top:20vh;\">Accès restreint : DevTools détecté !</h1>'",
                ''
            )
            # Supprime le bloc setInterval de détection DevTools
            import re
            content = re.sub(
                r'// Détection DevTools par resize\s+setInterval\(function\(\) \{[^}]+\}, \d+\);',
                '',
                content,
                flags=re.DOTALL
            )
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
