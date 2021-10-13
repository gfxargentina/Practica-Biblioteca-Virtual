import { hash } from "bcryptjs";
import { IsEmail, Length } from "class-validator";
import { Resolver, Mutation, InputType, Field, Arg } from "type-graphql";
import { getRepository, Repository } from "typeorm";
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

      const userExists = await this.userRepository.findOne({
        where: { email },
      });
      if (userExists) {
        const error = new Error();
        error.message = "El email ya esta en uso";
        throw error;
      }

      const hashedPassword = await hash(password, 10);

      const newUser = await this.userRepository.insert({
        fullName,
        email,
        password: hashedPassword,
      });

      return this.userRepository.findOne(newUser.identifiers[0].id);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
