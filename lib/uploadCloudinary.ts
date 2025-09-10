export const uploadFileToCloudinary = async (fileToUpload: File): Promise<string> => {
    const cloudName = "deazqe0j0";
    const uploadPreset = "ModNect";

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    
    formData.append("file",fileToUpload);
    formData.append("upload_preset",uploadPreset);

    const response = await fetch(url,{method:"POST",body:formData});


    if(!response.ok){
        const errData = await response.json();
        throw new Error(errData.error?.message || "Failed to upload file to Cloudinary.");
    }

    const data = await response.json();
    return data.secure_url;
};
