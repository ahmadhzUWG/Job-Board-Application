package com.ahmad.jobBoard.service;

import com.ahmad.jobBoard.model.Employer;
import com.ahmad.jobBoard.repository.EmployerRepository;
import org.springframework.stereotype.Service;

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

    public void deleteEmployer(Long id) { employerRepository.deleteById(id); }
}
