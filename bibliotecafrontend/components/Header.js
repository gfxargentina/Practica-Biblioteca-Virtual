import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";

const GET_USER_BY_ID = gql`
  query GetUserById($input: UserIdInput!) {
    getUserById(input: $input) {
      fullName
    }
  }
`;

const Header = () => {
  const router = useRouter();

  //Verifica que window este definido y recien trae el localStorage
  const userName =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const { client, data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: {
      input: {
        id: parseInt(userName),
      },
    },
  });
  if (loading) return null;
  //console.log(data);

  const cerrarSesion = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    router.push("/login");
  };
  return (
    <div className="flex justify-between mb-10">
      <p className="mr-3">Hola {data.getUserById.fullName} </p>
      <button
        className="bg-blue-800 hover:bg-red-700 w-full sm:w-auto font-bold uppercase text-xs rounded py-2 px-2 text-white shadow-md"
        type="button"
        onClick={() => cerrarSesion()}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Header;
