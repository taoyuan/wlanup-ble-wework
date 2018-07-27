import {assert} from "chai";
import {hmacsha1, sign, sort} from "../src";

const key = 'a15aa20deaea81bb6ab83ea46f73ea97';

describe("utils", () => {
  it("sort", () => {
    const sorted = sort('123', 'abc', '456');
    const expected = '123456abc';
    assert.equal(expected, sorted);
  });

  it('hmacsha1', () => {
    const client_nonce = '10534983059029401961';
    const server_nonce = '4471383152946429127';
    const sorted = sort('wxwork', client_nonce, server_nonce, 'handshake');
    console.log(sorted);
    const signature = hmacsha1(key, sorted);
    const expected = 'ed9092256c9a427b926e37305ab2a6a2e741d1d8';
    assert.equal(signature, expected);
  })
});
