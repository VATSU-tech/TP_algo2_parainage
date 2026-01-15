export default function Input({ placeholder, type }: { placeholder: string, type: string }) {
    return (
        <input type={type} placeholder={placeholder} className="input outline-none focus:border-blue-500 w-full" />
    );
}