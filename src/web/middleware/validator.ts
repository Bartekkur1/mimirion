import { NextFunction, Request, Response } from "express";
import Joi from 'joi';

export class ValidationError extends Error {

    public statusCode: number = 400;

    constructor(message) {
        super(message);
    }
}

export const validator = <T>(validator: Joi.ObjectSchema<T>, data: any) => {
    const result = validator.validate(data);
    if (result.error !== undefined) {
        const { details } = result.error;
        const { message } = details[0];
        throw new ValidationError(message);
    }

    return data as T;
};