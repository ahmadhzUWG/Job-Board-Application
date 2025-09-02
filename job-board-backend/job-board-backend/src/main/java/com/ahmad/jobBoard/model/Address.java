package com.ahmad.jobBoard.model;

import com.ahmad.jobBoard.model.enums.State;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Address {

    @NotBlank
    @Column(nullable = false)
    private String address1;

    private String address2;

    @NotBlank
    @Column(nullable = false)
    private String city;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private State state;

    @NotBlank
    @Column(nullable = false)
    @Size(min = 5, max = 5)
    private String zip;
}
