#!/bin/bash

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== DÉPLOIEMENT SÉCURISÉ ===${NC}\n"

# Étape 1 : Vérifier qu'on est sur main
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ ERREUR: Tu dois être sur la branche 'main'${NC}"
    echo "Branche actuelle: $CURRENT_BRANCH"
    exit 1
fi
echo -e "${GREEN}✅ Tu es sur la branche 'main'${NC}\n"

# Étape 2 : Vérifier qu'il n'y a pas de changements non-committés
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ ERREUR: Il y a des changements non-committés!${NC}"
    echo "Fais un commit d'abord:"
    echo "  git add ."
    echo "  git commit -m \"ton message\""
    git status
    exit 1
fi
echo -e "${GREEN}✅ Ton code est propre (tous les changements sont committés)${NC}\n"

# Étape 3 : Build
echo -e "${YELLOW}📦 Étape 1: Construction du projet...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ERREUR lors du build!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build réussi!${NC}\n"

# Étape 4 : Switch sur deploy
echo -e "${YELLOW}🔄 Étape 2: Switch vers la branche 'deploy'...${NC}"
git checkout deploy 2>/dev/null || git checkout -b deploy
echo -e "${GREEN}✅ Tu es maintenant sur 'deploy'${NC}\n"

# Étape 5 : Nettoyer et copier
echo -e "${YELLOW}🗑️  Étape 3: Nettoyage + copie des fichiers...${NC}"
git rm -rf . > /dev/null 2>&1
git checkout main -- dist/ 2>/dev/null
if [ -d "dist" ]; then
    cp -r dist/* .
    rm -rf dist/
fi
echo -e "${GREEN}✅ Fichiers prêts à être déployés!${NC}\n"

# Étape 6 : Commit et push
echo -e "${YELLOW}📤 Étape 4: Envoyer le build sur le serveur...${NC}"
git add .
git commit -m "chore: deploy build - $(date +%Y-%m-%d\ %H:%M:%S)"
git push origin deploy
echo -e "${GREEN}✅ Déploiement envoyé!${NC}\n"

# Étape 7 : Retour à main
echo -e "${YELLOW}🔙 Étape 5: Retour à la branche 'main'...${NC}"
git checkout main
echo -e "${GREEN}✅ Tu es de retour sur 'main'${NC}\n"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 DÉPLOIEMENT RÉUSSI!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📝 Résumé:"
echo "   • Code source → branche: main"
echo "   • Build publié → branche: deploy"
echo ""
echo "🌐 Ta branche 'deploy' est prête pour l'hébergement!"
