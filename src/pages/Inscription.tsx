import Button1 from "../components/Button1";
import Input from "../components/_input"; 

export default function Inscription() {
    return (
        
        <main className="flex flex-col bg-gray-600 p-4 border-gray-500 border-2 border rounded-lg gap-4 w-[400px] mx-auto">
            <h1 className="text-4xl font-bold">Inscription</h1>
            <Input placeholder="Nom" type="text" icon="user"/>
            <Input placeholder="Prenom" type="text" icon="user"/>
            <Input placeholder="Email" type="email" icon="envelope"/> 
            <Input placeholder="Nom d'utilisateur" type="text" icon="user"/>
            <Input placeholder="Mot de passe" type="password" icon="lock"/>
            <Input placeholder="Confirmer le mot de passe" type="password" icon="lock"/>
            <Button1 text="S'inscrire" />
            <div className="flex gap-4 justify-between">
                <p>Vous avez un compte <a href="/login" className="text-center text-blue-500 hover:underline">se connecter</a> </p>
            </div>
        </main>
    );
}