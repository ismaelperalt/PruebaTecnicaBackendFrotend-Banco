package com.example.backend.service;

import com.example.backend.dto.cuentaDTO.CuentaCreateDTO;
import com.example.backend.dto.cuentaDTO.CuentaResponseDTO;
import com.example.backend.dto.cuentaDTO.CuentaUpdateDTO;
import com.example.backend.entity.Cliente;
import com.example.backend.entity.Cuenta;
import com.example.backend.mapper.CuentaMapper;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.repository.CuentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CuentaService {

    @Autowired
    private CuentaRepository cuentaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public CuentaResponseDTO crearCuenta(Long clienteId, CuentaCreateDTO request){

        if(cuentaRepository.existsByNumeroCuenta(request.getNumeroCuenta())){
            throw new
                RuntimeException("El numero de cuenta ya existe");
        }


        Cliente cliente= clienteRepository.findById(clienteId).orElseThrow(()->new RuntimeException("Cliente no encontrado"));

        Cuenta cuenta= CuentaMapper.toEntity(request);

        cuenta.setCliente(cliente);
        cuenta.setEstado(true);

        if (cuenta.getSaldoInicial()==null){
            cuenta.setSaldoInicial(0.0);
        }

        Cuenta cuentaGuardada= cuentaRepository.save(cuenta);

        return CuentaMapper.toDTO(cuentaGuardada);

    }

    //Obtener cuenta por id
    public CuentaResponseDTO obtenerCuenta(long id){
        Cuenta cuenta = cuentaRepository.findById(id).orElseThrow(()->
                new RuntimeException("Cuenta no encontrada"));

        return CuentaMapper.toDTO(cuenta);
    }

    //Listar todas las cuentas
    public List<CuentaResponseDTO>listarCuentas(){
        return  cuentaRepository.findAll()
                .stream()
                .map(CuentaMapper ::toDTO)
                .toList();
    }
    //Actualizar cuenta

    public CuentaResponseDTO actualizarCuenta(Long id, CuentaUpdateDTO dto){
        Cuenta cuenta = cuentaRepository.findById(id).orElseThrow(()->
                new RuntimeException("Cuenta no encontrada"));

        cuenta.setTipoCuenta(dto.getTipoCuenta());
        cuenta.setSaldoInicial(dto.getSaldoInicial());
        cuenta.setEstado(dto.getEstado());
        return  CuentaMapper.toDTO(cuentaRepository.save(cuenta));

    }

    //Borrado logico

    public void eliminarCuenta(Long id){
        Cuenta cuenta = cuentaRepository.findById(id).orElseThrow(()->
                new RuntimeException("Cuenta no encontrada"));

        cuenta.setEstado(false);
        cuentaRepository.save(cuenta);

    }




}
