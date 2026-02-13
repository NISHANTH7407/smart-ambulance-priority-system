
package com.ambulance.controller;

import com.ambulance.dto.*;
import com.ambulance.entity.TrafficSignal;
import com.ambulance.repository.TrafficSignalRepository;
import com.ambulance.service.AmbulanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow React Frontend
public class AmbulanceController {

    private final AmbulanceService ambulanceService;
    private final TrafficSignalRepository signalRepository;

    @PostMapping("/ambulance/location")
    public SignalResponse updateLocation(@RequestBody AmbulanceLocation location) {
        return ambulanceService.processLocation(location);
    }

    @GetMapping("/signals")
    public List<TrafficSignal> getSignals() {
        return signalRepository.findAll();
    }
}
