export default function Avatar(){
    return(
        <div className="avatar flex items-center gap-2">
            <span>user-name</span>
                        <div className="ring-primary hover:cursor-pointer ring-offset-base-300  w-8 rounded-full ring-2 ring-offset-2">
                            <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" className="hover:scale-110 transition-all duration-300" />
                        </div>
                    </div>
    )
}