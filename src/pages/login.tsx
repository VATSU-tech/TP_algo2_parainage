export default function Login() {
    return (
        <main className="flex flex-col gap-4">
            <input type="text" placeholder="Username" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <button className="btn">Login</button>
        </main>
    );
}