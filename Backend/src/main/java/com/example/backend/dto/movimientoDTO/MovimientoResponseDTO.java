package com.example.backend.dto.movimientoDTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class MovimientoResponseDTO {
    private Long id;
    private LocalDate fecha;
    private Double valor;
    private Double  saldo;
    private String tipoMovimiento;
    private String numeroCuenta;
    private Boolean estado;

}
