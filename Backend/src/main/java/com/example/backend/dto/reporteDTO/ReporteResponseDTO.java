package com.example.backend.dto.reporteDTO;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ReporteResponseDTO {
    private String cliente;
    private String fechaInicio;
    private String fechaFin;
    private Double totalCreditos;
    private Double  totalDebitos;
    private List<MovimientoReporteDTO> movimientos;

    private String pdfBase64;


}
