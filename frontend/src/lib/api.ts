export const testReq = () =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve("kekvs!")), 300;
  });

export const test2Req = () =>
  new Promise<string>((resolve) => {
    setTimeout(() => resolve("kekvs 2!")), 300;
  });
