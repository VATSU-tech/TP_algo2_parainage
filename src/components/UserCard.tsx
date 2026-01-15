export default function UserCard() {
  return (
    <div className="flex flex-wrap  w-full gap-4 bg-gray-100 p-4  border-gray-500 rounded-2xl" >
      <div className="hover-3d ">
        {/* content */}
        <figure className="max-w-100 min-w-50 rounded-2xl">
          <img
            src="https://img.daisyui.com/images/stock/creditcard.webp"
            alt="3D card"
          />
        </figure>
        {/* 8 empty divs needed for the 3D effect */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="flex flex-1 min-w-3xs flex-col p-6 justify-around bg-gray-200 rounded-2xl">
            <h1 className="text-4xl font-bold">John Doe</h1> 
            <p className="text-xl"><i className="fa-solid fa-envelope"></i> johndoe@gmail.com</p>
            <p className="text-xl text-gray-500"><i className="fa-brands fa-whatsapp"></i> 1234 5678 9012</p>
            <p className="text-xl text-gray-500"><i className="fa-solid fa-user"></i> 1234 5678 9012</p>
            <p className="text-xl text-gray-500"><i className="fa-solid fa-flag"></i> U.S.A</p> 
        </div>
        <div className=" flex min-w-3xs flex-col p-6 justify-around flex-1 bg-gray-200 rounded-2xl">
            <p className="text-4xl font-bold"><i className="fa-solid fa-wallet "></i>32123 $</p>    
            <p><i className="fa-solid fa-clock"></i> Join since 2022</p>
            <p><i className="fa-solid fa-users-line"></i> Parent of <span className="font-bold">123</span> persons</p>
            <p><i className="fa-solid fa-users-between-lines"></i>Grand parent of <span className="font-bold">123</span> persons</p>
        </div> 
    </div>
  );
}
