import { registerEnumType } from "type-graphql";

enum RequestStatus {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    HANDLED = 'HANDLED',
}

registerEnumType(RequestStatus, {
    name: 'RequestStatus',
    description: 'Status of the request'
})


export default RequestStatus;
