package com.ahmad.jobBoard.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;


import java.io.IOException;
import java.net.URL;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Client s3Client;
    private final String bucketName;

    public S3Service(
            @Value("${S3_ACCESS_KEY}") String accessKey,
            @Value("${S3_SECRET_KEY}") String secretKey,
            @Value("${aws.region}") String region,
            @Value("${aws.s3.bucket-name}") String bucketName
    ) {
        this.bucketName = bucketName;
        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    public String uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.getOriginalFilename() == null) {
            throw new IllegalArgumentException("File must have a name");
        }

        String originalFilename = file.getOriginalFilename();
        String lowerCaseFilename = originalFilename.toLowerCase();

        String folder;
        if (lowerCaseFilename.endsWith(".pdf") || lowerCaseFilename.endsWith(".doc") || lowerCaseFilename.endsWith(".docx")) {
            folder = "resumes";
        } else if (lowerCaseFilename.endsWith(".jpg") || lowerCaseFilename.endsWith(".jpeg") || lowerCaseFilename.endsWith(".png")) {
            folder = "profiles";
        } else {
            throw new IllegalArgumentException("Unsupported file type");
        }

        String key = folder + "/" + UUID.randomUUID() + "_" + originalFilename;

        System.out.println("DEBUG: Uploading to S3 bucket: " + bucketName);
        System.out.println("DEBUG: S3 key: " + key);
        System.out.println("DEBUG: Content type: " + file.getContentType());

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(file.getContentType())
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(file.getBytes())
            );

            String url =  "https://" + bucketName + ".s3.amazonaws.com/" + key;
            System.out.println("DEBUG: File successfully uploaded to S3: " + url);
            return url;
        } catch (S3Exception e) {
            System.out.println("DEBUG: S3 Exception: " + e.awsErrorDetails().errorMessage());
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }
}
