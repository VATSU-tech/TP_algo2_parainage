import { NavLink } from "react-router-dom"; // Navigation interne.
import Button1 from "../components/Button1"; // Bouton stylisé.
import Input from "../components/_input"; // Champs de saisie réutilisables. 

export default function Inscription() {
    return (
        
        <main className="flex flex-col bg-gray-100 p-4 border-gray-200 border-2  rounded-lg gap-4 w-[400px] mx-auto">
            <h1 className="text-4xl font-bold">Inscription</h1>
            {/* Champs du formulaire d'inscription */}
            <Input placeholder="Nom" type="text" icon="user"/>
            <Input placeholder="Prenom" type="text" icon="user"/>
            <Input placeholder="Email" type="email" icon="envelope"/> 
            <Input placeholder="Nom d'utilisateur" type="text" icon="user"/>
            <Input placeholder="Mot de passe" type="password" icon="lock"/>
            <Input placeholder="Confirmer le mot de passe" type="password" icon="lock"/>
            {/* Lien vers login via NavLink */}
            <NavLink to="/login" className="w-full flex justify-center">
                <Button1 text="S'inscrire" page="/" />
            </NavLink>
            <div className="flex gap-4 justify-between">
                <p>Vous avez un compte <NavLink to="/login" className="text-center hover:text-blue-500 hover:underline">se connecter</NavLink> </p>
            </div>
        </main>
    );
}

/*
Résumé pédagogique du composant:
- Page d'inscription avec plusieurs champs (nom, email, mot de passe).
- Le bouton utilise Button1 et la navigation est gérée par NavLink.
*/
