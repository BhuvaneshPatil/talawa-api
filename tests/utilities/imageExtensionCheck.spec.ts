import { afterEach, describe, expect, it, vi } from "vitest";
import { imageExtensionCheck } from "../../src/utilities/imageExtensionCheck";
import * as deleteImage from "../../src/utilities/deleteImage";
import { requestContext } from "../../src/libraries";
import { INVALID_FILE_TYPE } from "../../src/constants";

const testFilename: string = "test.anyOtherExtension";

const testErrors = [
  {
    message: INVALID_FILE_TYPE.MESSAGE,
    code: INVALID_FILE_TYPE.CODE,
    param: INVALID_FILE_TYPE.PARAM,
  },
];

const testMessage: string = "invalid.fileType";

describe("utilities -> imageExtensionCheck", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws Validation Error and calls deleteImage", async () => {
    const mockedDeleteImage = vi
      .spyOn(deleteImage, "deleteImage")
      .mockImplementation((_filename: string) => {
        return Promise.resolve();
      });

    const mockedRequestTranslate = vi
      .spyOn(requestContext, "translate")
      .mockImplementation((message) => {
        return message;
      });

    try {
      await imageExtensionCheck(testFilename);
    } catch (error: any) {
      expect(error.message).toEqual(testMessage);
      expect(error.errors).toEqual(testErrors);
    }

    expect(mockedDeleteImage).toHaveBeenCalledOnce();
    expect(mockedRequestTranslate).toBeCalledTimes(2);
    expect(mockedRequestTranslate).toBeCalledWith("invalid.fileType");
  });
});
