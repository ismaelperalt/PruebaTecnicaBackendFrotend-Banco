package com.example.backend.service;

import com.example.backend.dto.reporteDTO.MovimientoReporteDTO;
import com.example.backend.dto.reporteDTO.ReporteResponseDTO;
import com.example.backend.entity.Cliente;
import com.example.backend.entity.Movimiento;
import com.example.backend.repository.ClienteRepository;
import com.example.backend.repository.MovimientoRepository;

import com.itextpdf.text.Document;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Element;
import com.itextpdf.text.BaseColor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class ReporteService {

    @Autowired
    private MovimientoRepository movimientoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    public ReporteResponseDTO generarReporte(
            Long clienteId,
            LocalDate inicio,
            LocalDate fin
    ) {
        // Validar fechas
        if (inicio.isAfter(fin)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha fin");
        }

        // Buscar cliente
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + clienteId));

        // Buscar movimientos ordenados por fecha
        List<Movimiento> movimientos =
                movimientoRepository.buscarMovimientosReporte(clienteId, inicio, fin);

        if (movimientos == null || movimientos.isEmpty()) {
            throw new RuntimeException("No se encontraron movimientos para el periodo especificado");
        }

        // Procesar movimientos
        List<MovimientoReporteDTO> detalle = new ArrayList<>();
        double totalCreditos = 0;
        double totalDebitos = 0;

        for (Movimiento m : movimientos) {
            MovimientoReporteDTO dto = new MovimientoReporteDTO();
            dto.setFecha(m.getFecha());
            dto.setNumeroCuenta(m.getCuenta().getNumeroCuenta());
            dto.setTipoCuenta(m.getCuenta().getTipoCuenta());

            // ✅ CORRECCIÓN: Calcular saldo antes correctamente
            // El saldo guardado en Movimiento es DESPUÉS del movimiento
            // Por tanto: saldoAntes = saldoDespués - valor
            double saldoAntes = m.getSaldo() - m.getValor();

            dto.setSaldoAntes(saldoAntes);
            dto.setValor(m.getValor());
            dto.setSaldoDespues(m.getSaldo());

            // Acumular totales
            if (m.getValor() > 0) {
                totalCreditos += m.getValor();
            } else {
                totalDebitos += Math.abs(m.getValor());
            }

            detalle.add(dto);
        }

        // Crear respuesta
        ReporteResponseDTO reporte = new ReporteResponseDTO();
        reporte.setCliente(cliente.getNombre());
        reporte.setFechaInicio(inicio.toString());
        reporte.setFechaFin(fin.toString());
        reporte.setTotalCreditos(totalCreditos);
        reporte.setTotalDebitos(totalDebitos);
        reporte.setMovimientos(detalle);

        // Generar PDF en Base64
        reporte.setPdfBase64(generarPdfBase64(reporte));

        return reporte;
    }

    private String generarPdfBase64(ReporteResponseDTO reporte) {
        ByteArrayOutputStream baos = null;
        Document document = null;

        try {
            baos = new ByteArrayOutputStream();
            document = new Document();
            PdfWriter.getInstance(document, baos);

            document.open();

            // Fuentes
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.BLACK);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.WHITE);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.BLACK);

            // Título
            Paragraph title = new Paragraph("ESTADO DE CUENTA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // Espacio

            // Información del cliente
            document.add(new Paragraph("Cliente: " + reporte.getCliente(), normalFont));
            document.add(new Paragraph(
                    "Desde: " + reporte.getFechaInicio() + " Hasta: " + reporte.getFechaFin(),
                    normalFont
            ));
            document.add(new Paragraph(" ")); // Espacio

            // Tabla de movimientos
            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{15, 12, 15, 15, 15, 15});

            // Encabezados con fondo
            table.getDefaultCell().setBackgroundColor(BaseColor.GRAY);
            table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);
            table.getDefaultCell().setPadding(5);

            table.addCell(new Paragraph("Fecha", headerFont));
            table.addCell(new Paragraph("Cuenta", headerFont));
            table.addCell(new Paragraph("Tipo", headerFont));
            table.addCell(new Paragraph("Saldo Antes", headerFont));
            table.addCell(new Paragraph("Movimiento", headerFont));
            table.addCell(new Paragraph("Saldo Después", headerFont));

            // Resetear estilo para las celdas de datos
            table.getDefaultCell().setBackgroundColor(BaseColor.WHITE);
            table.getDefaultCell().setHorizontalAlignment(Element.ALIGN_LEFT);

            // Datos de movimientos
            for (MovimientoReporteDTO m : reporte.getMovimientos()) {
                table.addCell(m.getFecha().toString());
                table.addCell(m.getNumeroCuenta());
                table.addCell(m.getTipoCuenta());
                table.addCell(String.format("%.2f", m.getSaldoAntes()));

                // Colorear movimientos: verde para créditos, rojo para débitos
                String valorStr = String.format("%.2f", m.getValor());
                if (m.getValor() < 0) {
                    Paragraph valorCell = new Paragraph(valorStr,
                            FontFactory.getFont(FontFactory.HELVETICA, 10, BaseColor.RED));
                    table.addCell(valorCell);
                } else {
                    Paragraph valorCell = new Paragraph(valorStr,
                            FontFactory.getFont(FontFactory.HELVETICA, 10, new BaseColor(0, 128, 0)));
                    table.addCell(valorCell);
                }

                table.addCell(String.format("%.2f", m.getSaldoDespues()));
            }

            document.add(table);

            // Totales
            document.add(new Paragraph(" ")); // Espacio
            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BaseColor.BLACK);
            document.add(new Paragraph(
                    String.format("Total Créditos: %.2f", reporte.getTotalCreditos()),
                    totalFont
            ));
            document.add(new Paragraph(
                    String.format("Total Débitos: %.2f", reporte.getTotalDebitos()),
                    totalFont
            ));

            document.close();

            return Base64.getEncoder().encodeToString(baos.toByteArray());

        } catch (Exception e) {
            if (document != null && document.isOpen()) {
                document.close();
            }
            throw new RuntimeException("Error al generar PDF: " + e.getMessage(), e);
        } finally {
            if (baos != null) {
                try {
                    baos.close();
                } catch (Exception e) {
                    // Log error but don't throw
                }
            }
        }
    }
}