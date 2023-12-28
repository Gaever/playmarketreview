export async function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      if (typeof reader.result !== "string") {
        reject("failed to base64 file");
      } else {
        resolve(reader.result);
      }
    };
    reader.onerror = reject;
  });
}
