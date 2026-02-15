// Fallback de types quand @types/three n'est pas disponible dans l'environnement.
// Ces déclarations évitent l'erreur TS7016/TS2307, mais les types deviennent "any".
// Si tu peux installer @types/three, supprime ces déclarations pour récupérer les vrais types.
declare module "three";
declare module "three/examples/jsm/controls/OrbitControls";
declare module "three/examples/jsm/controls/OrbitControls.js";

/*
Résumé pédagogique du fichier:
- Fournit des déclarations minimales pour que TypeScript accepte three.js.
- À retirer dès que @types/three est installé.
*/
