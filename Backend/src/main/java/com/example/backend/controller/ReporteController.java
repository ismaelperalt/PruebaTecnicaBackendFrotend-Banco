package com.example.backend.controller;

import com.example.backend.dto.reporteDTO.ReporteResponseDTO;
import com.example.backend.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
@CrossOrigin
@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @GetMapping
    public ReporteResponseDTO generarReporte(
            @RequestParam Long clienteId,
            @RequestParam LocalDate inicio,
            @RequestParam LocalDate fin) {

        return reporteService.generarReporte(clienteId, inicio, fin);
    }
}
