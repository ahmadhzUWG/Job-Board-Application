package com.ahmad.jobBoard;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobSeeker extends User {

    @Min(value = 18, message = "Age must be at least 18")
    private int age;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    private String description;

    private String resumeUrl;


}
