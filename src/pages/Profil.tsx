import UserCard from "../components/UserCard"; // Carte utilisateur.
import Navbar from "../components/navbar"; // Barre de navigation.

export default function Profil() {
    return (
        <div>
            {/* Navigation en haut */}
            <Navbar/>
            {/* Carte profil */}
            <UserCard />
        </div>
    );
}

/*
Résumé pédagogique du composant:
- Page Profil composée d'une Navbar et d'une UserCard.
*/
