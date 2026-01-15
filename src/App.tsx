import "./sass/Style.scss";
import Navbar from "./components/navbar";
import UserCard from "./components/UserCard";

export default function App() {
    return (
        <div className="flex flex-col gap-2.5 ">
            <Navbar />
            <UserCard />
            <h1>Acceuil</h1>
        </div>
    );
} 