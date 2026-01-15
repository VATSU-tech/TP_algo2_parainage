import Button1 from "../components/Button1";

export default function Login() {
    return (
        <main className="flex flex-col bg-gray-500 p-4 rounded-lg gap-4">
            <input type="text" style={{outline: 'none'}} placeholder="Username" className="input" />
            <input type="password" style={{outline: 'none'}} placeholder="Password" className="input" />
            <Button1 />
        </main>
    );
}