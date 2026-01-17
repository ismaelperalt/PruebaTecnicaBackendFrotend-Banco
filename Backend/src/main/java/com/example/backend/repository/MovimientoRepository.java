package com.example.backend.repository;

import com.example.backend.entity.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MovimientoRepository extends JpaRepository<Movimiento,Long> {
    @Query("""
            SELECT m FROM Movimiento m
            WHERE m.cuenta.cliente.id = :clienteId
            AND m.estado = true
            AND m.fecha BETWEEN :inicio AND :fin
            ORDER BY m.fecha
            """)
    List<Movimiento> buscarMovimientosReporte(
            @Param("clienteId") Long clienteId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin
    );


    List<Movimiento> findByCuentaId(Long cuentaId);


}
