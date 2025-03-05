import {  Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/db/baseEntity.entity.js';

@Entity()
export class Faq extends BaseEntity {

    @Property()
    pregunta!: string;

    @Property()
    respuesta!: string;
}