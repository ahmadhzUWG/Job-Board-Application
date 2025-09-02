package com.ahmad.jobBoard.model;

import com.ahmad.jobBoard.model.enums.State;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class JobAddress {

    private String address1;

    private String address2;

    private String city;

    private State state;

    @Size(min = 5, max = 5)
    private String zip;
}
