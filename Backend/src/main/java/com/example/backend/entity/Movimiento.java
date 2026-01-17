package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "movimientos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Movimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private TipoMovimiento tipoMovimiento;

    private Double  valor;
    private Double saldo;


    private Boolean estado;


    @ManyToOne
    @JoinColumn(name = "cuenta_id")
    private Cuenta cuenta;




}
