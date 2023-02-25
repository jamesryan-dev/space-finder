import { S3 } from 'aws-sdk'

const s3Client = new S3()

async function handler(event: any, context: any) {
    console.log('Node Lambda fired!')
    console.log('updated lambda')

    const buckets = await s3Client.listBuckets().promise()
    console.log('got buckets event: ');
    console.log(event);
    return {
        statusCode: 200,
        body: 'here are your buckets:' + JSON.stringify(buckets.Buckets)
    }
};

export { handler };