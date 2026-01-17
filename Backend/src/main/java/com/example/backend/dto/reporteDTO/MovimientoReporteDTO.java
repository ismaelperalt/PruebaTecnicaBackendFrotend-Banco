package com.example.backend.dto.reporteDTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class MovimientoReporteDTO {
    private LocalDate fecha;
    private String numeroCuenta;
    private String tipoCuenta;

    private Double saldoAntes;
    private Double valor;
    private Double saldoDespues;
}
