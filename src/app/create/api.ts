import AXIOS_API from "@/utils/axios-api";

export async function postImages(cloudName: string, formData: FormData) {
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  const imageUrl = data["secure_url"];

  return imageUrl;
}

export async function createNewListing(data:any, imageUrls: string) {
  const { data: newListing } = await AXIOS_API.post("/listing", {
    ...data,
    imageUrls,
  });

  console.log(newListing);
  return newListing;
}
