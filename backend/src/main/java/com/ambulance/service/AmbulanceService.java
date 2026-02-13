
package com.ambulance.service;

import com.ambulance.dto.*;
import com.ambulance.entity.TrafficSignal;
import com.ambulance.repository.TrafficSignalRepository;
import com.ambulance.util.GeoUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AmbulanceService {

    private final TrafficSignalRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public SignalResponse processLocation(AmbulanceLocation loc) {
        List<TrafficSignal> signals = repository.findAll();
        TrafficSignal nearest = null;
        double minDistance = Double.MAX_VALUE;

        for (TrafficSignal signal : signals) {
            double distance = GeoUtils.haversine(
                loc.getLat(), loc.getLng(), 
                signal.getLatitude(), signal.getLongitude()
            );

            if (distance < minDistance) {
                minDistance = distance;
                nearest = signal;
            }

            // Logic: Trigger Green Corridor
            if (distance < 300) {
                if (!"GREEN".equals(signal.getStatus())) {
                    signal.setStatus("GREEN");
                    signal.setLastActivatedTime(LocalDateTime.now());
                    repository.save(signal);
                    // Broadcast update to all clients
                    messagingTemplate.convertAndSend("/topic/signals", signal);
                }
            } else {
                // Return to red if ambulance is far away (simplified logic)
                if ("GREEN".equals(signal.getStatus())) {
                    signal.setStatus("RED");
                    repository.save(signal);
                    messagingTemplate.convertAndSend("/topic/signals", signal);
                }
            }
        }

        // AI Intelligence Simulation for Time Saved
        int trafficFactor = 1;
        LocalTime now = LocalTime.now();
        if (now.isAfter(LocalTime.of(17, 0)) && now.isBefore(LocalTime.of(21, 0))) {
            trafficFactor = 2;
        }
        double baseDelay = 2.0;
        double estimatedTimeSaved = baseDelay + trafficFactor;

        String finalStatus = (minDistance < 300) ? "GREEN" : "RED";
        
        return SignalResponse.builder()
                .nearestSignalId(nearest != null ? nearest.getId() : null)
                .signalStatus(finalStatus)
                .distance(Math.round(minDistance))
                .estimatedTimeSaved(minDistance < 300 ? estimatedTimeSaved : 0)
                .build();
    }
}
