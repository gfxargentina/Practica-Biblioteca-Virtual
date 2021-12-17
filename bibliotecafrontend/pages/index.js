import { useQuery, gql, useMutation } from "@apollo/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Swal from "sweetalert2";
import Layout from "../components/Layout";

export const GET_ALL_BOOKS = gql`
  query {
    getAllBooks {
      id
      title
      isOnLoan
      author {
        id
        fullName
      }
    }
  }
`;

const ELIMINAR_LIBRO = gql`
  mutation DeleteBook($bookId: BookIdInput!) {
    deleteBook(bookId: $bookId)
  }
`;

const DEVOLVER_LIBRO = gql`
  mutation BookReturn($input: BookReturnInput!) {
    bookReturn(input: $input) {
      isOnLoan
    }
  }
`;

function searchBook(term) {
  return function (x) {
    //console.log(typeof x);
    return x.title.toLowerCase().includes(term) || !term;
  };
}

function searchAuthor(termAuthor) {
  return function (x) {
    //console.log(typeof x);
    return x.author.fullName.toLowerCase().includes(termAuthor) || !termAuthor;
  };
}

export default function Home() {
  const router = useRouter();

  //barra de busqueda
  const [term, setTerm] = useState("");
  const [termAuthor, setTermAuthor] = useState("");

  const [eliminarLibro] = useMutation(ELIMINAR_LIBRO, {
    refetchQueries: [{ query: GET_ALL_BOOKS }],
  });

  const [devolverLibro] = useMutation(DEVOLVER_LIBRO, {
    refetchQueries: [{ query: GET_ALL_BOOKS }],
  });

  const { data, loading, error } = useQuery(GET_ALL_BOOKS);
  //console.log(data);

  if (loading) return "Cargando Libros....";

  if (!data) {
    return (window.location.href = "login");
  }

  //ELIMINAR LIBRO
  const confirmarEliminarLibro = (e) => {
    const libroId = e;

    Swal.fire({
      title: "¿Seguro quiere eliminar este libro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar",
      cancelButtonText: "No, Cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          const data = await eliminarLibro({
            variables: {
              bookId: { id: libroId },
            },
          });

          Swal.fire("EL Libro fue eliminado", data.eliminarLibro, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  // DEVOLVER LIBRO
  const confirmarDevolverLibro = (e) => {
    const libroId = e;

    Swal.fire({
      title: "¿Seguro quiere Devolver este libro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Devolver Libro",
      cancelButtonText: "No, Cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          const data = await devolverLibro({
            variables: {
              input: {
                bookId: libroId,
              },
            },
          });

          Swal.fire(
            "EL Libro fue Devuelto a la biblioteca",
            data.devolverLibro,
            "success"
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light mb-5">Libros</h1>
        <Link href="/nuevo-libro">
          <a
            className="h-8 px-4 py-2 mr-5 text-sm text-indigo-100 transition-colors duration-150 bg-blue-700 
                                      rounded-lg focus:shadow-outline hover:bg-blue-800"
          >
            Nuevo Libro
          </a>
        </Link>

        <Link href="/nuevo-autor">
          <a
            className="h-8 px-4 py-2 text-sm text-indigo-100 transition-colors duration-150 bg-blue-700 
                                      rounded-lg focus:shadow-outline hover:bg-blue-800"
          >
            Nuevo autor
          </a>
        </Link>

        <div className="flex flex-col mt-5">
          <label className="mr-3 font-medium text-green-700 text-center">
            Buscar Libro por nombre o por autor
          </label>
          <input
            type="text"
            name="term"
            placeholder="escriba el nombre del libro"
            onChange={(e) => setTerm(e.target.value)}
            className="h-10 px-5 mb-5 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            name="termAuthor"
            placeholder="escriba el nombre del autor"
            onChange={(e) => setTermAuthor(e.target.value)}
            className="h-10 px-5 mb-5 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-lg focus:outline-none"
          />
        </div>

        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Autor</th>
              <th className="w-1/5 py-2">Titulo</th>
              <th className="w-1/5 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.getAllBooks
              .filter(searchBook(term))
              .filter(searchAuthor(termAuthor))
              .map((libro) => (
                <tr key={libro.id}>
                  <td className="border px-4 py-2">{libro.author.fullName}</td>
                  <td className="border px-4 py-2">{libro.title}</td>
                  <td className="border px-4 py-2 ">
                    <Link href={libro.isOnLoan ? "" : "/prestamos/" + libro.id}>
                      <a
                        className={` ${
                          libro.isOnLoan
                            ? "bg-yellow-700"
                            : "bg-green-700 hover:bg-green-800"
                        } py-1 px-4 inline-block h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150  
                                      rounded-lg focus:shadow-outline 
                                       `}
                      >
                        {libro.isOnLoan ? "PRESTADO" : "Prestar"}
                      </a>
                    </Link>
                    {libro.isOnLoan ? (
                      <button
                        onClick={() => confirmarDevolverLibro(libro.id)}
                        className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 
                                      rounded-lg focus:shadow-outline hover:bg-indigo-800"
                      >
                        Devolver
                      </button>
                    ) : (
                      ""
                    )}

                    <Link href={"/actualizar-libro/" + libro.id}>
                      <a
                        className="py-2 px-4 m-2  text-sm text-indigo-100 transition-colors duration-150 bg-yellow-500  
                                          rounded-lg focus:shadow-outline hover:bg-yellow-800 inline-block"
                      >
                        Editar
                      </a>
                    </Link>

                    <button
                      onClick={() => confirmarEliminarLibro(libro.id)}
                      className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-red-700 
                                      rounded-lg focus:shadow-outline hover:bg-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Layout>
    </>
  );
}
