package com.ahmad.jobBoard.controller;

import com.ahmad.jobBoard.model.Employer;
import com.ahmad.jobBoard.service.EmployerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employers")
public class EmployerController {

    private final EmployerService employerService;

    public EmployerController(EmployerService employerService) {
        this.employerService = employerService;
    }

    @GetMapping
    public ResponseEntity<List<Employer>> getAllEmployers() {
        return new ResponseEntity<>(employerService.allEmployers(), HttpStatus.OK);
    }

    @GetMapping("/{email}")
    public ResponseEntity<Employer> getEmployerByEmail(@PathVariable  String email) {
        return employerService.findEmployerByEmail(email)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Employer> createEmployer(@Valid @RequestBody Employer employer, Errors errors) {
        if (errors.hasErrors()) {
            return ResponseEntity.badRequest().build();
        }
        return new ResponseEntity<>(employerService.createEmployer(employer), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Employer> updateEmployer(@PathVariable Long id, @RequestBody Employer updatedFields) {

        return new ResponseEntity<>(employerService.updateEmployer(id, updatedFields), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmployer(@PathVariable Long id) {
        employerService.deleteEmployer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
