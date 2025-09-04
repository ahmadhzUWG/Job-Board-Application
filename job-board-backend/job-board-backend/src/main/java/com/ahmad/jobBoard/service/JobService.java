package com.ahmad.jobBoard.service;

import com.ahmad.jobBoard.model.Job;
import com.ahmad.jobBoard.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> allJobs() {
        return jobRepository.findAll();
    }

    public Optional<Job> findJob(Long id) {
        return jobRepository.findById(id);
    }

    public Job createJob(Job job) { return jobRepository.save(job); }

    public void deleteJob(Long id) { jobRepository.deleteById(id); }
}
