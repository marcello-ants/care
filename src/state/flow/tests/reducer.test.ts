import { reducer, initialState } from '../reducer';

describe('flow reducer', () => {
  it('should check case setFlowName is setting flow name', () => {
    const flowName = 'SOME_FLOW_NAME';
    const currentReducer = reducer(initialState, {
      type: 'setFlowName',
      flowName,
    });

    expect(currentReducer.flowName).toBe(flowName);
  });

  it('should check case setMemberId is setting memberId', () => {
    const memberId = '12345';
    const currentReducer = reducer(initialState, {
      type: 'setMemberId',
      memberId,
    });

    expect(currentReducer.memberId).toBe(memberId);
  });

  it('should check case setFbAccessToken is setting access token', () => {
    const accessToken = '12345';
    const currentReducer = reducer(initialState, {
      type: 'setFbAccessToken',
      accessToken,
    });

    expect(currentReducer.facebookData.accessToken).toBe(accessToken);
  });
});
