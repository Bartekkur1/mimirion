import Joi from 'joi';

export enum ConfigStateAction {
    PUBLISH = 'publish',
    UNPUBLISH = 'unpublish'
};

export interface IdRequest {
    id: string;
}

export const IdRequestValidator = Joi.object({
    id: Joi.string().uuid().required()
});

export interface ConfigPatch extends IdRequest {
    action: ConfigStateAction;
    version: number;
}

export const VersionValidator = Joi.object({
    version: Joi.number().required()
});

export interface DeleteConfig extends IdRequest {
    version: number;
};

export const DeleteConfigValidator = Joi.object().concat(VersionValidator).concat(IdRequestValidator);

export const ConfigPatchValidator = Joi.object({
    action: Joi.string().valid("publish", "unpublish").required(),
})
    .concat(VersionValidator);


export interface PutStore {
    name: string;
};

export const NameValidator = Joi.object({
    name: Joi.string().min(3).required().trim(true)
});