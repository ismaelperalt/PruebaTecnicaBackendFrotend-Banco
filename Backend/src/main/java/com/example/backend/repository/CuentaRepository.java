package com.example.backend.repository;

import com.example.backend.entity.Cuenta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CuentaRepository extends JpaRepository<Cuenta,Long> {
    Optional<Cuenta> findBynumeroCuenta(String numerocuenta);

    Boolean existsByNumeroCuenta(String numeroCuenta);

}
