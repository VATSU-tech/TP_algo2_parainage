import Navbar from "../components/navbar"; // Navigation principale.

export default function NotFound() {
  return (
    <div className="flex flex-col">
      {/* Navbar toujours visible */}
      <Navbar />
      <div className="flex  justify-center items-center">
        {/* Illustration 404 */}
        <h1 className="text-9xl">4<i className="fa-solid fa-ban text-8xl"></i>4</h1>
        
      </div>
      <div className="flex flex-col justify-start">
        {/* Message */}
        <p className="text-4xl">Page non trouvée</p>
      </div>
    </div>
  );
}

/*
Résumé pédagogique du composant:
- Page 404 avec Navbar + message d'erreur visuel.
*/
