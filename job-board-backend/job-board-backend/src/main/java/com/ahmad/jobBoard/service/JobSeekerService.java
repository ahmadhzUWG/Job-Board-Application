package com.ahmad.jobBoard.service;

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
}
