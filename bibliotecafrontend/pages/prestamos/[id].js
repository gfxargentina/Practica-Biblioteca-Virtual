import React from "react";
import Layout from "../../components/Layout";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { GET_ALL_BOOKS } from "..";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { GET_ALL_LOANS } from "../libros-prestados";

const GET_BOOK_BY_ID = gql`
  query GetBookById($input: BookIdInput!) {
    getBookById(input: $input) {
      title
      author {
        fullName
      }
    }
  }
`;

const BOOK_LOAN = gql`
  mutation Loan($input: LoanInput!) {
    loan(input: $input) {
      books {
        title
      }
      createdAt
      returned_date
    }
  }
`;

const Prestamos = () => {
  const router = useRouter();

  //trae el id que le pasamos de index.js
  const { id } = router.query;
  //console.log(id);

  // Formulario
  const formik = useFormik({
    initialValues: {
      fechaPrestamo: `${dayjs().format("DD/MM/YYYY")}`,
      fechaRetorno: `${dayjs().add(7, "day").format("DD/MM/YYYY")}`,
    },
    onSubmit: async (valores) => {
      //console.log(valores);
      const { fechaRetorno, fechaPrestamo } = valores;
      try {
        const { data } = await nuevoPrestamo({
          variables: {
            input: {
              bookId: parseInt(id),
              returned_date: fechaRetorno.toString(),
              createdAt: fechaPrestamo,
            },
          },
        });

        Swal.fire({
          icon: "success",
          title: "OK",
          text: "Se Presto el libro correctamente",
        });
        router.push("/");
      } catch (error) {
        //console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...Hubo un problema",
          text: `${error}`,
        });
      }
    },
  });

  const { data, loading, error } = useQuery(GET_BOOK_BY_ID, {
    variables: {
      input: {
        id: parseInt(id),
      },
    },
  });

  //Mutation para crear un nuevo prestamo de libro
  const [nuevoPrestamo] = useMutation(BOOK_LOAN, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_LOANS }],
  });

  if (loading) return null;
  //console.log(data);

  return (
    <>
      <Layout>
        <div>
          <h1 className="text-center text-2xl text-gray-800 ">
            Libro a Prestar
          </h1>
          <div className="flex justify-center mt-5">
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white rounded shadow-md w-full max-w-xl px-8 pt-6 pb-8 mb-4"
            >
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Titulo
              </label>
              <input
                id="titulo"
                type="text"
                placeholder={data.getBookById.title}
                className="placeholder-gray-900 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"
              ></input>

              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Autor
              </label>
              <input
                id="autor"
                type="text"
                placeholder={data.getBookById.author.fullName}
                className="placeholder-gray-900 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"
              ></input>

              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Fecha del Prestamo
              </label>
              <input
                id="fechaPrestamo"
                type="text"
                placeholder={dayjs().format("DD/MM/YYYY")}
                value={formik.values.fechaPrestamo}
                onChange={formik.handleChange}
                className="placeholder-green-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"
              ></input>

              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Fecha de devolución del libro
              </label>
              <input
                id="fechaDevolucion"
                type="text"
                placeholder={dayjs().add(7, "day").format("DD/MM/YYYY")}
                value={formik.values.fechaRetorno}
                onChange={formik.handleChange}
                className="placeholder-red-600 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"
              ></input>

              <input
                type="submit"
                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                value="Prestar Libro"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Prestamos;
