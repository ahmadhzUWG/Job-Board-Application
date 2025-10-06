package com.ahmad.jobBoard.model;

import com.ahmad.jobBoard.model.JobSeeker.JobSeekerBuilder;
import com.ahmad.jobBoard.model.enums.Gender;
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
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JobSeekerTests {

    private static Validator validator;
    private static Address address;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @BeforeAll
    static void setupAddress() {
        address = Address.builder()
                .address1("123 Main St")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();
    }

    @Test
    void validJobSeeker_ShouldPassValidation() {
        JobSeeker seeker = JobSeeker.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .role(Role.JOBSEEKER)
                .address(address)
                .phoneNumber("123-456-7890")
                .password("password123")
                .age(25)
                .gender(Gender.MALE)
                .description("Looking for a dev role")
                .resumeUrl("http://resume.com/johndoe.pdf")
                .build();

        Set<ConstraintViolation<JobSeeker>> violations = validator.validate(seeker);
        assertTrue(violations.isEmpty(), "Expected no validation errors");
    }

    @ParameterizedTest
    @NullAndEmptySource
    void invalidName_shouldFailValidation(String name) {
        JobSeeker seeker = (JobSeeker) baseBuilder().name(name).build();
        assertHasViolation(seeker, "name");
    }

    @Test
    void invalidEmail_shouldFailValidation() {
        JobSeeker seeker = (JobSeeker) baseBuilder().email("notanemail").build();
        assertHasViolation(seeker, "email");
    }

    @ParameterizedTest
    @NullAndEmptySource
    void invalidPhoneNumber_shouldFailValidation(String phone) {
        JobSeeker seeker = (JobSeeker) baseBuilder().phoneNumber(phone).build();
        assertHasViolation(seeker, "phoneNumber");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = "123")
    void invalidPassword_shouldFailValidation(String password) {
        JobSeeker seeker = (JobSeeker) baseBuilder().password(password).build();
        assertHasViolation(seeker, "password");
    }

    @Test
    void invalidAddress_shouldFailValidation() {
        JobSeeker seeker = (JobSeeker) baseBuilder().address(null).build();
        assertHasViolation(seeker, "address");
    }

    @Test
    void invalidRole_shouldFailValidation() {
        JobSeeker seeker = (JobSeeker) baseBuilder().role(null).build();
        assertHasViolation(seeker, "role");
    }

    @Test
    void invalidAge_shouldFailValidation() {
        JobSeeker seeker = baseBuilder().age(16).build();
        assertHasViolation(seeker, "age");
    }

    @Test
    void invalidGender_shouldFailValidation() {
        JobSeeker seeker = baseBuilder().gender(null).build();
        assertHasViolation(seeker, "gender");
    }

    // --- Helper methods ---

    private JobSeekerBuilder baseBuilder() {
        return JobSeeker.builder()
                .name("John Doe")
                .email("john.doe@example.com")
                .role(Role.JOBSEEKER)
                .address(address)
                .phoneNumber("123-456-7890")
                .password("password123")
                .age(25)
                .gender(Gender.MALE);
    }

    private void assertHasViolation(JobSeeker seeker, String property) {
        Set<ConstraintViolation<JobSeeker>> violations = validator.validate(seeker);
        assertFalse(violations.isEmpty(), "Expected validation error for " + property);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals(property)));
    }
}
