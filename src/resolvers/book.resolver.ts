import { Query, Resolver } from "type-graphql";

//crea una consulta
@Resolver()
export class BookResolver {
  @Query(() => String)
  getAll() {
    return "Todos mis Libros";
  }
}
