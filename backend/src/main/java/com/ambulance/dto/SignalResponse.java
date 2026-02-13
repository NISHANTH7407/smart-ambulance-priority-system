package com.ambulance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignalResponse {
    private Long nearestSignalId;
    private String signalStatus;
    private double distance;
    private double estimatedTimeSaved;
}
