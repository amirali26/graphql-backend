import { registerEnumType } from "type-graphql";

enum RequestTopics {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED',
    HANDLED = 'HANDLED',
}

registerEnumType(RequestTopics, {
    name: 'RequestTopics',
    description: 'Topic of request'
})


export default RequestTopics;
