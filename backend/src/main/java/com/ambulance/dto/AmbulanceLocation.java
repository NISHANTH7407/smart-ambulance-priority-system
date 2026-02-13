package com.ambulance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AmbulanceLocation {
    private double lat;
    private double lng;
    private double speed;
}
