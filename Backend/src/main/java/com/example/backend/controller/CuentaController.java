package com.example.backend.controller;


import com.example.backend.dto.cuentaDTO.CuentaCreateDTO;
import com.example.backend.dto.cuentaDTO.CuentaResponseDTO;
import com.example.backend.dto.cuentaDTO.CuentaUpdateDTO;
import com.example.backend.service.CuentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin
@RestController
@RequestMapping("/api/cuentas")
public class CuentaController {

    @Autowired
    private CuentaService cuentaService;


    @PostMapping("/{clienteId}")
    public ResponseEntity<CuentaResponseDTO> crear(@PathVariable Long clienteId, @RequestBody CuentaCreateDTO request){
        return  ResponseEntity
                .status(HttpStatus.CREATED)
                .body(cuentaService.crearCuenta(clienteId, request));
    }

    // Obtener cuenta por id
    @GetMapping("/{id}")
    public ResponseEntity<CuentaResponseDTO> obtenerCuenta(@PathVariable Long id) {
        return ResponseEntity.ok(cuentaService.obtenerCuenta(id));
    }

    // Listar cuentas
    @GetMapping
    public List<CuentaResponseDTO> listarCuentas() {
        return cuentaService.listarCuentas();
    }

    // Actualizar cuenta
    @PutMapping("/{id}")
    public ResponseEntity<CuentaResponseDTO> actualizarCuenta(
            @PathVariable Long id,
            @RequestBody CuentaUpdateDTO dto) {

        return ResponseEntity.ok(cuentaService.actualizarCuenta(id, dto));
    }

    // Eliminar cuenta (borrado lógico)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCuenta(@PathVariable Long id) {
        cuentaService.eliminarCuenta(id);
        return ResponseEntity.noContent().build();
    }


}
