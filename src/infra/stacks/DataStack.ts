import { Stack, StackProps} from 'aws-cdk-lib';
import { AttributeType, BillingMode, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Bucket, HttpMethods, ObjectOwnership } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

export class DataStack extends Stack {

    public readonly spaceTable!: ITable;
    public readonly photosBucket!: Bucket;

    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);
        this.spaceTable = new Table(this, 'SpacesTable',{
            partitionKey:{
                name: 'id',
                type: AttributeType.STRING
            },
            billingMode: BillingMode.PAY_PER_REQUEST, // On-Demand capacity mode

        });

        this.photosBucket = new Bucket(this, 'SpacePhotoBucket', {
            cors: [{
                allowedMethods: [
                    HttpMethods.HEAD,
                    HttpMethods.GET,
                    HttpMethods.PUT
                ],
                allowedOrigins: ['*'],
                allowedHeaders: ['*']
            }],
            // accessControl: BucketAccessControl.PUBLIC_READ, // currently not working,
            objectOwnership: ObjectOwnership.OBJECT_WRITER,
            blockPublicAccess: {
                blockPublicAcls: false,
                blockPublicPolicy: false,
                ignorePublicAcls: false,
                restrictPublicBuckets: false
            }
        });
    }
}