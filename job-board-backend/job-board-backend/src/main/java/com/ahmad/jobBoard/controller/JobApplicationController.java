package com.ahmad.jobBoard.controller;

import com.ahmad.jobBoard.model.JobApplication;
import com.ahmad.jobBoard.service.JobApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @GetMapping
    public ResponseEntity<List<JobApplication>> getAllJobApplications() {
        return new ResponseEntity<>(jobApplicationService.allJobApplications(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobApplication> getJobApplication(@PathVariable Long id) {
        return jobApplicationService.findJobApplication(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<JobApplication> createJobApplication(@Valid @RequestBody JobApplication jobApplication, Errors errors) {
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }

        return new ResponseEntity<>(jobApplicationService.createJobApplication(jobApplication), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJobApplication(@PathVariable Long id) {
        jobApplicationService.deleteJobApplication(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
