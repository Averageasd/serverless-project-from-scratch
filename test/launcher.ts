import { HttpMethod } from 'aws-cdk-lib/aws-events';
import {handler} from '../src/services/spaces/handler';

handler({
    httpMethod: 'GET'
} as any, {} as any);