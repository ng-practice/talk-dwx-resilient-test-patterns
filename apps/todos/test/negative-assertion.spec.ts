import { instance, mock, verify } from 'ts-mockito';

class Service {
  doWork(_param1: string, _param2: string, _importantFlag = false) {}
}

class Consumer {
  constructor(private service: Service) {}
  do() {
    this.service.doWork('1', '2', true);
  }
}

describe('Negative assertion test', () => {
  it('passes because assertion is not specific enough', () => {
    const service = mock(Service);

    const consumer = new Consumer(instance(service));
    consumer.do();

    verify(service.doWork('1', '2')).never();
  });
});
