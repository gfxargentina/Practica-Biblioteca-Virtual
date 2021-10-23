import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Author } from "./author.entity";

@ObjectType()
@Entity() //para que la clase sea interpretada por typeorm
export class Book {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field(() => Author)
  //onDelete, cuando borre un author borra todos sus libros tambien
  @ManyToOne(() => Author, (author) => author.books, { onDelete: "CASCADE" })
  author!: Author;

  @Field()
  @Column()
  isOnLoan!: boolean;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string;
}
