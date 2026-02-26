package com.ahmad.jobBoard.service;

import com.ahmad.jobBoard.model.Employer;
import com.ahmad.jobBoard.repository.EmployerRepository;
import jakarta.validation.Valid;
import org.springframework.stereotype.Service;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class EmployerService {

    private final EmployerRepository employerRepository;

    public EmployerService(EmployerRepository employerRepository) {
        this.employerRepository = employerRepository;
    }

    public List<Employer> allEmployers() {
        return employerRepository.findAll();
    }

    public Optional<Employer> findEmployer(Long id) {
        return employerRepository.findById(id);
    }

    public Optional<Employer> findEmployerByEmail(String email) { return employerRepository.findByEmail(email); }

    public Employer createEmployer(Employer employer) { return employerRepository.save(employer); }

    public Employer updateEmployer(Long id, Employer updatedFields) {
        Employer existing = employerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employer not found"));

        if (updatedFields.getDescription() != null && !updatedFields.getDescription().isBlank()) {
            existing.setDescription(updatedFields.getDescription());
        }

        if (updatedFields.getIndustry() != null) {
            existing.setIndustry(updatedFields.getIndustry());
        }

        if (updatedFields.getPassword() != null && !updatedFields.getPassword().isBlank()) {
            existing.setPassword(updatedFields.getPassword());
        }

        if (updatedFields.getName() != null && !updatedFields.getName().isBlank()) {
            existing.setName(updatedFields.getName());
        }

        if (updatedFields.getAddress() != null) {
            existing.setAddress(updatedFields.getAddress());
        }

        if  (updatedFields.getPhoneNumber() != null && !updatedFields.getPhoneNumber().isBlank()) {
            existing.setPhoneNumber(updatedFields.getPhoneNumber());
        }

        if (updatedFields.getProfileImageUrl() != null && !updatedFields.getProfileImageUrl().isBlank()) {
            existing.setProfileImageUrl(updatedFields.getProfileImageUrl());
        }

        return employerRepository.save(existing);
    }

    public void deleteEmployer(Long id) { employerRepository.deleteById(id); }
}
