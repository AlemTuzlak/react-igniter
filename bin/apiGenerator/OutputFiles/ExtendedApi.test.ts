import { ExtendedApiJS, ExtendedApiTS } from "./ExtendedApi";
import { ExtendedApiMocks } from "../../mocks/ExtendedApiMocks";
import { removeWhitespace } from "../../helpers/removeWhitespace";
describe("ExtendedApiJS", () => {
  it("javascript extended api with prefix path generated properly", () => {
    const extendedApi = ExtendedApiJS("Shop", true, "test");
    expect(removeWhitespace(extendedApi)).toEqual(ExtendedApiMocks.withPathJS);
  });
  it("javascript extended api without prefix path generated properly", () => {
    const extendedApi = ExtendedApiJS("Shop", true, "");
    expect(removeWhitespace(extendedApi)).toEqual(
      ExtendedApiMocks.withoutPathJS
    );
  });
  it("javascript extended api with Crud generated properly", () => {
    const extendedApi = ExtendedApiJS("Shop", true, "test");
    expect(removeWhitespace(extendedApi)).toEqual(ExtendedApiMocks.withPathJS);
  });
  it("javascript extended api without Crud generated properly", () => {
    const extendedApi = ExtendedApiJS("Shop", false, "test");
    expect(removeWhitespace(extendedApi)).toEqual(
      ExtendedApiMocks.withoutCrudJS
    );
  });
});

describe("ExtendedApiTS", () => {
  it("typescript extended api with prefix path generated properly", () => {
    const extendedApi = ExtendedApiTS("Shop", true, "test");
    expect(removeWhitespace(extendedApi)).toEqual(ExtendedApiMocks.withPathTS);
  });
  it("typescript extended api without prefix path generated properly", () => {
    const extendedApi = ExtendedApiTS("Shop", true, "");
    expect(removeWhitespace(extendedApi)).toEqual(
      ExtendedApiMocks.withoutPathTS
    );
  });
  it("typescript extended api with Crud generated properly", () => {
    const extendedApi = ExtendedApiTS("Shop", true, "test");
    expect(removeWhitespace(extendedApi)).toEqual(ExtendedApiMocks.withPathTS);
  });
  it("typescript extended api without Crud generated properly", () => {
    const extendedApi = ExtendedApiTS("Shop", false, "test");
    expect(removeWhitespace(extendedApi)).toEqual(
      ExtendedApiMocks.withoutCrudTS
    );
  });
});
