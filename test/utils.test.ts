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
    const client_nonce = '2182195003008728305';
    const server_nonce = '16097309590180193298';
    const sorted = sort('wework', client_nonce, server_nonce, 'handshake');
    console.log(sorted);
    const signature = hmacsha1(key, sorted);
    const expected = '25bd85b40c1ced971e24f5c5ee95efeedec25d04';
    assert.equal(signature, expected);
  })
});
