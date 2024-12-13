// import React from "react";
// import { Link } from "react-router-dom"; 
// import defaultImage from './../assets/images/defaultImage.png'
// function Card({ provider }) {

//   return (
//     <div className="bg-[#D9F2F0] p-4 rounded-lg shadow-md flex flex-col items-center h-fit ml-8">
//       <img
//         src={`http://localhost:5001/${provider?.profilePicture}`}
//         alt="Profile Picture"
//         className="w-40 h-40 rounded-full object-cover mb-4"
//         onError={(e) => {
//           e.target.src = defaultImage;
//         }} 
//       />
//       <p className="text-gray-600 text-sm">{provider?.profession}</p>
//       <h3 className="text-lg font-semibold mt-2">
//         {provider?.firstName} {provider?.lastName}
//       </h3>
//       <Link to={`/details/${provider?.user_id}`}>
//         <button className="mt-4 bg-prim-button text-white py-2 px-4 rounded hover:bg-hover-button">
//           View Details
//         </button>
//       </Link>
//     </div>
//   );
// }

// export default Card;
