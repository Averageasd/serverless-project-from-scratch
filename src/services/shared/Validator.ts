import { SpaceEntry } from "../models/Model";

export class MissingFieldError extends Error {
    constructor(missingField: string){
        super(`Value for ${missingField} expected!`);
    }
}
export function validateAsSpaceEntry(arg:any): void {
    if ((arg as SpaceEntry).id == undefined){
        throw new MissingFieldError('id');
    }
    validateSpaceNameField(arg);
    validateSpaceLocationField(arg);
    
}

export function validateSpaceNameField(arg: any): void {
     if ((arg as SpaceEntry).name == undefined){
        throw new MissingFieldError('name');
    }
}

export function validateSpaceLocationField(arg: any): void {
     if ((arg as SpaceEntry).location == undefined){
        throw new MissingFieldError('location');
    }
}
