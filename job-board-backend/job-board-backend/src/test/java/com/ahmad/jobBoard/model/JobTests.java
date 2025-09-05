package com.ahmad.jobBoard.model;

import com.ahmad.jobBoard.model.Job.JobBuilder;
import com.ahmad.jobBoard.model.enums.EmploymentType;
import com.ahmad.jobBoard.model.enums.Industry;
import com.ahmad.jobBoard.model.enums.Role;
import com.ahmad.jobBoard.model.enums.State;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;

import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JobTests {

    private static Validator validator;
    private static JobAddress jobAddress;
    private static Address address;
    private static Employer employer;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @BeforeAll
    static void setupJobAddress() {
        jobAddress = JobAddress.builder()
                .address1("address1")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();
    }

    @BeforeAll
    static void setupAddress() {
        address = Address.builder()
                .address1("address1")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();
    }

    @BeforeAll
    static void setupEmployer() {
        employer = Employer.builder()
                .description("Test description")
                .email("test123@gmail.com")
                .role(Role.EMPLOYER)
                .address(address)
                .phoneNumber("123-456-7890")
                .name("Test Company")
                .industry(Industry.TECHNOLOGY)
                .username("username123")
                .password("password123")
                .build();
    }

    private JobBuilder baseBuilder() {
        return Job.builder()
                .title("job title")
                .description("job description")
                .closingDate(LocalDateTime.now().plusMonths(1))
                .location(jobAddress)
                .remote(false)
                .salary(75000)
                .employmentType(EmploymentType.FULL_TIME)
                .employer(employer);
    }

    private void assertHasViolation(Job job, String property) {
        Set<ConstraintViolation<Job>> violations = validator.validate(job);
        assertFalse(violations.isEmpty(), "Expected validation error for " + property);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals(property)));
    }

    @Test
    void validJob_ShouldPassValidation() {
        Job job = baseBuilder().build();

        Set<ConstraintViolation<Job>> violations = validator.validate(job);

        assertTrue(violations.isEmpty(), "No expected validation error for " + job.getTitle());
    }

    @ParameterizedTest
    @NullAndEmptySource
    void invalidTitle_shouldFailValidation(String title) {
        Job job = baseBuilder().title(title).build();
        assertHasViolation(job, "title");
    }

    @ParameterizedTest
    @NullAndEmptySource
    void invalidDescription_shouldFailValidation(String description) {
        Job job = baseBuilder().description(description).build();
        assertHasViolation(job, "description");
    }

    @Test
    void invalidLocationAndRemoteFalse_shouldFailValidation() {
        Job job = baseBuilder().location(null).remote(false).build();

        Set<ConstraintViolation<Job>> violations = validator.validate(job);

        assertFalse(violations.isEmpty(), "Non-remote job without location should fail");
        assertTrue(violations.stream().anyMatch(v -> v.getMessage().equals("Address must be provided if job is not remote")));
    }

    @Test
    void invalidEmploymentType_shouldFailValidation() {
        Job job = baseBuilder().employmentType(null).build();
        assertHasViolation(job, "employmentType");
    }

    @Test
    void invalidClosingDate_shouldFailValidation() {
        Job job = baseBuilder().closingDate(null).build();
        assertHasViolation(job, "closingDate");
    }
}
