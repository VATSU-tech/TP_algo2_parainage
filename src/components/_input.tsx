export default function Input({ placeholder, type, icon }: { placeholder: string, type: string, icon?: string }) {
    return (
        <div className="flex items-center gap-2">
            <i className={`fa-solid fa-${(icon || "user")}`}></i>
            <input type={type} placeholder={placeholder} className="input outline-none focus:border-blue-500 w-full" />
        </div>
    );
}