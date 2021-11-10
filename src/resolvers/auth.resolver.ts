import { hash, compareSync } from "bcryptjs";
import { IsEmail, Length } from "class-validator";
import { sign } from "jsonwebtoken";
import {
  Resolver,
  Mutation,
  InputType,
  Field,
  Arg,
  ObjectType,
} from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { environment } from "../config/environment";
import { User } from "../entity/user.entity";

@InputType()
class UserInput {
  @Field()
  @Length(3, 64)
  fullName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(8, 254)
  password!: string;
}

//Login input
@InputType()
class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

//clase ObjectType() para la respuesta del login
@ObjectType()
class LoginResponse {
  @Field()
  userId!: number;

  @Field()
  fullName!: string;

  @Field()
  jwt!: string;
}

@Resolver()
export class AuthResolver {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = getRepository(User);
  }

  //crear el usuario
  @Mutation(() => User)
  async register(
    @Arg("input", () => UserInput) input: UserInput
  ): Promise<User | undefined> {
    try {
      const { fullName, email, password } = input;

      //verifica si el usuario existe
      const userExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userExists) {
        const error = new Error();
        error.message = "El email ya esta en uso";
        throw error;
      }
      //encrypta el password con bcryptjs
      const hashedPassword = await hash(password, 10);

      //guarda el nuevo usuario
      const newUser = await this.userRepository.insert({
        fullName,
        email,
        password: hashedPassword,
      });
      //devuelve el nuevo usuario creado
      return this.userRepository.findOne(newUser.identifiers[0].id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  //Login
  @Mutation(() => LoginResponse)
  async login(@Arg("input", () => LoginInput) input: LoginInput) {
    try {
      const { email, password } = input;

      //busca y verifica el usuario por el email
      //en el error es una buena practica solo poner credenciales invalidas y no poner el error exacto ej. email incorrecto
      const userFound = await this.userRepository.findOne({ where: { email } });
      if (!userFound) {
        const error = new Error();
        error.message = "Credenciales invalidas, verifique porfavor";
        throw error;
      }
      //verifica el password encryptado
      const isValidPassword: boolean = compareSync(
        password,
        userFound.password
      );
      if (!isValidPassword) {
        const error = new Error();
        error.message = "Credenciales invalidas, verifique porfavor";
        throw error;
      }
      //firmar un token con el id del usuario
      const jwt: string = sign({ id: userFound.id }, environment.JWT_SECRET);
      return {
        userId: userFound.id,
        jwt: jwt,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
