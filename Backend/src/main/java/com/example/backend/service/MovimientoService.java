package com.example.backend.service;
import com.example.backend.dto.movimientoDTO.MovimientoRequestDTO;
import com.example.backend.dto.movimientoDTO.MovimientoResponseDTO;
import com.example.backend.entity.Cuenta;
import com.example.backend.entity.Movimiento;
import com.example.backend.entity.TipoMovimiento;
import com.example.backend.mapper.MovimientoMapper;
import com.example.backend.repository.CuentaRepository;
import com.example.backend.repository.MovimientoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class MovimientoService {

    @Autowired
    private CuentaRepository cuentaRepository;

    @Autowired
    private MovimientoRepository movimientoRepository;


    public MovimientoResponseDTO crearMovimiento(MovimientoRequestDTO dto) {
        Cuenta cuenta = cuentaRepository.findBynumeroCuenta(dto.getNumeroCuenta())
                .orElseThrow(() -> new RuntimeException("Cuenta no existe"));

        double saldoActual = cuenta.getSaldoInicial(); double valor = dto.getValor();
        TipoMovimiento tipoMovimiento;
        if (valor > 0) { tipoMovimiento = TipoMovimiento.DEPOSITO; }
        else { tipoMovimiento = TipoMovimiento.RETIRO;
            if (saldoActual < Math.abs(valor)) {
                throw new RuntimeException("Saldo no disponible");
            } }
        double nuevoSaldo = saldoActual + valor;


       // actualizar saldo cuenta
        cuenta.setSaldoInicial(nuevoSaldo);
        cuentaRepository.save(cuenta);
        // crear movimiento
        Movimiento movimiento = MovimientoMapper.toEntity( dto, cuenta, tipoMovimiento, nuevoSaldo );
        Movimiento guardado = movimientoRepository.save(movimiento);

        return MovimientoMapper.toDTO(guardado);

    }
    // Listar movimientos por cuenta
    public List<MovimientoResponseDTO> listarPorCuenta(String numeroCuenta) {
        Cuenta cuenta = cuentaRepository.findBynumeroCuenta(numeroCuenta)
                .orElseThrow(() -> new RuntimeException("Cuenta no existe"));

        return movimientoRepository.findByCuentaId(cuenta.getId())
                .stream()
                .map(MovimientoMapper::toDTO)
                .toList();
    }
    // Listar todos los movimientos
    public List<MovimientoResponseDTO> listarTodos() {
        return movimientoRepository.findAll()
                .stream()
                .map(MovimientoMapper::toDTO)
                .toList();
    }
    // Borrado lógico - Anular movimiento
    public void eliminarMovimiento(Long id) {

        Movimiento movimiento = movimientoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        movimiento.setEstado(false);
        movimientoRepository.save(movimiento);
    }

}
