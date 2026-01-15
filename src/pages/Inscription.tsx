import { NavLink } from "react-router-dom";
import Button1 from "../components/Button1";
import Input from "../components/_input"; 

export default function Inscription() {
    return (
        
        <main className="flex flex-col bg-gray-100 p-4 border-gray-200 border-2  rounded-lg gap-4 w-[400px] mx-auto">
            <h1 className="text-4xl font-bold">Inscription</h1>
            <Input placeholder="Nom" type="text" icon="user"/>
            <Input placeholder="Prenom" type="text" icon="user"/>
            <Input placeholder="Email" type="email" icon="envelope"/> 
            <Input placeholder="Nom d'utilisateur" type="text" icon="user"/>
            <Input placeholder="Mot de passe" type="password" icon="lock"/>
            <Input placeholder="Confirmer le mot de passe" type="password" icon="lock"/>
            <NavLink to="/login" className="w-full flex justify-center">
                <Button1 text="S'inscrire" page="/" />
            </NavLink>
            <div className="flex gap-4 justify-between">
                <p>Vous avez un compte <NavLink to="/login" className="text-center hover:text-blue-500 hover:underline">se connecter</NavLink> </p>
            </div>
        </main>
    );
}