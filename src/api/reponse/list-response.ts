import { GenericList } from '../../store/interfaces/list.interface';
import * as express from 'express';

export class ListResponse<T> {
    constructor(private res: express.Response) {}
    useList(listDescriptor: GenericList<T>, itemDescription: string) {
        if (!listDescriptor.list.length) {
            this.res.status(404);
            this.res.send({err: 'no_${itemDescription}_found'});
        }

        this.res.status(200);
        this.res.send(listDescriptor);
    }
}