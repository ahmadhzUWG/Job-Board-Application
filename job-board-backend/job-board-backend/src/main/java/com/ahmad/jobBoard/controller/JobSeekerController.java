package com.ahmad.jobBoard.controller;

import com.ahmad.jobBoard.model.JobSeeker;
import com.ahmad.jobBoard.service.JobSeekerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/job-seekers")
public class JobSeekerController {

    private final JobSeekerService jobSeekerService;

    public JobSeekerController(JobSeekerService jobSeekerService) {
        this.jobSeekerService = jobSeekerService;
    }

    @GetMapping
    public ResponseEntity<List<JobSeeker>> getAllJobSeekers() {
        return new ResponseEntity<>(jobSeekerService.allJobSeekers(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<JobSeeker>> getJobSeeker(@PathVariable Long id) {
        return new ResponseEntity<>(jobSeekerService.findJobSeeker(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<JobSeeker> createJobSeeker(@RequestBody JobSeeker jobSeeker) {
        return new ResponseEntity<>(jobSeekerService.createJobSeeker(jobSeeker), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobSeeker(@PathVariable Long id) {
        jobSeekerService.deleteJobSeeker(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
