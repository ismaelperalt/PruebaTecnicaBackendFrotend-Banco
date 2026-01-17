package com.example.backend.repository;

import com.example.backend.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente,Long> {

    Boolean existsByidentificacion(String identificacion);
}
