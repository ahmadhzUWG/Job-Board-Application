package com.ahmad.jobBoard;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String address1;

    private String address2;

    @NotBlank
    @Column(nullable = false)
    private String city;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private State state;

    @NotBlank
    @Column(nullable = false)
    private String zip;


}
