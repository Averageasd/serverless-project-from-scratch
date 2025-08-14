import { HttpMethod } from 'aws-cdk-lib/aws-events';
import {handler} from '../src/services/spaces/handler';
import { updateSingleSpaceHandler } from '../src/services/spaces/updateSpaceHandler';

// handler({
//     httpMethod: 'PUT',
//     body:JSON.stringify({
//         location: 'Kf'
//     })
// } as any, {} as any);

updateSingleSpaceHandler({
    pathParameters: {
        'id' : '59c58634-05fa-4a5d-94a5-5bb5938b9622'
    },
    body:JSON.stringify({
        location: 'new loc'
    })
} as any, {} as any);