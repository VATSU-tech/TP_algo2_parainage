import Navbar from "../components/navbar";

export default function NotFound() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="flex  justify-center items-center">
        <h1 className="text-9xl">4<i className="fa-solid fa-ban text-8xl"></i>4</h1>
        
      </div>
      <div className="flex flex-col justify-start">
        <p className="text-4xl">Page non trouvée</p>
      </div>
    </div>
  );
}
