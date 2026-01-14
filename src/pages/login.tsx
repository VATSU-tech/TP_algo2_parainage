export default function Login() {
    return (
        <div className="flex flex-col gap-4 items-center">
            <input type="text" placeholder="Username" className="input" />
            <input type="password" placeholder="Password" className="input" />
            <button className="btn">Login</button>
        </div>
    );
}