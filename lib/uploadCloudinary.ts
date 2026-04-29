export const uploadFileToCloudinary = async (fileToUpload: File) => {
  const formData = new FormData();
  formData.append("file", fileToUpload);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();

  return {
    url: data.url,
    type: data.type,
    name: data.name
  };
};






// export const uploadFileToCloudinary = async (fileToUpload: File): Promise<string> => {
//   const formData = new FormData();
//   formData.append("file", fileToUpload);

//   const response = await fetch("/api/upload", {
//     method: "POST",
//     body: formData,
//   });

//   if (!response.ok) {
//     throw new Error("Upload failed");
//   }

//   const data = await response.json();

//   return data.secure_url; 
// };