import * as Minio from "minio";

// Initialize MinIO client
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "",  // MinIO endpoint
  useSSL: true,
  accessKey: process.env.MINIO_ACCESS_KEY,  // Replace with your MinIO access key
  secretKey: process.env.MINIO_SECRET_KEY,  // Replace with your MinIO secret key
});

export default minioClient;