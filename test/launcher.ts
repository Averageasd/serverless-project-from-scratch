import { HttpMethod } from 'aws-cdk-lib/aws-events';
import {handler} from '../src/services/spaces/handler';
import { updateSingleSpaceHandler } from '../src/services/spaces/updateSpaceHandler';
import { deleteSpaceHandler } from '../src/services/spaces/deleteSpaceHandler';

// handler({
//     httpMethod: 'POST',
//     body:JSON.stringify({
//         location: 'Kf',
//         name: 'name of location'
//     })
// } as any, {} as any);

// updateSingleSpaceHandler({
//     pathParameters: {
//         'id' : '59c58634-05fa-4a5d-94a5-5bb5938b9622'
//     },
//     body:JSON.stringify({
//         location: 'new loc',
//     })
// } as any, {} as any);

// deleteSpaceHandler({
//     pathParameters: {
//         'id' : '59c58634-05fa-4a5d-94a5-5bb5938b9622'
//     },
//     body:JSON.stringify({
//         location: 'new loc'
//     })
// } as any, {} as any);