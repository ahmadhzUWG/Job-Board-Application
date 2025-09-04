package com.ahmad.jobBoard.service;

import com.ahmad.jobBoard.model.JobApplication;
import com.ahmad.jobBoard.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;

    public JobApplicationService(JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    public List<JobApplication> allJobApplications() {
        return jobApplicationRepository.findAll();
    }

    public Optional<JobApplication> findJobApplication(Long id) {
        return jobApplicationRepository.findById(id);
    }

    public JobApplication createJobApplication(JobApplication jobApplication) { return jobApplicationRepository.save(jobApplication); }

    public void deleteJobApplication(Long id) { jobApplicationRepository.deleteById(id); }
}
