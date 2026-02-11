import { NavLink } from "react-router-dom"; // Lien vers la page profil.

export default function Avatar(){
    return( <NavLink to="/profil"className="avatar flex items-center gap-2">
                {/* Nom affiché à côté de l'avatar */}
                <span>Jhon</span>
                        <div className="hover:cursor-pointer hover:ring-neutral-600 ring-neutral-400 ring-offset-base-300  w-8 rounded-full ring-2 ring-offset-2">
                            {/* Image de profil */}
                            <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" className="hover:scale-110 transition-all duration-300" />
                        </div>
            </NavLink> 
    )
}

/*
Résumé pédagogique du composant:
- Avatar affiche un nom et une image, cliquables vers /profil.
*/
