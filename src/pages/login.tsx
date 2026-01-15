import Button1 from "../components/Button1";
import Input from "../components/_input";

export default function Login() {
    return (
        <form className="flex flex-col justify-center  bg-gray-100 p-4 border-gray-200 border-2 rounded-lg gap-4 w-[400px] mx-auto">
            <h1 className="text-4xl font-bold">Connexion</h1>
            <Input placeholder="Username" required icon="user" type="text"/>
            <Input placeholder="Password" required icon="lock" type="password"/>
            <Button1 text="Se connecter" page="/" />
            <div className="flex gap-4 justify-between">
                <a href="/inscription" className="text-center hover:text-blue-500 hover:underline">S'inscrire</a>
                <a href="/mot-de-passe-oublie" className="text-center hover:text-blue-500 hover:underline">Mot de passe oublié ?</a>
            </div>
        </form>
    );
}