import { NextResponse} from 'next/server';

export const sendErrorResponse = (message, status) =>{
    return NextResponse.json({error:message},{status});
}