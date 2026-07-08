#!/bin/bash
set -e

echo "=== Configuration EduGest ==="

if [ ! -f .env ]; then
    echo "Création du fichier .env..."
    cat > .env << 'EOF'
DB_NAME=edugest
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=edugest_secret_key_2024
PORT=8080
EOF
    echo "Fichier .env créé"
fi

echo ""
echo "=== Vérification de la base de données ==="

if mysql -u root -e "SHOW DATABASES;" 2>/dev/null | grep -q "edugest"; then
    echo "✓ Base de données 'edugest' existe déjà"
else
    echo "Tentative de créer la base de données..."
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS edugest CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null && echo "✓ Base de données créée" || echo "⚠ Impossible de créer la base - vérifiez les droits MySQL"
fi

echo ""
echo "=== Installation des dépendances ==="

cd edugest-backend
npm install --silent 2>/dev/null || npm install
cd ../Front_final
npm install --silent 2>/dev/null || npm install

echo ""
echo "=== Démarrage de l'application ==="
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

npm run dev