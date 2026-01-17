package com.example.backend.mapper;

import com.example.backend.dto.movimientoDTO.MovimientoRequestDTO;
import com.example.backend.dto.movimientoDTO.MovimientoResponseDTO;
import com.example.backend.entity.Cuenta;
import com.example.backend.entity.Movimiento;
import com.example.backend.entity.TipoMovimiento;

import java.time.LocalDate;

public class MovimientoMapper {
    public static Movimiento toEntity(MovimientoRequestDTO dto, Cuenta cuenta, TipoMovimiento tipoMovimiento, Double saldo) {
        Movimiento mov = new Movimiento();
        mov.setFecha(LocalDate.now());
        mov.setValor(dto.getValor());
        mov.setSaldo(saldo);
        mov.setTipoMovimiento(tipoMovimiento);
        mov.setCuenta(cuenta);
        mov.setEstado(true);
        return mov;
    }
    public static MovimientoResponseDTO toDTO(Movimiento mov) {
        MovimientoResponseDTO dto = new MovimientoResponseDTO();
        dto.setId(mov.getId());
        dto.setFecha(mov.getFecha());
        dto.setValor(mov.getValor());
        dto.setSaldo(mov.getSaldo());
        dto.setTipoMovimiento(mov.getTipoMovimiento().name());
        dto.setNumeroCuenta(mov.getCuenta().getNumeroCuenta());
        dto.setEstado(mov.getEstado());



        return dto;
    }
}
