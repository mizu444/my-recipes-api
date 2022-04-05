import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recipe {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column("simple-array")
    ingredients: string[];

    @Column()
    image?: string;

    @Column()
    directions: string;
}