package com.ahmad.jobBoard;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;

@MappedSuperclass
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Embedded
    private Address address;

    @NotBlank
    @Column(nullable = false)
    private String phoneNumber;

    @NotBlank
    @Column(nullable = false)
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank
    @Column(nullable = false, unique = true)
    @Size(min = 5, message = "Username must be at least 5 characters")
    private String username;

    @NotBlank
    @Column(nullable = false)
    @Size(min = 8, message = "Password must be at least 8 characters")
    @JsonIgnore
    private String password; //hashed

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    private String profileImageUrl;
}
