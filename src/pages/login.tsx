import Button1 from "../components/Button1";

export default function Login() {
    return (
        <main className="flex flex-col bg-gray-600 p-4 rounded-lg gap-4 w-[400px] mx-auto">
            <h1 className="text-4xl font-bold">Connexion</h1>
            <input type="text" placeholder="Username" className="input outline-none w-full" />
            <input type="password" placeholder="Password" className="input outline-none mb-4 w-full" />
            <Button1 />
            <div className="flex gap-4 justify-between">
                <a href="#" className="text-center text-blue-500 hover:underline">S'inscrire</a>
                <a href="#" className="text-center text-blue-500 hover:underline">Mot de passe oublié ?</a>
            </div>
        </main>
    );
}