import { HttpMethod } from 'aws-cdk-lib/aws-events';
import {handler} from '../src/services/spaces/handler';

handler({
    httpMethod: 'POST',
    body:JSON.stringify({
        location: 'Kf'
    })
} as any, {} as any);