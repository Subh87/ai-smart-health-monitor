package com.healthmonitor.controller;

import com.healthmonitor.dto.DemoToggleRequest;
import com.healthmonitor.dto.DeviceStatusDto;
import com.healthmonitor.service.DemoSimulatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class DeviceController {

    private final DemoSimulatorService demoSimulatorService;

    public DeviceController(DemoSimulatorService demoSimulatorService) {
        this.demoSimulatorService = demoSimulatorService;
    }

    @GetMapping("/device/status")
    public ResponseEntity<DeviceStatusDto> getDeviceStatus(@RequestParam(required = false) String deviceId) {
        String effectiveId = (deviceId != null && !deviceId.isBlank()) ? deviceId : demoSimulatorService.getDefaultDeviceId();
        boolean isConnected = demoSimulatorService.isDeviceOnline();
        boolean demoActive = demoSimulatorService.isDemoModeActive();
        String status = isConnected ? "ONLINE" : "OFFLINE";

        DeviceStatusDto dto = new DeviceStatusDto(
                effectiveId,
                status,
                95,
                isConnected,
                demoSimulatorService.getLastSeen(),
                demoActive
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/demo/toggle")
    public ResponseEntity<Map<String, Object>> toggleDemoMode(@RequestBody DemoToggleRequest request) {
        boolean enable = request.getEnable() != null ? request.getEnable() : true;
        demoSimulatorService.setDemoModeActive(enable, request.getDeviceId());

        return ResponseEntity.ok(Map.of(
                "success", true,
                "demoMode", enable,
                "message", enable ? "Demo Simulator Activated" : "Demo Simulator Deactivated"
        ));
    }
}
