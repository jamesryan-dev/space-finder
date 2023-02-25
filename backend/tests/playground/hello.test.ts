// import { handler } from '../../services/node-lambda/hello';
import { handler  } from '../../services/SpacesTable/Create';

// handler({}, {});

const event = {
    body: {
        location: 'Paris'
    }
}

handler(event as any, {} as any);
