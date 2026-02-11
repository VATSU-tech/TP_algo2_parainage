import { NavLink } from "react-router-dom" // Lien de navigation avec style actif.

export default function Button1({ text, page}: { text: string,page:string }) {
    return (
        <button className="btn-1">
            {/* NavLink permet de changer de route sans recharger la page */}
            <NavLink to={page}>
                <span>{text}</span>
                <i></i>
            </NavLink>
        </button>
    );
}

/*
Résumé pédagogique du composant:
- Bouton stylisé qui encapsule un NavLink.
- text est le libellé, page est la route cible.
*/
