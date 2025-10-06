package com.ahmad.jobBoard.model;

import com.ahmad.jobBoard.model.Employer.EmployerBuilder;
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
import org.junit.jupiter.params.provider.ValueSource;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class EmployerTests {

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
                .address1("address1")
                .city("Atlanta")
                .state(State.GA)
                .zip("30339")
                .build();
    }

    @Test
    void validEmployer_ShouldPassValidation() {
        Employer employer = baseBuilder().build();
        Set<ConstraintViolation<Employer>> violations = validator.validate(employer);

        assertTrue(violations.isEmpty(), "Expected no validation errors");
    }

    @ParameterizedTest
    @NullAndEmptySource
    void invalidName_shouldFailValidation(String name) {
        Employer employer = (Employer) baseBuilder().name(name).build();
        assertHasViolation(employer, "name");
    }

    @Test
    void invalidEmail_shouldFailValidation() {
        Employer employer = (Employer) baseBuilder().email("notanemail").build();
        assertHasViolation(employer, "email");
    }

    @ParameterizedTest
    @NullAndEmptySource
    void invalidPhoneNumber_shouldFailValidation(String phone) {
        Employer employer = (Employer) baseBuilder().phoneNumber(phone).build();
        assertHasViolation(employer, "phoneNumber");
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = "123")
    void invalidPassword_shouldFailValidation(String password) {
        Employer employer = (Employer) baseBuilder().password(password).build();
        assertHasViolation(employer, "password");
    }

    @Test
    void invalidAddress_shouldFailValidation() {
        Employer employer = (Employer) baseBuilder().address(null).build();
        assertHasViolation(employer, "address");
    }

    @Test
    void invalidRole_shouldFailValidation() {
        Employer employer = (Employer) baseBuilder().role(null).build();
        assertHasViolation(employer, "role");
    }

    @Test
    void invalidDescription_shouldFailValidation() {
        Employer employer = (Employer) baseBuilder().description(null).build();
        assertHasViolation(employer, "description");
    }

    @Test
    void invalidIndustry_shouldFailValidation() {
        Employer employer = (Employer) baseBuilder().industry(null).build();
        assertHasViolation(employer, "industry");
    }

    private EmployerBuilder baseBuilder() {
        return Employer.builder()
                .description("Test description")
                .email("test123@gmail.com")
                .role(Role.EMPLOYER)
                .address(address)
                .phoneNumber("123-456-7890")
                .name("Test Company")
                .industry(Industry.TECHNOLOGY)
                .password("password123");
    }

    private void assertHasViolation(Employer employer, String property) {
        Set<ConstraintViolation<Employer>> violations = validator.validate(employer);
        assertFalse(violations.isEmpty(), "Expected validation error for " + property);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals(property)));
    }
}
