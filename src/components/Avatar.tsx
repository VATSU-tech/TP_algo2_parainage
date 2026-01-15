import { NavLink } from "react-router-dom";

export default function Avatar(){
    return( <NavLink to="/profil"className="avatar flex items-center gap-2">
                <span>Jhon</span>
                        <div className="hover:cursor-pointer hover:ring-neutral-600 ring-neutral-400 ring-offset-base-300  w-8 rounded-full ring-2 ring-offset-2">
                            <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" className="hover:scale-110 transition-all duration-300" />
                        </div>
            </NavLink> 
    )
}