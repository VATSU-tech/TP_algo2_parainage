import Button1 from "../components/Button1";
import Input from "../components/_input";

export default function Login() {
    return (
        <main className="flex flex-col bg-gray-600 p-4 border-gray-500 border-2 border rounded-lg gap-4 w-[400px] mx-auto">
            <h1 className="text-4xl font-bold">Connexion</h1>
            <Input placeholder="Username" type="text"/>
            <Input placeholder="Password" type="password"/>
            <Button1 text="Se connecter" page="/" />
            <div className="flex gap-4 justify-between">
                <a href="/inscription" className="text-center text-blue-500 hover:underline">S'inscrire</a>
                <a href="/mot-de-passe-oublie" className="text-center text-blue-500 hover:underline">Mot de passe oublié ?</a>
            </div>
        </main>
    );
}