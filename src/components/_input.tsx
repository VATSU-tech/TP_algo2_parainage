export default function Input({ placeholder, type, icon ,required}: { placeholder: string, type: string, icon?: string ,required?: boolean}) {
    return (
        <div className="flex items-center gap-2">
            {/* Icône FontAwesome par défaut: "user" */}
            <i className={`fa-solid fa-${(icon || "user")}`}></i>
            {/* Input contrôlé par le parent (via props) */}
            <input type={type} placeholder={placeholder} required={required} className="input outline-none focus:border-blue-500 w-full" />
        </div>
    );
}

/*
Résumé pédagogique du composant:
- Input réutilisable avec icône FontAwesome optionnelle.
- Les props contrôlent le type, le placeholder et l'obligation du champ.
*/
