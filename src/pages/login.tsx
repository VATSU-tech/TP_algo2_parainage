import Button1 from "../components/Button1";

export default function Login() {
    return (
        <main className="flex flex-col bg-gray-600 p-4 border-gray-500 border-2 border rounded-lg gap-4 w-[400px] mx-auto">
            <h1 className="text-4xl font-bold">Connexion</h1>
            <input type="text" placeholder="Username" className="input outline-none focus:border-blue-500 w-full" />
            <input type="password" placeholder="Password" className="input outline-none focus:border-blue-500 mb-4 w-full" />
            <Button1 text="Se connecter" />
            <div className="flex gap-4 justify-between">
                <a href="/inscription" className="text-center text-blue-500 hover:underline">S'inscrire</a>
                <a href="/mot-de-passe-oublie" className="text-center text-blue-500 hover:underline">Mot de passe oublié ?</a>
            </div>
        </main>
    );
}