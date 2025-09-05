package com.ahmad.jobBoard.model;

import com.ahmad.jobBoard.model.enums.State;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class JobAddressTests {
    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void validAddress_ShouldPassValidation() {
        JobAddress jobAddress = JobAddress.builder()
                .address1("123 Main St")
                .city("Atlanta")
                .state(State.GA)
                .zip("30310")
                .build();

        Set<ConstraintViolation<JobAddress>> violations = validator.validate(jobAddress);

        assertTrue(violations.isEmpty(), "Expected no validation errors");
    }

    @Test
    void invalidZip_ShouldFailValidation() {
        JobAddress jobAddress = JobAddress.builder()
                .address1("123 Main St")
                .city("Atlanta")
                .state(State.GA)
                .zip("123")
                .build();

        Set<ConstraintViolation<JobAddress>> violations = validator.validate(jobAddress);

        assertFalse(violations.isEmpty(), "Expected validation error");
        assertTrue(violations.stream().anyMatch(violation -> violation.getPropertyPath().toString().equals("zip")));
    }
}
