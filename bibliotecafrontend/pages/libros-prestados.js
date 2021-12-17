import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useQuery, gql } from "@apollo/client";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const GET_ALL_LOANS = gql`
  query {
    getAllLoans {
      books {
        id
        title
        author {
          fullName
        }
        bookLoan {
          id
          createdAt
          returned_date
        }
      }
    }
  }
`;

const LibrosPrestados = () => {
  const { data, loading, error } = useQuery(GET_ALL_LOANS);
  //console.log(data);

  if (loading) {
    return <p>Data is loading...</p>;
  }
  if (error) return `Error! ${error.message}`;

  return (
    <Layout>
      <>
        <h1>LIBROS PRESTADOS</h1>
        <table className="table-auto shadow-md mt-10 w-full w-lg">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Autor</th>
              <th className="w-1/5 py-2">Titulo</th>
              <th className="w-1/5 py-2">Fecha de Prestado</th>
              <th className="w-1/5 py-2">Fecha Devolución</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.getAllLoans?.map((libro) => (
              <>
                <tr key={libro.books.id}>
                  <td className="border px-4 py-2">
                    {libro.books.author.fullName}
                  </td>
                  <td className="border px-4 py-2">{libro.books.title}</td>
                  {libro.books.bookLoan.map((loan) => (
                    <td key={loan.id} className="border px-4 py-2">
                      {loan.createdAt}
                    </td>
                  ))}
                  {/* <td className="border px-4 py-2">
                    {libro.books.bookLoan.map((loan) =>
                      dayjs(loan.createdAt).format("MM/DD/YYYY")
                    )}
                  </td> */}
                  <td className="border px-4 py-2">
                    {libro.books.bookLoan.map((loan) => loan.returned_date)}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </>
    </Layout>
  );
};

export default LibrosPrestados;
