import { NavLink } from "react-router-dom"

export default function Button1({ text, page}: { text: string,page:string }) {
    return (
        <button className="btn-1">
            <NavLink to={page}>
                <span>{text}</span>
                <i></i>
            </NavLink>
        </button>
    );
}