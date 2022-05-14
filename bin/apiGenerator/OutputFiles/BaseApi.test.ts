import { BaseApiJS, BaseApiTS } from "./BaseApi";
import { BaseApiMock } from "../../mocks/BaseApiMocks";
import { removeWhitespace } from "../../helpers/removeWhitespace";

describe("BaseApiJS", () => {
  it("javascript base api with prefix path generated properly", () => {
    const baseApi = BaseApiJS("test");
    expect(removeWhitespace(baseApi)).toEqual(BaseApiMock.withPathJS);
  });
  it("javascript base api without prefix path generated properly", () => {
    const baseApi = BaseApiJS();
    expect(removeWhitespace(baseApi)).toEqual(BaseApiMock.withoutPathJS);
  });
});

describe("BaseApiTS", () => {
  it("typescript base api with prefix path generated properly", () => {
    const baseApi = BaseApiTS("test");
    expect(removeWhitespace(baseApi)).toEqual(BaseApiMock.withPathTS);
  });
  it("typescript base api without prefix path generated properly", () => {
    const baseApi = BaseApiTS();
    expect(removeWhitespace(baseApi)).toEqual(BaseApiMock.withoutPathTS);
  });
});
