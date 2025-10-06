package com.ahmad.jobBoard.model;

import com.ahmad.jobBoard.model.enums.*;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JobApplicationTests {

    private static Validator validator;
    private static Job job;
    private static JobSeeker jobSeeker;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @BeforeAll
    static void setupJob() {
        var jobAddress = JobAddress.builder()
                .address1("address1")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();

        var address = Address.builder()
                .address1("address1")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();

        var employer = Employer.builder()
                .description("Test description")
                .email("test123@gmail.com")
                .role(Role.EMPLOYER)
                .address(address)
                .phoneNumber("123-456-7890")
                .name("Test Company")
                .industry(Industry.TECHNOLOGY)
                .password("password123")
                .build();

        job = Job.builder()
                .title("job title")
                .description("job description")
                .closingDate(LocalDateTime.now().plusMonths(1))
                .location(jobAddress)
                .remote(false)
                .salary(75000)
                .employmentType(EmploymentType.FULL_TIME)
                .employer(employer)
                .build();
    }

    @BeforeAll
    static void setupJobSeeker() {
        var address = Address.builder()
                .address1("address11")
                .city("Duluth")
                .state(State.GA)
                .zip("30211")
                .build();

        jobSeeker = JobSeeker.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .role(Role.JOBSEEKER)
                .address(address)
                .phoneNumber("123-456-7890")
                .password("password123")
                .age(25)
                .gender(Gender.MALE)
                .build();
    }

    private JobApplication.JobApplicationBuilder baseBuilder() {
        return JobApplication.builder()
                .job(job)
                .applicant(jobSeeker)
                .status(ApplicationStatus.APPLIED)
                .appliedDate(LocalDateTime.now());
    }

    private void assertHasViolation(JobApplication jobApplication, String property) {
        Set<ConstraintViolation<JobApplication>> violations = validator.validate(jobApplication);
        assertFalse(violations.isEmpty(), "Expected validation error for " + property);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals(property)));
    }

    @Test
    void validJobApplication_ShouldPassValidation() {
        JobApplication jobApp = baseBuilder().build();

        Set<ConstraintViolation<JobApplication>> violations = validator.validate(jobApp);

        assertTrue(violations.isEmpty(), "No expected validation error for job application");
    }

    @Test
    void invalidJob_ShouldFailValidation() {
        JobApplication jobApp = baseBuilder().job(null).build();
        assertHasViolation(jobApp, "job");
    }

    @Test
    void invalidApplicant_ShouldFailValidation() {
        JobApplication jobApp = baseBuilder().applicant(null).build();
        assertHasViolation(jobApp, "applicant");
    }

    @Test
    void invalidStatus_ShouldFailValidation() {
        JobApplication jobApp = baseBuilder().status(null).build();
        assertHasViolation(jobApp, "status");
    }
}
