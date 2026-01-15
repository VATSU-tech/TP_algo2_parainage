export default function Input({ placeholder, type, icon ,required}: { placeholder: string, type: string, icon?: string ,required?: boolean}) {
    return (
        <div className="flex items-center gap-2">
            <i className={`fa-solid fa-${(icon || "user")}`}></i>
            <input type={type} placeholder={placeholder} required={required} className="input outline-none focus:border-blue-500 w-full" />
        </div>
    );
}