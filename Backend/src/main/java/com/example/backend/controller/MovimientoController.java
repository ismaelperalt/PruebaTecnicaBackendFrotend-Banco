package com.example.backend.controller;

import com.example.backend.dto.movimientoDTO.MovimientoRequestDTO;
import com.example.backend.dto.movimientoDTO.MovimientoResponseDTO;
import com.example.backend.entity.Movimiento;
import com.example.backend.service.MovimientoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/movimientos")
public class MovimientoController {

    @Autowired
    private MovimientoService movimientoService;

    // CREAR
    @PostMapping
    public ResponseEntity<MovimientoResponseDTO> crear(@RequestBody MovimientoRequestDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(movimientoService.crearMovimiento(dto));
    }

    // LISTAR POR CUENTA
    @GetMapping("/cuenta/{numeroCuenta}")
    public ResponseEntity<List<MovimientoResponseDTO>> listar(@PathVariable String numeroCuenta) {
        return ResponseEntity.ok(movimientoService.listarPorCuenta(numeroCuenta));
    }

    // LISTAR TODOS LOS MOVIMIENTOS
    @GetMapping
    public ResponseEntity<List<MovimientoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(movimientoService.listarTodos());
    }


    // Eliminar cuenta (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCuenta(@PathVariable Long id) {
        movimientoService.eliminarMovimiento(id);
        return ResponseEntity.noContent().build();
    }

}
