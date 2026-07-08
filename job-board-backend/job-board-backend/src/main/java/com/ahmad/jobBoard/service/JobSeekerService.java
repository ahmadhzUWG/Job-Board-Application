package com.ahmad.jobBoard.service;

import com.ahmad.jobBoard.model.Address;
import com.ahmad.jobBoard.model.JobSeeker;
import com.ahmad.jobBoard.repository.JobSeekerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobSeekerService {

    private final JobSeekerRepository jobSeekerRepository;

    public JobSeekerService(JobSeekerRepository jobSeekerRepository) {
        this.jobSeekerRepository = jobSeekerRepository;
    }

    public List<JobSeeker> allJobSeekers() {
        return jobSeekerRepository.findAll();
    }

    public Optional<JobSeeker> findJobSeeker(Long id) {
        return jobSeekerRepository.findById(id);
    }

    public Optional<JobSeeker> findJobSeekerByEmail(String email) { return  jobSeekerRepository.findByEmail(email); }

    public JobSeeker createJobSeeker(JobSeeker jobSeeker) { return jobSeekerRepository.save(jobSeeker); }

    public void deleteJobSeeker(Long id) { jobSeekerRepository.deleteById(id); }

    public JobSeeker updateJobSeeker(Long id, JobSeeker jobSeeker) {
        JobSeeker existing = jobSeekerRepository.findById(id).orElseThrow(() -> new RuntimeException("JobSeeker not found"));

        if (jobSeeker.getDescription() != null && !jobSeeker.getDescription().isBlank()) {
            existing.setDescription(jobSeeker.getDescription());
        }

        if (jobSeeker.getPassword() != null && !jobSeeker.getPassword().isBlank()) {
            existing.setPassword(jobSeeker.getPassword());
        }

        if (jobSeeker.getName() != null && !jobSeeker.getName().isBlank()) {
            existing.setName(jobSeeker.getName());
        }

        if (jobSeeker.getAddress() != null) {
            Address updatedAddress = jobSeeker.getAddress();
            Address existingAddress = existing.getAddress();

            if (updatedAddress.getAddress1() != null)
                existingAddress.setAddress1(updatedAddress.getAddress1());

            if (updatedAddress.getAddress2() != null)
                existingAddress.setAddress2(updatedAddress.getAddress2());

            if (updatedAddress.getCity() != null)
                existingAddress.setCity(updatedAddress.getCity());

            if (updatedAddress.getState() != null)
                existingAddress.setState(updatedAddress.getState());

            if (updatedAddress.getZip() != null)
                existingAddress.setZip(updatedAddress.getZip());
        }

        if  (jobSeeker.getPhoneNumber() != null && !jobSeeker.getPhoneNumber().isBlank()) {
            existing.setPhoneNumber(jobSeeker.getPhoneNumber());
        }

        if (jobSeeker.getProfileImageUrl() != null && !jobSeeker.getProfileImageUrl().isBlank()) {
            existing.setProfileImageUrl(jobSeeker.getProfileImageUrl());
        }

        if (jobSeeker.getResumeUrl() != null && !jobSeeker.getResumeUrl().isBlank()) {
            existing.setResumeUrl(jobSeeker.getResumeUrl());
        }

        return jobSeekerRepository.save(existing);
    }
}
