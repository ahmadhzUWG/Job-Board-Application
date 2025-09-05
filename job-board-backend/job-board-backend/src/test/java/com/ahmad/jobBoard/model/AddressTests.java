package com.ahmad.jobBoard.model;

import com.ahmad.jobBoard.model.enums.State;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class AddressTests {

    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void validAddress_ShouldPassValidation() {
        Address address = Address.builder()
                .address1("123 Main St")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();

        Set<ConstraintViolation<Address>> violations = validator.validate(address);

        assertTrue(violations.isEmpty(), "Expected no validation errors");
    }

    @Test
    void missingAddress1_ShouldFailValidation() {
        Address address = Address.builder()
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();

        Set<ConstraintViolation<Address>> violations = validator.validate(address);

        assertFalse(violations.isEmpty(), "Expected validation error for address1");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("address1")));
    }

    @Test
    void missingState_ShouldFailValidation() {
        Address address = Address.builder()
                .address1("123 Main St")
                .city("Atlanta")
                .zip("30339")
                .build();

        Set<ConstraintViolation<Address>> violations = validator.validate(address);

        assertFalse(violations.isEmpty(), "Expected validation error for state");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("state")));
    }

    @Test
    void invalidZip_ShouldFailValidation() {
        Address address = Address.builder()
                .address1("123 Main St")
                .city("Atlanta")
                .state(State.GA)
                .zip("123") // too short
                .build();

        Set<ConstraintViolation<Address>> violations = validator.validate(address);

        assertFalse(violations.isEmpty(), "Expected validation error for zip length");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("zip")));
    }
}
